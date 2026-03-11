/**
 * API v1 router — aggregates all endpoint routers.
 */
import { Router } from 'express';

import { authMiddleware } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import uploadRouter from './upload.routes.js';
import statusRouter from './status.routes.js';
import healthRouter from './health.routes.js';

export const apiRouter = Router();

// Apply auth + rate limiter globally to /api/v1
apiRouter.use(authMiddleware);
apiRouter.use(rateLimiter);

apiRouter.use(uploadRouter);
apiRouter.use(statusRouter);
apiRouter.use(healthRouter);
