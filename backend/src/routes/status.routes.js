/**
 * Status routes — GET /status/:jobId
 *
 * @swagger
 * /api/v1/status/{jobId}:
 *   get:
 *     summary: Get job processing status & AI Summary
 *     description: |
 *       Polls the current status and progress of an asynchronous processing job.
 *       Once completed, the response includes the generated AI Markdown summary 
 *       so the frontend can display a preview before acting further.
 *     tags: [Status]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique job identifier
 *     responses:
 *       200:
 *         description: Job status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobStatusResponse'
 *       404:
 *         description: Job not found
 */
import { Router } from 'express';
import { statusController } from '../controllers/status.controller.js';

const router = Router();

router.get('/status/:jobId', statusController);

export default router;
