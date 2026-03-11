import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES } from './constants';

/**
 * Validate a file for upload.
 * @param {File} file
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_FILE_TYPES.includes(extension)) {
    return { valid: false, error: `Unsupported file type. Only ${ALLOWED_FILE_TYPES.join(', ')} are accepted.` };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File is too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.` };
  }

  return { valid: true, error: null };
}

/**
 * Validate an email address.
 * @param {string} email
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  return { valid: true, error: null };
}
