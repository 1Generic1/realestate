const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const {
  uploadPropertyImages,
  uploadThumbnail,
} = require("../config/cloudinary");
const propertyController = require("../controllers/propertyController");

// ==================== PUBLIC ROUTES (No Authentication) ====================

// Get all properties with filtering
router.get("/properties", propertyController.getProperties);

// Get featured properties (for homepage)
router.get("/properties/featured", propertyController.getFeaturedProperties);

// Get properties by type (buy/rent/land)
router.get("/properties/type/:type", propertyController.getPropertiesByType);

// Search properties with advanced filters
router.get("/properties/search", propertyController.searchProperties);

// Get single property by ID
router.get("/properties/:id", propertyController.getPropertyById);

// Get similar properties (recommendations)
router.get("/properties/:id/similar", propertyController.getSimilarProperties);

// ==================== ADMIN ROUTES (Protected) ====================

// ----- CREATE -----
// Create new property with multiple images
router.post(
  "/admin/properties",
  adminAuth,
  uploadPropertyImages.array("images", 10), // Max 10 images
  propertyController.createProperty,
);

// ----- READ (Admin versions - could include all statuses) -----
// Get all properties for admin (including sold/rented)
router.get(
  "/admin/properties",
  adminAuth,
  propertyController.getAllPropertiesAdmin,
);

// Get single property for admin
router.get(
  "/admin/properties/:id",
  adminAuth,
  propertyController.getPropertyByIdAdmin,
);

// ----- UPDATE (Text fields only) -----
// Update property details (without images)
router.put(
  "/admin/properties/:id",
  adminAuth,
  propertyController.updateProperty,
);

// ----- IMAGE MANAGEMENT -----
// Add more images to existing property
router.post(
  "/admin/properties/:id/images",
  adminAuth,
  uploadPropertyImages.array("images", 10), // Max 10 additional images
  propertyController.addImages,
);

// Delete a single image from property
router.delete(
  "/admin/properties/:propertyId/images/:imageIndex",
  adminAuth,
  propertyController.deleteImage,
);

// Update thumbnail (set which image is the thumbnail)
router.put(
  "/admin/properties/:propertyId/thumbnail/:imageIndex",
  adminAuth,
  propertyController.updateThumbnail,
);

// Reorder images (change image order)
router.put(
  "/admin/properties/:propertyId/images/reorder",
  adminAuth,
  propertyController.reorderImages,
);

// ----- STATUS MANAGEMENT -----
// Update property status (available/sold/rented/pending)
router.patch(
  "/admin/properties/:id/status",
  adminAuth,
  propertyController.updateStatus,
);

// Toggle featured status
router.patch(
  "/admin/properties/:id/featured",
  adminAuth,
  propertyController.toggleFeatured,
);

// ----- DELETE -----
// Delete entire property (with all images)
router.delete(
  "/admin/properties/:id",
  adminAuth,
  propertyController.deleteProperty,
);

// Bulk delete properties
router.post(
  "/admin/properties/bulk-delete",
  adminAuth,
  propertyController.bulkDeleteProperties,
);

// ==================== BULK OPERATIONS ====================

// Bulk update properties (e.g., change agent for multiple)
router.patch(
  "/admin/properties/bulk-update",
  adminAuth,
  propertyController.bulkUpdateProperties,
);

// Export/Import routes (for backup)
router.get(
  "/admin/properties/export/csv",
  adminAuth,
  propertyController.exportPropertiesCSV,
);

module.exports = router;
