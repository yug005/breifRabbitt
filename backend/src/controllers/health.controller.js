/**
 * Health controller — returns service status and provider info.
 */
import { config } from '../config/env.js';

export function healthController(_req, res) {
  return res.json({
    status: 'healthy',
    version: '1.0.0',
    services: {
      llmProvider: config.llmProvider,
      emailProvider: config.emailProvider,
    },
  });
}
