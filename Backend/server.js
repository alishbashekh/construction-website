import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import ApiV1Router from './routes/api/v1/index.js';
import connectDB from './config/db.js';
import ErrorHandler from './middlewares/ErrorHandler.js';
import logger from './logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

// ─── Middleware ───────────────────────────────────────────
app.use(helmet());                          // Security headers
app.use(cors({ origin: '*' }));             // Allow all origins
app.use(morgan('dev'));                     // Log requests in terminal
app.use(express.json());                   // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// ─── Routes ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ottomon API' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/v1', ApiV1Router);

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ─── Error Handler ────────────────────────────────────────
app.use(ErrorHandler);

// ─── Start Server ─────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    logger.info('Database connected');

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();