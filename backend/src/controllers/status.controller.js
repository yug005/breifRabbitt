/**
 * Status controller — returns current job progress.
 */
import { jobStore } from '../models/jobStore.js';

export function statusController(req, res) {
  const { jobId } = req.params;

  const job = jobStore.get(jobId);
  if (!job) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Job '${jobId}' not found.`,
    });
  }

  return res.json({
    jobId,
    status: job.status,
    currentStep: job.currentStep,
    progressPercent: job.progressPercent,
    createdAt: job.createdAt,
    completedAt: job.completedAt,
    summary: job.summary,
    error: job.error,
  });
}
