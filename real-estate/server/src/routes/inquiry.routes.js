const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const inquiryController = require("../controllers/inquiry.controller");

// ==================== PUBLIC ROUTES ====================
// @route   POST /api/inquiries
// @desc    Submit a new inquiry (contact form, rent form, land form)
// @access  Public
router.post("/inquiries", inquiryController.submitInquiry);

// ==================== ADMIN ROUTES ====================
// All routes below require authentication
router.use(adminAuth);

// @route   GET /api/admin/inquiries
// @desc    Get all inquiries (with filters)
// @access  Private
router.get("/admin/inquiries", inquiryController.getAllInquiries);

// @route   GET /api/admin/inquiries/stats
// @desc    Get inquiry statistics for dashboard
// @access  Private
router.get("/admin/inquiries/stats", inquiryController.getInquiryStats);

// @route   GET /api/admin/inquiries/search
// @desc    Search inquiries by text
// @access  Private
router.get("/admin/inquiries/search", inquiryController.searchInquiries);

// @route   GET /api/admin/inquiries/date-range
// @desc    Get inquiries by date range
// @access  Private
router.get(
  "/admin/inquiries/date-range",
  inquiryController.getInquiriesByDateRange,
);

// @route   GET /api/admin/inquiries/export/csv
// @desc    Export inquiries as CSV
// @access  Private
router.get("/admin/inquiries/export/csv", inquiryController.exportInquiriesCSV);

// @route   GET /api/admin/inquiries/:id
// @desc    Get single inquiry by ID
// @access  Private
router.get("/admin/inquiries/:id", inquiryController.getInquiryById);

// @route   PATCH /api/admin/inquiries/:id/status
// @desc    Update inquiry status
// @access  Private
router.patch(
  "/admin/inquiries/:id/status",
  inquiryController.updateInquiryStatus,
);

// @route   POST /api/admin/inquiries/:id/reply
// @desc    Mark inquiry as replied
// @access  Private
router.post("/admin/inquiries/:id/reply", inquiryController.replyToInquiry);

// @route   POST /api/admin/inquiries/:id/note
// @desc    Add admin note
// @access  Private
router.post("/admin/inquiries/:id/note", inquiryController.addAdminNote);

// @route   DELETE /api/admin/inquiries/:id/archive
// @desc    Archive inquiry
// @access  Private
router.delete("/admin/inquiries/:id/archive", inquiryController.archiveInquiry);

// @route   DELETE /api/admin/inquiries/:id
// @desc    Permanently delete inquiry
// @access  Private
router.delete("/admin/inquiries/:id", inquiryController.deleteInquiry);

// @route   POST /api/admin/inquiries/bulk-delete
// @desc    Bulk delete inquiries
// @access  Private
router.post(
  "/admin/inquiries/bulk-delete",
  inquiryController.bulkDeleteInquiries,
);

module.exports = router;
