import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-api-key-change-me';

const client = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'X-API-Key': API_KEY,
  },
});

/**
 * Upload a file and email for processing.
 * @param {File} file - CSV or XLSX file
 * @param {string} email - Recipient email address
 * @returns {Promise<{job_id: string, status: string, message: string}>}
 */
export async function uploadFile(file, email) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('email', email);

  const response = await client.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * Poll the status of a processing job.
 * @param {string} jobId - Job identifier
 * @returns {Promise<{job_id: string, status: string, progress_percent: number}>}
 */
export async function getJobStatus(jobId) {
  const response = await client.get(`/status/${jobId}`);
  return response.data;
}

/**
 * Check API health.
 * @returns {Promise<{status: string, version: string}>}
 */
export async function checkHealth() {
  const response = await axios.get(`${API_URL}/health`);
  return response.data;
}

export default client;
