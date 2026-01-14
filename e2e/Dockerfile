FROM mcr.microsoft.com/playwright:v1.57.0-jammy

WORKDIR /work

RUN corepack enable && corepack prepare pnpm@9.4.0 --activate

COPY pnpm-workspace.yaml ./
COPY e2e/package.json ./e2e/

RUN pnpm install --filter e2e --force

COPY e2e/ ./e2e/

WORKDIR /work/e2e

RUN mkdir -p .playwright/test-results .playwright/report \
  && chmod -R a+rwX .playwright

CMD ["pnpm", "test"]
