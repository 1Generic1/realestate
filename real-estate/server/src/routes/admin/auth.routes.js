const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin.model");
const { AppError } = require("../../middleware/errorMiddleware");
const { adminAuth } = require("../../middleware/auth.middleware");

const router = express.Router();

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
router.post("/admin/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new AppError(
        "Username and password are required",
        400,
        "ValidationError",
      );
    }

    const admin = await Admin.findOne({ username }).select("+password");
    if (!admin) {
      throw new AppError("Invalid credentials", 401, "AuthenticationError");
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401, "AuthenticationError");
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "24h" },
    );

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      success: true,
      data: { token, admin: adminResponse },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
});

// TEMPORARY TEST ROUTE - Add this BEFORE other routes
router.get("/test-auth", adminAuth, (req, res) => {
  console.log("✅ Auth middleware passed!");
  res.json({ success: true, message: "Auth working" });
});

module.exports = router;
