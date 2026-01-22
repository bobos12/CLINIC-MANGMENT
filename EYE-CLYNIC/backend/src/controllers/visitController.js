const Visit = require("../models/Visit");

// Get all visits with patient and doctor details
exports.getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate("patientId", "name phone code")
      .populate("doctorId", "name email role");

    res.status(200).json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get visit by ID
exports.getVisitById = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id)
      .populate("patientId", "name phone code")
      .populate("doctorId", "name email role");

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json(visit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create visit - minimal required fields
exports.createVisit = async (req, res) => {
  try {
    const { patientId, eyeExam, complaint, recommendations, followUpDate } = req.body;

    if (!patientId) {
      return res.status(400).json({ message: "patientId is required" });
    }

    // doctorId comes from authenticated user
    const doctorId = req.user._id;

    const visit = new Visit({
      patientId,
      doctorId,
      complaint,
      eyeExam,
      recommendations,
      followUpDate,
      visitDate: new Date()
    });

    await visit.save();

    // Populate before returning
    await visit.populate("patientId", "name phone code");
    await visit.populate("doctorId", "name email role");

    res.status(201).json({
      message: "Visit created successfully",
      visit
    });
  } catch (error) {
    res.status(400).json({ message: error.message, error: error.toString() });
  }
};

// Update visit
exports.updateVisit = async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("patientId", "name phone code")
      .populate("doctorId", "name email role");

    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json({
      message: "Visit updated successfully",
      visit
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete visit
exports.deleteVisit = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Visit ID is required" });
    }

    const visit = await Visit.findByIdAndDelete(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: "Visit not found" });
    }

    res.status(200).json({ message: "Visit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};