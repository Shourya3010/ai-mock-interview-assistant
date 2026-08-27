const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.clientUrl,
  credentials: true
}));

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', globalLimiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.nodeEnv
    }
  });
});

// Route imports will be mounted here in subsequent phases
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/interviews', require('./routes/interview.routes'));
app.use('/api/reports', require('./routes/report.routes'));

// 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
