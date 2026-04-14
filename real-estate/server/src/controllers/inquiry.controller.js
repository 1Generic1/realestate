const Inquiry = require("../models/Inquiry.model");
const { AppError } = require("../middleware/errorMiddleware");

// ==================== PUBLIC FUNCTIONS ====================

// @desc    Submit a new inquiry (from contact/rent/land forms)
// @route   POST /api/inquiries
// @access  Public
exports.submitInquiry = async (req, res, next) => {
  try {
    // Log incoming request for debugging
    console.log("📥 Incoming request body:", JSON.stringify(req.body, null, 2));

    // Filter out any fields that are empty strings, null, or undefined
    const filteredBody = {};
    for (const [key, value] of Object.entries(req.body)) {
      // Only include fields that have meaningful values
      if (value !== "" && value !== null && value !== undefined) {
        filteredBody[key] = value;
      }
    }

    console.log("🧹 Filtered body:", JSON.stringify(filteredBody, null, 2));

    const {
      name,
      email,
      phone,
      serviceType,
      preferredLocation,
      budgetRange,
      propertyType,
      landType,
      timeline,
      message,
      inquiryType,
      source,
      propertyId,
      propertyTitle,
    } = filteredBody;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 10 characters long",
      });
    }

    // Build inquiry data with only valid fields
    const inquiryData = {
      name,
      email,
      message,
      inquiryType: inquiryType || "general",
      source: source || "contact_form",
      ipAddress:
        req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress,
      userAgent: req.headers["user-agent"],
    };

    // Add optional fields only if they exist
    if (phone) inquiryData.phone = phone;
    if (serviceType) inquiryData.serviceType = serviceType;
    if (preferredLocation) inquiryData.preferredLocation = preferredLocation;
    if (budgetRange) inquiryData.budgetRange = budgetRange;
    if (propertyType) inquiryData.propertyType = propertyType;
    if (landType) inquiryData.landType = landType;
    if (propertyId) inquiryData.propertyId = propertyId;
    if (propertyTitle) inquiryData.propertyTitle = propertyTitle;

    // Handle timeline - ONLY if it's a valid enum value
    const validTimelines = [
      "immediate",
      "1-3months",
      "3-6months",
      "6-12months",
      "researching",
    ];
    if (timeline && validTimelines.includes(timeline)) {
      inquiryData.timeline = timeline;
    }
    // If timeline is not valid or doesn't exist, we explicitly do NOT add it

    console.log("📝 Final inquiry data:", JSON.stringify(inquiryData, null, 2));

    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();

    return res.status(201).json({
      success: true,
      message:
        "Thank you! Your message has been sent successfully. We'll get back to you soon.",
      data: {
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Submit inquiry error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// ==================== ADMIN FUNCTIONS ====================

// @desc    Get all inquiries (with filters)
// @route   GET /api/admin/inquiries
// @access  Private
exports.getAllInquiries = async (req, res, next) => {
  try {
    const {
      status,
      inquiryType,
      source,
      serviceType,
      limit = 20,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (inquiryType) query.inquiryType = inquiryType;
    if (source) query.source = source;
    if (serviceType) query.serviceType = serviceType;

    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortDirection };

    const inquiries = await Inquiry.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("propertyId", "title type location price");

    const total = await Inquiry.countDocuments(query);

    res.json({
      success: true,
      data: inquiries,
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

// @desc    Get single inquiry by ID
// @route   GET /api/admin/inquiries/:id
// @access  Private
exports.getInquiryById = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate(
      "propertyId",
      "title type location price",
    );

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404, "NotFoundError");
    }

    // Mark as read if it was new
    if (inquiry.status === "new") {
      await inquiry.markAsRead();
    }

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status
// @route   PATCH /api/admin/inquiries/:id/status
// @access  Private
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "read", "replied", "archived"];

    if (!validStatuses.includes(status)) {
      throw new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        400,
        "ValidationError",
      );
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      throw new AppError("Inquiry not found", 404, "NotFoundError");
    }

    inquiry.status = status;
    await inquiry.save();

    res.json({
      success: true,
      data: inquiry,
      message: `Inquiry marked as ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark inquiry as replied
// @route   POST /api/admin/inquiries/:id/reply
// @access  Private
exports.replyToInquiry = async (req, res, next) => {
  try {
    const { message, adminNote } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404, "NotFoundError");
    }

    // Add admin note if provided
    if (adminNote) {
      await inquiry.addAdminNote(adminNote);
    }

    // Mark as replied
    await inquiry.markAsReplied(req.admin.username);

    // Here you would send an email reply to the client
    // await sendReplyEmail(inquiry.email, message, inquiry.name);

    res.json({
      success: true,
      data: inquiry,
      message: "Reply sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add admin note to inquiry
// @route   POST /api/admin/inquiries/:id/note
// @access  Private
exports.addAdminNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404, "NotFoundError");
    }

    await inquiry.addAdminNote(note);

    res.json({
      success: true,
      data: inquiry,
      message: "Note added successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive inquiry
// @route   DELETE /api/admin/inquiries/:id/archive
// @access  Private
exports.archiveInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      throw new AppError("Inquiry not found", 404, "NotFoundError");
    }

    await inquiry.archive();

    res.json({
      success: true,
      message: "Inquiry archived successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry permanently
// @route   DELETE /api/admin/inquiries/:id
// @access  Private
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      throw new AppError("Inquiry not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiry statistics (dashboard)
// @route   GET /api/admin/inquiries/stats
// @access  Private
exports.getInquiryStats = async (req, res, next) => {
  try {
    const [
      unreadCount,
      statusStats,
      typeStats,
      sourceStats,
      serviceStats,
      recentInquiries,
    ] = await Promise.all([
      Inquiry.getUnreadCount(),
      Inquiry.getStats(),
      Inquiry.getTypeStats(),
      Inquiry.getSourceStats(),
      Inquiry.aggregate([
        {
          $group: {
            _id: "$serviceType",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Inquiry.getRecent(5),
    ]);

    res.json({
      success: true,
      data: {
        unreadCount,
        statusStats,
        typeStats,
        sourceStats,
        serviceStats,
        recentInquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search inquiries
// @route   GET /api/admin/inquiries/search
// @access  Private
exports.searchInquiries = async (req, res, next) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;

    if (!q) {
      throw new AppError("Search term is required", 400, "ValidationError");
    }

    const results = await Inquiry.search(q);

    // Simple pagination for search results
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginatedResults = results.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: paginatedResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: results.length,
        pages: Math.ceil(results.length / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export inquiries as CSV
// @route   GET /api/admin/inquiries/export/csv
// @access  Private
exports.exportInquiriesCSV = async (req, res, next) => {
  try {
    const { status, inquiryType, source, serviceType } = req.query;
    const query = {};
    if (status) query.status = status;
    if (inquiryType) query.inquiryType = inquiryType;
    if (source) query.source = source;
    if (serviceType) query.serviceType = serviceType;

    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });

    // Define CSV headers
    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
      "Phone",
      "Inquiry Type",
      "Service Type",
      "Source",
      "Location",
      "Budget",
      "Property Type",
      "Land Type",
      "Timeline",
      "Message",
      "Status",
      "Admin Notes",
    ];

    // Convert to CSV rows
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const inquiry of inquiries) {
      const row = [
        `"${inquiry._id}"`,
        inquiry.createdAt.toISOString().split("T")[0],
        `"${(inquiry.name || "").replace(/"/g, '""')}"`,
        `"${(inquiry.email || "").replace(/"/g, '""')}"`,
        `"${(inquiry.phone || "").replace(/"/g, '""')}"`,
        inquiry.inquiryTypeDisplay,
        inquiry.serviceTypeDisplay,
        inquiry.sourceDisplay,
        `"${(inquiry.preferredLocation || "").replace(/"/g, '""')}"`,
        `"${(inquiry.budgetRange || "").replace(/"/g, '""')}"`,
        `"${(inquiry.propertyType || "").replace(/"/g, '""')}"`,
        `"${(inquiry.landType || "").replace(/"/g, '""')}"`,
        inquiry.timelineDisplay || "",
        `"${(inquiry.message || "").replace(/"/g, '""')}"`,
        inquiry.status,
        `"${(inquiry.adminNotes || "").replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    }

    const csvString = csvRows.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=inquiries_${new Date().toISOString().split("T")[0]}.csv`,
    );
    res.send(csvString);
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete inquiries
// @route   POST /api/admin/inquiries/bulk-delete
// @access  Private
exports.bulkDeleteInquiries = async (req, res, next) => {
  try {
    const { inquiryIds } = req.body;

    if (!inquiryIds || !Array.isArray(inquiryIds) || inquiryIds.length === 0) {
      throw new AppError(
        "Please provide an array of inquiry IDs",
        400,
        "ValidationError",
      );
    }

    const result = await Inquiry.deleteMany({ _id: { $in: inquiryIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} inquiries deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiries by date range
// @route   GET /api/admin/inquiries/date-range
// @access  Private
exports.getInquiriesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    if (!startDate || !endDate) {
      throw new AppError(
        "Start date and end date are required",
        400,
        "ValidationError",
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const inquiries = await Inquiry.find({
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: inquiries,
      count: inquiries.length,
    });
  } catch (error) {
    next(error);
  }
};
