const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  createInterview,
  startInterview,
  submitAnswer,
  endInterview,
  getUserInterviews,
  getInterviewById
} = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { createInterviewSchema, submitAnswerSchema } = require('../validators/interview.validator');

const router = express.Router();

const createInterviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Interview creation limit reached (10 per hour).' }
});

router.use(protect);

router.post('/', createInterviewLimiter, validate(createInterviewSchema), createInterview);
router.get('/', getUserInterviews);
router.get('/:id', getInterviewById);
router.post('/:id/start', startInterview);
router.post('/:id/answer', validate(submitAnswerSchema), submitAnswer);
router.post('/:id/end', endInterview);

module.exports = router;
