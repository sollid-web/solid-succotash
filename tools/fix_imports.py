#!/usr/bin/env python3
"""
Fix missing imports in specified files by inserting safe import blocks.
Creates backups: <file>.bak before modifying.
Usage: python tools/fix_imports.py
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
FILES_TO_PATCH = [
    PROJECT_ROOT / "core" / "management" / "commands" / "send_test_email.py",
    PROJECT_ROOT / "core" / "tests_email_simple.py",
]

# imports we expect to add (module path -> list of names or module)
# If an entry maps to a name equal to the module (e.g. "decimal.Decimal"), we import the name.
IMPORT_BLOCK = [
    ("core.services.email_service", ["EmailService"]),
    ("django.contrib.auth.models", ["User"]),
    ("decimal", ["Decimal"]),
    ("transactions.models", ["Transaction"]),
    ("investments.models", ["InvestmentPlan", "UserInvestment"]),
]

HEADER_COMMENT = (
    "# --- Added by tools/fix_imports.py: missing imports detected by ruff ---\n"
)

def file_contains_any_import(text: str, module: str, name: str) -> bool:
    # crude but effective checks to avoid duplicates
    patterns = [
        f"from {module} import {name}",
        f"import {module}",
        f"from {module} import {name},",
        f"from {module} import ({name}",
    ]
    for p in patterns:
        if p in text:
            return True
    return False

def build_import_lines(existing_text: str):
    lines = []
    for module, names in IMPORT_BLOCK:
        for name in names:
            if not file_contains_any_import(existing_text, module, name):
                # if module == name or module == "decimal" we prefer "from module import name"
                # otherwise use "from module import Name"
                lines.append(f"from {module} import {name}\n")
    return lines

def patch_file(path: Path) -> bool:
    if not path.exists():
        print(f"[SKIP] file not found: {path}")
        return False

    text = path.read_text(encoding="utf8")
    import_lines = build_import_lines(text)

    if not import_lines:
        print(f"[OK] No missing imports to add in {path.name}")
        return False

    # create backup
    bak = path.with_suffix(path.suffix + ".bak")
    bak.write_text(text, encoding="utf8")
    print(f"[BACKUP] Created {bak.relative_to(PROJECT_ROOT)}")

    # find insertion point: after module docstring if present, otherwise at top
    insertion_index = 0
    stripped = text.lstrip()
    leading_ws_len = len(text) - len(stripped)
    # detect module-level docstring
    if stripped.startswith(('"""', "'''")):
        # find end of docstring
        quote = stripped[:3]
        end_idx = stripped.find(quote, 3)
        if end_idx != -1:
            # move index to after docstring (including newline)
            insertion_index = leading_ws_len + end_idx + 3
            # consume following newline characters
            while insertion_index < len(text) and text[insertion_index] in ("\r", "\n"):
                insertion_index += 1

    # construct new text
    block = HEADER_COMMENT + "".join(import_lines) + "\n"
    new_text = text[:insertion_index] + block + text[insertion_index:]

    path.write_text(new_text, encoding="utf8")
    print(f"[PATCHED] Inserted {len(import_lines)} import(s) into {path.relative_to(PROJECT_ROOT)}")
    return True

def main():
    changed = 0
    for p in FILES_TO_PATCH:
        try:
            if patch_file(p):
                changed += 1
        except Exception as e:
            print(f"[ERROR] Failed to patch {p}: {e}", file=sys.stderr)

    print(f"\nDone. Files patched: {changed}/{len(FILES_TO_PATCH)}")
    print("Next steps:")
    print("  1) Activate your venv and run: python -m ruff check .")
    print("  2) If ruff is clean, run: python -m mypy (install mypy in venv if needed).")
    return 0

if __name__ == '__main__':
    sys.exit(main())
