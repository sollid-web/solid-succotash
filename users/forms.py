"""
Email preferences form for users
"""

from django import forms

from .models import Profile


class EmailPreferencesForm(forms.ModelForm):
    """Form for managing user email preferences"""

    class Meta:
        model = Profile
        fields = [
            'email_notifications_enabled',
            'email_welcome',
            'email_transactions',
            'email_investments',
            'email_roi_payouts',
            'email_wallet_updates',
            'email_security_alerts',
            'email_marketing',
        ]

        labels = {
            'email_notifications_enabled': 'Enable Email Notifications',
            'email_welcome': 'Welcome Messages',
            'email_transactions': 'Transaction Updates',
            'email_investments': 'Investment Updates',
            'email_roi_payouts': 'ROI Payout Notifications',
            'email_wallet_updates': 'Wallet Updates',
            'email_security_alerts': 'Security Alerts',
            'email_marketing': 'Marketing & Promotions',
        }

        help_texts = {
            'email_notifications_enabled': 'Master toggle to enable or disable all email notifications',
            'email_welcome': 'Receive welcome emails when you join or reach milestones',
            'email_transactions': 'Get notified about deposits, withdrawals, and transaction status updates',
            'email_investments': 'Receive updates about your investments, approvals, and completions',
            'email_roi_payouts': 'Get notified when you receive daily ROI payouts',
            'email_wallet_updates': 'Receive notifications when your wallet balance changes',
            'email_security_alerts': 'Important security notifications (highly recommended)',
            'email_marketing': 'Receive promotional emails about new features and special offers',
        }

        widgets = {
            'email_notifications_enabled': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
                'id': 'email_master_toggle'
            }),
            'email_welcome': forms.CheckboxInput(attrs={'class': 'form-check-input email-option'}),
            'email_transactions': forms.CheckboxInput(attrs={'class': 'form-check-input email-option'}),
            'email_investments': forms.CheckboxInput(attrs={'class': 'form-check-input email-option'}),
            'email_roi_payouts': forms.CheckboxInput(attrs={'class': 'form-check-input email-option'}),
            'email_wallet_updates': forms.CheckboxInput(attrs={'class': 'form-check-input email-option'}),
            'email_security_alerts': forms.CheckboxInput(attrs={'class': 'form-check-input email-option'}),
            'email_marketing': forms.CheckboxInput(attrs={'class': 'form-check-input email-option'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Add Bootstrap classes to all fields
        for _field_name, field in self.fields.items():
            if isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs.update({
                    'class': field.widget.attrs.get('class', '') + ' form-check-input'
                })

    def clean(self):
        cleaned_data = super().clean()

        # If master toggle is disabled, warn about security alerts
        if not cleaned_data.get('email_notifications_enabled') and cleaned_data.get('email_security_alerts', True):
            # Force security alerts to be disabled if master toggle is off
            cleaned_data['email_security_alerts'] = False

        return cleaned_data
