#!/usr/bin/env python3
"""
WolvCapital Email System Automation Script

This script automates email system setup, testing, and deployment tasks.
"""

import os
import sys
import subprocess
import json
from pathlib import Path

# Add Django project to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wolvcapital.settings')

import django
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model
from core.email_utils import (
    send_test_email, send_welcome_email, send_marketing_email,
    send_support_email, send_admin_alert
)

User = get_user_model()


class EmailAutomation:
    """Automated email system management"""

    def __init__(self):
        self.results = {}
        self.test_email = "test@example.com"

    def check_configuration(self):
        """Check email configuration"""
        print("🔍 Checking Email Configuration...")

        config_checks = {
            'SendGrid API Key': bool(getattr(settings, 'SENDGRID_API_KEY', None)),
            'Default From Email': bool(getattr(settings, 'DEFAULT_FROM_EMAIL', None)),
            'Admin Email': bool(getattr(settings, 'ADMIN_EMAIL', None)),
            'Support Email': bool(getattr(settings, 'SUPPORT_EMAIL', None)),
            'Marketing Email': bool(getattr(settings, 'MARKETING_EMAIL', None)),
        }

        for check, status in config_checks.items():
            status_icon = "✅" if status else "❌"
            print(f"  {status_icon} {check}: {'Configured' if status else 'Missing'}")

        self.results['configuration'] = config_checks
        return all(config_checks.values())

    def test_all_email_functions(self):
        """Test all email functions"""
        print("\n📧 Testing Email Functions...")

        test_results = {}

        # Test basic email
        print("  Testing basic test email...")
        test_results['test_email'] = send_test_email(
            self.test_email,
            "Automated Test - Basic Email"
        )

        # Test welcome email
        print("  Testing welcome email...")
        test_results['welcome_email'] = send_welcome_email(
            self.test_email,
            "TestUser"
        )

        # Test marketing email
        print("  Testing marketing email...")
        test_results['marketing_email'] = send_marketing_email(
            self.test_email,
            "Automated Test - Marketing Campaign",
            "This is an automated test of the marketing email system.",
            "TestUser",
            "https://wolvcapital.com/test"
        )

        # Test support email
        print("  Testing support email...")
        test_results['support_email'] = send_support_email(
            self.test_email,
            "Automated Test - Support Response",
            "This is an automated test of the support email system.",
            "TestUser"
        )

        # Test admin alert
        print("  Testing admin alert...")
        test_results['admin_alert'] = send_admin_alert(
            "Automated System Test",
            "This is an automated test of the admin alert system."
        )

        # Display results
        print("\n📊 Email Test Results:")
        for test_name, result in test_results.items():
            status_icon = "✅" if result else "❌"
            print(f"  {status_icon} {test_name.replace('_', ' ').title()}: {'Success' if result else 'Failed'}")

        self.results['email_tests'] = test_results
        return all(test_results.values())

    def send_real_test_email(self, email_address):
        """Send real test email to specified address"""
        print(f"\n📮 Sending Real Test Email to {email_address}...")

        results = {}

        # Send welcome email
        print(f"  Sending welcome email to {email_address}...")
        results['welcome'] = send_welcome_email(email_address, "New User")

        # Send marketing email
        print(f"  Sending marketing email to {email_address}...")
        results['marketing'] = send_marketing_email(
            email_address,
            "🚀 Welcome to WolvCapital - Exclusive Offers Inside!",
            "Thank you for joining WolvCapital! As a new member, you have access to exclusive investment opportunities with competitive returns.",
            "New User",
            "https://wolvcapital.com/dashboard"
        )

        print("\n📧 Real Email Results:")
        for email_type, result in results.items():
            status_icon = "✅" if result else "❌"
            print(f"  {status_icon} {email_type.title()} Email: {'Sent Successfully' if result else 'Failed'}")

        return all(results.values())

    def generate_deployment_report(self):
        """Generate deployment readiness report"""
        print("\n📋 Generating Deployment Report...")

        report = {
            "timestamp": str(django.utils.timezone.now()),
            "configuration_status": self.results.get('configuration', {}),
            "email_test_results": self.results.get('email_tests', {}),
            "environment_variables": {
                "SENDGRID_API_KEY": "Configured" if getattr(settings, 'SENDGRID_API_KEY', None) else "Missing",
                "DEFAULT_FROM_EMAIL": getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not Set'),
                "ADMIN_EMAIL": getattr(settings, 'ADMIN_EMAIL', 'Not Set'),
                "SUPPORT_EMAIL": getattr(settings, 'SUPPORT_EMAIL', 'Not Set'),
                "MARKETING_EMAIL": getattr(settings, 'MARKETING_EMAIL', 'Not Set'),
            },
            "deployment_ready": self.is_deployment_ready()
        }

        # Save report
        report_file = project_root / "email_system_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"📄 Report saved to: {report_file}")
        return report

    def is_deployment_ready(self):
        """Check if system is ready for deployment"""
        config_ok = self.results.get('configuration', {})
        tests_ok = self.results.get('email_tests', {})

        return all(config_ok.values()) and all(tests_ok.values())

    def run_full_automation(self, test_email_address=None):
        """Run complete email automation suite"""
        print("🤖 Starting WolvCapital Email System Automation")
        print("=" * 50)

        # Step 1: Check configuration
        config_ok = self.check_configuration()

        if not config_ok:
            print("\n❌ Configuration check failed. Please fix missing configurations.")
            return False

        # Step 2: Test email functions
        tests_ok = self.test_all_email_functions()

        # Step 3: Send real test email if address provided
        if test_email_address:
            real_test_ok = self.send_real_test_email(test_email_address)
        else:
            real_test_ok = True
            print("\n📧 Skipping real email test (no email address provided)")

        # Step 4: Generate report
        report = self.generate_deployment_report()

        # Final status
        print("\n" + "=" * 50)
        if self.is_deployment_ready():
            print("✅ Email system is ready for deployment!")
            print("🚀 All tests passed. You can deploy to production.")
        else:
            print("❌ Email system has issues that need attention.")
            print("🔧 Please review the report and fix issues before deployment.")

        return self.is_deployment_ready()


def main():
    """Main automation script"""
    import argparse

    parser = argparse.ArgumentParser(description='WolvCapital Email System Automation')
    parser.add_argument('--test-email', help='Email address for real email testing')
    parser.add_argument('--config-only', action='store_true', help='Only check configuration')
    parser.add_argument('--quick-test', action='store_true', help='Run quick tests only')

    args = parser.parse_args()

    automation = EmailAutomation()

    if args.config_only:
        automation.check_configuration()
    elif args.quick_test:
        automation.check_configuration()
        automation.test_all_email_functions()
    else:
        automation.run_full_automation(args.test_email)


if __name__ == "__main__":
    main()
