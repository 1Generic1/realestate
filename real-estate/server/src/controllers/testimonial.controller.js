const Testimonial = require("../models/Testimonial.model");
const { deleteImage, deleteImageByPublicId } = require("../config/cloudinary");
const { AppError } = require("../middleware/errorMiddleware");

// ==================== PUBLIC FUNCTIONS ====================

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, featured, rating } = req.query;

    const query = { status: "approved" };
    if (featured === "true") query.featured = true;
    if (rating) query.rating = { $gte: parseInt(rating) };

    const testimonials = await Testimonial.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Testimonial.countDocuments(query);

    res.json({
      success: true,
      data: testimonials,
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

// @desc    Get featured testimonials
// @route   GET /api/testimonials/featured
// @access  Public
exports.getFeaturedTestimonials = async (req, res, next) => {
  try {
    const { limit = 3 } = req.query;
    const testimonials = await Testimonial.findFeatured(parseInt(limit));
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN FUNCTIONS ====================

// @desc    Get all testimonials (including pending)
// @route   GET /api/admin/testimonials
// @access  Private
exports.getAllTestimonialsAdmin = async (req, res, next) => {
  try {
    const { limit = 50, page = 1, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Testimonial.countDocuments(query);

    res.json({
      success: true,
      data: testimonials,
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

// @desc    Create testimonial with optional image
// @route   POST /api/admin/testimonials
// @access  Private
exports.createTestimonial = async (req, res, next) => {
  try {
    // Extract image if uploaded
    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const testimonialData = {
      ...req.body,
      image: imageUrl,
      imagePublicId: imagePublicId,
    };

    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();

    res.status(201).json({
      success: true,
      data: testimonial,
      message: "Testimonial created successfully",
    });
  } catch (error) {
    // If error occurs and image was uploaded, clean up
    if (req.file) {
      await deleteImage(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// @desc    Update testimonial (text fields only)
// @route   PUT /api/admin/testimonials/:id
// @access  Private
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }

    // Update text fields (image handled separately)
    const allowedFields = [
      "name",
      "role",
      "company",
      "content",
      "rating",
      "featured",
      "displayOrder",
      "status",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        testimonial[field] = req.body[field];
      }
    });

    await testimonial.save();

    res.json({
      success: true,
      data: testimonial,
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/replace testimonial image
// @route   POST /api/admin/testimonials/:id/image
// @access  Private
exports.uploadTestimonialImage = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }

    if (!req.file) {
      throw new AppError("No image file provided", 400, "ValidationError");
    }

    console.log("📸 New testimonial image uploaded:", {
      path: req.file.path,
      publicId: req.file.filename,
    });

    // Store old image info BEFORE updating
    const oldImagePublicId = testimonial.imagePublicId;
    const oldImageUrl = testimonial.image;

    console.log("🔍 Old image info:", {
      publicId: oldImagePublicId,
      url: oldImageUrl,
    });

    // Update testimonial with new image
    testimonial.image = req.file.path;
    testimonial.imagePublicId = req.file.filename;
    await testimonial.save();
    console.log("✅ Testimonial saved with new image");

    // Delete old image if it existed - TRY MULTIPLE METHODS
    if (oldImagePublicId || oldImageUrl) {
      console.log(`🗑️ Attempting to delete old image...`);

      let deleteSuccess = false;

      // Method 1: Try using public ID
      if (oldImagePublicId) {
        try {
          console.log(`Method 1: Deleting by publicId: ${oldImagePublicId}`);
          const result = await deleteImageByPublicId(oldImagePublicId);
          console.log(`Result:`, result);
          if (result.result === "ok") {
            deleteSuccess = true;
            console.log(`✅ Old image deleted by publicId`);
          }
        } catch (err) {
          console.log(`Method 1 failed:`, err.message);
        }
      }

      // Method 2: If Method 1 failed, try using URL
      if (!deleteSuccess && oldImageUrl) {
        try {
          console.log(`Method 2: Deleting by URL: ${oldImageUrl}`);
          const result = await deleteImage(oldImageUrl);
          console.log(`Result:`, result);
          if (result.result === "ok") {
            deleteSuccess = true;
            console.log(`✅ Old image deleted by URL`);
          }
        } catch (err) {
          console.log(`Method 2 failed:`, err.message);
        }
      }

      // Method 3: Extract public ID from URL manually
      if (!deleteSuccess && oldImageUrl) {
        try {
          // Extract public ID from URL
          const urlParts = oldImageUrl.split("/");
          const uploadIndex = urlParts.indexOf("upload");
          if (uploadIndex !== -1) {
            const relevantParts = urlParts.slice(uploadIndex + 2);
            const extractedPublicId = relevantParts.join("/").split(".")[0];
            console.log(`Method 3: Extracted publicId: ${extractedPublicId}`);
            const result = await deleteImageByPublicId(extractedPublicId);
            console.log(`Result:`, result);
            if (result.result === "ok") {
              deleteSuccess = true;
              console.log(`✅ Old image deleted by extracted publicId`);
            }
          }
        } catch (err) {
          console.log(`Method 3 failed:`, err.message);
        }
      }

      if (!deleteSuccess) {
        console.log(
          `⚠️ Could not delete old image. Manual cleanup may be needed.`,
        );
      }
    } else {
      console.log(`ℹ️ No old image to delete`);
    }

    res.json({
      success: true,
      data: {
        image: testimonial.image,
        imagePublicId: testimonial.imagePublicId,
      },
      message: "Testimonial image updated successfully",
    });
  } catch (error) {
    console.error("❌ Error in uploadTestimonialImage:", error);
    // If error occurs, delete the newly uploaded image
    if (req.file) {
      console.log(`🧹 Cleaning up new image due to error`);
      await deleteImageByPublicId(req.file.filename).catch(console.error);
    }
    next(error);
  }
};

// @desc    Delete testimonial image only
// @route   DELETE /api/admin/testimonials/:id/image
// @access  Private
exports.deleteTestimonialImage = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }

    if (!testimonial.image) {
      throw new AppError("No image to delete", 400, "ValidationError");
    }

    // Delete from Cloudinary
    await deleteImage(testimonial.image);

    // Remove image references
    testimonial.image = "";
    testimonial.imagePublicId = "";
    await testimonial.save();

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial and its image
// @route   DELETE /api/admin/testimonials/:id
// @access  Private
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }

    // Delete image from Cloudinary if exists
    if (testimonial.image) {
      await deleteImage(testimonial.image).catch(console.error);
    }

    // Delete testimonial from database
    await Testimonial.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Testimonial and associated image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve testimonial
// @route   PATCH /api/admin/testimonials/:id/approve
// @access  Private
exports.approveTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }

    await testimonial.approve();

    res.json({
      success: true,
      data: testimonial,
      message: "Testimonial approved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject testimonial
// @route   PATCH /api/admin/testimonials/:id/reject
// @access  Private
exports.rejectTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }

    await testimonial.reject();

    res.json({
      success: true,
      data: testimonial,
      message: "Testimonial rejected successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status
// @route   PATCH /api/admin/testimonials/:id/featured
// @access  Private
exports.toggleFeatured = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      throw new AppError("Testimonial not found", 404, "NotFoundError");
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    res.json({
      success: true,
      data: testimonial,
      message: `Testimonial ${testimonial.featured ? "added to" : "removed from"} featured`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending testimonials (for admin review)
// @route   GET /api/admin/testimonials/pending
// @access  Private
exports.getPendingTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: "pending" }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rejected testimonials
// @route   GET /api/admin/testimonials/rejected
// @access  Private
exports.getRejectedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: "rejected" }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approved testimonials (admin view)
// @route   GET /api/admin/testimonials/approved
// @access  Private
exports.getApprovedTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    next(error);
  }
};
