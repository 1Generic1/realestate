const Company = require("../models/Company.model");
const { AppError } = require("../middleware/errorMiddleware");

// @desc    Get company informations
// @route   GET /api/company
// @access  Public
exports.getCompanyInfo = async (req, res, next) => {
  try {
    // Get the first (and only) company document
    let company = await Company.findOne();

    // If no company exists yet, create default one
    if (!company) {
      company = await Company.create({});
    }

    res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update specific company section (admin)
// @route   PATCH /api/admin/company/:section
// @access  Private
exports.updateCompanySection = async (req, res, next) => {
  try {
    const { section } = req.params;

    // Allowed sections based on your model
    const allowedSections = [
      "phone", // phone object with primary, secondary, whatsapp
      "email", // email object with general, support, sales, rentals
      "address", // address object with street, city, state, country, postalCode, mapLink
      "hours", // hours object with monday-sunday, notes
      "social", // social object with facebook, twitter, instagram, linkedin
    ];

    // Validate section
    if (!allowedSections.includes(section)) {
      throw new AppError(
        `Invalid section. Allowed sections: ${allowedSections.join(", ")}`,
        400,
        "ValidationError",
      );
    }

    // Validate that the request body is an object (not array or primitive)
    if (typeof req.body !== "object" || Array.isArray(req.body)) {
      throw new AppError(
        `Request body must be an object matching the ${section} structure`,
        400,
        "ValidationError",
      );
    }

    // Update only the specified section
    const updateData = {
      [section]: req.body, // This will replace the entire section object
    };

    const company = await Company.findOneAndUpdate(
      {}, // empty filter to update the single document
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Validate against schema
        upsert: true, // Create if doesn't exist
      },
    );

    res.json({
      success: true,
      data: company,
      message: `${section} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update specific field within a section (admin)
// @route   PATCH /api/admin/company/:section/:field
// @access  Private
exports.updateCompanyField = async (req, res, next) => {
  try {
    const { section, field } = req.params;
    const { value } = req.body;

    // Allowed sections
    const allowedSections = ["phone", "email", "address", "hours", "social"];

    if (!allowedSections.includes(section)) {
      throw new AppError("Invalid section", 400, "ValidationError");
    }

    // Build the update path (e.g., "phone.primary")
    const updatePath = `${section}.${field}`;

    const company = await Company.findOneAndUpdate(
      {},
      { $set: { [updatePath]: value } },
      { new: true, runValidators: true },
    );

    res.json({
      success: true,
      data: company,
      message: `${section} ${field} updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update entire company (admin)
// @route   PUT /api/admin/company
// @access  Private
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });

    res.json({
      success: true,
      data: company,
      message: "Company updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset company to defaults (admin)
// @route   POST /api/admin/company/reset
// @access  Private
exports.resetCompany = async (req, res, next) => {
  try {
    // Delete existing company
    await Company.deleteMany({});

    // Create new company with schema defaults
    const defaultCompany = new Company({});
    await defaultCompany.save();

    res.json({
      success: true,
      data: defaultCompany,
      message: "Company reset to defaults successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload company signature
// @route   POST /api/admin/company/signature
// @access  Private/Admin
exports.uploadSignature = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError("No signature image provided", 400, "ValidationError");
    }

    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company not found", 404, "NotFoundError");
    }

    // Delete old signature if exists
    if (company.signaturePublicId) {
      const { deleteImageByPublicId } = require("../config/cloudinary");
      await deleteImageByPublicId(company.signaturePublicId).catch(
        console.error,
      );
    }

    // Update with new signature
    company.signature = req.file.path;
    company.signaturePublicId = req.file.filename;
    await company.save();

    res.json({
      success: true,
      data: {
        signature: company.signature,
        signaturePublicId: company.signaturePublicId,
      },
      message: "Signature uploaded successfully",
    });
  } catch (error) {
    // Clean up uploaded file if error occurs
    if (req.file) {
      const { deleteImage } = require("../config/cloudinary");
      await deleteImage(req.file.path).catch(console.error);
    }
    next(error);
  }
};

// @desc    Delete company signature
// @route   DELETE /api/admin/company/signature
// @access  Private/Admin
exports.deleteSignature = async (req, res, next) => {
  try {
    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company not found", 404, "NotFoundError");
    }

    if (!company.signaturePublicId) {
      throw new AppError("No signature to delete", 400, "ValidationError");
    }

    const { deleteImageByPublicId } = require("../config/cloudinary");
    await deleteImageByPublicId(company.signaturePublicId);

    company.signature = "";
    company.signaturePublicId = "";
    await company.save();

    res.json({
      success: true,
      message: "Signature deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update signatory information
// @route   PATCH /api/admin/company/signatory
// @access  Private/Admin
exports.updateSignatory = async (req, res, next) => {
  try {
    const { signatoryName, signatoryTitle } = req.body;

    const company = await Company.findOneAndUpdate(
      {},
      { signatoryName, signatoryTitle },
      { new: true, runValidators: true, upsert: true },
    );

    res.json({
      success: true,
      data: {
        signatoryName: company.signatoryName,
        signatoryTitle: company.signatoryTitle,
      },
      message: "Signatory information updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get signature and signatory info
// @route   GET /api/admin/company/signature-info
// @access  Private/Admin
exports.getSignatureInfo = async (req, res, next) => {
  try {
    const company = await Company.findOne().select(
      "signature signatoryName signatoryTitle",
    );

    if (!company) {
      throw new AppError("Company not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      data: {
        signature: company.signature,
        signatoryName: company.signatoryName,
        signatoryTitle: company.signatoryTitle,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==================== REFERENCE TEMPLATE FUNCTIONS ====================

// @desc    Get all reference templates
// @route   GET /api/admin/company/reference-templates
// @access  Private/Admin
exports.getReferenceTemplates = async (req, res, next) => {
  try {
    const company = await Company.findOne();

    if (!company) {
      throw new AppError("Company not found", 404);
    }

    // Get predefined templates
    const templates = {
      visa: company.referenceTemplates?.visa || {
        recipientTitle: "TO THE EMBASSY/VISA OFFICER",
        letterTitle: "LETTER OF REFERENCE",
        salutation: "Dear Visa Officer",
      },
      employment: company.referenceTemplates?.employment || {
        recipientTitle: "TO THE HUMAN RESOURCES MANAGER",
        letterTitle: "LETTER OF EMPLOYMENT REFERENCE",
        salutation: "Dear Hiring Manager",
      },
      bank: company.referenceTemplates?.bank || {
        recipientTitle: "TO THE BANK MANAGER",
        letterTitle: "BANK REFERENCE LETTER",
        salutation: "Dear Bank Manager",
      },
      general: company.referenceTemplates?.general || {
        recipientTitle: "TO WHOM IT MAY CONCERN",
        letterTitle: "CERTIFICATE OF GOOD STANDING",
        salutation: "To Whom It May Concern",
      },
      custom: company.referenceTemplates?.custom || {},
    };

    res.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a reference template
// @route   PUT /api/admin/company/reference-templates/:type
// @access  Private/Admin
exports.updateReferenceTemplate = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { recipientTitle, letterTitle, salutation } = req.body;

    // Validate required fields
    if (!recipientTitle || !letterTitle || !salutation) {
      throw new AppError("All fields are required", 400);
    }

    const updatePath = `referenceTemplates.${type}`;
    const updateData = {
      [updatePath]: { recipientTitle, letterTitle, salutation },
    };

    const company = await Company.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json({
      success: true,
      data: company.referenceTemplates[type],
      message: `${type} template updated successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a custom template
// @route   POST /api/admin/company/reference-templates/custom
// @access  Private/Admin
exports.createCustomTemplate = async (req, res, next) => {
  try {
    const { name, recipientTitle, letterTitle, salutation } = req.body;

    if (!name || !recipientTitle || !letterTitle || !salutation) {
      throw new AppError("Name and all template fields are required", 400);
    }

    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    // Check if template name already exists
    if (company.referenceTemplates?.custom?.has(name)) {
      throw new AppError("Template name already exists", 400);
    }

    const updateData = {
      [`referenceTemplates.custom.${name}`]: {
        recipientTitle,
        letterTitle,
        salutation,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const updatedCompany = await Company.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.status(201).json({
      success: true,
      data: updatedCompany.referenceTemplates.custom.get(name),
      message: `Custom template "${name}" created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a custom template
// @route   DELETE /api/admin/company/reference-templates/custom/:name
// @access  Private/Admin
exports.deleteCustomTemplate = async (req, res, next) => {
  try {
    const { name } = req.params;

    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    if (!company.referenceTemplates?.custom?.has(name)) {
      throw new AppError("Template not found", 404);
    }

    // Remove the template
    company.referenceTemplates.custom.delete(name);
    await company.save();

    res.json({
      success: true,
      message: `Template "${name}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single custom template
// @route   GET /api/admin/company/reference-templates/custom/:name
// @access  Private/Admin
exports.getCustomTemplate = async (req, res, next) => {
  try {
    const { name } = req.params;

    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    const template = company.referenceTemplates?.custom?.get(name);
    if (!template) {
      throw new AppError("Template not found", 404);
    }

    res.json({
      success: true,
      data: template,
    });
  } catch (error) {
    next(error);
  }
};
