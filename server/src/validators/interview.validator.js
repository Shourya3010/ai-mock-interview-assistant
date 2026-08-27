const { z } = require('zod');

const createInterviewSchema = z.object({
  body: z.object({
    role: z.string().min(2, 'Role is required'),
    interviewType: z.enum(['Technical', 'HR', 'Behavioral', 'DSA']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    topics: z.array(z.string()).min(1, 'At least one topic must be selected'),
    duration: z.number().positive('Duration must be positive')
  })
});

const submitAnswerSchema = z.object({
  body: z.object({
    questionId: z.string().min(1, 'questionId is required'),
    answer: z.string().min(1, 'Answer text cannot be empty'),
    duration: z.number().optional()
  })
});

module.exports = { createInterviewSchema, submitAnswerSchema };
