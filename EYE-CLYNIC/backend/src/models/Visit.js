const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  // References
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor ID is required']
  },
  // Visit date (auto-set to now if not provided)
  visitDate: {
    type: Date,
    default: Date.now
  },
  
  // Patient history (all optional for quick recording)
  complaint: {
    type: Map,
    of: new mongoose.Schema({
      years: { type: Number, min: 0 },
      months: { type: Number, min: 0, max: 12 },
      days: { type: Number, min: 0, max: 31 },
      value: { type: String, trim: true },
      eye: { type: String, enum: ['Right', 'Left', 'Both'], default: 'Both' },
    }),
    default: {},
  },
  medicalHistory: {
    type: Map,
    of: new mongoose.Schema({
      years: { type: Number, min: 0 },
      months: { type: Number, min: 0, max: 12 },
      days: { type: Number, min: 0, max: 31 },
      value: { type: String, trim: true },
      eye: { type: String, enum: ['Right', 'Left', 'Both'], default: 'Both' },
    }),
    default: {},
  },
  surgicalHistory: {
    type: Map,
    of: new mongoose.Schema({
      years: { type: Number, min: 0 },
      months: { type: Number, min: 0, max: 12 },
      days: { type: Number, min: 0, max: 31 },
      value: { type: String, trim: true },
      eye: { type: String, enum: ['Right', 'Left', 'Both'], default: 'Both' },
    }),
    default: {},
  },
  
  // Eye Examination structure (OD = Right eye, OS = Left eye)
  eyeExam: {
    visualAcuity: { OD: String, OS: String },
    oldGlasses: {
      OD: { sphere: String, cylinder: String, axis: String },
      OS: { sphere: String, cylinder: String, axis: String }
    },
    refraction: {
      OD: { sphere: String, cylinder: String, axis: String, ADD: String },
      OS: { sphere: String, cylinder: String, axis: String, ADD: String }
    },
    newPrescription: {
      OD: { sphere: String, cylinder: String, axis: String },
      OS: { sphere: String, cylinder: String, axis: String }
    },
    iop: { OD: mongoose.Schema.Types.Mixed, OS: mongoose.Schema.Types.Mixed }, // IOP in mmHg (string or number)
    externalAppearance: {
      OD: { values: [String], other: String },
      OS: { values: [String], other: String }
    },
    // Fields with option buttons store { values: [array of selected options], other: "text" }
    ocularMotility: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    eyelid: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    conjunctiva: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    cornea: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    sclera: {
      OD: { values: [String], other: String },
      OS: { values: [String], other: String }
    },
    anteriorChamber: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    iris: {
      OD: { values: [String], other: String },
      OS: { values: [String], other: String }
    },
    pupil: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    lens: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    posteriorSegment: {
      OD: { values: [String], other: String },
      OS: { values: [String], other: String }
    },
    others: { OD: String, OS: String } // Additional notes for any other findings
  },
  
  // Treatment and follow-up
  recommendations: {
    type: String,
    trim: true
  },
  followUp: {
    years: { type: Number, min: 0 },
    months: { type: Number, min: 0, max: 12 },
    days: { type: Number, min: 0, max: 31 }
  },
  followUpDate: {
    type: Date
  },
  // Soft-delete flags for medical record safety
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
  deletedAt: {
    type: Date,
  }
  // timestamps (createdAt, updatedAt) added automatically
}, {
  timestamps: true
});

// Indexes for faster queries on common operations
visitSchema.index({ patientId: 1, visitDate: -1 });
visitSchema.index({ doctorId: 1, visitDate: -1 });

module.exports = mongoose.model('Visit', visitSchema);