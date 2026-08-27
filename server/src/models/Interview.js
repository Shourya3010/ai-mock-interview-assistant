const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    role: {
      type: String,
      required: [true, 'Interview role is required'],
      trim: true
    },
    interviewType: {
      type: String,
      enum: ['Technical', 'HR', 'Behavioral', 'DSA'],
      default: 'Technical',
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      required: true
    },
    topics: {
      type: [String],
      required: true,
      validate: [array => array.length > 0, 'At least one topic must be selected']
    },
    duration: {
      type: Number, // in minutes: 15, 30, 45
      required: true,
      default: 15
    },
    status: {
      type: String,
      enum: ['created', 'in-progress', 'completed', 'abandoned'],
      default: 'created',
      index: true
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    startedAt: {
      type: Date
    },
    completedAt: {
      type: Date
    },
    overallScore: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
