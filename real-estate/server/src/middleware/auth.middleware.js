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

module.exports = { adminAuth };
