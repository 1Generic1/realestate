const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // ===== BASIC INFORMATION =====
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ===== PROPERTY TYPE =====
    type: {
      type: String,
      enum: ["buy", "rent", "land"],
      required: [true, "Property type is required"],
    },
    category: {
      type: String,
      enum: [
        "house",
        "apartment",
        "flat",
        "duplex",
        "commercial",
        "land",
        "penthouse",
      ],
      required: [true, "Property category is required"],
    },

    // ===== PRICING =====
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    priceLabel: {
      type: String, // Formatted price for display (e.g., "₦85M")
    },
    pricePeriod: {
      type: String,
      enum: ["total", "year", "month"],
      default: "total",
    },
    pricePerSqm: Number, // Useful for land and comparisons

    // ===== LOCATION =====
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: "Nigeria" },
      coordinates: {
        lat: Number,
        lng: Number,
      },
      mapEmbedUrl: String,
      mapLink: String,
    },

    // ===== PROPERTY DETAILS =====
    size: String, // e.g., "450 sqm", "5 acres"
    sizeSqm: Number, // Numeric value for calculations
    bedrooms: {
      type: Number,
      min: 0,
    },
    bathrooms: {
      type: Number,
      min: 0,
    },
    yearBuilt: Number,

    // ===== LAND-SPECIFIC FIELDS =====
    landUse: String, // Residential, Commercial, Agricultural, Mixed-Use
    zoning: String,
    dimensions: String, // "40m x 30m"
    frontage: Number, // in meters
    depth: Number, // in meters
    terrain: String, // Flat, Sloping, Hilly
    soilType: String, // For agricultural land

    // ===== FEATURES & AMENITIES =====
    features: [String], // General features
    utilities: [String], // Electricity, Water, Sewage, Internet
    nearbyAmenities: [String], // Schools, hospitals, banks etc.

    // ===== DOCUMENTS =====
    documents: [String], // "Certificate of Occupancy", "Survey Plan", etc.

    // ===== DESCRIPTION =====
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },

    // ===== DEVELOPMENT POTENTIAL =====
    developmentPotential: {
      residential: Boolean,
      commercial: Boolean,
      mixedUse: Boolean,
      maxFloors: Number,
      plotRatio: Number,
    },

    // ===== MEDIA =====
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            // Custom validator to limit number of images
            return this.images.length <= 10; // Max 10 images
          },
          message: "Maximum 10 images allowed per property",
        },
      },
    ],

    // Track image public_ids for easier deletion from Cloudinary
    imagePublicIds: [
      {
        type: String,
        description: "Cloudinary public IDs for images",
      },
    ],

    thumbnail: {
      type: String,
      required: [true, "Thumbnail image is required"],
    },

    thumbnailPublicId: {
      type: String,
      description: "Cloudinary public ID for thumbnail",
    },

    videoUrl: String,
    virtualTourUrl: String,

    // ===== STATUS =====
    status: {
      type: String,
      enum: ["available", "sold", "rented", "pending"],
      default: "available",
    },
    featured: {
      type: Boolean,
      default: false,
    },

    // ===== AGENT =====
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
    agentName: String, // Fallback if no agent assigned

    // ===== METRICS =====
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },

    // ===== RESTRICTIONS =====
    restrictions: [String],

    // ===== SEO FIELDS =====
    seoTitle: {
      type: String,
      trim: true,
      maxlength: [60, "SEO title should not exceed 60 characters"],
      description: "Meta title for search engines (50-60 chars recommended)",
    },

    seoDescription: {
      type: String,
      trim: true,
      maxlength: [160, "SEO description should not exceed 160 characters"],
      description:
        "Meta description for search results (150-160 chars recommended)",
    },

    seoKeywords: [
      {
        type: String,
        trim: true,
        lowercase: true,
        description: "Array of keywords for search engine optimization",
      },
    ],

    seoSlug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      description: "URL-friendly version of the title",
    },

    seoCanonicalUrl: {
      type: String,
      trim: true,
      description: "Canonical URL to prevent duplicate content issues",
    },

    seoNoIndex: {
      type: Boolean,
      default: false,
      description: "Flag to tell search engines NOT to index this property",
    },

    seoImageAlt: {
      type: String,
      trim: true,
      maxlength: [125, "Image alt text should be descriptive but concise"],
      description: "Alt text for main property image",
    },

    seoSchema: {
      type: mongoose.Schema.Types.Mixed,
      description: "Custom JSON-LD schema markup for this property",
    },

    seoLastReviewed: {
      type: Date,
      default: Date.now,
      description: "When SEO was last reviewed/updated",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
);

