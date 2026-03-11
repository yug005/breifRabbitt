/**
 * Upload routes — POST /upload
 *
 * @swagger
 * /api/v1/upload:
 *   post:
 *     summary: Upload a sales dataset for AI analysis
 *     description: |
 *       Accepts a CSV or XLSX file along with a recipient email.
 *       The dataset is immediately queued for background processing (parsing, analysis, and AI summarization).
 *       A job ID is returned instantly, which you can poll to get the summary or track status.
 *     tags: [Upload]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, email]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX sales dataset (max 5MB limit enforced)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address to receive the executive summary
 *     responses:
 *       202:
 *         description: Accepted — processing started
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Invalid file type
 *       413:
 *         description: File too large
 *       422:
 *         description: Invalid email
 */
import { Router } from 'express';
import { uploadMiddleware, handleMulterError } from '../middleware/fileValidator.js';
import { uploadController } from '../controllers/upload.controller.js';
import { uploadRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/upload', uploadRateLimiter, uploadMiddleware, handleMulterError, uploadController);

export default router;
