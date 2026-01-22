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

// Get user by ID
router.get("/:id", asyncHandler(getUserById));

// Update user (Admin or own user)
router.put("/:id", updateUser);

// Delete user (Admin only)
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;