# Build frontend from repository root (PowerShell)
param(
    [switch]$Install
)

Write-Host "[Frontend Build] Starting..." -ForegroundColor Cyan

if ($Install) {
    Write-Host "[Frontend Build] Installing dependencies..." -ForegroundColor Cyan
    npm --prefix frontend install || exit 1
}

Write-Host "[Frontend Build] Running production build..." -ForegroundColor Cyan
npm --prefix frontend run build || exit 1

Write-Host "[Frontend Build] Build complete." -ForegroundColor Green