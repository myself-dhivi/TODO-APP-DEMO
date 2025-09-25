import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRoutes } from './routes';
import { errorHandler } from './middlewares/error';

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Logging
  app.use(morgan('dev'));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api', apiRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      data: null,
      error: `Route ${req.method} ${req.originalUrl} not found`
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};