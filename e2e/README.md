# E2E tests

## Quick start

Make sure to run the dev server with CI=true

- Docker (preferred):
  - Run tests: `pnpm docker:test`
- Local (non-Docker):
  - Run all tests: `pnpm test`
  - CI-style reporter: `pnpm test:ci`


## Additional options

### Non standard URL

If you'd like to run your web server on another URL than `localhost:4321`, set `PLAYWRIGHT_BASE_URL`

```
PLAYWRIGHT_BASE_URL="https://playfulprogramming.com/" pnpm --filter e2e docker:test
```

### Docker Playwright args

```
PLAYWRIGHT_ARGS="--update-snapshots" pnpm docker:test
```

