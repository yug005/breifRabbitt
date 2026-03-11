/**
 * Pipeline orchestrator — coordinates the full processing flow.
 *
 * Flow: Parse → Analyze → Summarize → Email
 *
 * Runs asynchronously after the upload controller returns 202.
 * Updates the job store at each step for real-time status polling.
 */
import { jobStore } from '../models/jobStore.js';
import { parseFile } from './fileProcessor.js';
import { analyzeData } from './dataAnalyzer.js';
import { generateSummary } from './aiSummarizer.js';
import { sendSummaryEmail } from './emailService.js';
import { logger } from '../utils/logger.js';

/**
 * Execute the full processing pipeline.
 *
 * @param {{ jobId: string, fileBuffer: Buffer, fileExtension: string, email: string }} params
 */
export async function processPipeline({ jobId, fileBuffer, fileExtension, email }) {
  try {
    // ── Step 1: Parse file ────────────────────────────────────
    updateJob(jobId, 'processing', 'parsing', 10);
    logger.info(`[${jobId}] Step 1/4: Parsing file`);
    const parsed = parseFile(fileBuffer, fileExtension);

    // ── Step 2: Analyze data ──────────────────────────────────
    updateJob(jobId, 'processing', 'analyzing', 30);
    logger.info(`[${jobId}] Step 2/4: Analyzing data`);
    const analysis = analyzeData(parsed);

    // ── Step 3: Generate AI summary ───────────────────────────
    updateJob(jobId, 'processing', 'summarizing', 50);
    logger.info(`[${jobId}] Step 3/4: Generating AI summary`);
    const summary = await generateSummary(analysis);
    
    // Save summary to store for preview capability
    jobStore.update(jobId, { summary });

    // ── Step 4: Send email ────────────────────────────────────
    updateJob(jobId, 'processing', 'emailing', 80);
    logger.info(`[${jobId}] Step 4/4: Sending email to ${email}`);
    await sendSummaryEmail(email, summary);

    // ── Done ──────────────────────────────────────────────────
    updateJob(jobId, 'completed', 'email_sent', 100);
    jobStore.update(jobId, { completedAt: new Date().toISOString() });
    logger.info(`[${jobId}] Pipeline completed successfully`);

  } catch (err) {
    logger.error(`[${jobId}] Pipeline failed: ${err.message}`);
    jobStore.update(jobId, {
      status: 'failed',
      error: err.message,
      completedAt: new Date().toISOString(),
    });
  }
}

function updateJob(jobId, status, currentStep, progressPercent) {
  jobStore.update(jobId, { status, currentStep, progressPercent });
}
