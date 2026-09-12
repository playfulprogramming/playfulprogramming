# syntax=docker/dockerfile:1.7-labs
ARG BUILD_OUTPUT=static

FROM node:24-alpine3.23 AS builder

# Create app directory
WORKDIR /var/app

# Prepare pnpm according to the root package.json
COPY package.json .
RUN corepack enable
RUN corepack install

# Install dependencies with pnpm
COPY pnpm-lock.yaml .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter "!e2e"

# Copy and build the app
COPY --parents assets content public src project.inlang astro.config.ts tsconfig.json .env .

# Define build arguments
ARG GIT_COMMIT_REF
ARG PUBLIC_CLOUDINARY_CLOUD_NAME
ARG SITE_URL
ARG MODE=production
ARG BUILD_OUTPUT

RUN --mount=type=secret,id=GITHUB_TOKEN \
	--mount=type=secret,id=HOOF_AUTH_TOKEN \
	GITHUB_TOKEN=$(cat /run/secrets/GITHUB_TOKEN) \
	HOOF_AUTH_TOKEN=$(cat /run/secrets/HOOF_AUTH_TOKEN) \
	GIT_COMMIT_REF=$GIT_COMMIT_REF \
	PUBLIC_CLOUDINARY_CLOUD_NAME=$PUBLIC_CLOUDINARY_CLOUD_NAME \
	SITE_URL=$SITE_URL \
	BUILD_OUTPUT=$BUILD_OUTPUT \
	ASTRO_TELEMETRY_DISABLED=1 \
	pnpm build --mode $MODE

FROM nginx:1.29.1-alpine3.22-slim AS runtime-static

# Copy the project nginx configuration
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy output HTML from the builder
COPY --from=builder /var/app/dist /usr/share/nginx/html
# Test the nginx config to make sure it works
RUN nginx -t

FROM node:24-alpine3.23 AS runtime-server

WORKDIR /var/app

ARG MODE=production
ARG SITE_URL
ARG GIT_COMMIT_REF
ARG PUBLIC_CLOUDINARY_CLOUD_NAME

ENV NODE_ENV=production \
	HOST=0.0.0.0 \
	PORT=80 \
	MODE=$MODE \
	SITE_URL=$SITE_URL \
	GIT_COMMIT_REF=$GIT_COMMIT_REF \
	PUBLIC_CLOUDINARY_CLOUD_NAME=$PUBLIC_CLOUDINARY_CLOUD_NAME \
	ASTRO_TELEMETRY_DISABLED=1

COPY --from=builder /var/app/dist ./dist
COPY --from=builder /var/app/package.json ./package.json
# Markdown rendering reads source files and compiles Shiki workers at runtime.
# Keep devDependencies too: they include the renderer, esbuild, and Shiki.
COPY --from=builder /var/app/node_modules ./node_modules
COPY --from=builder /var/app/content ./content
COPY --from=builder /var/app/public ./public
COPY --from=builder /var/app/src ./src
COPY --from=builder /var/app/assets ./assets

EXPOSE 80
CMD ["node", "dist/server/entry.mjs"]

# One switch selects both Astro's output and the matching runtime image.
FROM runtime-${BUILD_OUTPUT} AS runtime
