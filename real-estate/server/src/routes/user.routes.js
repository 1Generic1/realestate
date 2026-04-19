const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware"); // For user auth
const { uploadAvatar } = require("../config/cloudinary"); // You'll need to add avatar storage
const userController = require("../controllers/user.controller");

// ==================== PUBLIC ROUTES ====================

// @route   POST /api/users/register
// @desc    Register new user
// @access  Public
router.post("/register", userController.register);

// @route   GET /api/users/verify-email/:token
// @desc    Verify email
// @access  Public
router.get("/verify-email/:token", userController.verifyEmail);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post("/login", userController.login);

// @route   POST /api/users/forgot-password
// @desc    Forgot password
// @access  Public
router.post("/forgot-password", userController.forgotPassword);

// @route   POST /api/users/reset-password/:token
// @desc    Reset password
// @access  Public
router.post("/reset-password/:token", userController.resetPassword);

// ==================== AUTHENTICATED USER ROUTES ====================
// All routes below require user authentication

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authMiddleware, userController.getCurrentUser);

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put("/me", authMiddleware, userController.updateProfile);

// @route   POST /api/users/change-password
// @desc    Change password
// @access  Private
router.post("/change-password", authMiddleware, userController.changePassword);

// @route   POST /api/users/me/avatar
// @desc    Update avatar
// @access  Private
router.post(
  "/me/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  userController.updateAvatar,
);

// @route   DELETE /api/users/me/avatar
// @desc    Delete avatar
// @access  Private
router.delete("/me/avatar", authMiddleware, userController.deleteAvatar);

// @route   DELETE /api/users/me
// @desc    Deactivate account
// @access  Private
router.delete("/me", authMiddleware, userController.deactivateAccount);

// ==================== FAVORITES ROUTES ====================

// @route   POST /api/users/favorites/:propertyId
// @desc    Add property to favorites
// @access  Private
router.post(
  "/favorites/:propertyId",
  authMiddleware,
  userController.addToFavorites,
);

// @route   DELETE /api/users/favorites/:propertyId
// @desc    Remove property from favorites
// @access  Private
router.delete(
  "/favorites/:propertyId",
  authMiddleware,
  userController.removeFromFavorites,
);

// @route   GET /api/users/favorites
// @desc    Get user's favorites
// @access  Private
router.get("/favorites", authMiddleware, userController.getFavorites);

// ==================== SAVED SEARCHES ROUTES ====================

// @route   POST /api/users/saved-searches
// @desc    Save a search
// @access  Private
router.post("/saved-searches", authMiddleware, userController.saveSearch);

// @route   GET /api/users/saved-searches
// @desc    Get saved searches
// @access  Private
router.get("/saved-searches", authMiddleware, userController.getSavedSearches);

// @route   DELETE /api/users/saved-searches/:searchId
// @desc    Delete saved search
// @access  Private
router.delete(
  "/saved-searches/:searchId",
  authMiddleware,
  userController.deleteSavedSearch,
);

// Get all reference letters for the logged-in user
router.get(
  "/reference-letters",
  authMiddleware,
  userController.getUserReferenceLetters,
);

router.get(
  "/reference-letters/:letterId/download-proxy",
  authMiddleware,
  userController.downloadReferenceLetterProxy,
);

// User routes (for clients to download their own letters)
router.get(
  "/reference-letters/:letterId/download",
  authMiddleware,
  userController.downloadReferenceLetter,
);

module.exports = router;
