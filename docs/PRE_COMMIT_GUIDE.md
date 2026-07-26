# Pre-commit Hooks Setup Guide

## What is pre-commit?

Pre-commit automatically runs checks (linting, formatting, type checking) before each `git commit` to catch issues early and enforce code quality standards.

## Installation

1. **Install pre-commit hooks** (one-time setup):
   ```bash
   pip install -r requirements-dev.txt
   pre-commit install
   ```

2. **Verify installation**:
   ```bash
   pre-commit --version
   ```

## Usage

### Automatic (Recommended)
Once installed, pre-commit runs automatically on `git commit`. If checks fail, the commit is blocked until you fix the issues.

### Manual
Run checks on all files without committing:
```bash
pre-commit run --all-files
```

Run checks on specific files:
```bash
pre-commit run --files core/views.py transactions/services.py
```

### Skip hooks (emergency only)
```bash
git commit --no-verify -m "Emergency fix"
```

## What gets checked?

1. **Basic hygiene** (pre-commit-hooks):
   - Trailing whitespace removal
   - End-of-file fixer
   - YAML/JSON validation
   - Large file detection (>500KB)
   - Merge conflict markers

2. **Linting (Ruff)**:
   - Undefined names, unused imports (F)
   - Code style errors (E, W)
   - Import sorting (I)
   - Bug patterns (B)
   - Modern Python idioms (UP)

3. **Formatting (Black)**:
   - Consistent code formatting (100 char line length)

4. **Type checking (mypy)**:
   - Type hints validation (critical modules only)

## Updating hooks

```bash
pre-commit autoupdate
```

## Troubleshooting

**Hook installation failed?**
```bash
pre-commit uninstall
pre-commit install
```

**Slow on large commits?**
Use `--no-verify` for emergency commits, then run `pre-commit run --all-files` separately.

**False positives?**
Add ignores to `pyproject.toml` under `[tool.ruff.lint.per-file-ignores]`.
