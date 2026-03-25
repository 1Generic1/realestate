const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    // ===== CLIENT INFORMATION =====
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },

    role: {
      type: String,
      trim: true,
      default: "Client",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    // ===== TESTIMONIAL CONTENT =====
    content: {
      type: String,
      required: [true, "Testimonial content is required"],
      trim: true,
      maxlength: [500, "Testimonial cannot exceed 500 characters"],
    },

    // ===== MEDIA =====
    image: {
      type: String,
      default: "", // URL to client image (optional)
    },

    imagePublicId: {
      type: String,
      default: "",
    },

    // ===== RATING =====
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    // ===== PROPERTY REFERENCE (optional) =====
    propertyType: {
      type: String,
      enum: ["buy", "rent", "land", ""],
      default: "",
    },

    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
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

    // ===== STATUS =====
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
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
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

// ===== INDEXES =====
testimonialSchema.index({ featured: 1, displayOrder: 1 });
testimonialSchema.index({ status: 1 });
testimonialSchema.index({ rating: -1 });

// ===== VIRTUALS =====
testimonialSchema.virtual("shortContent").get(function () {
  if (this.content.length > 100) {
    return this.content.substring(0, 100) + "...";
  }
  return this.content;
});

testimonialSchema.virtual("ratingStars").get(function () {
  return "⭐".repeat(this.rating);
});

// ===== STATICS =====
// Get featured testimonials
testimonialSchema.statics.findFeatured = function (limit = 3) {
  return this.find({ featured: true, status: "approved" })
    .sort({ displayOrder: 1, createdAt: -1 })
    .limit(limit);
};

// Get testimonials by rating
testimonialSchema.statics.findByRating = function (rating, limit = 10) {
  return this.find({ rating: { $gte: rating }, status: "approved" })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// ===== METHODS =====
// Approve testimonial
testimonialSchema.methods.approve = function () {
  this.status = "approved";
  return this.save();
};

// Reject testimonial
testimonialSchema.methods.reject = function () {
  this.status = "rejected";
  return this.save();
};

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
