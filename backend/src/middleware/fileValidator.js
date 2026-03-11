/**
 * File validation middleware — validates uploaded files via Multer.
 *
 * Checks file extension and enforces size limits.
 */
import multer from 'multer';
import path from 'path';
import { config } from '../config/env.js';

const ALLOWED_EXTENSIONS = new Set(['.csv', '.xlsx']);
const ALLOWED_MIMETYPES = new Set([
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/octet-stream', // Some browsers send this for .xlsx
]);

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    const error = new Error(`Unsupported file type '${ext}'. Only .csv and .xlsx are accepted.`);
    error.statusCode = 400;
    return cb(error, false);
  }

  cb(null, true);
};

/**
 * Multer upload middleware configured for single-file upload.
 * - Field name: "file"
 * - Max size: configurable via MAX_FILE_SIZE_MB
 * - Storage: memory buffer (no disk writes for temp processing)
 */
export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSizeMB * 1024 * 1024,
  },
}).single('file');

/**
 * Wraps Multer to return proper JSON errors.
 */
export function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        error: 'Payload Too Large',
        message: `File exceeds maximum size of ${config.maxFileSizeMB}MB.`,
      });
    }
    return res.status(400).json({ error: 'Upload Error', message: err.message });
  }

  if (err && err.statusCode) {
    return res.status(err.statusCode).json({ error: 'Bad Request', message: err.message });
  }

  next(err);
}
