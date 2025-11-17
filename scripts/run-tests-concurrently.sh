#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR=$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd -- "${SCRIPT_DIR}/.." && pwd)
cd "$REPO_ROOT" || exit 1

TOTAL_RUNS=${TOTAL_RUNS:-50}
THREADS=${THREADS:-5}
TMP_FAIL_FILE=$(mktemp -t run-search-tests.XXXXXX)
trap 'rm -f "$TMP_FAIL_FILE"' EXIT

if (( THREADS < 1 )); then
  echo "THREADS must be at least 1" >&2
  exit 1
fi

if (( TOTAL_RUNS < 1 )); then
  echo "TOTAL_RUNS must be at least 1" >&2
  exit 1
fi

run_command() {
  local run_index=$1
  shift
  local log_file
  log_file=$(mktemp -t run-search-tests-log.XXXXXX)

  echo "Run ${run_index}"

  if pnpm vitest "$@" >"$log_file" 2>&1; then
    sed "s/^/[Run ${run_index}] /" "$log_file"
  else
    {
      echo "Run ${run_index} failed";
      cat "$log_file";
    } >&2
    echo "${run_index}" >> "$TMP_FAIL_FILE"
  fi

  rm -f "$log_file"
}

export TMP_FAIL_FILE
export -f run_command
START_TIME=$(date +%s)

VITEST_ARGS=("$@")

seq 1 "$TOTAL_RUNS" | xargs -I {} -P "$THREADS" bash -c 'run_command "$@"' _ {} "${VITEST_ARGS[@]}"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [[ -s "$TMP_FAIL_FILE" ]]; then
  echo "" >&2
  echo "Failed runs:" >&2
  sort -n "$TMP_FAIL_FILE" | tr '\n' ' ' >&2
  echo >&2
  echo "Total time: ${DURATION}s" >&2
  exit 1
else
  echo ""
  echo "All ${TOTAL_RUNS} runs passed across ${THREADS} threads."
  echo "Total time: ${DURATION}s"
fi
