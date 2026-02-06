const mongoose = require('mongoose');

const CurrentAffairSchema = new mongoose.Schema({
  headline: {
    type: String,
    required: true
  },
  contentBody: {
    type: String,
    required: true // Can store HTML or Markdown string
  },
  category: {
    type: String,
    enum: ['National', 'International', 'Tech', 'Awards', 'Sports', 'Economy'],
    required: true
  },
  tags: [{
    type: String
  }],
  isSpotlight: {
    type: Boolean,
    default: false,
    description: 'If true, this article appears in the big Hero card'
  },
  imageUrl: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
},{ timestamps: true });

module.exports = mongoose.model('CurrentAffair', CurrentAffairSchema);