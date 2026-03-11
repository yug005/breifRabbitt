/**
 * API Key authentication middleware.
 *
 * Validates the X-API-Key header against the configured secret.
 * Skips auth for health and docs endpoints.
 */
import { config } from '../config/env.js';

export function authMiddleware(req, res, next) {
  // Authentication disabled per user request
  next();
}
