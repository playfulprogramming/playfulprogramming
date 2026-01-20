# E2E tests 

## Running tests

These tests run against the web service started by Docker Compose.

- Run tests: `pnpm test`
- Update snapshots: `pnpm test:update-snapshots`

If you'd like to pass extra args to playwright, set the `PLAYWRIGHT_ARGS` environment variable

```
PLAYWRIGHT_ARGS="--update-snapshots" pnpm test
```

## Git LFS

Due to large snapshot images (2MB+), this project uses gitlfs, so make sure to install it if you need to run e2e tests

https://git-lfs.com/

### Installation

#### Winget
```powershell
winget install GitHub.GitLFS
git lfs install
```

#### Brew
```
brew install git-lfs
git lfs install
```

#### Debian
```
sudo apt install git-lfs
git lfs install
```
