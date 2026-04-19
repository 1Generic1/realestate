const User = require("../models/User.model");
const {
  deleteImage,
  deleteImageByPublicId,
  uploadBuffer,
} = require("../config/cloudinary");
const { AppError } = require("../middleware/errorMiddleware");
const crypto = require("crypto");
const { generateReferenceLetter } = require("../services/pdf.service");

// ==================== PUBLIC FUNCTIONS ====================

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, referralSource } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(
        "User with this email already exists",
        400,
        "DuplicateError",
      );
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      referralSource,
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    await user.save();

    // Generate verification token
    const verificationToken = await user.generateVerificationToken();

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, verificationToken, user.firstName);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse,
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/users/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError(
        "Invalid or expired verification token",
        400,
        "ValidationError",
      );
    }

    const verified = await user.verifyEmail(token);

    if (!verified) {
      throw new AppError("Failed to verify email", 400, "ValidationError");
    }

    res.json({
      success: true,
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.isActive) {
      throw new AppError(
        "Account is deactivated. Please contact support.",
        401,
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: {
        token,
        user: userResponse,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      // For security, still return success
      return res.json({
        success: true,
        message: "If your email is registered, you will receive a reset link",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: Send reset email
    // await sendPasswordResetEmail(user.email, resetToken, user.firstName);

    res.json({
      success: true,
      message: "If your email is registered, you will receive a reset link",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      throw new AppError("Password is required", 400);
    }

    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// ==================== USER FUNCTIONS (Authenticated) ====================

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, bio, location } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (location) user.location = { ...user.location, ...location };

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   POST /api/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    if (newPassword.length < 8) {
      throw new AppError("New password must be at least 8 characters", 400);
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update avatar
// @route   POST /api/users/me/avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("No image file provided", 400);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Delete old avatar if exists
    if (user.avatarPublicId) {
      await deleteImageByPublicId(user.avatarPublicId).catch(console.error);
    }

    user.avatar = req.file.path;
    user.avatarPublicId = req.file.filename;
    await user.save();

    res.json({
      success: true,
      data: { avatar: user.avatar, avatarPublicId: user.avatarPublicId },
      message: "Avatar updated successfully",
    });
  } catch (error) {
    if (req.file) {
      await deleteImage(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// @desc    Delete avatar
// @route   DELETE /api/users/me/avatar
// @access  Private
exports.deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.avatarPublicId) {
      await deleteImageByPublicId(user.avatarPublicId).catch(console.error);
    }

    user.avatar = "";
    user.avatarPublicId = "";
    await user.save();

    res.json({
      success: true,
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorites
// @route   POST /api/users/favorites/:propertyId
// @access  Private
exports.addToFavorites = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await user.addToFavorites(propertyId);

    res.json({
      success: true,
      message: "Property added to favorites",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from favorites
// @route   DELETE /api/users/favorites/:propertyId
// @access  Private
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await user.removeFromFavorites(propertyId);

    res.json({
      success: true,
      message: "Property removed from favorites",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorites
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "favorites.propertyId",
      "title type price location thumbnail slug",
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const favorites = user.favorites.map((fav) => ({
      ...fav.propertyId._doc,
      addedAt: fav.addedAt,
    }));

    res.json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a search
// @route   POST /api/users/saved-searches
// @access  Private
exports.saveSearch = async (req, res, next) => {
  try {
    const { name, filters } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!name || !filters) {
      throw new AppError("Search name and filters are required", 400);
    }

    await user.saveSearch(name, filters);

    res.json({
      success: true,
      message: "Search saved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved searches
// @route   GET /api/users/saved-searches
// @access  Private
exports.getSavedSearches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: user.savedSearches,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete saved search
// @route   DELETE /api/users/saved-searches/:searchId
// @access  Private
exports.deleteSavedSearch = async (req, res, next) => {
  try {
    const { searchId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.savedSearches = user.savedSearches.filter(
      (search) => search._id.toString() !== searchId,
    );
    await user.save();

    res.json({
      success: true,
      message: "Search deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate account
// @route   DELETE /api/users/me
// @access  Private
exports.deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserReferenceLetters = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Sort by generatedAt descending (newest first)
    const referenceLetters = user.referenceLetters.sort(
      (a, b) => new Date(b.generatedAt) - new Date(a.generatedAt),
    );

    res.json({
      success: true,
      data: referenceLetters,
      count: referenceLetters.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download reference letter (for users)
// @route   GET /api/users/reference-letters/:letterId/download
// @access  Private
exports.downloadReferenceLetter = async (req, res, next) => {
  try {
    const { letterId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    const letter = user.referenceLetters.find((l) => l.letterId === letterId);
    if (!letter) {
      throw new AppError("Reference letter not found", 404, "NotFoundError");
    }

    // Track download
    await user.trackLetterDownload(letterId);

    res.json({
      success: true,
      data: {
        pdfUrl: letter.pdfUrl,
        letterId: letter.letterId,
        generatedAt: letter.generatedAt,
        downloadedCount: letter.downloadedCount + 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download reference letter via server proxy (bypasses Cloudinary auth) - USER VERSION
// @route   GET /api/users/reference-letters/:letterId/download-proxy
// @access  Private
exports.downloadReferenceLetterProxy = async (req, res, next) => {
  try {
    const { letterId } = req.params;
    const decodedLetterId = decodeURIComponent(letterId);

    console.log("📥 User proxy download request:", {
      userId: req.user.id,
      letterId: decodedLetterId,
    });

    // Find the user (from auth middleware)
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Find the reference letter
    let letter = user.referenceLetters.find(
      (l) => l.letterId === decodedLetterId,
    );
    if (!letter) {
      letter = user.referenceLetters.find((l) => l.letterId === letterId);
    }

    if (!letter) {
      console.log(
        "Available letters:",
        user.referenceLetters.map((l) => l.letterId),
      );
      throw new AppError("Reference letter not found", 404);
    }

    console.log("📄 Found letter:", {
      letterId: letter.letterId,
      pdfUrl: letter.pdfUrl,
    });

    // Track download
    if (letter.downloadedCount !== undefined) {
      letter.downloadedCount += 1;
      letter.lastDownloadedAt = new Date();
      await user.save();
    }

    // Fetch PDF from Cloudinary with proper headers
    const cloudinaryUrl = letter.pdfUrl;
    console.log("🌐 Fetching from Cloudinary:", cloudinaryUrl);

    // Add a download flag to the URL
    let fetchUrl = cloudinaryUrl;
    if (fetchUrl.includes("/image/upload/")) {
      fetchUrl = fetchUrl.replace(
        "/image/upload/",
        "/image/upload/fl_attachment/",
      );
    }

    console.log("📡 Fetch URL:", fetchUrl);

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/pdf, image/*",
      },
    });

    if (!response.ok) {
      console.error(
        "❌ Cloudinary fetch failed:",
        response.status,
        response.statusText,
      );

      // Try without the fl_attachment flag
      console.log("🔄 Retrying without attachment flag...");
      const retryResponse = await fetch(cloudinaryUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/pdf, */*",
        },
      });

      if (!retryResponse.ok) {
        throw new AppError(
          `Failed to fetch PDF from storage: ${retryResponse.status}`,
          500,
        );
      }

      const retryBuffer = await retryResponse.arrayBuffer();
      const pdfBuffer = Buffer.from(retryBuffer);

      // Send the PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="reference-letter-${letter.letterId.replace(/\//g, "-")}.pdf"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);
      return res.send(pdfBuffer);
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    console.log(`✅ PDF fetched successfully: ${pdfBuffer.length} bytes`);

    // Send the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="reference-letter-${letter.letterId.replace(/\//g, "-")}.pdf"`,
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache");

    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ User proxy download error:", error);
    next(error);
  }
};
