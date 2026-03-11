/**
 * In-memory job store.
 *
 * Tracks processing status for each upload job.
 * Replace with Redis or a database for horizontal scaling.
 */

/** @type {Map<string, object>} */
const store = new Map();

export const jobStore = {
  /**
   * Create a new job entry.
   * @param {string} jobId
   */
  create(jobId) {
    store.set(jobId, {
      status: 'pending',
      currentStep: null,
      progressPercent: 0,
      createdAt: new Date().toISOString(),
      completedAt: null,
      error: null,
      summary: null,
    });
  },

  /**
   * Get a job by ID.
   * @param {string} jobId
   * @returns {object | undefined}
   */
  get(jobId) {
    return store.get(jobId);
  },

  /**
   * Update specific fields on a job.
   * @param {string} jobId
   * @param {object} updates
   */
  update(jobId, updates) {
    const job = store.get(jobId);
    if (job) {
      Object.assign(job, updates);
    }
  },

  /** Expose the underlying Map (for testing). */
  _store: store,
};
