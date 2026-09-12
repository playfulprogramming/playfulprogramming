# syntax=docker/dockerfile:1.7-labs

# e2e: contains the Playwright test runner
FROM mcr.microsoft.com/playwright:v1.63.0-resolute AS e2e

WORKDIR /work

COPY package.json .
RUN corepack enable && corepack install

COPY --parents pnpm-workspace.yaml pnpm-lock.yaml e2e/package.json packages/mdast-comment-components/package.json .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter e2e

COPY --parents e2e/playwright.config.ts .

WORKDIR /work/e2e

# proxy: Runs the fake e2e backend
FROM node:24-slim AS fakeserver

WORKDIR /work

COPY package.json .
RUN corepack enable && corepack install
COPY --parents pnpm-workspace.yaml pnpm-lock.yaml e2e/package.json packages/mdast-comment-components/package.json .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter e2e
COPY --parents e2e/src .

# server: Runs the Astro dev server
FROM node:24-slim AS server

WORKDIR /work

COPY package.json .
RUN corepack enable && corepack install

COPY --parents pnpm-workspace.yaml pnpm-lock.yaml e2e/package.json packages/mdast-comment-components/package.json .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter "!e2e"

COPY --parents content public src packages project.inlang astro.config.ts tsconfig.json .

ENV MODE=e2e BUILD_OUTPUT=server
RUN pnpm build --mode $MODE
