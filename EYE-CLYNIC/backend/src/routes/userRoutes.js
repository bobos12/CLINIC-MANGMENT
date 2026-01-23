const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

const router = express.Router();

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Protect all routes with authentication
router.use(protect);

// Get all users (Admin only)
router.get("/", authorize("admin"), asyncHandler(getAllUsers));

// Get user by ID (Admin only; non-admins should use /api/auth/me)
router.get("/:id", authorize("admin"), asyncHandler(getUserById));

// Update user (Admin only; self-updates should use a dedicated endpoint if needed)
router.put("/:id", authorize("admin"), asyncHandler(updateUser));

// Delete user (Admin only)
router.delete("/:id", authorize("admin"), asyncHandler(deleteUser));

module.exports = router;