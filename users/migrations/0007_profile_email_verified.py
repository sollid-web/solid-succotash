from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_email_verification'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='email_verified',
            field=models.BooleanField(default=False, help_text='Email address verified via code'),
        ),
    ]
