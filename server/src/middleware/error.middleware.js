const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error Middleware] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack })
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
