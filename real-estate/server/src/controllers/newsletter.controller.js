const Newsletter = require("../models/Newsletter.model");
const { AppError } = require("../middleware/errorMiddleware");
const crypto = require("crypto");

// ==================== PUBLIC FUNCTIONS ====================

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribe = async (req, res, next) => {
  try {
    const { email, name, preferences, source } = req.body;

    // Validate email
    if (!email) {
      throw new AppError("Email is required", 400, "ValidationError");
    }

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      // If unsubscribed, reactivate
      if (subscriber.status === "unsubscribed") {
        await subscriber.reactivate();
      }

      // Update preferences (merge new preferences with existing)
      const newPreferences = [
        ...new Set([...subscriber.preferences, ...(preferences || [])]),
      ];
      subscriber.preferences = newPreferences;
      subscriber.source = source || subscriber.source;
      await subscriber.save();

      return res.json({
        success: true,
        message: "Subscription updated successfully",
        data: {
          email: subscriber.email,
          preferences: subscriber.preferencesDisplay,
        },
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new subscriber
    subscriber = new Newsletter({
      email,
      name,
      preferences: preferences || [],
      source: source || "footer",
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers["user-agent"],
      verificationToken,
    });

    await subscriber.save();

    // TODO: Send verification email
    // await sendVerificationEmail(email, verificationToken, name);

    res.status(201).json({
      success: true,
      message: "Subscribed successfully! Please check your email to verify.",
      data: {
        email: subscriber.email,
        preferences: subscriber.preferencesDisplay,
      },
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return next(
        new AppError("Email already subscribed", 400, "DuplicateError"),
      );
    }
    next(error);
  }
};

// @desc    Verify email subscription
// @route   GET /api/newsletter/verify/:token
// @access  Public
exports.verifySubscription = async (req, res, next) => {
  try {
    const { token } = req.params;

    const subscriber = await Newsletter.findOne({ verificationToken: token });

    if (!subscriber) {
      throw new AppError(
        "Invalid or expired verification token",
        400,
        "ValidationError",
      );
    }

    await subscriber.verify();

    // TODO: Send welcome email
    // await sendWelcomeEmail(subscriber.email, subscriber.name);

    res.json({
      success: true,
      message: "Email verified successfully! You're now subscribed.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = async (req, res, next) => {
  try {
    const { email, reason } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400, "ValidationError");
    }

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      throw new AppError("Email not found", 404, "NotFoundError");
    }

    await subscriber.unsubscribe(reason);

    res.json({
      success: true,
      message: "Unsubscribed successfully. We're sorry to see you go!",
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ADMIN FUNCTIONS ====================

// @desc    Get all subscribers
// @route   GET /api/admin/newsletter
// @access  Private
exports.getAllSubscribers = async (req, res, next) => {
  try {
    const {
      status,
      source,
      preference,
      limit = 20,
      page = 1,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (source) query.source = source;
    if (preference) query.preferences = preference;

    const sortDirection = sortOrder === "desc" ? -1 : 1;
    const sort = { [sortBy]: sortDirection };

    const subscribers = await Newsletter.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Newsletter.countDocuments(query);

    res.json({
      success: true,
      data: subscribers,
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

// @desc    Get subscriber by ID
// @route   GET /api/admin/newsletter/:id
// @access  Private
exports.getSubscriberById = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      throw new AppError("Subscriber not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      data: subscriber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subscriber preferences
// @route   PUT /api/admin/newsletter/:id
// @access  Private
exports.updateSubscriber = async (req, res, next) => {
  try {
    const { name, preferences, status, location } = req.body;

    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      throw new AppError("Subscriber not found", 404, "NotFoundError");
    }

    if (name) subscriber.name = name;
    if (preferences) subscriber.preferences = preferences;
    if (status) subscriber.status = status;
    if (location) subscriber.location = location;

    await subscriber.save();

    res.json({
      success: true,
      data: subscriber,
      message: "Subscriber updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/admin/newsletter/:id
// @access  Private
exports.deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);

    if (!subscriber) {
      throw new AppError("Subscriber not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get newsletter statistics
// @route   GET /api/admin/newsletter/stats
// @access  Private
exports.getNewsletterStats = async (req, res, next) => {
  try {
    const [
      totalActive,
      totalUnsubscribed,
      sourceStats,
      preferenceStats,
      growthStats,
      recentSubscribers,
    ] = await Promise.all([
      Newsletter.countDocuments({ status: "active" }),
      Newsletter.countDocuments({ status: "unsubscribed" }),
      Newsletter.getSourceStats(),
      Newsletter.getPreferenceStats(),
      Newsletter.getGrowthStats(30),
      Newsletter.find({ status: "active" }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      data: {
        totalActive,
        totalUnsubscribed,
        sourceStats,
        preferenceStats,
        growthStats,
        recentSubscribers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search subscribers
// @route   GET /api/admin/newsletter/search
// @access  Private
exports.searchSubscribers = async (req, res, next) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;

    if (!q) {
      throw new AppError("Search term is required", 400, "ValidationError");
    }

    const results = await Newsletter.search(q);

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

// @desc    Get subscribers by preference
// @route   GET /api/admin/newsletter/preference/:preference
// @access  Private
exports.getSubscribersByPreference = async (req, res, next) => {
  try {
    const { preference } = req.params;
    const { limit = 50, page = 1 } = req.query;

    const validPreferences = [
      "houses",
      "flats",
      "commercial",
      "lands",
      "residential_land",
      "commercial_land",
      "agricultural_land",
      "investment_opportunities",
      "rental_properties",
      "price_drops",
      "market_updates",
      "exclusive_offers",
      "new_projects",
    ];

    if (!validPreferences.includes(preference)) {
      throw new AppError("Invalid preference", 400, "ValidationError");
    }

    const subscribers = await Newsletter.find({
      status: "active",
      preferences: preference,
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Newsletter.countDocuments({
      status: "active",
      preferences: preference,
    });

    res.json({
      success: true,
      data: subscribers,
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

// @desc    Export subscribers to CSV
// @route   GET /api/admin/newsletter/export/csv
// @access  Private
exports.exportSubscribersCSV = async (req, res, next) => {
  try {
    const { status = "active" } = req.query;
    const { headers, rows } = await Newsletter.exportToCSV(status);

    const csvString = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=subscribers_${new Date().toISOString().split("T")[0]}.csv`,
    );
    res.send(csvString);
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk unsubscribe
// @route   POST /api/admin/newsletter/bulk-unsubscribe
// @access  Private
exports.bulkUnsubscribe = async (req, res, next) => {
  try {
    const { emails, reason } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      throw new AppError(
        "Please provide an array of emails",
        400,
        "ValidationError",
      );
    }

    const result = await Newsletter.bulkUnsubscribe(emails, reason);

    res.json({
      success: true,
      message: `${result.modifiedCount} subscribers unsubscribed successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get land investors (specific to Land Page)
// @route   GET /api/admin/newsletter/land-investors
// @access  Private
exports.getLandInvestors = async (req, res, next) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const investors = await Newsletter.getLandInvestors()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = (await Newsletter.getLandInvestors()).length;

    res.json({
      success: true,
      data: investors,
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

// @desc    Get property buyers (houses, flats, commercial, lands)
// @route   GET /api/admin/newsletter/property-buyers
// @access  Private
exports.getPropertyBuyers = async (req, res, next) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const buyers = await Newsletter.getPropertyBuyers()
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = (await Newsletter.getPropertyBuyers()).length;

    res.json({
      success: true,
      data: buyers,
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

// @desc    Send test email to subscribers (placeholder)
// @route   POST /api/admin/newsletter/send-test
// @access  Private
exports.sendTestEmail = async (req, res, next) => {
  try {
    const { subject, content, preferences } = req.body;

    // This is a placeholder for email sending logic
    // You'll integrate with your email service here

    res.json({
      success: true,
      message: "Test email sent successfully (placeholder)",
    });
  } catch (error) {
    next(error);
  }
};
