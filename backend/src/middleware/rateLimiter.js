/**
 * Rate limiter middleware using express-rate-limit.
 */
import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: 100, // Increased to allow polling without hits
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Requests',
    message: `Rate limit exceeded. Try again in ${config.rateLimitWindowMs / 1000} seconds.`,
  },
});

export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // restrict to 5 uploads per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too Many Upload Requests',
    message: 'Upload rate limit exceeded. You can only upload 5 files per minute.',
  },
});
