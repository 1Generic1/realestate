const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const newsletterController = require("../controllers/newsletter.controller");

// ==================== PUBLIC ROUTES ====================
// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post("/newsletter/subscribe", newsletterController.subscribe);

// @route   GET /api/newsletter/verify/:token
// @desc    Verify email subscription
// @access  Public
router.get(
  "/newsletter/verify/:token",
  newsletterController.verifySubscription,
);

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post("/newsletter/unsubscribe", newsletterController.unsubscribe);

// ==================== ADMIN ROUTES ====================
// All routes below require authentication
router.use(adminAuth);

// @route   GET /api/admin/newsletter
// @desc    Get all subscribers
// @access  Private
router.get("/admin/newsletter", newsletterController.getAllSubscribers);

// @route   GET /api/admin/newsletter/stats
// @desc    Get newsletter statistics
// @access  Private
router.get("/admin/newsletter/stats", newsletterController.getNewsletterStats);

// @route   GET /api/admin/newsletter/search
// @desc    Search subscribers
// @access  Private
router.get("/admin/newsletter/search", newsletterController.searchSubscribers);

// @route   GET /api/admin/newsletter/export/csv
// @desc    Export subscribers to CSV
// @access  Private
router.get(
  "/admin/newsletter/export/csv",
  newsletterController.exportSubscribersCSV,
);

// @route   GET /api/admin/newsletter/land-investors
// @desc    Get land investors (Land Page specific)
// @access  Private
router.get(
  "/admin/newsletter/land-investors",
  newsletterController.getLandInvestors,
);

// @route   GET /api/admin/newsletter/property-buyers
// @desc    Get property buyers (Buy Page specific)
// @access  Private
router.get(
  "/admin/newsletter/property-buyers",
  newsletterController.getPropertyBuyers,
);

// @route   GET /api/admin/newsletter/preference/:preference
// @desc    Get subscribers by specific preference
// @access  Private
router.get(
  "/admin/newsletter/preference/:preference",
  newsletterController.getSubscribersByPreference,
);

// @route   GET /api/admin/newsletter/:id
// @desc    Get subscriber by ID
// @access  Private
router.get("/admin/newsletter/:id", newsletterController.getSubscriberById);

// @route   PUT /api/admin/newsletter/:id
// @desc    Update subscriber
// @access  Private
router.put("/admin/newsletter/:id", newsletterController.updateSubscriber);

// @route   DELETE /api/admin/newsletter/:id
// @desc    Delete subscriber
// @access  Private
router.delete("/admin/newsletter/:id", newsletterController.deleteSubscriber);

// @route   POST /api/admin/newsletter/bulk-unsubscribe
// @desc    Bulk unsubscribe subscribers
// @access  Private
router.post(
  "/admin/newsletter/bulk-unsubscribe",
  newsletterController.bulkUnsubscribe,
);

// @route   POST /api/admin/newsletter/send-test
// @desc    Send test email to subscribers (placeholder)
// @access  Private
router.post("/admin/newsletter/send-test", newsletterController.sendTestEmail);

module.exports = router;
