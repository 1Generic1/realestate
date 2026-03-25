const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    // ===== SUBSCRIBER INFORMATION =====
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    name: {
      type: String,
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    // ===== SUBSCRIPTION PREFERENCES =====
    // Comprehensive list covering all pages:
    // Buy Page: houses, flats, commercial, lands (from Buy Page)
    // Land Page: residential_land, commercial_land, agricultural_land, investment_opportunities
    // Rent Page: rental_properties
    // General: price_drops, market_updates, exclusive_offers, new_projects
    preferences: [
      {
        type: String,
        enum: [
          // Property Types (Buy Page)
          "houses", // Houses for sale
          "flats", // Flats/Apartments for sale
          "commercial", // Commercial properties for sale
          "lands", // Lands (generic - from Buy Page)

          // Land Types (Land Page - specific categories)
          "residential_land", // Residential land plots
          "commercial_land", // Commercial land plots
          "agricultural_land", // Agricultural/Farm land
          "investment_opportunities", // General investment opportunities

          // Rental Properties (Rent Page)
          "rental_properties", // Properties for rent

          // General Alerts
          "price_drops", // Price drop alerts
          "market_updates", // Market trends and insights
          "exclusive_offers", // Exclusive deals and promotions
          "new_projects", // New development projects
        ],
        default: [],
      },
    ],

    // ===== SUBSCRIPTION STATUS =====
    status: {
      type: String,
      enum: ["active", "unsubscribed", "bounced", "spam"],
      default: "active",
    },

    // ===== SOURCE TRACKING =====
    source: {
      type: String,
      enum: [
        "homepage",
        "land_page",
        "rent_page",
        "buy_page",
        "contact_form",
        "popup",
        "footer",
        "blog",
        "other",
      ],
      default: "footer",
    },

    // ===== LOCATION & DEMOGRAPHICS =====
    location: {
      type: String,
      trim: true,
    },

    // ===== EMAIL METRICS =====
    emailSent: {
      type: Number,
      default: 0,
    },

    emailOpened: {
      type: Number,
      default: 0,
    },

    emailClicked: {
      type: Number,
      default: 0,
    },

    lastEmailSent: {
      type: Date,
    },

    lastEmailOpened: {
      type: Date,
    },

    // ===== UNSUBSCRIBE INFORMATION =====
    unsubscribedAt: {
      type: Date,
    },

    unsubscribeReason: {
      type: String,
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    // ===== METADATA =====
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      unique: true,
      sparse: true,
    },

    verifiedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ===== INDEXES =====
newsletterSchema.index({ email: 1 }, { unique: true });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ createdAt: -1 });
newsletterSchema.index({ preferences: 1 });

// ===== VIRTUALS =====
// Check if subscriber is active
newsletterSchema.virtual("isActive").get(function () {
  return this.status === "active";
});

// Get email domain
newsletterSchema.virtual("emailDomain").get(function () {
  if (!this.email) return null;
  const parts = this.email.split("@");
  return parts[1] || null;
});

// Get preference display names for frontend
newsletterSchema.virtual("preferencesDisplay").get(function () {
  const displayNames = {
    // Property Types (Buy Page)
    houses: "Houses",
    flats: "Flats/Apartments",
    commercial: "Commercial Properties",
    lands: "Lands (General)",

    // Land Types (Land Page - specific)
    residential_land: "Residential Land",
    commercial_land: "Commercial Land",
    agricultural_land: "Agricultural Land",
    investment_opportunities: "Investment Opportunities",

    // Rental
    rental_properties: "Rental Properties",

    // General
    price_drops: "Price Drop Alerts",
    market_updates: "Market Updates",
    exclusive_offers: "Exclusive Offers",
    new_projects: "New Development Projects",
  };

  return this.preferences.map((p) => displayNames[p] || p);
});

// ===== METHODS =====

// Unsubscribe
newsletterSchema.methods.unsubscribe = async function (reason = null) {
  this.status = "unsubscribed";
  this.unsubscribedAt = new Date();
  if (reason) {
    this.unsubscribeReason = reason;
  }
  return await this.save();
};

// Reactivate subscription
newsletterSchema.methods.reactivate = async function () {
  if (this.status === "unsubscribed") {
    this.status = "active";
    this.unsubscribedAt = null;
    this.unsubscribeReason = null;
  }
  return await this.save();
};

// Track email sent
newsletterSchema.methods.trackEmailSent = async function () {
  this.emailSent += 1;
  this.lastEmailSent = new Date();
  return await this.save();
};

// Track email opened
newsletterSchema.methods.trackEmailOpened = async function () {
  this.emailOpened += 1;
  this.lastEmailOpened = new Date();
  return await this.save();
};

// Track email clicked
newsletterSchema.methods.trackEmailClicked = async function () {
  this.emailClicked += 1;
  return await this.save();
};

// Update preferences
newsletterSchema.methods.updatePreferences = async function (preferences) {
  this.preferences = preferences;
  return await this.save();
};

// Verify email
newsletterSchema.methods.verify = async function () {
  this.verified = true;
  this.verifiedAt = new Date();
  this.verificationToken = null;
  return await this.save();
};

// Generate verification token
newsletterSchema.methods.generateVerificationToken = async function () {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;
  return token;
};

// Check if user wants specific property type
newsletterSchema.methods.wantsPropertyType = function (type) {
  const typeMap = {
    // Buy page property types
    house: "houses",
    flat: "flats",
    commercial: "commercial",
    land: "lands", // Generic land from Buy Page
    lands: "lands",

    // Land page land types (specific)
    residential_land: "residential_land",
    commercial_land: "commercial_land",
    agricultural_land: "agricultural_land",
    investment: "investment_opportunities",

    // Rent page
    rent: "rental_properties",
  };

  const preference = typeMap[type];
  return preference ? this.preferences.includes(preference) : false;
};

