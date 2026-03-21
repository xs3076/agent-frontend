# Stage 1: Build the frontend application
FROM node:22-alpine AS builder

WORKDIR /app

# BACK_END is compile-time only (Umi route redirects)
ARG BACK_END=java

# Copy package files (for dependency cache layer)
COPY .npmrc package*.json ./
COPY packages/main/package.json ./packages/main/
COPY packages/spark-flow/package.json ./packages/spark-flow/
COPY packages/spark-i18n/package.json ./packages/spark-i18n/

# Install dependencies (skip husky install — no .git in build context)
RUN npm install --ignore-scripts

# Copy source code
COPY . .

# Build spark-flow then main application
RUN npm run build:flow && BACK_END=${BACK_END} npm run build:app

# Stage 2: Serve with nginx
FROM nginx:alpine

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Copy built assets
COPY --from=builder /app/packages/main/dist /usr/share/nginx/html

# Copy nginx template and entrypoint
COPY nginx/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Runtime defaults — override with docker run -e
ENV BACKEND_SERVER=localhost:8080
ENV APP_BACK_END=java
ENV APP_DEFAULT_USERNAME=""
ENV APP_DEFAULT_PASSWORD=""

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
