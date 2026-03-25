const express = require("express");
const bcrypt = require("bcryptjs");
const Admin = require("../../models/Admin.model");
const { adminAuth } = require("../../middleware/auth.middleware");
const { AppError } = require("../../middleware/errorMiddleware");

const router = express.Router();

router.use(adminAuth); // All routes protected

// @desc    Get admin profile
router.get("/", async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
});

// @desc    Update profile (username/email)
router.put("/", async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const admin = await Admin.findByIdAndUpdate(req.admin.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ success: true, data: admin, message: "Profile updated" });
  } catch (error) {
    next(error);
  }
});

// @desc    Change password
router.post("/change-password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("All fields required", 400);
    }

    const admin = await Admin.findById(req.admin.id);
    const isValid = await bcrypt.compare(currentPassword, admin.password);

    if (!isValid) {
      throw new AppError("Current password incorrect", 401);
    }

    const saltRounds = 12;
    admin.password = await bcrypt.hash(newPassword, saltRounds);
    await admin.save();

    res.json({ success: true, message: "Password changed" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
