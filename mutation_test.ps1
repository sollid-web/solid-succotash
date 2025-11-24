Param(
    [string]$Target = "transactions/services.py",
    [int]$Threshold = 70,
    [switch]$Strict,                         # If provided, fail when kill rate < threshold
    [string]$Output = "mutation_summary.json",      # JSON summary filename (placed in -Dir if relative)
    [switch]$Open,                           # Auto-open summary files after run (JSON + HTML)
    [string]$Csv = "mutation_summary.csv",           # CSV summary filename (placed in -Dir if relative)
    [string]$Html = "mutation_summary.html",         # HTML summary filename (placed in -Dir if relative)
    [string]$Dir = "mutation_artifacts"              # Artifact directory for outputs
)

# Ensure artifact directory exists and normalize output paths if user passed relative names
if (-not (Test-Path $Dir)) { New-Item -ItemType Directory -Path $Dir | Out-Null }
function Normalize-ArtifactPath {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace([IO.Path]::GetDirectoryName($Path))) {
        return (Join-Path $Dir $Path)
    }
    return $Path
}
$Output = Normalize-ArtifactPath $Output
$Csv    = Normalize-ArtifactPath $Csv
$Html   = Normalize-ArtifactPath $Html

Write-Host "Running mutation testing on $Target (threshold=$Threshold%)" -ForegroundColor Cyan
Write-Host "Artifacts directory: $Dir" -ForegroundColor DarkCyan

# Execute mutation run; tolerate failures to allow parsing attempt
mutmut run --paths-to-mutate $Target --backup --tests-dir api 2>$null

Write-Host "Mutation results summary:" -ForegroundColor Cyan
$results = mutmut results 2>$null
if (-not $results) {
    Write-Warning "No mutation results available (mutmut may have failed)."
    $Killed = 0
    $Survived = 0
} else {
    $Killed = 0
    $Survived = 0
    foreach ($line in $results) {
        if ($line -match 'KILLED\s+(\d+)') { $Killed = [int]$Matches[1] }
        elseif ($line -match 'SURVIVED\s+(\d+)') { $Survived = [int]$Matches[1] }
    }
}

$Total = $Killed + $Survived
if ($Total -gt 0) {
    $KillRate = [math]::Round(($Killed / $Total) * 100, 2)
} else {
    $KillRate = 0
}

Write-Host "Killed: $Killed" -ForegroundColor Green
Write-Host "Survived: $Survived" -ForegroundColor Yellow
Write-Host "Kill Rate: $KillRate%" -ForegroundColor Cyan

# Persist JSON summary
$summary = [pscustomobject]@{
    target    = $Target
    killed    = $Killed
    survived  = $Survived
    killRate  = $KillRate
    threshold = $Threshold
    strict    = $Strict.IsPresent
    timestamp = (Get-Date).ToString('o')
}
try {
    $summary | ConvertTo-Json -Depth 3 | Set-Content -Encoding UTF8 $Output
    Write-Host "Summary written to $Output" -ForegroundColor Cyan
} catch {
    Write-Warning "Failed to write summary JSON: $_"
}

# Write CSV (append). Create header if file does not exist.
try {
    $csvHeaders = 'timestamp,target,killed,survived,killRate,threshold,strict'
    $row = ('{0},{1},{2},{3},{4},{5},{6}' -f $summary.timestamp,$summary.target,$summary.killed,$summary.survived,$summary.killRate,$summary.threshold,$summary.strict)
    if (-not (Test-Path $Csv)) { $csvHeaders | Out-File -FilePath $Csv -Encoding UTF8 }
    $row | Out-File -FilePath $Csv -Append -Encoding UTF8
    Write-Host "CSV appended to $Csv" -ForegroundColor Cyan
} catch {
    Write-Warning "Failed to write CSV: $_"
}

# Write HTML summary
try {
        $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Mutation Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 1.5rem; background:#fafafa; }
        h1 { font-size: 1.25rem; margin-bottom: 0.75rem; }
        table { border-collapse: collapse; width: 480px; }
        th, td { border:1px solid #ddd; padding:6px 10px; text-align:left; }
        th { background:#222; color:#fff; }
        tr:nth-child(even){background:#f2f2f2;}
        .ok { color: #0a7c28; font-weight:600; }
        .fail { color: #b30000; font-weight:600; }
    </style>
</head>
<body>
    <h1>Mutation Testing Summary</h1>
    <table>
        <tr><th>Field</th><th>Value</th></tr>
        <tr><td>Target</td><td>${Target}</td></tr>
        <tr><td>Killed</td><td>${Killed}</td></tr>
        <tr><td>Survived</td><td>${Survived}</td></tr>
        <tr><td>Kill Rate</td><td>${KillRate}%</td></tr>
        <tr><td>Threshold</td><td>${Threshold}%</td></tr>
        <tr><td>Strict Mode</td><td>${$Strict.IsPresent}</td></tr>
        <tr><td>Timestamp</td><td>${summary.timestamp}</td></tr>
        <tr><td>Status</td><td>$(if($KillRate -ge $Threshold){'<span class="ok">PASS</span>'}else{'<span class="fail">FAIL</span>'})</td></tr>
    </table>
</body>
</html>
"@
        $html | Set-Content -Encoding UTF8 $Html
        Write-Host "HTML summary written to $Html" -ForegroundColor Cyan
} catch {
        Write-Warning "Failed to write HTML summary: $_"
}

if ($Strict) {
    if ($KillRate -lt $Threshold) {
        Write-Host "Kill rate ($KillRate%) below threshold ($Threshold%). Failing." -ForegroundColor Red
        exit 1
    } else {
        Write-Host "Kill rate ($KillRate%) meets threshold ($Threshold%)." -ForegroundColor Green
    }
}

Write-Host "Done." -ForegroundColor Cyan

if ($Open) {
    foreach ($f in @($Output, $Html)) {
        if (Test-Path $f) {
            try {
                Start-Process $f | Out-Null
                Write-Host "Opened $f" -ForegroundColor Cyan
            } catch {
                Write-Warning "Could not open $f: $_"
            }
        } else {
            Write-Warning "File not found to open: $f"
        }
    }
}