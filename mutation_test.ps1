Param(
    [string]$Target = "transactions/services.py"
)
Write-Host "Running mutation testing on $Target" -ForegroundColor Cyan
mutmut run --paths-to-mutate $Target --backup --tests-dir api
Write-Host "Mutation results summary:" -ForegroundColor Cyan
mutmut results