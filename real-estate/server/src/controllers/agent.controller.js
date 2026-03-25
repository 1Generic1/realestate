const Agent = require("../models/Agent.model");
const Property = require("../models/Property.model");
const {
  deleteImage,
  deleteImageByPublicId,
  uploadAgentImage,
} = require("../config/cloudinary");
const { AppError } = require("../middleware/errorMiddleware");

// ==================== PUBLIC FUNCTIONS ====================

// @desc    Get all active agents
// @route   GET /api/agents
// @access  Public
exports.getAgents = async (req, res, next) => {
  try {
    const {
      specialty,
      featured,
      limit = 12,
      page = 1,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { status: "active" };
    if (specialty) query.specialties = specialty;
    if (featured === "true") query.featured = true;

    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortDirection };

    const agents = await Agent.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select("-password -__v");

    const total = await Agent.countDocuments(query);

    res.json({
      success: true,
      data: agents,
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

// @desc    Get featured agents
// @route   GET /api/agents/featured
// @access  Public
exports.getFeaturedAgents = async (req, res, next) => {
  try {
    const { limit = 4 } = req.query;
    const agents = await Agent.getFeatured(parseInt(limit));
    res.json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent by slug or ID
// @route   GET /api/agents/:slug
// @access  Public
exports.getAgentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    let agent = await Agent.findOne({ slug, status: "active" })
      .populate("properties", "title type price location thumbnail")
      .populate("featuredProperties", "title type price location thumbnail");

    if (!agent) {
      agent = await Agent.findById(slug).populate(
        "properties",
        "title type price location thumbnail",
      );
    }

    if (!agent) {
      throw new AppError("Agent not found", 404, "NotFoundError");
    }

    // Increment view count (optional)
    // await agent.incrementViews();

    res.json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agents by specialty
// @route   GET /api/agents/specialty/:specialty
// @access  Public
exports.getAgentsBySpecialty = async (req, res, next) => {
  try {
    const { specialty } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const validSpecialties = [
      "residential",
      "commercial",
      "land",
      "luxury",
      "investment",
      "rental",
      "property management",
      "valuation",
      "first-time buyers",
      "foreclosures",
      "new developments",
      "international",
    ];

    if (!validSpecialties.includes(specialty)) {
      throw new AppError("Invalid specialty", 400, "ValidationError");
    }

    const agents = await Agent.find({
      status: "active",
      specialties: specialty,
    })
      .sort({ rating: -1, deals: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Agent.countDocuments({
      status: "active",
      specialties: specialty,
    });

    res.json({
      success: true,
      data: agents,
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

// @desc    Search agents
// @route   GET /api/agents/search
// @access  Public
exports.searchAgents = async (req, res, next) => {
  try {
    const { q, limit = 10, page = 1 } = req.query;

    if (!q) {
      throw new AppError("Search term is required", 400, "ValidationError");
    }

    const agents = await Agent.search(q);
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginatedResults = agents.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: paginatedResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: agents.length,
        pages: Math.ceil(agents.length / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top rated agents
// @route   GET /api/agents/top-rated
// @access  Public
exports.getTopRatedAgents = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const agents = await Agent.getTopRated(parseInt(limit));
    res.json({ success: true, data: agents });
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN FUNCTIONS ====================

// @desc    Get all agents (admin view)
// @route   GET /api/admin/agents
// @access  Private
exports.getAllAgentsAdmin = async (req, res, next) => {
  try {
    const {
      status,
      featured,
      limit = 20,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (featured === "true") query.featured = true;
    if (featured === "false") query.featured = false;

    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortDirection };

    const agents = await Agent.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Agent.countDocuments(query);

    res.json({
      success: true,
      data: agents,
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

// @desc    Get single agent (admin)
// @route   GET /api/admin/agents/:id
// @access  Private
exports.getAgentByIdAdmin = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id)
      .populate("properties", "title type price location status")
      .populate("featuredProperties", "title type price location");

    if (!agent) {
      throw new AppError("Agent not found", 404, "NotFoundError");
    }

    res.json({ success: true, data: agent });
  } catch (error) {
    next(error);
  }
};

// Update the createAgent function to handle file upload:
exports.createAgent = async (req, res, next) => {
  // Store uploaded file info at the start
  let uploadedImage = null;
  let uploadedImagePublicId = null;
  let uploadedImagePath = null;

  try {
    const {
      name,
      title,
      bio,
      shortBio,
      experience,
      specialties,
      email,
      phone,
      alternativePhone,
      social,
      languages,
      certifications,
      awards,
      status,
      featured,
      displayOrder,
      workHours,
    } = req.body;

    // Store image info if uploaded
    if (req.file) {
      uploadedImage = req.file;
      uploadedImagePath = req.file.path;
      uploadedImagePublicId = req.file.filename;
      console.log("📸 Image uploaded:", {
        path: uploadedImagePath,
        publicId: uploadedImagePublicId,
        filename: req.file.filename,
      });
    }

    // Validate required fields
    if (!name || !email) {
      throw new AppError("Name and email are required", 400, "ValidationError");
    }

    // Check if agent with same email exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      throw new AppError(
        "Agent with this email already exists",
        400,
        "DuplicateError",
      );
    }

    // Handle image upload from multer
    let image = "";
    let imagePublicIdValue = "";

    if (uploadedImage) {
      image = uploadedImage.path;
      imagePublicIdValue = uploadedImage.filename;
    }

    // Parse JSON fields if they come as strings
    let parsedSpecialties = specialties;
    let parsedSocial = social;
    let parsedLanguages = languages;
    let parsedCertifications = certifications;
    let parsedAwards = awards;
    let parsedWorkHours = workHours;

    if (specialties && typeof specialties === "string") {
      parsedSpecialties = JSON.parse(specialties);
    }
    if (social && typeof social === "string") {
      parsedSocial = JSON.parse(social);
    }
    if (languages && typeof languages === "string") {
      parsedLanguages = JSON.parse(languages);
    }
    if (certifications && typeof certifications === "string") {
      parsedCertifications = JSON.parse(certifications);
    }
    if (awards && typeof awards === "string") {
      parsedAwards = JSON.parse(awards);
    }
    if (workHours && typeof workHours === "string") {
      parsedWorkHours = JSON.parse(workHours);
    }

    // Create agent
    const agent = new Agent({
      name,
      title,
      bio,
      shortBio,
      experience,
      specialties: parsedSpecialties || [],
      email,
      phone,
      alternativePhone,
      social: parsedSocial || {},
      image,
      imagePublicId: imagePublicIdValue,
      languages: parsedLanguages || [],
      certifications: parsedCertifications || [],
      awards: parsedAwards || [],
      status: status || "active",
      featured: featured || false,
      displayOrder: displayOrder || 0,
      workHours: parsedWorkHours,
    });

    await agent.save();

    // Success - clear stored image info
    uploadedImage = null;
    uploadedImagePublicId = null;
    uploadedImagePath = null;

    res.status(201).json({
      success: true,
      data: agent,
      message: "Agent created successfully",
    });
  } catch (error) {
    // Clean up uploaded image if error occurred
    if (uploadedImagePublicId) {
      try {
        console.log(`🧹 Attempting to delete image: ${uploadedImagePublicId}`);
        // Use deleteImageByPublicId if you have it, or deleteImage with path
        if (typeof deleteImageByPublicId === "function") {
          await deleteImageByPublicId(uploadedImagePublicId);
        } else if (uploadedImagePath) {
          await deleteImage(uploadedImagePath);
        }
        console.log(`✅ Image deleted successfully`);
      } catch (cleanupError) {
        console.error(`❌ Failed to delete image:`, cleanupError);
      }
    } else if (uploadedImagePath) {
      try {
        console.log(
          `🧹 Attempting to delete image by path: ${uploadedImagePath}`,
        );
        await deleteImage(uploadedImagePath);
        console.log(`✅ Image deleted successfully`);
      } catch (cleanupError) {
        console.error(`❌ Failed to delete image:`, cleanupError);
      }
    }
    next(error);
  }
};

// Update updateAgent to handle image upload:
exports.updateAgent = async (req, res, next) => {
  // Store uploaded file info if any
  let uploadedFile = null;
  let shouldDeleteUploadedFile = false;

  try {
    const {
      name,
      title,
      bio,
      shortBio,
      experience,
      specialties,
      email,
      phone,
      alternativePhone,
      social,
      languages,
      certifications,
      awards,
      status,
      featured,
      displayOrder,
      workHours,
      deals,
      rating,
      reviews,
      totalSalesValue,
    } = req.body;

    console.log("📝 UPDATE AGENT - Received data:", { name, email });

    // Find the agent first
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      throw new AppError("Agent not found", 404, "NotFoundError");
    }

    // Store old image info
    const oldImagePublicId = agent.imagePublicId;

    // VALIDATE EMAIL HERE (before any database operation)
    if (email && email !== agent.email) {
      // Check email format
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        // If validation fails, delete uploaded image
        if (req.file) {
          await deleteImage(req.file.path).catch(console.error);
        }
        throw new AppError(
          "Please provide a valid email address",
          400,
          "ValidationError",
        );
      }

      // Check if email already exists
      const existingAgent = await Agent.findOne({ email });
      if (
        existingAgent &&
        existingAgent._id.toString() !== agent._id.toString()
      ) {
        // If validation fails, delete uploaded image
        if (req.file) {
          await deleteImage(req.file.path).catch(console.error);
        }
        throw new AppError(
          "Agent with this email already exists",
          400,
          "DuplicateError",
        );
      }
    }

    // Handle file upload (email already validated)
    if (req.file) {
      uploadedFile = req.file;
      console.log("📸 New image uploaded after validation:", {
        path: uploadedFile.path,
        publicId: uploadedFile.filename,
      });
      shouldDeleteUploadedFile = true; // Mark for deletion if save fails
    }

    // Parse JSON fields
    let parsedSpecialties = specialties;
    let parsedSocial = social;
    let parsedLanguages = languages;
    let parsedCertifications = certifications;
    let parsedAwards = awards;
    let parsedWorkHours = workHours;

    if (specialties && typeof specialties === "string")
      parsedSpecialties = JSON.parse(specialties);
    if (social && typeof social === "string") parsedSocial = JSON.parse(social);
    if (languages && typeof languages === "string")
      parsedLanguages = JSON.parse(languages);
    if (certifications && typeof certifications === "string")
      parsedCertifications = JSON.parse(certifications);
    if (awards && typeof awards === "string") parsedAwards = JSON.parse(awards);
    if (workHours && typeof workHours === "string")
      parsedWorkHours = JSON.parse(workHours);

    // Update all fields
    if (name) agent.name = name;
    if (title) agent.title = title;
    if (bio) agent.bio = bio;
    if (shortBio) agent.shortBio = shortBio;
    if (experience) agent.experience = experience;
    if (parsedSpecialties) agent.specialties = parsedSpecialties;
    if (email) agent.email = email;
    if (phone) agent.phone = phone;
    if (alternativePhone) agent.alternativePhone = alternativePhone;
    if (parsedSocial) agent.social = { ...agent.social, ...parsedSocial };
    if (parsedLanguages) agent.languages = parsedLanguages;
    if (parsedCertifications) agent.certifications = parsedCertifications;
    if (parsedAwards) agent.awards = parsedAwards;
    if (status) agent.status = status;
    if (featured !== undefined) agent.featured = featured;
    if (displayOrder !== undefined) agent.displayOrder = displayOrder;
    if (parsedWorkHours)
      agent.workHours = { ...agent.workHours, ...parsedWorkHours };
    if (deals !== undefined) agent.deals = deals;
    if (rating !== undefined) agent.rating = rating;
    if (reviews !== undefined) agent.reviews = reviews;
    if (totalSalesValue !== undefined) agent.totalSalesValue = totalSalesValue;

    // Update image if file was uploaded
    if (uploadedFile) {
      agent.image = uploadedFile.path;
      agent.imagePublicId = uploadedFile.filename;
    }

    // Save agent (this will trigger other validations)
    await agent.save();
    console.log("✅ Agent saved successfully");

    // If save succeeded AND we updated the image, delete OLD image
    if (uploadedFile && oldImagePublicId) {
      console.log(`🗑️ Deleting old image: ${oldImagePublicId}`);
      await deleteImageByPublicId(oldImagePublicId).catch(console.error);
    }

    // Clear flag
    shouldDeleteUploadedFile = false;

    res.json({
      success: true,
      data: agent,
      message: "Agent updated successfully",
    });
  } catch (error) {
    console.log("❌ Error in update:", error.message);

    // If we uploaded a new image and save failed, delete the NEW image
    if (req.file && shouldDeleteUploadedFile) {
      try {
        console.log(
          `🧹 Deleting NEW image (validation failed): ${req.file.filename}`,
        );
        await deleteImageByPublicId(req.file.filename);
        console.log(`✅ New image cleaned up`);
      } catch (cleanupError) {
        console.error(`❌ Failed to clean up new image:`, cleanupError);
      }
    }

    next(error);
  }
};

// @desc    Delete agent
// @route   DELETE /api/admin/agents/:id
// @access  Private
exports.deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      throw new AppError("Agent not found", 404, "NotFoundError");
    }

    // Delete agent's image from Cloudinary
    if (agent.imagePublicId) {
      await deleteImage(agent.image).catch(console.error);
    }

    // Remove agent reference from properties
    await Property.updateMany({ agent: agent._id }, { $unset: { agent: "" } });

    await Agent.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add property to agent
// @route   POST /api/admin/agents/:id/properties/:propertyId
// @access  Private
exports.addPropertyToAgent = async (req, res, next) => {
  try {
    const { id, propertyId } = req.params;

    const agent = await Agent.findById(id);
    if (!agent) {
      throw new AppError("Agent not found", 404, "NotFoundError");
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new AppError("Property not found", 404, "NotFoundError");
    }

    await agent.addProperty(propertyId);

    res.json({
      success: true,
      data: agent,
      message: "Property added to agent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from agent
// @route   DELETE /api/admin/agents/:id/properties/:propertyId
// @access  Private
exports.removePropertyFromAgent = async (req, res, next) => {
  try {
    const { id, propertyId } = req.params;

    const agent = await Agent.findById(id);
    if (!agent) {
      throw new AppError("Agent not found", 404, "NotFoundError");
    }

    await agent.removeProperty(propertyId);

    res.json({
      success: true,
      message: "Property removed from agent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add testimonial to agent
// @route   POST /api/admin/agents/:id/testimonials
// @access  Private
exports.addTestimonialToAgent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { clientName, content, rating } = req.body;

    if (!clientName || !content) {
      throw new AppError(
        "Client name and testimonial content are required",
        400,
        "ValidationError",
      );
    }

    const agent = await Agent.findById(id);
    if (!agent) {
      throw new AppError("Agent not found", 404, "NotFoundError");
    }

    await agent.addTestimonial({ clientName, content, rating });

    res.json({
      success: true,
      data: agent,
      message: "Testimonial added successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent statistics
// @route   GET /api/admin/agents/stats
// @access  Private
exports.getAgentStats = async (req, res, next) => {
  try {
    const [totalAgents, activeAgents, featuredAgents, topAgent, recentAgents] =
      await Promise.all([
        Agent.countDocuments(),
        Agent.countDocuments({ status: "active" }),
        Agent.countDocuments({ featured: true, status: "active" }),
        Agent.findOne({ status: "active" })
          .sort({ rating: -1, deals: -1 })
          .limit(1),
        Agent.find({ status: "active" }).sort({ createdAt: -1 }).limit(5),
      ]);

    const specialtyStats = await Agent.aggregate([
      { $match: { status: "active" } },
      { $unwind: "$specialties" },
      { $group: { _id: "$specialties", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalAgents,
        activeAgents,
        featuredAgents,
        topAgent,
        recentAgents,
        specialtyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update agents (status, featured, etc.)
// @route   POST /api/admin/agents/bulk-update
// @access  Private
exports.bulkUpdateAgents = async (req, res, next) => {
  try {
    const { agentIds, updateData } = req.body;

    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      throw new AppError(
        "Please provide an array of agent IDs",
        400,
        "ValidationError",
      );
    }

    const result = await Agent.updateMany(
      { _id: { $in: agentIds } },
      { $set: updateData },
      { runValidators: true },
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} agents updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export agents to CSV
// @route   GET /api/admin/agents/export/csv
// @access  Private
exports.exportAgentsCSV = async (req, res, next) => {
  try {
    const agents = await Agent.find({ status: "active" }).sort({ name: 1 });

    const headers = [
      "Name",
      "Title",
      "Email",
      "Phone",
      "Specialties",
      "Experience",
      "Deals",
      "Rating",
      "Reviews",
      "Status",
      "Featured",
      "Created At",
    ];

    const rows = agents.map((agent) => [
      `"${agent.name}"`,
      `"${agent.title || ""}"`,
      `"${agent.email}"`,
      `"${agent.phone || ""}"`,
      `"${agent.specialties.join("; ")}"`,
      `"${agent.experience || ""}"`,
      agent.deals,
      agent.rating,
      agent.reviews,
      agent.status,
      agent.featured ? "Yes" : "No",
      agent.createdAt.toISOString().split("T")[0],
    ]);

    const csvString = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=agents_${new Date().toISOString().split("T")[0]}.csv`,
    );
    res.send(csvString);
  } catch (error) {
    next(error);
  }
};
