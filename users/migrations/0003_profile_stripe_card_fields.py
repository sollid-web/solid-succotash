# Generated migration for Stripe Virtual Card fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_kycdocument'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='stripe_cardholder_id',
            field=models.CharField(blank=True, help_text='Stripe Cardholder ID', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='stripe_card_id',
            field=models.CharField(blank=True, help_text='Stripe Virtual Card ID', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='card_last4',
            field=models.CharField(blank=True, help_text='Last 4 digits of card', max_length=4, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='card_exp_month',
            field=models.CharField(blank=True, help_text='Card expiration month', max_length=2, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='card_exp_year',
            field=models.CharField(blank=True, help_text='Card expiration year', max_length=4, null=True),
        ),
        migrations.AddField(
            model_name='profile',
            name='is_card_frozen',
            field=models.BooleanField(default=False, help_text='Whether virtual card is frozen'),
        ),
    ]
