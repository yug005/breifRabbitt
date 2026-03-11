/**
 * BriefRabbit — Server Entry Point
 * Starts the Express application on the configured port.
 */
import app from './src/app.js';
import { config } from './src/config/env.js';
import { logger } from './src/utils/logger.js';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🐇 BriefRabbit API running on http://localhost:${PORT}`);
  logger.info(`📄 Swagger docs at http://localhost:${PORT}/docs`);
  logger.info(`🔧 Environment: ${config.nodeEnv}`);
});
