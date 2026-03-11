/**
 * Health routes — GET /health
 *
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Detailed health check
 *     description: Returns service health status and connectivity info.
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

const router = Router();

router.get('/health', healthController);

export default router;
