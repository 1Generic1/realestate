const express = require("express");
const router = express.Router();
const { adminAuth } = require("../../middleware/auth.middleware"); // For user auth
const adminUserController = require("../../controllers/admin/adminuser.controller");

router.post(
  "/admin/users/:userId/reference-letter",
  adminAuth,
  adminUserController.sendReferenceLetter,
);

router.get(
  "/admin/users/:userId/reference-letter/preview",
  adminAuth,
  adminUserController.previewReferenceLetter,
);

router.get(
  "/admin/users/:userId/reference-letters",
  adminAuth,
  adminUserController.getUserReferenceLetters,
);

router.post(
  "/admin/users/:userId/reference-letters/:letterId/resend",
  adminAuth,
  adminUserController.resendReferenceLetter,
);

// @desc    Download reference letter for a user (admin)
// @route   GET /api/admin/users/:userId/reference-letters/:letterId/download
// @access  Private/Admin
router.get(
  "/admin/users/:userId/reference-letters/:letterId/download",
  adminAuth,
  adminUserController.downloadUserReferenceLetter,
);

// PROXY DOWNLOAD - Use this one (add this NEW route)
router.get(
  "/admin/users/:userId/reference-letters/:letterId/download-proxy",
  adminAuth,
  adminUserController.downloadReferenceLetterProxy,
);

module.exports = router;
