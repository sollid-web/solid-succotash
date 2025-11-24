#!/usr/bin/env bash
set -euo pipefail

echo "[Frontend Build] Starting..."

if [[ "${1:-}" == "--install" ]]; then
  echo "[Frontend Build] Installing dependencies..."
  npm --prefix frontend install
fi

echo "[Frontend Build] Running production build..."
npm --prefix frontend run build

echo "[Frontend Build] Build complete."