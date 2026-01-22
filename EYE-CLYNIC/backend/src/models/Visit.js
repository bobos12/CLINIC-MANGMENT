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
    of: Number, // { "Decreased vision far or near": 0, "Seeking glasses": 0, ... }
    default: {}
  },
  medicalHistory: {
    type: Map,
    of: Number, // { "DM": 5, "HTN": 3, ... } - number is years
    default: {}
  },
  surgicalHistory: {
    type: Map,
    of: Number, // { "Cataract": 2, "Refractive": 1, ... } - number is years
    default: {}
  },
  
  // Eye Examination structure kept intact (OD = Right eye, OS = Left eye)
  eyeExam: {
    visualAcuity: { OD: String, OS: String }, // Options: "0.1-1", "2", "3", "4", "5m", "CF", "HM", "PL", "NPL"
    oldGlasses: { 
      OD: { sphere: String, cylinder: String, axis: String }, 
      OS: { sphere: String, cylinder: String, axis: String } 
    },
    refraction: { 
      OD: { sphere: String, cylinder: String, axis: String }, 
      OS: { sphere: String, cylinder: String, axis: String } 
    },
    externalAppearance: { OD: String, OS: String },
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
    sclera: { OD: String, OS: String },
    anteriorChamber: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    iris: { OD: String, OS: String },
    pupil: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    lens: { 
      OD: { values: [String], other: String }, 
      OS: { values: [String], other: String } 
    },
    posteriorSegment: { OD: String, OS: String },
    others: { OD: String, OS: String } // Additional notes for any other findings
  },
  
  // Treatment and follow-up
  recommendations: {
    type: String,
    trim: true
  },
  followUpDate: {
    type: Date
  }
  // timestamps (createdAt, updatedAt) added automatically
}, {
  timestamps: true
});

// Indexes for faster queries on common operations
visitSchema.index({ patientId: 1, visitDate: -1 });
visitSchema.index({ doctorId: 1, visitDate: -1 });

module.exports = mongoose.model('Visit', visitSchema);