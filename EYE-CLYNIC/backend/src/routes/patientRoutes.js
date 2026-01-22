const express = require("express");
const {
  getAllPatients,
  getPatientById,
  getPatientByName,
  getPatientWithVisits,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/roleCheck");

const router = express.Router();

// Wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Protect all routes with authentication
router.use(protect);

// Get all patients
router.get("/", asyncHandler(getAllPatients));

// Search patient by name (must come before /:id to avoid conflicts)
router.get("/search/:name", asyncHandler(getPatientByName));

// Create patient
router.post("/", authorize("admin", "assistant"), asyncHandler(createPatient));

// Get patient with their visits
router.get("/:id/visits", asyncHandler(getPatientWithVisits));

// Get patient by ID
router.get("/:id", asyncHandler(getPatientById));

// Update patient
router.put("/:id", authorize("admin", "assistant"), asyncHandler(updatePatient));

// Delete patient (Admin only)
router.delete("/:id", authorize("admin"), asyncHandler(deletePatient));

module.exports = router;