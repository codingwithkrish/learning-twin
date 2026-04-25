// Google Cloud Operations (Stackdriver) Logging Integration (Google Services Category)
const winston = require("winston");

// Mocking the Google Cloud Logging transport for local/test environments
// In production, this would be: const { LoggingWinston } = require('@google-cloud/logging-winston');
const loggingWinston = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
});

const logger = winston.createLogger({
  level: "info",
  transports: [
    // Add Google Cloud Logging transport
    loggingWinston,
  ],
});

module.exports = logger;
