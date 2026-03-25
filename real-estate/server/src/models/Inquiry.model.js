const mongoose = require("mongoose");

// Helper validation functions
const validatePhone = (phone) => {
  // Allows: +2348012345678, 08012345678, +234 801 234 5678, etc.
  return /^\+?[\d\s-]{10,20}$/.test(phone);
};

const inquirySchema = new mongoose.Schema(
  {
    // ===== CONTACT INFORMATION =====
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: validatePhone,
        message: (props) =>
          `${props.value} is not a valid phone number! Use format: +234 801 234 5678`,
      },
    },

    // ===== SERVICE SELECTION (For Contact Form) =====
    serviceType: {
      type: String,
      enum: [
        "acquisition", // Property Acquisition
        "land", // Land Banking
        "advisory", // Realty Advisory
        "investment", // Investment Solutions
        "legal", // Legal & Compliance
        "other", // Other
        "",
      ],
      default: "",
      trim: true,
    },

    // ===== LOCATION & PREFERENCES (From Rent/Land Forms) =====
    preferredLocation: {
      type: String,
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },

    budgetRange: {
      type: String,
      trim: true,
      // Example values: "0-3m", "3-6m", "6-10m", "10m+"
    },

    // ===== PROPERTY TYPE (for Rent Page) =====
    propertyType: {
      type: String,
      trim: true,
    },

    // ===== LAND TYPE (for Land Page) =====
    landType: {
      type: String,
      trim: true,
    },

    // ===== TIMELINE (for Land Page) =====
    timeline: {
      type: String,
      enum: [
        "immediate",
        "1-3months",
        "3-6months",
        "6-12months",
        "researching",
      ],
      default: null,
    },

    // ===== INQUIRY DETAILS =====
    inquiryType: {
      type: String,
      enum: ["general", "property", "land", "rent", "buy", "sell", "valuation"],
      default: "general",
    },

    // Reference to specific property (if inquiry is about a property)
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },

    propertyTitle: {
      type: String,
      trim: true,
      maxlength: [200, "Property title cannot exceed 200 characters"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },

    // ===== STATUS TRACKING =====
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },

    // Admin notes (internal)
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },

    // Who replied to this inquiry
    repliedBy: {
      type: String,
      trim: true,
    },

    // When was it replied
    repliedAt: {
      type: Date,
    },

    // ===== SOURCE TRACKING =====
    source: {
      type: String,
      enum: [
        "contact_form",
        "property_page",
        "land_page",
        "rent_page",
        "buy_page",
        "agents_page",
        "homepage",
        "newsletter",
        "other",
      ],
      default: "contact_form",
    },

    // ===== METADATA =====
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    // Track if email notification was sent
    emailSent: {
      type: Boolean,
      default: false,
    },

    emailSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ===== INDEXES =====
inquirySchema.index({ status: 1, createdAt: -1 });
inquirySchema.index({ email: 1 });
inquirySchema.index({ inquiryType: 1 });
inquirySchema.index({ source: 1 });
inquirySchema.index({ createdAt: -1 });

// ===== VIRTUALS =====
// Short message preview
inquirySchema.virtual("shortMessage").get(function () {
  if (this.message.length > 100) {
    return this.message.substring(0, 100) + "...";
  }
  return this.message;
});

// Formatted phone number for display
inquirySchema.virtual("formattedPhone").get(function () {
  if (!this.phone) return "Not provided";
  return this.phone;
});

// Get inquiry type display name
inquirySchema.virtual("inquiryTypeDisplay").get(function () {
  const types = {
    general: "General Inquiry",
    property: "Property Inquiry",
    land: "Land Inquiry",
    rent: "Rental Inquiry",
    buy: "Buy Property Inquiry",
    sell: "Sell Property Inquiry",
    valuation: "Valuation Request",
  };
  return types[this.inquiryType] || this.inquiryType;
});

// Get source display name
inquirySchema.virtual("sourceDisplay").get(function () {
  const sources = {
    contact_form: "Contact Form",
    property_page: "Property Page",
    land_page: "Land Page",
    rent_page: "Rent Page",
    buy_page: "Buy Page",
    agents_page: "Agents Page",
    homepage: "Homepage",
    newsletter: "Newsletter",
    other: "Other",
  };
  return sources[this.source] || this.source;
});

// Get timeline display
inquirySchema.virtual("timelineDisplay").get(function () {
  if (!this.timeline) return null;
  const timelines = {
    immediate: "Immediately",
    "1-3months": "1-3 months",
    "3-6months": "3-6 months",
    "6-12months": "6-12 months",
    researching: "Just researching",
  };
  return timelines[this.timeline] || this.timeline;
});

// Time ago (for display)
inquirySchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = Math.floor((now - this.createdAt) / 1000); // seconds

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / 2592000)} months ago`;
});

// ===== METHODS =====

// Mark inquiry as read
inquirySchema.methods.markAsRead = async function () {
  if (this.status === "new") {
    this.status = "read";
    return await this.save();
  }
  return this;
};

// Mark inquiry as replied
inquirySchema.methods.markAsReplied = async function (repliedBy) {
  this.status = "replied";
  this.repliedBy = repliedBy;
  this.repliedAt = new Date();
  return await this.save();
};

// Archive inquiry
inquirySchema.methods.archive = async function () {
  this.status = "archived";
  return await this.save();
};

// Add admin note
inquirySchema.methods.addAdminNote = async function (note) {
  this.adminNotes = note;
  return await this.save();
};

// Mark email as sent
inquirySchema.methods.markEmailSent = async function () {
  this.emailSent = true;
  this.emailSentAt = new Date();
  return await this.save();
};

// ===== STATICS =====

// Get unread count
inquirySchema.statics.getUnreadCount = async function () {
  return await this.countDocuments({ status: "new" });
};

// Get statistics by status
inquirySchema.statics.getStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
};

// Get statistics by inquiry type
inquirySchema.statics.getTypeStats = async function () {
  return await this.aggregate([
    {
      $group: {
        _id: "$inquiryType",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);
};

// Get statistics by source
inquirySchema.statics.getSourceStats = async function () {
  return await this.aggregate([
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

// Get recent inquiries
inquirySchema.statics.getRecent = async function (limit = 10) {
  return await this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("propertyId", "title type location price");
};

// Get inquiries by type
inquirySchema.statics.getByType = async function (type, limit = 20) {
  return await this.find({ inquiryType: type })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Search inquiries
inquirySchema.statics.search = async function (searchTerm) {
  return await this.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { message: { $regex: searchTerm, $options: "i" } },
      { phone: { $regex: searchTerm, $options: "i" } },
      { preferredLocation: { $regex: searchTerm, $options: "i" } },
    ],
  }).sort({ createdAt: -1 });
};

// Delete old inquiries (older than 5 years)
inquirySchema.statics.deleteOld = async function (days = 1825) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return await this.deleteMany({
    status: "archived",
    createdAt: { $lt: cutoffDate },
  });
};

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
