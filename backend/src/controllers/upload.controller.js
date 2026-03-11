/**
 * Upload controller — handles file upload requests.
 *
 * Validates input, creates a job, and launches the
 * background processing pipeline.
 */
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { jobStore } from '../models/jobStore.js';
import { processPipeline } from '../services/pipeline.js';
import { logger } from '../utils/logger.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function uploadController(req, res, next) {
  try {
    const file = req.file;
    let { email } = req.body;

    // ── Validate file presence ────────────────────────────────
    if (!file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'No file uploaded. Attach a CSV or XLSX file.',
      });
    }

    // ── Sanitize & Validate email ─────────────────────────────
    email = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: 'Invalid email address format.',
      });
    }

    const extension = path.extname(file.originalname).toLowerCase();

    // ── Create job ────────────────────────────────────────────
    const jobId = uuidv4();
    jobStore.create(jobId);

    logger.info(`Job ${jobId} created for ${email} — file: ${file.originalname} (${file.size} bytes)`);

    // ── Launch pipeline asynchronously (fire-and-forget) ─────
    processPipeline({
      jobId,
      fileBuffer: file.buffer,
      fileExtension: extension,
      email,
    }).catch((err) => {
      logger.error(`Pipeline failed for job ${jobId}: ${err.message}`);
    });

    // ── Return immediately with 202 Accepted ─────────────────
    return res.status(202).json({
      jobId,
      status: 'pending',
      message: `File accepted. Summary will be sent to ${email}`,
      estimatedTimeSeconds: 30,
    });
  } catch (err) {
    next(err);
  }
}
