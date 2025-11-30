from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_rename_users_kyc__status_3603a3_idx_users_kyc_a_status_cebdd4_idx_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailVerification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=64, unique=True)),
                ('expires_at', models.DateTimeField()),
                ('used_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='email_verifications', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddIndex(
            model_name='emailverification',
            index=models.Index(fields=['user', 'expires_at'], name='email_verif_user_exp_idx'),
        ),
        migrations.AddIndex(
            model_name='emailverification',
            index=models.Index(fields=['token'], name='email_verif_token_idx'),
        ),
    ]
