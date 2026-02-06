const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Please add student name']
  },
  examName: {
    type: String,
    required: [true, 'Please add exam name (e.g., SBI PO)']
  },
  rank: {
    type: String,
    required: [true, 'Please add rank or status (e.g., AIR 1, Selected)']
  },
  category: {
    type: String,
    enum: ['Banking', 'SSC', 'State', 'Defence', 'Teaching'],
    required: true
  },
  imageUrl: {
    type: String,
    default: '/images/students/default-avatar.png'
  },
  year: {
    type: Number,
    required: true
  },
  testimonial: {
    type: String,
    maxlength: 200
  }
},{ timestamps: true });

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);