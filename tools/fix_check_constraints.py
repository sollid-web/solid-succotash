#!/usr/bin/env python3
"""
Fix CheckConstraint type annotations in model files.
Removes incorrect 'check: models.Q =' syntax and replaces with 'check='
Creates backups: <file>.bak before modifying.
Usage: python tools/fix_check_constraints.py
"""

import re
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODEL_FILES = [
    PROJECT_ROOT / "investments" / "models.py",
    PROJECT_ROOT / "core" / "models.py",
    PROJECT_ROOT / "users" / "models.py",
]

def fix_check_constraints(filepath: Path) -> bool:
    """Fix incorrect type annotations in CheckConstraint parameters."""
    if not filepath.exists():
        print(f"❌ File not found: {filepath}")
        return False

    # Read file
    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Pattern: check: models.Q = models.Q(...) -> check=models.Q(...)
    # This pattern matches the incorrectly annotated check parameter
    content = re.sub(
        r'(\s+)check:\s*models\.Q\s*=\s*(models\.Q\()',
        r'\1check=\2',
        content
    )

    # Also fix any other incorrectly annotated Meta parameters
    content = re.sub(
        r'(\s+)(name|verbose_name|ordering):\s*models\.(\w+)\s*=\s*models\.\3\(',
        r'\1\2=models.\3(',
        content
    )

    if content != original_content:
        # Create backup
        backup_path = filepath.with_suffix('.py.bak')
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
        print(f"📦 Created backup: {backup_path}")

        # Write fixed content
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed: {filepath}")
        return True
    else:
        print(f"✓ No changes needed: {filepath}")
        return False

def main():
    print("="*70)
    print("Fixing CheckConstraint Type Annotations")
    print("="*70)

    fixed_count = 0
    for filepath in MODEL_FILES:
        print(f"\nProcessing: {filepath.relative_to(PROJECT_ROOT)}")
        if fix_check_constraints(filepath):
            fixed_count += 1

    print("\n" + "="*70)
    if fixed_count > 0:
        print(f"✅ Fixed {fixed_count} file(s)")
        print("\n💡 Run 'python -m ruff check .' to verify the fixes")
    else:
        print("✓ All files are already correct")
    print("="*70)

if __name__ == "__main__":
    main()
