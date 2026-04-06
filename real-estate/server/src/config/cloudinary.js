const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Log the values being used
console.log("📸 Initializing Cloudinary with:");
console.log("- Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
  "- API Key:",
  process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
);
console.log(
  "- API Secret:",
  process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
);

// Configure Cloudinary - explicitly set each value
cloudinary.config({
  cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: String(process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: String(process.env.CLOUDINARY_API_SECRET || "").trim(),
});

// Verify the config was set
const config = cloudinary.config();
console.log("✅ Cloudinary configured:", {
  cloud_name: config.cloud_name ? "present" : "missing",
  api_key: config.api_key ? "present" : "missing",
  api_secret: config.api_secret ? "present" : "missing",
});

// Test the connection
cloudinary.api
  .ping()
  .then((result) => console.log("✅ Cloudinary connection successful"))
  .catch((err) =>
    console.error("❌ Cloudinary connection failed:", err.message),
  );

// Configure storage for property images
const propertyStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tayes-property/properties",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
    format: "jpg",
  },
});

// Configure storage for property thumbnails
const thumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tayes-property/thumbnails",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 300, crop: "fill" }],
    format: "jpg",
  },
});

// Create multer upload instances
const uploadPropertyImages = multer({
  storage: propertyStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadThumbnail = multer({
  storage: thumbnailStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Configure storage for testimonial images
const testimonialStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tayes-property/testimonials",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 200, height: 200, crop: "fill" }],
    format: "jpg",
  },
});

const uploadTestimonialImage = multer({
  storage: testimonialStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

// ===== AGENT IMAGE STORAGE =====
const agentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tayes-property/agents", // Separate folder for agents
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 400, height: 400, crop: "fill" }, // Square profile images
      { quality: "auto" },
    ],
    format: "jpg",
  },
});

const uploadAgentImage = multer({
  storage: agentStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for profile photos
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// ==================== USER AVATAR STORAGE ====================
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tayes-property/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 200, height: 200, crop: "fill" }],
    format: "jpg",
  },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for avatars
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// Delete image from Cloudinary using either public ID or URL
const deleteImage = async (identifier) => {
  try {
    console.log("🗑️ deleteImage called with:", identifier);

    if (!identifier) {
      console.log("⚠️ No identifier provided");
      return null;
    }

    let publicId = identifier;
    console.log("🔍 Original identifier:", identifier);

    // Check if it's a URL (contains 'res.cloudinary.com')
    if (identifier.includes("res.cloudinary.com")) {
      console.log("📎 Processing as URL");
      // Extract public ID from URL
      const urlParts = identifier.split("/");
      console.log("URL parts:", urlParts);

      const folderIndex = urlParts.findIndex(
        (part) => part === "tayes-property",
      );
      console.log("Folder index:", folderIndex);

      if (folderIndex === -1) {
        console.error("❌ Could not find 'tayes-property' in URL");
        throw new Error("Could not find public ID in URL");
      }
      const publicIdParts = urlParts.slice(folderIndex);
      publicId = publicIdParts.join("/").split(".")[0];
      console.log("📎 Extracted publicId:", publicId);
    } else {
      console.log("📎 Processing as publicId directly:", publicId);
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Image deleted from Cloudinary: ${publicId}`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error deleting image:`, error);
    throw error;
  }
};

// Delete by public ID directly
const deleteImageByPublicId = async (publicId) => {
  try {
    if (!publicId) {
      console.log("⚠️ No publicId provided for deletion");
      return null;
    }

    // Ensure the public ID doesn't have the full URL
    let cleanPublicId = publicId;

    // If it's a full URL, extract just the public ID
    if (publicId.includes("res.cloudinary.com")) {
      const urlParts = publicId.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex !== -1) {
        const relevantParts = urlParts.slice(uploadIndex + 2);
        cleanPublicId = relevantParts.join("/").split(".")[0];
        console.log(`📎 Extracted publicId from URL: ${cleanPublicId}`);
      }
    }

    console.log(`🗑️ Attempting to delete Cloudinary image: ${cleanPublicId}`);
    const result = await cloudinary.uploader.destroy(cleanPublicId);
    console.log(`📊 Delete result:`, result);
    return result;
  } catch (error) {
    console.error(`❌ Error deleting image:`, error);
    throw error;
  }
};

// ===== SIGNATURE STORAGE =====
const signatureStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tayes-property/signatures",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
    transformation: [{ width: 300, height: 100, crop: "fit" }],
    format: "png",
  },
});

const uploadSignature = multer({
  storage: signatureStorage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// ==================== BUFFER UPLOAD (for PDFs, etc.) ====================

// Upload buffer to Cloudinary (for PDFs, documents, etc.)
const uploadBuffer = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("❌ Buffer upload failed:", error);
          reject(error);
        } else {
          console.log("✅ Buffer uploaded to Cloudinary:", result.secure_url);
          resolve(result);
        }
      },
    );

    // Write the buffer to the stream
    uploadStream.end(buffer);
  });
};

// Upload file from path (alternative method)
const uploadFile = (filePath, options) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, options, (error, result) => {
      if (error) {
        console.error("❌ File upload failed:", error);
        reject(error);
      } else {
        console.log("✅ File uploaded to Cloudinary:", result.secure_url);
        resolve(result);
      }
    });
  });
};

module.exports = {
  // Multer upload instances
  uploadPropertyImages,
  uploadThumbnail,
  uploadTestimonialImage,
  uploadAgentImage,
  uploadAvatar,
  uploadSignature,

  // Cloudinary instance
  cloudinary,

  //delete functions
  deleteImage,
  deleteImageByPublicId,

  // Buffer/file upload functions (for PDFs, etc.)
  uploadBuffer,
  uploadFile,
};
