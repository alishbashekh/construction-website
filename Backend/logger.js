import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => 
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    // Print logs in terminal — works everywhere ✅
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),

    // File logs only in local development — Vercel is read-only ✅
    ...(!isProduction ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/app.log' })
    ] : [])
  ]
});

export const logError = (msg) => logger.error(msg);
export const logInfo = (msg) => logger.info(msg);

export default logger;