// Centralized Error Handling Middleware (Code Quality & Security)
const logger = require("../services/logger.service");

const errorHandler = (err, req, res, next) => {
  // Log the error using Google Cloud Logging
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === "production" ? "Server Error" : err.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
