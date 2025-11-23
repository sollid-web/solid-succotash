from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_profile_email_investments_profile_email_marketing_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="KycApplication",
            fields=[
                ("id", models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ("status", models.CharField(choices=[("draft", "Draft"), ("pending", "Pending Review"), ("approved", "Approved"), ("rejected", "Rejected")], default="draft", max_length=20)),
                ("personal_info", models.JSONField(blank=True, default=dict)),
                ("document_info", models.JSONField(blank=True, default=dict)),
                ("personal_info_submitted_at", models.DateTimeField(blank=True, null=True)),
                ("document_submitted_at", models.DateTimeField(blank=True, null=True)),
                ("last_submitted_at", models.DateTimeField(blank=True, null=True)),
                ("reviewed_at", models.DateTimeField(blank=True, null=True)),
                ("reviewer_notes", models.TextField(blank=True)),
                ("rejection_reason", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(default=django.utils.timezone.now)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("reviewed_by", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name="reviewed_kyc_applications", to=settings.AUTH_USER_MODEL)),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="kyc_applications", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "db_table": "users_kyc_application",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="kycapplication",
            index=models.Index(fields=["status"], name="users_kyc__status_3603a3_idx"),
        ),
        migrations.AddIndex(
            model_name="kycapplication",
            index=models.Index(fields=["user", "status"], name="users_kyc__user_id_e79dbf_idx"),
        ),
        migrations.AlterField(
            model_name="usernotification",
            name="notification_type",
            field=models.CharField(choices=[("deposit_approved", "Deposit Approved"), ("deposit_rejected", "Deposit Rejected"), ("withdrawal_approved", "Withdrawal Approved"), ("withdrawal_rejected", "Withdrawal Rejected"), ("investment_approved", "Investment Approved"), ("investment_rejected", "Investment Rejected"), ("investment_completed", "Investment Completed"), ("card_approved", "Virtual Card Approved"), ("card_rejected", "Virtual Card Rejected"), ("wallet_credited", "Wallet Credited"), ("wallet_debited", "Wallet Debited"), ("roi_payout", "ROI Payout"), ("system_alert", "System Alert"), ("welcome", "Welcome Message"), ("kyc_submitted", "KYC Submitted"), ("kyc_approved", "KYC Approved"), ("kyc_rejected", "KYC Rejected")], max_length=30),
        ),
    ]
