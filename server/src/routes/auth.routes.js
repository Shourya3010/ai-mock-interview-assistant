const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { success: false, message: 'Too many login/registration attempts, please try again in a minute.' }
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
