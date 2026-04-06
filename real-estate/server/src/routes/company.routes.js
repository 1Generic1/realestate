const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const { uploadSignature } = require("../config/cloudinary");
const companyController = require("../controllers/company.controller");

// ==================== PUBLIC ROUTES ====================
router.get("/company", companyController.getCompanyInfo);

// ==================== SPECIFIC ADMIN ROUTES (ORDER MATTERS!) ====================
router.patch(
  "/admin/company/signatory",
  adminAuth,
  companyController.updateSignatory,
);
router.post(
  "/admin/company/signature",
  adminAuth,
  uploadSignature.single("signature"),
  companyController.uploadSignature,
);
router.delete(
  "/admin/company/signature",
  adminAuth,
  companyController.deleteSignature,
);
router.get(
  "/admin/company/signature-info",
  adminAuth,
  companyController.getSignatureInfo,
);
router.post("/admin/company/reset", adminAuth, companyController.resetCompany);

// ==================== REFERENCE TEMPLATE ROUTES ====================
// All routes require admin authentication

// Get all templates
router.get(
  "/admin/company/reference-templates",
  adminAuth,
  companyController.getReferenceTemplates,
);

// Update predefined template (visa, employment, bank, general)
router.put(
  "/admin/company/reference-templates/:type",
  adminAuth,
  companyController.updateReferenceTemplate,
);

// Create custom template
router.post(
  "/admin/company/reference-templates/custom",
  adminAuth,
  companyController.createCustomTemplate,
);

// Get custom template by name
router.get(
  "/admin/company/reference-templates/custom/:name",
  adminAuth,
  companyController.getCustomTemplate,
);

// Delete custom template
router.delete(
  "/admin/company/reference-templates/custom/:name",
  adminAuth,
  companyController.deleteCustomTemplate,
);

// ==================== GENERIC ADMIN ROUTES (MUST COME LAST) ====================
router.patch(
  "/admin/company/:section",
  adminAuth,
  companyController.updateCompanySection,
);
router.patch(
  "/admin/company/:section/:field",
  adminAuth,
  companyController.updateCompanyField,
);
router.put("/admin/company", adminAuth, companyController.updateCompany);

module.exports = router;
