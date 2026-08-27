const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
      index: true
    },
    answer: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: Number, // in seconds
      default: 0
    },
    technicalAccuracy: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    relevance: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    completeness: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    communication: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    problemSolving: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    strengths: [String],
    weaknesses: [String],
    feedback: {
      type: String,
      default: ''
    },
    followUpNeeded: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('Answer', answerSchema);
