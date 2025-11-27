from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0005_incomingemail_emailattachment"),
    ]

    operations = [
        migrations.CreateModel(
            name="PlatformCertificate",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(default="Certificate of Operation", max_length=255)),
                ("certificate_id", models.CharField(max_length=64, unique=True)),
                ("issue_date", models.DateField(default=django.utils.timezone.now)),
                ("jurisdiction", models.CharField(default="United States", max_length=255)),
                ("issuing_authority", models.CharField(help_text="Name of the issuing authority", max_length=255)),
                ("verification_url", models.URLField(blank=True, max_length=500)),
                ("authority_seal_url", models.URLField(blank=True, max_length=500)),
                ("signature_1_url", models.URLField(blank=True, max_length=500)),
                ("signature_2_url", models.URLField(blank=True, max_length=500)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
