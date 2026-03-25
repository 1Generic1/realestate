const mongoose = require("mongoose");

// Helper validation functions
const validatePhone = (phone) => {
  // Allows: +2348012345678, 08012345678, +234 801 234 5678, etc.
  return /^\+?[\d\s-]{10,20}$/.test(phone);
};

const agentSchema = new mongoose.Schema(
  {
    // ===== BASIC INFORMATION =====
    name: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ===== PROFESSIONAL INFORMATION =====
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      default: "Real Estate Agent",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [2000, "Bio cannot exceed 2000 characters"],
    },

    shortBio: {
      type: String,
      trim: true,
      maxlength: [200, "Short bio cannot exceed 200 characters"],
    },

    experience: {
      type: String,
      trim: true,
      default: "0+ years",
    },

    specialties: [
      {
        type: String,
        enum: [
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
        ],
        trim: true,
      },
    ],

    // ===== CONTACT INFORMATION =====
    email: {
      type: String,
      required: [true, "Agent email is required"],
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

    alternativePhone: {
      type: String,
      trim: true,
    },

    // ===== SOCIAL MEDIA =====
    social: {
      facebook: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
      instagram: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      whatsapp: { type: String, trim: true, default: "" },
    },

    // ===== MEDIA =====
    image: {
      type: String,
      default: "",
    },

    imagePublicId: {
      type: String,
    },

    // ===== STATISTICS & PERFORMANCE =====
    deals: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSalesValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ===== PROPERTIES =====
    properties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    featuredProperties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    ],

    // ===== AVAILABILITY =====
    status: {
      type: String,
      enum: ["active", "inactive", "on_leave", "former"],
      default: "active",
    },

    availableForAppointments: {
      type: Boolean,
      default: true,
    },

    workHours: {
      monday: { type: String, default: "9:00 AM - 6:00 PM" },
      tuesday: { type: String, default: "9:00 AM - 6:00 PM" },
      wednesday: { type: String, default: "9:00 AM - 6:00 PM" },
      thursday: { type: String, default: "9:00 AM - 6:00 PM" },
      friday: { type: String, default: "9:00 AM - 6:00 PM" },
      saturday: { type: String, default: "10:00 AM - 2:00 PM" },
      sunday: { type: String, default: "Closed" },
    },

    // ===== DISPLAY SETTINGS =====
    featured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    // ===== LANGUAGES =====
    languages: [
      {
        type: String,
        trim: true,
      },
    ],

    // ===== CERTIFICATIONS =====
    certifications: [
      {
        name: { type: String, trim: true },
        issuer: { type: String, trim: true },
        year: { type: Number },
        verified: { type: Boolean, default: false },
      },
    ],

    // ===== AWARDS =====
    awards: [
      {
        title: { type: String, trim: true },
        year: { type: Number },
        organization: { type: String, trim: true },
      },
    ],

    // ===== TESTIMONIALS =====
    testimonials: [
      {
        clientName: { type: String, trim: true },
        content: { type: String, trim: true },
        rating: { type: Number, min: 1, max: 5 },
        date: { type: Date, default: Date.now },
      },
    ],

    // ===== SEO =====
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [60, "SEO title should not exceed 60 characters"],
    },

    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "SEO description should not exceed 160 characters"],
    },

    // ===== METADATA =====
    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// ===== INDEXES =====
agentSchema.index({ name: "text", bio: "text", specialties: "text" });
agentSchema.index({ featured: 1, displayOrder: 1 });
agentSchema.index({ status: 1 });
agentSchema.index({ rating: -1 });

// ===== PRE-SAVE HOOKS =====
agentSchema.pre("save", function (next) {
  // Generate slug from name
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  this.updatedAt = Date.now();
});

// ===== VIRTUALS =====
// Full profile URL
agentSchema.virtual("profileUrl").get(function () {
  return `/agents/${this.slug || this._id}`;
});

// Formatted rating
agentSchema.virtual("formattedRating").get(function () {
  return this.rating.toFixed(1);
});

// Rating stars
agentSchema.virtual("ratingStars").get(function () {
  const fullStars = Math.floor(this.rating);
  const hasHalfStar = this.rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(this.rating);
  return {
    full: fullStars,
    half: hasHalfStar,
    empty: emptyStars,
  };
});

// Contact email
agentSchema.virtual("contactEmail").get(function () {
  return this.email;
});

// ===== METHODS =====

// Add property to agent
agentSchema.methods.addProperty = async function (propertyId) {
  if (!this.properties.includes(propertyId)) {
    this.properties.push(propertyId);
    await this.save();
  }
  return this;
};

// Remove property from agent
agentSchema.methods.removeProperty = async function (propertyId) {
  this.properties = this.properties.filter(
    (id) => id.toString() !== propertyId.toString(),
  );
  this.featuredProperties = this.featuredProperties.filter(
    (id) => id.toString() !== propertyId.toString(),
  );
  await this.save();
  return this;
};

// Add featured property
agentSchema.methods.addFeaturedProperty = async function (propertyId) {
  if (!this.featuredProperties.includes(propertyId)) {
    this.featuredProperties.push(propertyId);
    await this.save();
  }
  return this;
};

// Update agent stats (deals, total sales, etc.)
agentSchema.methods.updateStats = async function (saleAmount) {
  this.deals += 1;
  if (saleAmount) {
    this.totalSalesValue += saleAmount;
  }
  await this.save();
  return this;
};

// Add testimonial
agentSchema.methods.addTestimonial = async function (testimonial) {
  this.testimonials.push(testimonial);
  // Recalculate rating
  const totalRating = this.testimonials.reduce(
    (sum, t) => sum + (t.rating || 0),
    0,
  );
  this.rating = totalRating / this.testimonials.length;
  this.reviews = this.testimonials.length;
  await this.save();
  return this;
};

// ===== STATICS =====

// Get featured agents
agentSchema.statics.getFeatured = async function (limit = 4) {
  return await this.find({ featured: true, status: "active" })
    .sort({ displayOrder: 1, rating: -1 })
    .limit(limit);
};

// Get agents by specialty
agentSchema.statics.getBySpecialty = async function (specialty, limit = 10) {
  return await this.find({
    status: "active",
    specialties: specialty,
  })
    .sort({ rating: -1, deals: -1 })
    .limit(limit);
};

// Search agents
agentSchema.statics.search = async function (searchTerm) {
  return await this.find({
    $or: [
      { name: { $regex: searchTerm, $options: "i" } },
      { bio: { $regex: searchTerm, $options: "i" } },
      { specialties: { $regex: searchTerm, $options: "i" } },
      { title: { $regex: searchTerm, $options: "i" } },
    ],
    status: "active",
  }).sort({ rating: -1, deals: -1 });
};

// Get top agents by rating
agentSchema.statics.getTopRated = async function (limit = 5) {
  return await this.find({ status: "active", rating: { $gt: 0 } })
    .sort({ rating: -1, deals: -1 })
    .limit(limit);
};

// Get agents by property type expertise
agentSchema.statics.getByPropertyType = async function (
  propertyType,
  limit = 10,
) {
  const specialtyMap = {
    buy: "residential",
    rent: "rental",
    land: "land",
    commercial: "commercial",
  };

  const specialty = specialtyMap[propertyType];
  if (!specialty) return [];

  return await this.getBySpecialty(specialty, limit);
};

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
