#!/usr/bin/env bash
set -euo pipefail

echo "Running mutation testing (transactions/services.py)..."
mutmut run --paths-to-mutate transactions/services.py --backup --tests-dir api
echo "Mutation results summary:"
mutmut results