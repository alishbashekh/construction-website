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
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

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

// ─── Connect DB then start (local only) ──────────────────
const startServer = async () => {
  try {
    await connectDB();
    logger.info('Database connected');

    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


export default app;