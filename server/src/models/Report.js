const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    overallScore: {
      type: Number,
      required: true
    },
    technicalScore: {
      type: Number,
      required: true
    },
    communicationScore: {
      type: Number,
      required: true
    },
    completenessScore: {
      type: Number,
      required: true
    },
    problemSolvingScore: {
      type: Number,
      required: true
    },
    strengths: [String],
    weaknesses: [String],
    recommendedTopics: [String],
    summary: {
      type: String,
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('Report', reportSchema);
