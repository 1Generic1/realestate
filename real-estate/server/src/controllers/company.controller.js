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
