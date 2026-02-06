const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  image: {
    type: String,
    default: null
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['SSC', 'Banking', 'State', 'Defence', 'Teaching', 'Other'],
    required: true
  },
  features: [{
    type: String
  }],
  badgeText: {
    type: String,
    default: null 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Store theme colors for the frontend UI cards
  colorTheme: {
    from: { type: String, default: 'from-brand-red' },
    to: { type: String, default: 'to-orange-600' },
    text: { type: String, default: 'text-brand-red' },
    border: { type: String, default: 'border-brand-red' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);