// ===== PRE-SAVE HOOKS =====
propertySchema.pre("save", async function () {
  // Generate slug from title
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Generate SEO slug if not provided
  if (!this.seoSlug && this.title) {
    this.seoSlug = this.title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
  }

  // Create price label if not provided
  if (!this.priceLabel && this.price) {
    const priceInMillions = this.price / 1000000;
    this.priceLabel = `₦${priceInMillions.toFixed(1)}M`;
  }

  // Calculate price per sqm for land
  if (this.type === "land" && this.price && this.sizeSqm) {
    this.pricePerSqm = Math.round(this.price / this.sizeSqm);
  }

  // Auto-generate image alt text if not provided
  if (!this.seoImageAlt && this.title && this.location) {
    this.seoImageAlt = `${this.title} in ${this.location} - TAYE'S PROPERTY`;
  }

  // Update last reviewed date when SEO fields change
  if (
    this.isModified("seoTitle") ||
    this.isModified("seoDescription") ||
    this.isModified("seoKeywords")
  ) {
    this.seoLastReviewed = Date.now();
  }

  // Ensure thumbnail matches one of the images
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0];
  }

  // Set thumbnailPublicId if thumbnail exists and images are present
  if (this.thumbnail && this.images && this.imagePublicIds) {
    const thumbnailIndex = this.images.indexOf(this.thumbnail);
    if (thumbnailIndex !== -1 && this.imagePublicIds[thumbnailIndex]) {
      this.thumbnailPublicId = this.imagePublicIds[thumbnailIndex];
    }
  }
});

// ===== INDEXES =====
// Search indexes
propertySchema.index({ title: "text", description: "text", location: "text" });
propertySchema.index({
  seoTitle: "text",
  seoDescription: "text",
  seoKeywords: "text",
});

// Filter indexes
propertySchema.index({ type: 1, status: 1, featured: 1 });
propertySchema.index({ price: 1, bedrooms: 1, location: 1 });
propertySchema.index({ seoNoIndex: 1 });
propertySchema.index({ seoLastReviewed: -1 });

// ===== VIRTUALS =====
// Full SEO title with brand
propertySchema.virtual("fullSeoTitle").get(function () {
  if (this.seoTitle) {
    return `${this.seoTitle} | TAYE'S PROPERTY & REALTY SOLUTIONS`;
  }
  return `${this.title} | TAYE'S PROPERTY & REALTY SOLUTIONS`;
});

// Formatted address
propertySchema.virtual("fullAddress").get(function () {
  const parts = [];
  if (this.address?.street) parts.push(this.address.street);
  if (this.address?.city) parts.push(this.address.city);
  if (this.address?.state) parts.push(this.address.state);
  if (this.address?.country) parts.push(this.address.country);
  return parts.join(", ");
});

// Get all image URLs with their public IDs
propertySchema.virtual("imagesWithIds").get(function () {
  return this.images.map((url, index) => ({
    url,
    publicId: this.imagePublicIds?.[index] || null,
    isThumbnail: url === this.thumbnail,
  }));
});

// ===== METHODS =====
// Check if SEO needs review
propertySchema.methods.needsSEOReview = function () {
  const daysSinceReview =
    (Date.now() - this.seoLastReviewed) / (1000 * 60 * 60 * 24);
  return daysSinceReview > 90; // Review every 90 days
};

// Increment view count
propertySchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Add images with their public IDs
propertySchema.methods.addImages = function (newImages, newPublicIds) {
  if (this.images.length + newImages.length > 10) {
    throw new Error("Maximum 10 images allowed per property");
  }
  this.images.push(...newImages);
  this.imagePublicIds.push(...newPublicIds);
  return this.save();
};

// Remove image by index
propertySchema.methods.removeImage = function (index) {
  if (index < 0 || index >= this.images.length) {
    throw new Error("Invalid image index");
  }

  const removedImage = this.images[index];
  const removedPublicId = this.imagePublicIds?.[index];

  this.images.splice(index, 1);
  if (this.imagePublicIds) {
    this.imagePublicIds.splice(index, 1);
  }

  // If removed image was thumbnail, set new thumbnail
  if (removedImage === this.thumbnail && this.images.length > 0) {
    this.thumbnail = this.images[0];
    this.thumbnailPublicId = this.imagePublicIds?.[0];
  }

  return { removedImage, removedPublicId };
};

// Set new thumbnail
propertySchema.methods.setThumbnail = function (imageUrl) {
  const index = this.images.indexOf(imageUrl);
  if (index === -1) {
    throw new Error("Image not found in property images");
  }
  this.thumbnail = imageUrl;
  this.thumbnailPublicId = this.imagePublicIds?.[index];
  return this.save();
};

// ===== STATICS =====
// Find properties needing SEO attention
propertySchema.statics.findNeedingSEOReview = function () {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return this.find({
    $or: [
      { seoLastReviewed: { $lt: ninetyDaysAgo } },
      { seoTitle: { $exists: false } },
      { seoDescription: { $exists: false } },
      { seoKeywords: { $size: 0 } },
    ],
  });
};

// Find featured properties
propertySchema.statics.findFeatured = function (limit = 6) {
  return this.find({ featured: true, status: "available" })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Find properties by type with filters
propertySchema.statics.findByType = function (
  type,
  filters = {},
  limit = 10,
  page = 1,
) {
  const query = { type, status: "available", ...filters };
  return this.find(query)
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
