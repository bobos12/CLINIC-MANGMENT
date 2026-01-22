const Patient = require("../models/Patient");

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient with all their visits
exports.getPatientWithVisits = async (req, res) => {
  try {
    const Visit = require('../models/Visit');
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Get all visits for this patient
    const visits = await Visit.find({ patientId: req.params.id })
      .populate('doctorId', 'name email role')
      .sort({ visitDate: -1 });

    res.status(200).json({
      patient,
      visits,
      visitCount: visits.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get patient by name (search)
exports.getPatientByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Please provide a patient name to search" });
    }

    // Case-insensitive search using regex
    const patients = await Patient.find({
      name: { $regex: name, $options: 'i' }
    });

    if (patients.length === 0) {
      return res.status(404).json({ message: `No patients found with name containing '${name}'` });
    }

    res.status(200).json({
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create patient - minimal required fields
exports.createPatient = async (req, res) => {
  try {
    console.log('createPatient: Starting...');
    console.log('createPatient: req.body =', req.body);
    
    // Only require: name, phone, age
    // Gender defaults to 'other', code auto-generated
    const { name, phone, age, gender } = req.body;

    if (!name || !phone || !age) {
      console.log('createPatient: Missing required fields');
      return res.status(400).json({ 
        message: "Missing required fields: name, phone, age",
        received: { name, phone, age }
      });
    }

    // Check if patient with same phone already exists
    const existingPatient = await Patient.findOne({ phone: phone.trim() });
    if (existingPatient) {
      console.log('createPatient: Patient with this phone already exists');
      return res.status(409).json({ 
        message: "A patient with this phone number already exists",
        existingPatient: {
          _id: existingPatient._id,
          name: existingPatient.name,
          phone: existingPatient.phone,
          code: existingPatient.code
        }
      });
    }

    console.log('createPatient: Creating new Patient document');
    const patient = new Patient({
      name,
      phone,
      age,
      gender: gender || 'other'
    });

    console.log('createPatient: Saving patient to database');
    await patient.save();

    console.log('createPatient: Patient saved successfully');
    res.status(201).json({
      message: "Patient created successfully",
      patient
    });
  } catch (error) {
    console.error('createPatient: Error occurred:', error.message);
    console.error('createPatient: Error stack:', error.stack);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        message: `A patient with this ${field} already exists`,
        error: error.message
      });
    }
    
    res.status(400).json({ 
      message: error.message, 
      error: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    // Allow updating any fields except code (which is auto-generated)
    const { code, ...updateData } = req.body;
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      patient
    });
  } catch (error) {
    res.status(400).json({ message: error.message, error: error.toString() });
  }
};

// Delete patient (hard delete - can be changed to soft delete if needed)
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};