# E2E tests Quick start

These tests run against the web service started by Docker Compose.

- Run tests: `pnpm test`
- Update snapshots: `pnpm test:update-snapshots`

If you'd like to pass extra args to playwright, set the `PLAYWRIGHT_ARGS` environment variable

```
PLAYWRIGHT_ARGS="--update-snapshots" pnpm test
```

