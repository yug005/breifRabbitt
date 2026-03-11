/**
 * Shared utility functions.
 */

/**
 * Remove unsafe characters from a filename.
 * @param {string} filename
 * @returns {string}
 */
export function sanitizeFilename(filename) {
  return filename.replace(/[^\w\-.]/g, '_');
}

/**
 * Truncate text to a maximum length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 500) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
