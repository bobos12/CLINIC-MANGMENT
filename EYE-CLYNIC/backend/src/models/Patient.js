const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Auto-generated unique patient identifier (P000001, P000002, etc.)
  code: {
    type: String,
    unique: true,
    uppercase: true,
    sparse: true  // Allows null during validation, enforced uniqueness when set
  },
  // Core patient information - minimal required fields for MVP
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    unique: [true, 'A patient with this phone number already exists'],
    sparse: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
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

// Auto-generate patient code before saving
patientSchema.pre('save', async function() {
  if (this.isNew && !this.code) {
    // Count existing patients to generate next code
    const count = await this.constructor.countDocuments();
    this.code = `P${String(count + 1).padStart(6, '0')}`;
  }
});

// Index for faster queries
patientSchema.index({ name: 'text' });

module.exports = mongoose.model('Patient', patientSchema);