const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learningData: [{
    day: String,
    concepts: Number
  }],
  retentionData: [{
    day: Number,
    rate: Number
  }],
  subjectData: [{
    name: String,
    value: Number,
    color: String
  }],
  topicsToRevisit: [{
    title: String,
    recall: Number,
    icon: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
