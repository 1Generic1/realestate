// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware with specific error types
const errorHandler = (err, req, res, next) => {
  // 🔥🔥🔥 ADD THIS DETAILED LOGGING AT THE VERY TOP 🔥🔥🔥
  console.log("\n========== 🔥 ERROR CAUGHT IN HANDLER ==========");
  console.log("1️⃣ Error object type:", typeof err);
  console.log("2️⃣ Is Error instance:", err instanceof Error);
  console.log("3️⃣ Error constructor name:", err?.constructor?.name);
  console.log("4️⃣ Error name:", err?.name);
  console.log("5️⃣ Error message:", err?.message);
  console.log("6️⃣ Error stack:", err?.stack);
  console.log("7️⃣ Error code:", err?.code);
  console.log("8️⃣ Error statusCode:", err?.statusCode);
  console.log("9️⃣ Error isOperational:", err?.isOperational);
  console.log(
    "🔟 Full error object:",
    JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
  );
  console.log("===============================================\n");

  // Default error values
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Something went wrong";
  let errorType = "ServerError";

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    errorType = "ValidationError";
    // Collect all validation error messages
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(", ");
    console.log("✅ Identified as ValidationError");
  }

  // Handle Mongoose duplicate key errors (e.g., duplicate email)
  else if (err.code === 11000) {
    statusCode = 400;
    errorType = "DuplicateError";
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists. Please use a different ${field}.`;
    console.log("✅ Identified as DuplicateError");
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    errorType = "CastError";
    message = `Invalid ${err.path}: ${err.value}`;
    console.log("✅ Identified as CastError");
  }

  // Handle JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorType = "JsonWebTokenError";
    message = "Invalid token. Please log in again.";
    console.log("✅ Identified as JsonWebTokenError");
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorType = "TokenExpiredError";
    message = "Token expired. Please log in again.";
    console.log("✅ Identified as TokenExpiredError");
  }

  // Handle Multer errors (file upload)
  else if (err.name === "MulterError") {
    statusCode = 400;
    errorType = "UploadError";
    console.log("✅ Identified as MulterError");

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "File too large. Maximum size is 5MB.";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files. Maximum 10 images allowed.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected field name for file upload.";
        break;
      default:
        message = err.message;
    }
  }

  // Handle Cloudinary errors
  else if (
    err.name === "CloudinaryError" ||
    err.http_code === 400 ||
    (err.message && err.message.includes("Cloudinary"))
  ) {
    statusCode = 400;
    errorType = "CloudinaryError";
    message = `Cloudinary error: ${err.message || "Error uploading image"}`;
    console.log("✅ Identified as CloudinaryError");
  }

  // Handle custom API errors
  else if (err.isOperational) {
    statusCode = err.statusCode || 400;
    errorType = err.errorType || "OperationalError";
    message = err.message;
    console.log("✅ Identified as OperationalError");
  }

  // If we got here with no specific handling, log that
  else {
    console.log("⚠️ Unhandled error type, using default handler");
  }

  // Log error for debugging (always log in development)
  console.error("\n📤 SENDING ERROR RESPONSE:");
  console.error("- Status:", statusCode);
  console.error("- Type:", errorType);
  console.error("- Message:", message);
  console.error("- Original Error:", err.message);
  console.error("- Original Stack:", err.stack);
  console.error("========================================\n");

  // Send response
  res.status(statusCode).json({
    success: false,
    error: message,
    errorType,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode, errorType = "AppError") {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { notFound, errorHandler, AppError };
