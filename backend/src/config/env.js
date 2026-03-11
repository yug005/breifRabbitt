/**
 * Environment configuration — loads and validates all env vars.
 */
import 'dotenv/config';

function required(key) {
  const value = process.env[key];
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
}

function optional(key, fallback) {
  return process.env[key] || fallback;
}

export const config = {
  // ── App ───────────────────────────────────────────────────
  nodeEnv: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '8000'), 10),

  // ── Security ──────────────────────────────────────────────
  apiKey: optional('API_KEY', 'dev-api-key-change-me'),
  allowedOrigins: optional('ALLOWED_ORIGINS', 'http://localhost:5173,http://localhost:3000').split(','),

  // ── File Upload ───────────────────────────────────────────
  maxFileSizeMB: parseInt(optional('MAX_FILE_SIZE_MB', '5'), 10),
  uploadDir: optional('UPLOAD_DIR', 'uploads'),

  // ── LLM Provider ─────────────────────────────────────────
  llmProvider: optional('LLM_PROVIDER', 'groq'),  // 'groq' | 'gemini'
  groqApiKey: optional('GROQ_API_KEY', ''),
  groqModel: optional('GROQ_MODEL', 'llama-3.3-70b-versatile'),
  geminiApiKey: optional('GEMINI_API_KEY', ''),
  geminiModel: optional('GEMINI_MODEL', 'gemini-2.0-flash'),

  // ── Email Provider ────────────────────────────────────────
  emailProvider: optional('EMAIL_PROVIDER', 'smtp'),  // 'smtp' | 'resend'

  // SMTP
  smtpHost: optional('SMTP_HOST', 'smtp.gmail.com'),
  smtpPort: parseInt(optional('SMTP_PORT', '587'), 10),
  smtpUser: optional('SMTP_USER', ''),
  smtpPassword: optional('SMTP_PASSWORD', ''),
  smtpFromName: optional('SMTP_FROM_NAME', 'BriefRabbit'),

  // Resend
  resendApiKey: optional('RESEND_API_KEY', ''),
  resendFromEmail: optional('RESEND_FROM_EMAIL', 'summary@briefrabbit.com'),

  // ── Rate Limiting ─────────────────────────────────────────
  rateLimitWindowMs: parseInt(optional('RATE_LIMIT_WINDOW_MS', '60000'), 10),
  rateLimitMaxRequests: parseInt(optional('RATE_LIMIT_MAX_REQUESTS', '10'), 10),
};
