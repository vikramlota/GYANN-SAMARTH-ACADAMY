const mongoose = require('mongoose');

const UpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Job', 'AdmitCard', 'Result', 'Notice'],
    required: true
  },
  linkUrl: {
    type: String,
    required: false // Optional, in case it's just a text notice
  },
  isNew: {
    type: Boolean,
    default: true
  },
  // Auto-expire "New" badge after 7 days (logic handled in controller or frontend)
  datePosted: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

module.exports = mongoose.model('Update', UpdateSchema);