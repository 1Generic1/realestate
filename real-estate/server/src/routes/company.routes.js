const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth.middleware");
const companyController = require("../controllers/company.controller");

// ==================== PUBLIC ROUTES ====================
// @route   GET /api/company
// @access  Public
router.get("/company", companyController.getCompanyInfo);

// ==================== ADMIN ROUTES ====================
// All routes below this middleware are protected
router.use("/admin", adminAuth);

// @route   PUT /api/admin/company
// @access  Private
router.put("/admin/company", companyController.updateCompany);

// @route   PATCH /api/admin/company/reset
// @access  Private
router.patch("/admin/company/reset", companyController.resetCompany);

// @route   PATCH /api/admin/company/:section
// @access  Private
router.patch("/admin/company/:section", companyController.updateCompanySection);

// @route   PATCH /api/admin/company/:section/:field
// @access  Private
router.patch(
  "/admin/company/:section/:field",
  companyController.updateCompanyField,
);

module.exports = router;
