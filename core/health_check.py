"""
Health check utility for WolvCapital deployment debugging
"""

import os
import sys

from django.conf import settings
from django.db import connection


def check_environment():
    """Check environment variables"""
    print("=" * 60)
    print("🔍 ENVIRONMENT VARIABLES CHECK")
    print("=" * 60)

    required_vars = {
        "SECRET_KEY": os.getenv("SECRET_KEY", "NOT SET"),
        "DEBUG": os.getenv("DEBUG", "NOT SET"),
        "DATABASE_URL": os.getenv("DATABASE_URL", "NOT SET"),
        "RENDER_EXTERNAL_URL": os.getenv("RENDER_EXTERNAL_URL", "NOT SET"),
        "PORT": os.getenv("PORT", "NOT SET"),
    }

    for key, value in required_vars.items():
        status = "✅" if value != "NOT SET" else "❌"
        # Mask sensitive values
        if key in ["SECRET_KEY", "DATABASE_URL"] and value != "NOT SET":
            display_value = value[:10] + "..." + value[-5:]
        else:
            display_value = value
        print(f"{status} {key}: {display_value}")
    print()


def check_database():
    """Check database connectivity"""
    print("=" * 60)
    print("🔍 DATABASE CONNECTION CHECK")
    print("=" * 60)

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            print(f"✅ Database connected successfully")
            print(f"   PostgreSQL version: {version[:50]}...")
        return True
    except Exception as e:
        print(f"❌ Database connection failed")
        print(f"   Error: {str(e)}")
        return False
    print()


def check_settings():
    """Check Django settings"""
    print("=" * 60)
    print("🔍 DJANGO SETTINGS CHECK")
    print("=" * 60)

    try:
        print(f"✅ DEBUG: {settings.DEBUG}")
        print(f"✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
        print(f"✅ DATABASE ENGINE: {settings.DATABASES['default']['ENGINE']}")
        print(f"✅ STATIC_ROOT: {settings.STATIC_ROOT}")
        print(f"✅ CSRF_TRUSTED_ORIGINS: {settings.CSRF_TRUSTED_ORIGINS}")
        return True
    except Exception as e:
        print(f"❌ Settings check failed: {str(e)}")
        return False
    print()


def check_migrations():
    """Check if migrations are applied"""
    print("=" * 60)
    print("🔍 MIGRATIONS CHECK")
    print("=" * 60)

    try:
        from io import StringIO

        from django.core.management import call_command

        out = StringIO()
        call_command("showmigrations", "--list", stdout=out)
        output = out.getvalue()

        unapplied = [line for line in output.split("\n") if "[ ]" in line]

        if unapplied:
            print(f"⚠️  Found {len(unapplied)} unapplied migrations:")
            for migration in unapplied[:5]:  # Show first 5
                print(f"   {migration}")
            return False
        else:
            print("✅ All migrations are applied")
            return True
    except Exception as e:
        print(f"❌ Migration check failed: {str(e)}")
        return False
    print()


def check_apps():
    """Check if all apps can be imported"""
    print("=" * 60)
    print("🔍 APPS IMPORT CHECK")
    print("=" * 60)

    apps_to_check = [
        "core",
        "users",
        "investments",
        "transactions",
        "api",
    ]

    all_ok = True
    for app_name in apps_to_check:
        try:
            __import__(app_name)
            print(f"✅ {app_name}")
        except Exception as e:
            print(f"❌ {app_name}: {str(e)}")
            all_ok = False

    return all_ok
    print()


def run_full_check():
    """Run all health checks"""
    print("\n")
    print("🏥 WOLVCAPITAL HEALTH CHECK")
    print("=" * 60)
    print()

    checks = {
        "Environment Variables": check_environment,
        "Django Settings": check_settings,
        "Apps Import": check_apps,
        "Database Connection": check_database,
        "Migrations": check_migrations,
    }

    results = {}
    for name, check_func in checks.items():
        try:
            results[name] = check_func()
        except Exception as e:
            print(f"\n❌ {name} check crashed: {str(e)}\n")
            results[name] = False

    print("=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)

    for name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {name}")

    print("=" * 60)

    all_passed = all(results.values())
    if all_passed:
        print("🎉 All checks passed! Your app should be working.")
    else:
        print("⚠️  Some checks failed. Fix the issues above.")

    return all_passed


if __name__ == "__main__":
    # Setup Django
    import django

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wolvcapital.settings")
    django.setup()

    run_full_check()
