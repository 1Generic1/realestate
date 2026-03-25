const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const { uploadTestimonialImage } = require("../config/cloudinary");
const testimonialController = require("../controllers/testimonial.controller");

// ==================== PUBLIC ROUTES ====================
// @route   GET /api/testimonials
// @access  Public
router.get("/testimonials", testimonialController.getTestimonials);

// @route   GET /api/testimonials/featured
// @access  Public
router.get(
  "/testimonials/featured",
  testimonialController.getFeaturedTestimonials,
);

// @route   GET /api/testimonials/:id
// @access  Public
router.get("/testimonials/:id", testimonialController.getTestimonialById);

// ==================== ADMIN ROUTES ====================
// All admin routes are protected

// @route   GET /api/admin/testimonials
// @access  Private
router.get(
  "/admin/testimonials",
  adminAuth,
  testimonialController.getAllTestimonialsAdmin,
);

// @route   POST /api/admin/testimonials (with optional image)
// @access  Private
router.post(
  "/admin/testimonials",
  adminAuth,
  uploadTestimonialImage.single("image"),
  testimonialController.createTestimonial,
);

// @route   PUT /api/admin/testimonials/:id (text fields only)
// @access  Private
router.put(
  "/admin/testimonials/:id",
  adminAuth,
  testimonialController.updateTestimonial,
);

// @route   POST /api/admin/testimonials/:id/image (upload/replace image)
// @access  Private
router.post(
  "/admin/testimonials/:id/image",
  adminAuth,
  uploadTestimonialImage.single("image"),
  testimonialController.uploadTestimonialImage,
);

// @route   DELETE /api/admin/testimonials/:id/image (delete image only)
// @access  Private
router.delete(
  "/admin/testimonials/:id/image",
  adminAuth,
  testimonialController.deleteTestimonialImage,
);

// @route   DELETE /api/admin/testimonials/:id (delete testimonial + image)
// @access  Private
router.delete(
  "/admin/testimonials/:id",
  adminAuth,
  testimonialController.deleteTestimonial,
);

// @route   PATCH /api/admin/testimonials/:id/approve
// @access  Private
router.patch(
  "/admin/testimonials/:id/approve",
  adminAuth,
  testimonialController.approveTestimonial,
);

// @route   PATCH /api/admin/testimonials/:id/reject
// @access  Private
router.patch(
  "/admin/testimonials/:id/reject",
  adminAuth,
  testimonialController.rejectTestimonial,
);

// @route   PATCH /api/admin/testimonials/:id/featured
// @access  Private
router.patch(
  "/admin/testimonials/:id/featured",
  adminAuth,
  testimonialController.toggleFeatured,
);

module.exports = router;
