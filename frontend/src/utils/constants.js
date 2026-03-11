export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ALLOWED_FILE_TYPES = ['.csv', '.xlsx'];
export const ALLOWED_MIME_TYPES = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

export const POLL_INTERVAL_MS = 3000;

export const MESSAGES = {
  UPLOAD_SUCCESS: 'File uploaded successfully! Processing your data...',
  UPLOAD_ERROR: 'Failed to upload file. Please try again.',
  INVALID_FILE: 'Please upload a .csv or .xlsx file.',
  FILE_TOO_LARGE: `File must be under ${MAX_FILE_SIZE_MB}MB.`,
  INVALID_EMAIL: 'Please enter a valid email address.',
  PROCESSING: 'Analyzing your data and generating summary...',
  COMPLETED: 'Executive summary sent to your email!',
  FAILED: 'Something went wrong. Please try again.',
};
