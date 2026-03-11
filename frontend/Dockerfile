# ===========================
# Stage 1: Builder
# ===========================
FROM node:20-alpine AS builder

WORKDIR /build

# Copy and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ===========================
# Stage 2: Production Server
# ===========================
FROM nginx:alpine AS production

# Copy built assets from builder
COPY --from=builder /build/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Overwrite default nginx config to handle React Router properly
RUN echo 'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
