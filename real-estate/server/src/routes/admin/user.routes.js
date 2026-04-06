const express = require("express");
const { adminAuth } = require("../../middleware/auth.middleware");
const { AppError } = require("../../middleware/errorMiddleware");
const User = require("../../models/User.model");
const { deleteImageByPublicId } = require("../../config/cloudinary");

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get("/", async (req, res, next) => {
  try {
    const { limit = 20, page = 1, isActive, search } = req.query;

    const query = {};
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select("-password");

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put("/:id", async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Deactivate user (admin) - Soft delete
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Soft delete - just deactivate
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Reactivate user (admin)
// @route   POST /api/admin/users/:id/reactivate
// @access  Private/Admin
router.post("/:id/reactivate", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isActive) {
      throw new AppError("User account is already active", 400);
    }

    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: "User reactivated successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Permanently delete user (admin) - Hard delete
// @route   DELETE /api/admin/users/:id/permanent
// @access  Private/Admin
router.delete("/:id/permanent", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Delete avatar if exists
    if (user.avatarPublicId) {
      await deleteImageByPublicId(user.avatarPublicId).catch(console.error);
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User permanently deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private/Admin
router.get("/stats/overview", async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, inactiveUsers, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        User.countDocuments({ isActive: false }),
        User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
      ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk deactivate users
// @route   POST /api/admin/users/bulk-deactivate
// @access  Private/Admin
router.post("/bulk-deactivate", async (req, res, next) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new AppError("Please provide an array of user IDs", 400);
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { isActive: false },
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} users deactivated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Bulk reactivate users
// @route   POST /api/admin/users/bulk-reactivate
// @access  Private/Admin
router.post("/bulk-reactivate", async (req, res, next) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new AppError("Please provide an array of user IDs", 400);
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { isActive: true },
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} users reactivated successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
