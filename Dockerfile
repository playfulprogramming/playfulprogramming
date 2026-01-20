# syntax=docker/dockerfile:1.7-labs
FROM node:22-alpine3.22 AS builder

# Create app directory
WORKDIR /var/app

# Prepare pnpm according to the root package.json
COPY package.json .
RUN corepack enable
RUN corepack install

# Install dependencies with pnpm
COPY pnpm-lock.yaml .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install

# Copy and build the app
COPY --parents assets content public src astro.config.ts tsconfig.json .env .

# Define build arguments
ARG GIT_COMMIT_REF
ARG PUBLIC_CLOUDINARY_CLOUD_NAME
ARG SITE_URL
ARG MODE=production

RUN --mount=type=secret,id=GITHUB_TOKEN \
	--mount=type=secret,id=HOOF_AUTH_TOKEN \
	GITHUB_TOKEN=$(cat /run/secrets/GITHUB_TOKEN) \
	HOOF_AUTH_TOKEN=$(cat /run/secrets/HOOF_AUTH_TOKEN) \
	GIT_COMMIT_REF=$GIT_COMMIT_REF \
	PUBLIC_CLOUDINARY_CLOUD_NAME=$PUBLIC_CLOUDINARY_CLOUD_NAME \
	SITE_URL=$SITE_URL \
	ASTRO_TELEMETRY_DISABLED=1 \
	pnpm build --mode $MODE

FROM nginx:1.29.1-alpine3.22-slim

# Copy the project nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy output HTML from the builder
COPY --from=builder /var/app/dist /usr/share/nginx/html
# Test the nginx config to make sure it works
RUN nginx -t
