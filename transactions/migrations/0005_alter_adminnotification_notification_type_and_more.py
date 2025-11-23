from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("transactions", "0004_seed_company_crypto_wallets"),
    ]

    operations = [
        migrations.AlterField(
            model_name="adminnotification",
            name="notification_type",
            field=models.CharField(choices=[("new_deposit", "New Deposit Request"), ("new_withdrawal", "New Withdrawal Request"), ("new_investment", "New Investment Request"), ("new_card_request", "New Virtual Card Request"), ("user_registration", "New User Registration"), ("new_kyc", "New KYC Submission")], max_length=30),
        ),
        migrations.AlterField(
            model_name="adminauditlog",
            name="entity",
            field=models.CharField(choices=[("transaction", "Transaction"), ("investment", "Investment"), ("plan", "Plan"), ("user", "User"), ("kyc", "KYC Application")], max_length=20),
        ),
    ]
