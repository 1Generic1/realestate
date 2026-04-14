const Property = require("../models/Property.model");
const { deleteImage } = require("../config/cloudinary");
const { AppError } = require("../middleware/errorMiddleware");

// ==================== PUBLIC FUNCTIONS ====================

// Get all properties with filtering
exports.getProperties = async (req, res, next) => {
  try {
    const { type, category, limit = 10, page = 1 } = req.query;

    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    query.status = "available"; // Only show available properties

    const properties = await Property.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single property by ID
exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    // Increment view count
    await property.incrementViews();

    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// Get featured properties
exports.getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.findFeatured(6);
    res.json({ success: true, data: properties });
  } catch (error) {
    next(error);
  }
};

// Get properties by type (buy/rent/land) with search and filters
exports.getPropertiesByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const {
      limit = 10,
      page = 1,
      search,
      minPrice,
      maxPrice,
      ...filters
    } = req.query;

    // Validate type
    const validTypes = ["buy", "rent", "land"];
    if (!validTypes.includes(type)) {
      throw new AppError(
        "Invalid property type. Must be 'buy', 'rent', or 'land'",
        400,
        "ValidationError",
      );
    }

    // Build the query
    const query = {
      type,
      status: "available",
      ...filters,
    };

    // Add search functionality (title, location, description)
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
        { "address.state": { $regex: search, $options: "i" } },
      ];
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    console.log("📡 Backend query:", JSON.stringify(query, null, 2));

    // Execute query using Mongoose directly (not the static method)
    const properties = await Property.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Property.countDocuments(query);

    console.log(
      `📡 Found ${properties.length} properties out of ${total} total`,
    );

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search properties (advanced filtering)
exports.searchProperties = async (req, res, next) => {
  try {
    const {
      query,
      minPrice,
      maxPrice,
      location,
      bedrooms,
      type,
      limit = 10,
      page = 1,
    } = req.query;

    const searchQuery = { status: "available" };

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = parseInt(minPrice);
      if (maxPrice) searchQuery.price.$lte = parseInt(maxPrice);
    }

    // Location search (case insensitive)
    if (location) {
      searchQuery.location = { $regex: location, $options: "i" };
    }

    // Bedrooms filter
    if (bedrooms) {
      if (bedrooms === "5+") {
        searchQuery.bedrooms = { $gte: 5 };
      } else {
        searchQuery.bedrooms = parseInt(bedrooms);
      }
    }

    // Type filter
    if (type) {
      searchQuery.type = type;
    }

    const properties = await Property.find(searchQuery)
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Property.countDocuments(searchQuery);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get similar properties
exports.getSimilarProperties = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      type: property.type,
      category: property.category,
      status: "available",
      price: {
        $gte: property.price * 0.7,
        $lte: property.price * 1.3,
      },
    })
      .sort({ featured: -1 })
      .limit(4);

    res.json({
      success: true,
      data: similarProperties,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN FUNCTIONS ====================

// Get all properties for admin (including non-available)
exports.getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const { limit = 50, page = 1, status, type } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single property for admin
exports.getPropertyByIdAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }
    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

// Create new property with images (admin only)
exports.createProperty = async (req, res, next) => {
  // ========== DEBUG LOGS ==========
  console.log("\n🔍🔍🔍 PROPERTY CREATE DEBUG 🔍🔍🔍");
  console.log("📋 Headers:", {
    "content-type": req.headers["content-type"],
    authorization: req.headers.authorization
      ? "Bearer [PRESENT]"
      : "Bearer [MISSING]",
  });

  console.log("📋 Body keys:", Object.keys(req.body));
  console.log("📋 Body raw:", req.body);

  console.log("📋 Files present:", req.files ? "YES" : "NO");
  console.log("📋 Files type:", req.files ? typeof req.files : "N/A");
  console.log(
    "📋 Files is array:",
    req.files ? Array.isArray(req.files) : "N/A",
  );

  if (req.files) {
    if (Array.isArray(req.files)) {
      console.log("📋 Files length:", req.files.length);
      req.files.forEach((file, index) => {
        console.log(`📋 File ${index + 1}:`, {
          fieldname: file.fieldname,
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path ? "PRESENT" : "MISSING",
          filename: file.filename || "MISSING",
        });
      });
    } else {
      console.log("📋 Files object keys:", Object.keys(req.files));
      console.log("📋 Files object:", req.files);
    }
  } else {
    console.log("📋 NO FILES DETECTED IN REQUEST");
  }
  console.log("🔍🔍🔍 END DEBUG 🔍🔍🔍\n");
  // ========== END DEBUG LOGS ==========

  try {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      throw new AppError(
        "At least one image is required",
        400,
        "ValidationError",
      );
    }

    // Validate number of images (max 10)
    if (req.files.length > 10) {
      // Clean up uploaded files if too many
      for (const file of req.files) {
        await deleteImage(file.path).catch(console.error);
      }
      throw new AppError(
        "Maximum 10 images allowed per property",
        400,
        "ValidationError",
      );
    }

    // Extract image URLs and public_ids from uploaded files
    const images = req.files.map((file) => file.path);
    const imagePublicIds = req.files.map((file) => file.filename);

    // First image becomes thumbnail
    const thumbnail = images[0];
    const thumbnailPublicId = imagePublicIds[0];

    // Parse any stringified fields
    let propertyData = { ...req.body };

    // Handle all possible JSON string fields
    const jsonFields = [
      "features",
      "utilities",
      "nearbyAmenities",
      "documents",
      "address",
      "developmentPotential",
      "restrictions",
      "seoKeywords",
    ];

    for (const field of jsonFields) {
      if (propertyData[field] && typeof propertyData[field] === "string") {
        try {
          // Check if it looks like JSON (starts with [ or {)
          const trimmed = propertyData[field].trim();
          if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
            propertyData[field] = JSON.parse(propertyData[field]);
          }
        } catch (e) {
          console.warn(`⚠️ Could not parse ${field}:`, e.message);
          // Leave as string if parsing fails
        }
      }
    }

    // Ensure numeric fields are numbers
    const numericFields = [
      "price",
      "bedrooms",
      "bathrooms",
      "sizeSqm",
      "frontage",
      "depth",
    ];
    for (const field of numericFields) {
      if (propertyData[field] && typeof propertyData[field] === "string") {
        propertyData[field] = parseFloat(propertyData[field]);
      }
    }

    // Create property with image data
    const property = new Property({
      ...propertyData,
      images,
      imagePublicIds,
      thumbnail,
      thumbnailPublicId,
    });

    await property.save();

    console.log("✅ Property created successfully:", property._id);

    res.status(201).json({
      success: true,
      data: property,
      message: "Property created successfully",
    });
  } catch (error) {
    console.error("❌ Error creating property:");
    console.error("- Name:", error.name);
    console.error("- Message:", error.message);
    console.error("- Stack:", error.stack);

    // If error occurs, clean up any uploaded images from Cloudinary
    if (req.files && req.files.length > 0) {
      console.log("🧹 Cleaning up uploaded images from Cloudinary...");
      for (const file of req.files) {
        if (file.path) {
          try {
            await deleteImage(file.path);
            console.log(`✅ Deleted: ${file.filename}`);
          } catch (deleteError) {
            console.error(
              `❌ Failed to delete: ${file.filename}`,
              deleteError.message,
            );
          }
        }
      }
    }

    next(error);
  }
};

