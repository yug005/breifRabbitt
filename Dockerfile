# ===========================
# Stage 1: Build Frontend
# ===========================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# Build the frontend
RUN npm run build

# ===========================
# Stage 2: Build Backend
# ===========================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# ===========================
# Stage 3: Final Production
# ===========================
FROM node:20-alpine AS production
WORKDIR /app

# Security: run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy backend dependencies
COPY --from=backend-builder /app/backend/node_modules ./node_modules
# Copy backend code
COPY backend/package*.json ./
COPY backend/server.js ./
COPY backend/src/ ./src/

# Copy built frontend assets to a 'public' folder in backend
COPY --from=frontend-builder /app/frontend/dist ./public

# Create uploads directory and fix permissions
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1

# Start the server
CMD ["node", "server.js"]
