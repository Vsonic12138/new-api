#!/usr/bin/env bash

set -euo pipefail

# Official release builds use the exact tag. Custom builds derive their
# display version from the latest reachable official tag and add build metadata.
mode=${1:-custom}

if [[ "$mode" == "official" ]]; then
  if [[ "${GITHUB_REF:-}" == refs/tags/* ]]; then
    printf '%s\n' "${GITHUB_REF#refs/tags/}"
  else
    git describe --tags --match 'v[0-9]*' --abbrev=0
  fi
  exit 0
fi

base_tag=$(git describe --tags --match 'v[0-9]*' --abbrev=0 2>/dev/null || true)
if [[ -z "$base_tag" ]]; then
  printf '%s\n' 'v0.0.0+custom'
  exit 0
fi

printf '%s+custom\n' "${base_tag%%+*}"
