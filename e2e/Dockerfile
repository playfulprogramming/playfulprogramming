# syntax=docker/dockerfile:1.7-labs

# e2e: contains the Playwright test runner
FROM mcr.microsoft.com/playwright:v1.58.0-jammy AS e2e

WORKDIR /work

COPY package.json .
RUN corepack enable && corepack install

COPY --parents pnpm-workspace.yaml pnpm-lock.yaml e2e/package.json .

RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter e2e

COPY --parents e2e/playwright.config.ts .

WORKDIR /work/e2e

# server: Runs the Astro dev server
FROM node:22-slim AS server

WORKDIR /work

# Install rust
RUN apt-get update && apt-get install build-essential ca-certificates curl -y --no-install-recommends
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH=/root/.cargo/bin:$PATH

# Prepare pnpm according to the root package.json
COPY package.json .
RUN corepack enable && corepack install

# Install dependencies with pnpm
COPY --parents pnpm-workspace.yaml pnpm-lock.yaml */package.json .
RUN --mount=type=cache,target=/root/.local/share/pnpm/store,sharing=locked pnpm install --filter "!e2e"

# Copy and build the native addon
COPY --parents native/Cargo.toml native/Cargo.lock native/src .
RUN RUSTFLAGS="-C target-feature=-crt-static" pnpm --filter native build
COPY --parents native/index.ts .
COPY public/fonts/Figtree/Figtree-Regular.ttf /usr/share/fonts/truetype/figtree/Figtree-Regular.ttf

RUN pnpm --exec astro preferences disable --global devToolbar

COPY --parents assets content e2e public src astro.config.ts tsconfig.json .env .
