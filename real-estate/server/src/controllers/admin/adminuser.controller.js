const User = require("../../models/User.model");
const {
  deleteImage,
  deleteImageByPublicId,
  uploadBuffer,
} = require("../../config/cloudinary");
const { AppError } = require("../../middleware/errorMiddleware");
const { generateReferenceLetter } = require("../../services/pdf.service1");
const {
  generateReferenceLetterPDF,
  generateReferenceLetterHTML,
} = require("../../services/pdf.service");
const Company = require("../../models/Company.model");

// @desc    Send reference letter to user
// @route   POST /api/admin/users/:id/reference-letter
// @access  Private/Admin
exports.sendReferenceLetter1 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { letterType = "visa", notes = "", purpose = "" } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    // Get company info for letter
    const company = await Company.findOne();

    // Prepare user data for PDF
    const userData = {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || "Not provided",
    };

    // Prepare company data for PDF
    const companyData = {
      signature: company.signature || null,
      signatoryName: company.signatoryName || "Taye Adebayo",
      signatoryTitle: company.signatoryTitle || "Managing Director",
    };

    // Generate unique reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000);
    const referenceNumber = `TPR/VISA/${year}/${randomNum.toString().padStart(3, "0")}`;

    // Generate PDF buffer using your service
    let pdfBuffer;
    try {
      pdfBuffer = await generateReferenceLetter(
        userData,
        companyData,
        referenceNumber,
      );
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      throw new AppError("Failed to generate reference letter", 500);
    }

    // Upload PDF to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadBuffer(pdfBuffer, {
        folder: "tayes-property/reference-letters",
        resource_type: "auto",
        public_id: `ref_${referenceNumber.replace(/\//g, "_")}`,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      throw new AppError(
        "Failed to upload reference letter to cloud storage",
        500,
      );
    }

    // Save reference letter record to user
    user.referenceLetters.push({
      letterId: referenceNumber,
      letterType,
      purpose,
      notes,
      pdfUrl: uploadResult.secure_url,
      generatedAt: new Date(),
      sentViaEmail: true,
      emailSentAt: new Date(),
    });

    await user.save();

    // TODO: Send email with PDF attachment (optional)
    // await sendReferenceLetterEmail(user.email, user.fullName, referenceNumber, uploadResult.secure_url);

    res.json({
      success: true,
      message: "Reference letter generated and sent successfully",
      data: {
        pdfUrl: uploadResult.secure_url,
        referenceNumber,
        letterId: referenceNumber,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Reference letter generation failed:", error);
    next(error);
  }
};

// @desc    Send reference letter to user
// @route   POST /api/admin/users/:id/reference-letter
// @access  Private/Admin
exports.sendReferenceLetter2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { letterType = "visa", notes = "", purpose = "" } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    // Get company info
    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company info not found", 404, "NotFoundError");
    }

    // Generate unique reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000);
    const referenceNumber = `TPR/VISA/${year}/${randomNum.toString().padStart(3, "0")}`;

    // Prepare data for PDF
    const pdfData = {
      referenceNumber,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      clientName: `${user.firstName} ${user.lastName}`,
      clientEmail: user.email,
      clientPhone: user.phone || "Not provided",
      signatoryName: company.signatoryName || "Taye Adebayo",
      signatoryTitle: company.signatoryTitle || "Managing Director",
      signature: company.signature,
      address: company.address,
      phone: company.phone,
      email: company.email,
    };

    // Generate PDF using HTML template
    let pdfBuffer;
    try {
      pdfBuffer = await generateReferenceLetterPDF(pdfData);
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      throw new AppError("Failed to generate reference letter", 500);
    }

    // Upload PDF to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadBuffer(pdfBuffer, {
        folder: "tayes-property/reference-letters",
        resource_type: "auto",
        public_id: `ref_${referenceNumber.replace(/\//g, "_")}`,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      throw new AppError(
        "Failed to upload reference letter to cloud storage",
        500,
      );
    }

    // Save reference letter record
    user.referenceLetters.push({
      letterId: referenceNumber,
      letterType,
      purpose,
      notes,
      pdfUrl: uploadResult.secure_url,
      generatedAt: new Date(),
      sentViaEmail: true,
      emailSentAt: new Date(),
    });

    await user.save();

    res.json({
      success: true,
      message: "Reference letter generated successfully",
      data: {
        pdfUrl: uploadResult.secure_url,
        referenceNumber,
        letterId: referenceNumber,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Reference letter generation failed:", error);
    next(error);
  }
};

exports.sendReferenceLetter = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      templateType = "visa", // visa, employment, bank, general, or custom template name
      customTemplateName,
      notes = "",
      purpose = "",
    } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get company info
    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company not found", 404);
    }

    // Get template based on type
    let template;

    if (templateType === "custom" && customTemplateName) {
      // Get custom template
      template = company.referenceTemplates?.custom?.get(customTemplateName);
      if (!template) {
        throw new AppError(
          `Custom template "${customTemplateName}" not found`,
          404,
        );
      }
    } else {
      // Get predefined template
      template = company.referenceTemplates?.[templateType];
      if (!template) {
        throw new AppError(`Template "${templateType}" not found`, 404);
      }
    }

    // Generate reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000);
    const referenceNumber = `TPR/${templateType.toUpperCase()}/${year}/${randomNum.toString().padStart(3, "0")}`;

    // Prepare data for PDF
    const pdfData = {
      referenceNumber: referenceNumber,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      recipientTitle: template.recipientTitle,
      letterTitle: template.letterTitle,
      salutation: template.salutation,
      clientName: `${user.firstName} ${user.lastName}`,
      clientEmail: user.email,
      clientPhone: user.phone || "Not provided",
      signatoryName: company.signatoryName || "Taye Adebayo",
      signatoryTitle: company.signatoryTitle || "Managing Director",
      signature: company.signature,
      address: company.address,
      phone: company.phone,
      email: company.email,
    };

    // Generate PDF
    const pdfBuffer = await generateReferenceLetterPDF(pdfData);

    // Upload to Cloudinary
    const uploadResult = await uploadBuffer(pdfBuffer, {
      folder: "tayes-property/reference-letters",
      resource_type: "auto",
      public_id: `ref_${referenceNumber.replace(/\//g, "_")}`,
    });

    // Save to user
    user.referenceLetters.push({
      letterId: referenceNumber,
      letterType: templateType,
      purpose,
      notes,
      pdfUrl: uploadResult.secure_url,
      generatedAt: new Date(),
      sentViaEmail: true,
      emailSentAt: new Date(),
    });
    await user.save();

    res.json({
      success: true,
      message: "Reference letter sent successfully",
      data: {
        pdfUrl: uploadResult.secure_url,
        referenceNumber: referenceNumber,
        templateType: templateType,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Preview reference letter HTML (for testing)
// @route   GET /api/admin/users/:userId/reference-letter/preview
// @access  Private/Admin
exports.previewReferenceLetter = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    const company = await Company.findOne();

    const referenceNumber = `TPR/VISA/${new Date().getFullYear()}/PREVIEW`;

    const htmlContent = await generateReferenceLetterHTML({
      referenceNumber,
      clientName: `${user.firstName} ${user.lastName}`,
      clientEmail: user.email,
      clientPhone: user.phone || "Not provided",
      signatoryName: company.signatoryName || "Taye Adebayo",
      signatoryTitle: company.signatoryTitle || "Managing Director",
      signature: company.signature,
      address: company.address,
      phone: company.phone,
      email: company.email,
    });

    res.send(htmlContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reference letters for a user
// @route   GET /api/admin/users/:id/reference-letters
// @access  Private/Admin
exports.getUserReferenceLetters = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "referenceLetters firstName lastName email",
    );
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      data: {
        user: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        referenceLetters: user.referenceLetters.sort(
          (a, b) => b.generatedAt - a.generatedAt,
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend reference letter email
// @route   POST /api/admin/users/:userId/reference-letters/:letterId/resend
// @access  Private/Admin
exports.resendReferenceLetter = async (req, res, next) => {
  try {
    const { userId, letterId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    const letter = user.referenceLetters.find((l) => l.letterId === letterId);
    if (!letter) {
      throw new AppError("Reference letter not found", 404, "NotFoundError");
    }

    // Update email sent tracking
    letter.sentViaEmail = true;
    letter.emailSentAt = new Date();
    await user.save();

    // TODO: Resend email with PDF attachment
    // await sendReferenceLetterEmail(user.email, user.fullName, letterId, letter.pdfUrl);

    res.json({
      success: true,
      message: "Reference letter resent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send reference letter to user
// @route   POST /api/admin/users/:id/reference-letter
// @access  Private/Admin
exports.sendReferenceLetter1 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { letterType = "visa", notes = "", purpose = "" } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    // Get company info for letter
    const company = await Company.findOne();

    // Prepare user data for PDF
    const userData = {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || "Not provided",
    };

    // Prepare company data for PDF
    const companyData = {
      signature: company.signature || null,
      signatoryName: company.signatoryName || "Taye Adebayo",
      signatoryTitle: company.signatoryTitle || "Managing Director",
    };

    // Generate unique reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000);
    const referenceNumber = `TPR/VISA/${year}/${randomNum.toString().padStart(3, "0")}`;

    // Generate PDF buffer using your service
    let pdfBuffer;
    try {
      pdfBuffer = await generateReferenceLetter(
        userData,
        companyData,
        referenceNumber,
      );
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      throw new AppError("Failed to generate reference letter", 500);
    }

    // Upload PDF to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadBuffer(pdfBuffer, {
        folder: "tayes-property/reference-letters",
        resource_type: "auto",
        public_id: `ref_${referenceNumber.replace(/\//g, "_")}`,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      throw new AppError(
        "Failed to upload reference letter to cloud storage",
        500,
      );
    }

    // Save reference letter record to user
    user.referenceLetters.push({
      letterId: referenceNumber,
      letterType,
      purpose,
      notes,
      pdfUrl: uploadResult.secure_url,
      generatedAt: new Date(),
      sentViaEmail: true,
      emailSentAt: new Date(),
    });

    await user.save();

    // TODO: Send email with PDF attachment (optional)
    // await sendReferenceLetterEmail(user.email, user.fullName, referenceNumber, uploadResult.secure_url);

    res.json({
      success: true,
      message: "Reference letter generated and sent successfully",
      data: {
        pdfUrl: uploadResult.secure_url,
        referenceNumber,
        letterId: referenceNumber,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Reference letter generation failed:", error);
    next(error);
  }
};

// @desc    Send reference letter to user
// @route   POST /api/admin/users/:id/reference-letter
// @access  Private/Admin
exports.sendReferenceLetter2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { letterType = "visa", notes = "", purpose = "" } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    // Get company info
    const company = await Company.findOne();
    if (!company) {
      throw new AppError("Company info not found", 404, "NotFoundError");
    }

    // Generate unique reference number
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000);
    const referenceNumber = `TPR/VISA/${year}/${randomNum.toString().padStart(3, "0")}`;

    // Prepare data for PDF
    const pdfData = {
      referenceNumber,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      clientName: `${user.firstName} ${user.lastName}`,
      clientEmail: user.email,
      clientPhone: user.phone || "Not provided",
      signatoryName: company.signatoryName || "Taye Adebayo",
      signatoryTitle: company.signatoryTitle || "Managing Director",
      signature: company.signature,
      address: company.address,
      phone: company.phone,
      email: company.email,
    };

    // Generate PDF using HTML template
    let pdfBuffer;
    try {
      pdfBuffer = await generateReferenceLetterPDF(pdfData);
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      throw new AppError("Failed to generate reference letter", 500);
    }

    // Upload PDF to Cloudinary
    let uploadResult;
    try {
      uploadResult = await uploadBuffer(pdfBuffer, {
        folder: "tayes-property/reference-letters",
        resource_type: "auto",
        public_id: `ref_${referenceNumber.replace(/\//g, "_")}`,
      });
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      throw new AppError(
        "Failed to upload reference letter to cloud storage",
        500,
      );
    }

    // Save reference letter record
    user.referenceLetters.push({
      letterId: referenceNumber,
      letterType,
      purpose,
      notes,
      pdfUrl: uploadResult.secure_url,
      generatedAt: new Date(),
      sentViaEmail: true,
      emailSentAt: new Date(),
    });

    await user.save();

    res.json({
      success: true,
      message: "Reference letter generated successfully",
      data: {
        pdfUrl: uploadResult.secure_url,
        referenceNumber,
        letterId: referenceNumber,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Reference letter generation failed:", error);
    next(error);
  }
};

// @desc    Download reference letter for a user (admin) - FIXED VERSION
// @route   GET /api/admin/users/:userId/reference-letters/:letterId/download
// @access  Private/Admin
exports.downloadUserReferenceLetter = async (req, res, next) => {
  try {
    const { userId, letterId } = req.params;
    const decodedLetterId = decodeURIComponent(letterId);

    console.log("Download request:", { userId, letterId: decodedLetterId });

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    let letter = user.referenceLetters.find(
      (l) => l.letterId === decodedLetterId,
    );
    if (!letter) {
      letter = user.referenceLetters.find((l) => l.letterId === letterId);
    }

    if (!letter) {
      console.log(
        "Available letters:",
        user.referenceLetters.map((l) => l.letterId),
      );
      throw new AppError(
        `Reference letter not found. ID: ${decodedLetterId}`,
        404,
      );
    }

    console.log("Found letter:", {
      letterId: letter.letterId,
      pdfUrl: letter.pdfUrl,
    });

    // Track download
    if (letter.downloadedCount !== undefined) {
      letter.downloadedCount += 1;
      letter.lastDownloadedAt = new Date();
      await user.save();
    }

    // Create a direct download URL for Cloudinary
    let downloadUrl = letter.pdfUrl;

    // Add download flag for PDF
    if (downloadUrl.includes("/image/upload/")) {
      downloadUrl = downloadUrl.replace(
        "/image/upload/",
        "/image/upload/fl_attachment/",
      );
    }

    console.log("🔄 Redirecting to download URL:", downloadUrl);

    // Simply redirect to Cloudinary for download
    return res.redirect(downloadUrl);
  } catch (error) {
    console.error("Admin download error:", error);
    next(error);
  }
};

// @desc    Preview reference letter HTML (for testing)
// @route   GET /api/admin/users/:userId/reference-letter/preview
// @access  Private/Admin
exports.previewReferenceLetter = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    const company = await Company.findOne();

    const referenceNumber = `TPR/VISA/${new Date().getFullYear()}/PREVIEW`;

    const htmlContent = await generateReferenceLetterHTML({
      referenceNumber,
      clientName: `${user.firstName} ${user.lastName}`,
      clientEmail: user.email,
      clientPhone: user.phone || "Not provided",
      signatoryName: company.signatoryName || "Taye Adebayo",
      signatoryTitle: company.signatoryTitle || "Managing Director",
      signature: company.signature,
      address: company.address,
      phone: company.phone,
      email: company.email,
    });

    res.send(htmlContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reference letters for a user
// @route   GET /api/admin/users/:id/reference-letters
// @access  Private/Admin
exports.getUserReferenceLetters = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "referenceLetters firstName lastName email",
    );
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    res.json({
      success: true,
      data: {
        user: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        referenceLetters: user.referenceLetters.sort(
          (a, b) => b.generatedAt - a.generatedAt,
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend reference letter email
// @route   POST /api/admin/users/:userId/reference-letters/:letterId/resend
// @access  Private/Admin
exports.resendReferenceLetter = async (req, res, next) => {
  try {
    const { userId, letterId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "NotFoundError");
    }

    const letter = user.referenceLetters.find((l) => l.letterId === letterId);
    if (!letter) {
      throw new AppError("Reference letter not found", 404, "NotFoundError");
    }

    // Update email sent tracking
    letter.sentViaEmail = true;
    letter.emailSentAt = new Date();
    await user.save();

    // TODO: Resend email with PDF attachment
    // await sendReferenceLetterEmail(user.email, user.fullName, letterId, letter.pdfUrl);

    res.json({
      success: true,
      message: "Reference letter resent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download reference letter via server proxy (bypasses Cloudinary auth)
// @route   GET /api/admin/users/:userId/reference-letters/:letterId/download-proxy
// @access  Private/Admin
exports.downloadReferenceLetterProxy = async (req, res, next) => {
  try {
    const { userId, letterId } = req.params;
    const decodedLetterId = decodeURIComponent(letterId);

    console.log("📥 Proxy download request:", {
      userId,
      letterId: decodedLetterId,
    });

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Find the reference letter
    let letter = user.referenceLetters.find(
      (l) => l.letterId === decodedLetterId,
    );
    if (!letter) {
      letter = user.referenceLetters.find((l) => l.letterId === letterId);
    }

    if (!letter) {
      throw new AppError("Reference letter not found", 404);
    }

    console.log("📄 Found letter:", {
      letterId: letter.letterId,
      pdfUrl: letter.pdfUrl,
    });

    // Track download
    if (letter.downloadedCount !== undefined) {
      letter.downloadedCount += 1;
      letter.lastDownloadedAt = new Date();
      await user.save();
    }

    // Fetch PDF from Cloudinary with proper headers
    const cloudinaryUrl = letter.pdfUrl;
    console.log("🌐 Fetching from Cloudinary:", cloudinaryUrl);

    // Add a download flag to the URL
    let fetchUrl = cloudinaryUrl;
    if (fetchUrl.includes("/image/upload/")) {
      fetchUrl = fetchUrl.replace(
        "/image/upload/",
        "/image/upload/fl_attachment/",
      );
    }

    console.log("📡 Fetch URL:", fetchUrl);

    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/pdf, image/*",
      },
    });

    if (!response.ok) {
      console.error(
        "❌ Cloudinary fetch failed:",
        response.status,
        response.statusText,
      );

      // Try without the fl_attachment flag
      console.log("🔄 Retrying without attachment flag...");
      const retryResponse = await fetch(cloudinaryUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/pdf, */*",
        },
      });

      if (!retryResponse.ok) {
        throw new AppError(
          `Failed to fetch PDF from storage: ${retryResponse.status}`,
          500,
        );
      }

      const retryBuffer = await retryResponse.arrayBuffer();
      const pdfBuffer = Buffer.from(retryBuffer);

      // Send the PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="reference-letter-${letter.letterId.replace(/\//g, "-")}.pdf"`,
      );
      res.setHeader("Content-Length", pdfBuffer.length);
      return res.send(pdfBuffer);
    }

    const arrayBuffer = await response.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    console.log(`✅ PDF fetched successfully: ${pdfBuffer.length} bytes`);

    // Send the PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="reference-letter-${letter.letterId.replace(/\//g, "-")}.pdf"`,
    );
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache");

    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Proxy download error:", error);
    next(error);
  }
};
