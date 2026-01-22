const express = require("express");
const {
  getAllVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
} = require("../controllers/visitController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

const router = express.Router();

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Protect all routes with authentication
router.use(protect);

// Get all visits
router.get("/", asyncHandler(getAllVisits));

// Create visit (Admin or Assistant)
router.post("/", authorize("admin", "assistant"), asyncHandler(createVisit));

// Get visit by ID
router.get("/:id", getVisitById);

// Update visit (Admin or Assistant)
router.put("/:id", authorize("admin", "assistant"), updateVisit);

// Delete visit (Admin only)
router.delete("/:id", authorize("admin"), deleteVisit);

module.exports = router;