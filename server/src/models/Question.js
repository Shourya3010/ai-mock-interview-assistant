const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      index: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    sequenceNumber: {
      type: Number,
      required: true
    },
    questionType: {
      type: String,
      enum: ['conceptual', 'scenario', 'problem-solving', 'behavioral', 'coding'],
      default: 'conceptual'
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

module.exports = mongoose.model('Question', questionSchema);
