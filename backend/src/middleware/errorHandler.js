/**
 * Global error handler — catches all unhandled errors
 * and returns a consistent JSON response.
 */
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method} ${req.url}] ${statusCode} — ${message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Request Error',
    message: statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : message,
  });
}