// Add images to existing property (admin only)
exports.addImages = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      throw new AppError("No images to add", 400, "ValidationError");
    }

    // Check if adding new images would exceed limit
    if (property.images.length + req.files.length > 10) {
      // Clean up newly uploaded files
      for (const file of req.files) {
        await deleteImage(file.path).catch(console.error);
      }
      throw new AppError(
        `Cannot add ${req.files.length} images. Maximum 10 images allowed. Current: ${property.images.length}`,
        400,
        "ValidationError",
      );
    }

    // Add new images
    const newImages = req.files.map((file) => file.path);
    const newPublicIds = req.files.map((file) => file.filename);

    property.images.push(...newImages);
    property.imagePublicIds.push(...newPublicIds);
    await property.save();

    res.json({
      success: true,
      data: property,
      message: `${newImages.length} images added successfully`,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await deleteImage(file.path).catch(console.error);
      }
    }
    next(error);
  }
};

// Delete single image from property (admin only)
exports.deleteImage = async (req, res, next) => {
  try {
    const { propertyId, imageIndex } = req.params;
    const index = parseInt(imageIndex);

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    // Check if image index is valid
    if (isNaN(index) || index < 0 || index >= property.images.length) {
      throw new AppError("Invalid image index", 400, "ValidationError");
    }

    // Prevent deletion if it's the only image
    if (property.images.length === 1) {
      throw new AppError(
        "Cannot delete the only image. Property must have at least one image.",
        400,
        "ValidationError",
      );
    }

    // Get the image URL and public_id to delete
    const imageUrl = property.images[index];
    const imagePublicId = property.imagePublicIds[index];

    // Delete from Cloudinary
    await deleteImage(imageUrl);

    // Remove from database using atomic operation
    await Property.updateOne(
      { _id: propertyId },
      {
        $pull: {
          images: imageUrl,
          imagePublicIds: imagePublicId,
        },
      },
    );

    // If deleted image was the thumbnail, update thumbnail to first remaining image
    if (property.thumbnail === imageUrl) {
      const updatedProperty = await Property.findById(propertyId);
      updatedProperty.thumbnail = updatedProperty.images[0];
      updatedProperty.thumbnailPublicId = updatedProperty.imagePublicIds[0];
      await updatedProperty.save();
    }

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update thumbnail (admin only)
exports.updateThumbnail = async (req, res, next) => {
  try {
    const { propertyId, imageIndex } = req.params;
    const index = parseInt(imageIndex);

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    // Check if image index is valid
    if (isNaN(index) || index < 0 || index >= property.images.length) {
      throw new AppError("Invalid image index", 400, "ValidationError");
    }

    // Set new thumbnail
    property.thumbnail = property.images[index];
    property.thumbnailPublicId = property.imagePublicIds[index];
    await property.save();

    res.json({
      success: true,
      data: property,
      message: "Thumbnail updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Reorder images (admin only)
exports.reorderImages = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const { newOrder } = req.body; // Array of image URLs in new order

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    // Validate that all images exist
    const allImagesExist = newOrder.every((url) =>
      property.images.includes(url),
    );
    if (!allImagesExist) {
      throw new AppError(
        "Invalid image URLs in new order",
        400,
        "ValidationError",
      );
    }

    // Reorder images and their public IDs
    const newImagesOrder = [];
    const newPublicIdsOrder = [];

    newOrder.forEach((url) => {
      const index = property.images.indexOf(url);
      newImagesOrder.push(property.images[index]);
      newPublicIdsOrder.push(property.imagePublicIds[index]);
    });

    property.images = newImagesOrder;
    property.imagePublicIds = newPublicIdsOrder;

    // Update thumbnail if needed
    if (property.thumbnail !== property.images[0]) {
      property.thumbnail = property.images[0];
      property.thumbnailPublicId = property.imagePublicIds[0];
    }

    await property.save();

    res.json({
      success: true,
      data: property,
      message: "Images reordered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update property (admin only) - without image changes
exports.updateProperty = async (req, res, next) => {
  try {
    // Parse any stringified fields
    let updateData = { ...req.body };

    if (updateData.features && typeof updateData.features === "string") {
      updateData.features = JSON.parse(updateData.features);
    }

    if (updateData.address && typeof updateData.address === "string") {
      updateData.address = JSON.parse(updateData.address);
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      data: property,
      message: "Property updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update property status (admin only)
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["available", "sold", "rented", "pending"];
    if (!validStatuses.includes(status)) {
      throw new AppError("Invalid status value", 400, "ValidationError");
    }

    const property = await Property.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      data: property,
      message: `Property status updated to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle featured status (admin only)
exports.toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    property.featured = !property.featured;
    await property.save();

    res.json({
      success: true,
      data: property,
      message: `Property ${property.featured ? "added to" : "removed from"} featured`,
    });
  } catch (error) {
    next(error);
  }
};

// Delete property and all its images (admin only)
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    // Delete all images from Cloudinary
    if (property.images && property.images.length > 0) {
      const deletePromises = property.images.map((imageUrl) =>
        deleteImage(imageUrl).catch((err) =>
          console.error(`Failed to delete image ${imageUrl}:`, err),
        ),
      );
      await Promise.all(deletePromises);
    }

    // Delete property from database
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Property and all associated images deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Bulk delete properties (admin only)
exports.bulkDeleteProperties = async (req, res, next) => {
  try {
    const { propertyIds } = req.body;

    if (
      !propertyIds ||
      !Array.isArray(propertyIds) ||
      propertyIds.length === 0
    ) {
      throw new AppError(
        "Please provide an array of property IDs",
        400,
        "ValidationError",
      );
    }

    // Get all properties to delete their images
    const properties = await Property.find({ _id: { $in: propertyIds } });

    // Delete all images from Cloudinary
    for (const property of properties) {
      if (property.images && property.images.length > 0) {
        const deletePromises = property.images.map((imageUrl) =>
          deleteImage(imageUrl).catch((err) =>
            console.error(`Failed to delete image ${imageUrl}:`, err),
          ),
        );
        await Promise.all(deletePromises);
      }
    }

    // Delete properties from database
    const result = await Property.deleteMany({ _id: { $in: propertyIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} properties deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Bulk update properties (admin only)
exports.bulkUpdateProperties = async (req, res, next) => {
  try {
    const { propertyIds, updateData } = req.body;

    if (
      !propertyIds ||
      !Array.isArray(propertyIds) ||
      propertyIds.length === 0
    ) {
      throw new AppError(
        "Please provide an array of property IDs",
        400,
        "ValidationError",
      );
    }

    const result = await Property.updateMany(
      { _id: { $in: propertyIds } },
      { $set: updateData },
      { runValidators: true },
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} properties updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// Export properties as CSV (admin only)
exports.exportPropertiesCSV = async (req, res, next) => {
  try {
    const properties = await Property.find({}).lean();

    // Define CSV headers
    const headers = [
      "title",
      "type",
      "category",
      "price",
      "location",
      "bedrooms",
      "bathrooms",
      "size",
      "status",
      "featured",
      "views",
      "createdAt",
    ];

    // Convert to CSV
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const property of properties) {
      const row = headers
        .map((header) => {
          const value = property[header] || "";
          // Escape commas and quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",");
      csvRows.push(row);
    }

    const csvString = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=properties.csv");
    res.send(csvString);
  } catch (error) {
    next(error);
  }
};
