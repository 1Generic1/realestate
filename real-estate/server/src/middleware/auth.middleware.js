const jwt = require("jsonwebtoken");
const { AppError } = require("./errorMiddleware");

const adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401, "AuthenticationError");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new AppError("Invalid token", 401, "AuthenticationError"));
    } else if (error.name === "TokenExpiredError") {
      next(new AppError("Token expired", 401, "AuthenticationError"));
    } else {
      next(error);
    }
  }
};

// ==================== USER AUTHENTICATION ====================

// User authentication middleware (for user routes)
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401, "AuthenticationError");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token has user ID
    if (!decoded.id) {
      throw new AppError("Invalid user token", 401, "AuthenticationError");
    }

    // Get user from database
    const User = require("../models/User.model");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found", 401, "AuthenticationError");
    }

    if (!user.isActive) {
      throw new AppError(
        "Account is deactivated. Please contact support.",
        401,
        "AccountDeactivated",
      );
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new AppError("Invalid token", 401, "AuthenticationError"));
    } else if (error.name === "TokenExpiredError") {
      next(new AppError("Token expired", 401, "AuthenticationError"));
    } else {
      next(error);
    }
  }
};

module.exports = { adminAuth, authMiddleware };
