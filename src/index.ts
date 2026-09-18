import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import hospitalRoutes from './routes/hospital.routes.js';
import { notFoundHandler, globalErrorHandler } from './middlewares/error.js';

// Global Process-level Catches
process.on('uncaughtException', (err: Error) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...', reason);
  process.exit(1);
});

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Hospital Backend API is running!',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospital', hospitalRoutes);

// Catch 404s
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

// Start server
app.listen(ENV.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
  console.log(`📝 Environment: ${ENV.NODE_ENV}`);
});

export default app;
export { app };
