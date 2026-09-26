# syntax=docker/dockerfile:1.7-labs

# e2e: contains the Playwright test runner
FROM mcr.microsoft.com/playwright:v1.63.0-resolute AS e2e

WORKDIR /work

COPY package.json .
RUN npm install --global corepack && corepack enable && corepack install

COPY --parents pnpm-workspace.yaml pnpm-lock.yaml e2e/package.json .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter e2e

COPY --parents e2e/playwright.config.ts .

WORKDIR /work/e2e

# proxy: Runs the fake e2e backend
FROM node:26.8-slim AS fakeserver

WORKDIR /work

COPY --parents package.json pnpm-installer .
ENV PNPM_HOME=/pnpm PATH="/pnpm/bin:$PATH"
RUN npm ci --prefix=pnpm-installer && env \
    ENV="$HOME/.shrc" \
    SHELL=/bin/sh \
    PNPM_VERSION=$(node -p '/@([^\+]+)\+/.exec(require("./package.json").packageManager)[1]') \
    node pnpm-installer/node_modules/.bin/get-pnpm

COPY --parents pnpm-workspace.yaml pnpm-lock.yaml e2e/package.json .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter e2e
COPY --parents e2e/src .

# server: Runs the Astro dev server
FROM node:26.8-slim AS server

WORKDIR /work

COPY --parents package.json pnpm-installer .
ENV PNPM_HOME=/pnpm PATH="/pnpm/bin:$PATH"
RUN npm ci --prefix=pnpm-installer && env \
    ENV="$HOME/.shrc" \
    SHELL=/bin/sh \
    PNPM_VERSION=$(node -p '/@([^\+]+)\+/.exec(require("./package.json").packageManager)[1]') \
    node pnpm-installer/node_modules/.bin/get-pnpm

COPY --parents pnpm-workspace.yaml pnpm-lock.yaml e2e/package.json .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter "!e2e"

COPY --parents content public src project.inlang project.json astro.config.ts tsconfig.json .

ENV MODE=e2e BUILD_OUTPUT=server
RUN pnpm build --mode $MODE