// ===== STATICS =====

// Get active subscribers
newsletterSchema.statics.getActiveSubscribers = async function () {
  return await this.find({ status: "active" }).sort({ createdAt: -1 });
};

// Get subscriber count by source
newsletterSchema.statics.getSourceStats = async function () {
  return await this.aggregate([
    {
      $match: { status: "active" },
    },
    {
      $group: {
        _id: "$source",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// Get subscriber count by preference
newsletterSchema.statics.getPreferenceStats = async function () {
  return await this.aggregate([
    {
      $match: { status: "active" },
    },
    {
      $unwind: "$preferences",
    },
    {
      $group: {
        _id: "$preferences",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// Get subscriber growth over time
newsletterSchema.statics.getGrowthStats = async function (days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
        date: { $first: "$createdAt" },
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);
};

// Find subscribers by preference
newsletterSchema.statics.findByPreference = async function (preference) {
  return await this.find({
    status: "active",
    preferences: preference,
  });
};

// ===== TARGETED SUBSCRIBER QUERIES =====

// Get subscribers by property type (Buy Page)
newsletterSchema.statics.getSubscribersByPropertyType = async function (
  propertyType,
) {
  const propertyMap = {
    house: "houses",
    flat: "flats",
    commercial: "commercial",
    land: "lands", // Generic land from Buy Page
    lands: "lands",
  };

  const preference = propertyMap[propertyType];
  if (!preference) return [];

  return await this.find({
    status: "active",
    preferences: preference,
  });
};

// Get subscribers by land type (Land Page - specific)
newsletterSchema.statics.getSubscribersByLandType = async function (landType) {
  const landTypeMap = {
    residential: "residential_land",
    commercial: "commercial_land",
    agricultural: "agricultural_land",
    investment: "investment_opportunities",
  };

  const preference = landTypeMap[landType];
  if (!preference) return [];

  return await this.find({
    status: "active",
    preferences: preference,
  });
};

// Get all land investors (all land-related preferences)
newsletterSchema.statics.getLandInvestors = async function () {
  return await this.find({
    status: "active",
    preferences: {
      $in: [
        "lands", // Generic land from Buy Page
        "residential_land",
        "commercial_land",
        "agricultural_land",
        "investment_opportunities",
      ],
    },
  });
};

// Get residential land subscribers
newsletterSchema.statics.getResidentialLandSubscribers = async function () {
  return await this.find({
    status: "active",
    preferences: "residential_land",
  });
};

// Get commercial land subscribers
newsletterSchema.statics.getCommercialLandSubscribers = async function () {
  return await this.find({
    status: "active",
    preferences: "commercial_land",
  });
};

// Get agricultural land subscribers
newsletterSchema.statics.getAgriculturalLandSubscribers = async function () {
  return await this.find({
    status: "active",
    preferences: "agricultural_land",
  });
};

// Get investment opportunity subscribers
newsletterSchema.statics.getInvestmentSubscribers = async function () {
  return await this.find({
    status: "active",
    preferences: "investment_opportunities",
  });
};

// Get property buyers (houses, flats, commercial, lands)
newsletterSchema.statics.getPropertyBuyers = async function () {
  return await this.find({
    status: "active",
    preferences: {
      $in: ["houses", "flats", "commercial", "lands"],
    },
  });
};

// Get rental property subscribers
newsletterSchema.statics.getRentalSubscribers = async function () {
  return await this.find({
    status: "active",
    preferences: "rental_properties",
  });
};

// Get all real estate investors (any property/land type)
newsletterSchema.statics.getAllInvestors = async function () {
  return await this.find({
    status: "active",
    preferences: {
      $in: [
        "houses",
        "flats",
        "commercial",
        "lands",
        "residential_land",
        "commercial_land",
        "agricultural_land",
        "investment_opportunities",
        "rental_properties",
      ],
    },
  });
};

// Search subscribers
newsletterSchema.statics.search = async function (searchTerm) {
  return await this.find({
    $or: [
      { email: { $regex: searchTerm, $options: "i" } },
      { name: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
    ],
  }).sort({ createdAt: -1 });
};

// Export subscribers as CSV
newsletterSchema.statics.exportToCSV = async function (status = "active") {
  const subscribers = await this.find({ status }).sort({ createdAt: -1 });

  const headers = [
    "Email",
    "Name",
    "Status",
    "Source",
    "Preferences",
    "Created At",
    "Email Sent",
    "Email Opened",
    "Location",
    "Verified",
  ];

  const rows = subscribers.map((sub) => [
    sub.email,
    sub.name || "",
    sub.status,
    sub.source,
    sub.preferences.join("; "),
    sub.createdAt.toISOString().split("T")[0],
    sub.emailSent,
    sub.emailOpened,
    sub.location || "",
    sub.verified ? "Yes" : "No",
  ]);

  return { headers, rows };
};

// Bulk unsubscribe (for spam/bounced emails)
newsletterSchema.statics.bulkUnsubscribe = async function (emails, reason) {
  return await this.updateMany(
    { email: { $in: emails } },
    {
      status: "unsubscribed",
      unsubscribedAt: new Date(),
      unsubscribeReason: reason,
    },
  );
};

// Clean up unverified subscribers older than 7 days
newsletterSchema.statics.cleanUnverified = async function () {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return await this.deleteMany({
    verified: false,
    createdAt: { $lt: sevenDaysAgo },
  });
};

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;
