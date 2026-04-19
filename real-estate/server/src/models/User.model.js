const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const validatePhone = (phone) => {
  // Remove all spaces, dashes, dots, and parentheses
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, "");

  // Nigerian phone number patterns:
  // Option 1: +234XXXXXXXXXX (14 characters)
  // Option 2: 0XXXXXXXXXXX (11 characters)
  return /^(\+234|0)[789][01]\d{8}$/.test(cleaned);
};

const userSchema = new mongoose.Schema(
  {
    // ===== BASIC INFORMATION =====
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

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

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: validatePhone,
        message: (props) =>
          `${props.value} is not a valid phone number! Use format:  +2348012345678 or 08012345678`,
      },
    },

    // ===== AUTHENTICATION =====
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,

    // ===== PROFILE INFORMATION =====
    avatar: {
      type: String,
      default: "",
    },

    avatarPublicId: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    // ===== LOCATION =====
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, default: "Nigeria" },
    },

    // ===== FAVORITES & SAVED =====
    favorites: [
      {
        propertyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Property",
        },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    savedSearches: [
      {
        name: { type: String, trim: true },
        filters: {
          type: mongoose.Schema.Types.Mixed,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ===== ACTIVITY TRACKING =====
    inquiries: [
      {
        inquiryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Inquiry",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // ===== ACCOUNT STATUS =====
    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationExpires: Date,

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },

    // ===== METADATA =====
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    referralSource: {
      type: String,
      default: "direct",
    },

    // ===== REFERENCE LETTERS =====
    referenceLetters: [
      {
        letterId: {
          type: String, // Make it not required
        },
        letterType: {
          type: String,
          enum: ["visa", "employment", "bank", "general", "custom"],
          default: "general",
        },
        purpose: {
          type: String,
          trim: true,
        },
        notes: {
          type: String,
          trim: true,
        },
        pdfUrl: {
          type: String,
          required: true,
        },
        generatedAt: {
          type: Date,
          default: Date.now,
        },
        sentViaEmail: {
          type: Boolean,
          default: false,
        },
        emailSentAt: {
          type: Date,
        },
        downloadedCount: {
          type: Number,
          default: 0,
        },
        lastDownloadedAt: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// ===== INDEXES =====
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ isActive: 1 });
userSchema.index({ "location.city": 1 });
userSchema.index({ createdAt: -1 });

// ===== PRE-SAVE HOOKS =====
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
});

// ===== VIRTUALS =====
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ===== METHODS =====

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add to favorites
userSchema.methods.addToFavorites = async function (propertyId) {
  const alreadyFavorited = this.favorites.some(
    (fav) => fav.propertyId.toString() === propertyId.toString(),
  );

  if (!alreadyFavorited) {
    this.favorites.push({ propertyId });
    await this.save();
  }
  return this;
};

// Remove from favorites
userSchema.methods.removeFromFavorites = async function (propertyId) {
  this.favorites = this.favorites.filter(
    (fav) => fav.propertyId.toString() !== propertyId.toString(),
  );
  await this.save();
  return this;
};

// Check if property is favorited
userSchema.methods.isFavorited = function (propertyId) {
  return this.favorites.some(
    (fav) => fav.propertyId.toString() === propertyId.toString(),
  );
};

// Save a search
userSchema.methods.saveSearch = async function (name, filters) {
  this.savedSearches.push({ name, filters });
  if (this.savedSearches.length > 20) {
    this.savedSearches = this.savedSearches.slice(-20);
  }
  await this.save();
  return this;
};

// Update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
  return this;
};

// Generate verification token
userSchema.methods.generateVerificationToken = async function () {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");
  this.verificationToken = token;
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  await this.save();
  return token;
};

// Verify email
userSchema.methods.verifyEmail = async function (token) {
  if (
    this.verificationToken !== token ||
    this.verificationExpires < Date.now()
  ) {
    return false;
  }
  this.emailVerified = true;
  this.verificationToken = undefined;
  this.verificationExpires = undefined;
  await this.save();
  return true;
};

// ===== STATICS =====

// Get user statistics
userSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$isActive",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);
  return stats;
};

// Get recent users
userSchema.statics.getRecent = async function (limit = 10) {
  return await this.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select("-password");
};

// Search users
userSchema.statics.search = async function (searchTerm) {
  return await this.find({
    $or: [
      { firstName: { $regex: searchTerm, $options: "i" } },
      { lastName: { $regex: searchTerm, $options: "i" } },
      { email: { $regex: searchTerm, $options: "i" } },
      { phone: { $regex: searchTerm, $options: "i" } },
    ],
    isActive: true,
  }).select("-password");
};

// Find inactive users older than 6 months
userSchema.statics.findInactive = async function () {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return await this.find({
    lastLogin: { $lt: sixMonthsAgo },
    isActive: true,
  });
};

//  method to track downloads
userSchema.methods.trackLetterDownload = async function (letterId) {
  const letter = this.referenceLetters.find((l) => l.letterId === letterId);
  if (letter) {
    letter.downloadedCount += 1;
    letter.lastDownloadedAt = new Date();
    await this.save();
  }
  return this;
};

//  method to get all reference letters
userSchema.methods.getReferenceLetters = function () {
  return this.referenceLetters.sort((a, b) => b.generatedAt - a.generatedAt);
};

//  method to get letter by ID
userSchema.methods.getReferenceLetterById = function (letterId) {
  return this.referenceLetters.find((l) => l.letterId === letterId);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
