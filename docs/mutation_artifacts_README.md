# Mutation Testing Artifacts

This project includes a PowerShell helper `mutation_test.ps1` to run mutation tests (via `mutmut`) and bundle results into a single artifact directory.

## Outputs
- JSON: `mutation_summary.json` – machine-readable summary
- CSV: `mutation_summary.csv` – appended history of runs
- HTML: `mutation_summary.html` – human-friendly report

All files are written into `-Dir` (default: `mutation_artifacts/`).

## Usage (PowerShell)
```
# Default: write to mutation_artifacts/ and print summary
./mutation_test.ps1

# Enforce threshold (exit 1 if below 80%) and open reports
./mutation_test.ps1 -Threshold 80 -Strict -Open

# Custom artifact directory and file names
./mutation_test.ps1 -Dir artifacts/mutation -Output summary.json -Csv history.csv -Html report.html -Open
```

## CI
A GitHub Actions workflow `.github/workflows/mutation-testing.yml` runs tests and a focused mutation pass on `transactions/services.py`, uploads `coverage.xml` and `mutation_summary.json`, and enforces a baseline kill-rate threshold. Adjust `KILL_RATE_MIN` in the workflow if needed.
