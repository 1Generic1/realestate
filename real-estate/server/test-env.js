require("dotenv").config();

console.log("🧪 TESTING ENVIRONMENT VARIABLES");
console.log("================================");
console.log(
  "CLOUDINARY_CLOUD_NAME:",
  process.env.CLOUDINARY_CLOUD_NAME || "❌ NOT FOUND",
);
console.log(
  "CLOUDINARY_API_KEY:",
  process.env.CLOUDINARY_API_KEY ? " Found " : "❌ NOT FOUND",
);
console.log(
  "CLOUDINARY_API_SECRET:",
  process.env.CLOUDINARY_API_SECRET
    ? "✅ FOUND (length: " + process.env.CLOUDINARY_API_SECRET.length + ")"
    : "❌ NOT FOUND",
);
console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI ? "✅ FOUND" : "❌ NOT FOUND",
);
console.log("================================");
