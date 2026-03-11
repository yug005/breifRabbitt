/**
 * BriefRabbit — Express Application Factory
 *
 * Assembles middleware stack, routes, Swagger docs,
 * and the global error handler.
 */
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { config } from './config/env.js';
import { setupSwagger } from './config/swagger.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

// ── Core Middleware ──────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(cors({ origin: config.allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { v4 as uuidv4 } from 'uuid';

// ── Request Logging ─────────────────────────────────────────────
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  logger.http(`[${req.id}] ${req.method} ${req.url}`);
  next();
});

// ── Swagger Docs ────────────────────────────────────────────────
setupSwagger(app);

// ── API Routes ──────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ── Root Health Check (unversioned) ─────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', version: '1.0.0', service: 'BriefRabbit API' });
});

// ── Serve Frontend Static Files (Monolith Mode) ─────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');

// Only serve static files if the directory exists (Monolith Mode)
import fs from 'fs';
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  
  // SPA Routing fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/docs')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  // If no frontend files, just redirect root to docs
  app.get('/', (req, res) => res.redirect('/docs'));
}

// ── Global Error Handler ────────────────────────────────────────
app.use(errorHandler);

export default app;
