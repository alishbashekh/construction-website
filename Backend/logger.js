import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => 
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    // Print logs in terminal
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Save error logs to file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Save all logs to file
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

export const logError = (msg) => logger.error(msg);
export const logInfo = (msg) => logger.info(msg);

export default logger;