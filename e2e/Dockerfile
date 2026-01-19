FROM mcr.microsoft.com/playwright:v1.57.0-jammy AS e2e

WORKDIR /work

ENV COREPACK_HOME=/usr/local/share/corepack

RUN corepack enable && \
  corepack install && \
  chmod -R 755 $COREPACK_HOME || chmod -R 755 /root/.cache/node/corepack 2>/dev/null || true

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY e2e/package.json ./e2e/

RUN pnpm install --filter e2e --force

COPY e2e/ ./e2e/

WORKDIR /work/e2e

RUN mkdir -p .playwright/test-results .playwright/report \
  && chmod -R a+rwX .playwright


FROM node:22 AS server

WORKDIR /work

ENV COREPACK_HOME=/usr/local/share/corepack

RUN corepack enable && \
  corepack install && \
  chmod -R 755 $COREPACK_HOME || chmod -R 755 /root/.cache/node/corepack 2>/dev/null || true

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY e2e/package.json ./e2e/

RUN pnpm install --filter playfulprogramming-site --force

RUN pnpm --exec astro preferences disable --global devToolbar
