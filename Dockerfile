# Stage 1: Build frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build backend
FROM node:22-alpine AS backend-build
WORKDIR /app
COPY backend/ .
RUN npm ci --omit=dev

# Final stage: nginx (frontend) + Node.js (backend) via supervisord
FROM nginx:1.29-alpine

RUN apk add --no-cache nodejs supervisor

# Frontend static files
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Backend application
COPY --from=backend-build /app /backend
RUN mkdir -p /backend/data

# Configs
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
