from django import forms
from django.core.validators import MinValueValidator
from django.core.mail import send_mail
from django.conf import settings

from investments.models import InvestmentPlan
from .models import SupportRequest


class InvestmentForm(forms.Form):
    plan = forms.ModelChoiceField(
        queryset=InvestmentPlan.objects.all(),
        widget=forms.Select(attrs={"class": "form-select"}),
    )
    amount = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        widget=forms.NumberInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter investment amount",
                "step": "0.01",
            }
        ),
    )

    def __init__(self, *args, user=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super().clean()
        plan = cleaned_data.get("plan")
        amount = cleaned_data.get("amount")

        if plan and amount:
            if amount < plan.min_amount:
                raise forms.ValidationError(
                    f"Minimum investment for {plan.name} is ${plan.min_amount}"
                )
            if amount > plan.max_amount:
                raise forms.ValidationError(
                    f"Maximum investment for {plan.name} is ${plan.max_amount}"
                )

            # Check user balance if user is provided
            if self.user:
                from users.models import UserWallet

                wallet, created = UserWallet.objects.get_or_create(user=self.user)
                if wallet.balance < amount:
                    raise forms.ValidationError(
                        f"Insufficient balance. Your current balance is ${wallet.balance}. Please deposit funds first."
                    )

        return cleaned_data


class DepositForm(forms.Form):
    PAYMENT_METHOD_CHOICES = [
        ("bank_transfer", "Bank Transfer"),
        ("BTC", "Bitcoin (BTC)"),
        ("USDT", "Tether USD (USDT)"),
        ("USDC", "USD Coin (USDC)"),
        ("ETH", "Ethereum (ETH)"),
    ]

    payment_method = forms.ChoiceField(
        choices=PAYMENT_METHOD_CHOICES,
        widget=forms.Select(
            attrs={
                "class": "form-control",
                "onchange": "toggleCryptoFields(this.value)",
            }
        ),
        initial="bank_transfer",
    )
    amount = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        widget=forms.NumberInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter deposit amount",
                "step": "0.01",
            }
        ),
    )
    reference = forms.CharField(
        max_length=500,
        widget=forms.Textarea(
            attrs={
                "class": "form-control",
                "placeholder": "Enter payment reference, transaction ID, or proof of payment",
                "rows": 3,
            }
        ),
        help_text="For bank transfers: provide transaction reference. For crypto: provide transaction hash.",
    )
    tx_hash = forms.CharField(
        max_length=255,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "form-control crypto-field",
                "placeholder": "Enter transaction hash (required for crypto deposits)",
                "style": "display: none;",
            }
        ),
        help_text="Required for cryptocurrency deposits",
    )

    def clean(self):
        cleaned_data = super().clean()
        payment_method = cleaned_data.get("payment_method")
        tx_hash = cleaned_data.get("tx_hash")

        # Require tx_hash for crypto payments
        if payment_method in ["BTC", "USDT", "USDC", "ETH"] and not tx_hash:
            raise forms.ValidationError("Transaction hash is required for cryptocurrency deposits")

        return cleaned_data


class WithdrawalForm(forms.Form):
    amount = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        widget=forms.NumberInput(
            attrs={
                "class": "form-control",
                "placeholder": "Enter withdrawal amount",
                "step": "0.01",
            }
        ),
    )
    reference = forms.CharField(
        max_length=500,
        widget=forms.Textarea(
            attrs={
                "class": "form-control",
                "placeholder": "Enter withdrawal details (bank account, wallet address, etc.)",
                "rows": 3,
            }
        ),
        help_text="Provide your bank account details or wallet address for the withdrawal",
    )


class ContactForm(forms.ModelForm):
    """Contact/Support form for users to send messages to admins"""
    
    class Meta:
        model = SupportRequest
        fields = ['full_name', 'contact_email', 'topic', 'message']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'class': 'w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-600 transition',
                'placeholder': 'Your full name'
            }),
            'contact_email': forms.EmailInput(attrs={
                'class': 'w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-600 transition',
                'placeholder': 'your.email@example.com'
            }),
            'topic': forms.TextInput(attrs={
                'class': 'w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-600 transition',
                'placeholder': 'Subject of your message'
            }),
            'message': forms.Textarea(attrs={
                'class': 'w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-blue-600 transition',
                'placeholder': 'Type your message here...',
                'rows': 6
            }),
        }
        labels = {
            'full_name': 'Full Name',
            'contact_email': 'Email Address',
            'topic': 'Subject',
            'message': 'Message',
        }
    
    def save_and_notify(self, request=None, user=None):
        """Save message and send email notifications to all admin recipients"""
        instance = self.save(commit=False)
        
        # Attach user if authenticated
        if user and user.is_authenticated:
            instance.user = user
            if not instance.full_name:
                instance.full_name = user.get_full_name() or user.email
            if not instance.contact_email:
                instance.contact_email = user.email
        
        # Capture request metadata if available
        if request:
            instance.source_url = request.build_absolute_uri()
            # Get client IP
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                instance.ip_address = x_forwarded_for.split(',')[0]
            else:
                instance.ip_address = request.META.get('REMOTE_ADDR')
            instance.user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]
        
        instance.save()
        
        # Send email notification to all admin recipients
        admin_emails = getattr(settings, 'ADMIN_EMAIL_RECIPIENTS', [])
        if admin_emails:
            site_url = getattr(settings, 'SITE_URL', 'http://localhost:8000')
            
            email_body = f"""
New Support Message from WolvCapital Contact Form
{'=' * 60}

From: {instance.full_name} <{instance.contact_email}>
Subject: {instance.topic}
Status: {instance.get_status_display()}
Submitted: {instance.created_at.strftime('%Y-%m-%d %H:%M:%S')}

Message:
{instance.message}

{'=' * 60}
User Account: {instance.user.email if instance.user else 'Not logged in'}
IP Address: {instance.ip_address or 'N/A'}
Source: {instance.source_url or 'N/A'}

View in Admin Panel:
{site_url}/admin/core/supportrequest/{instance.id}/change/

Reply to: {instance.contact_email}
            """
            
            try:
                send_mail(
                    subject=f"[WolvCapital Support] {instance.topic}",
                    message=email_body.strip(),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=admin_emails,
                    fail_silently=False,
                )
            except Exception as e:
                # Log the error but don't fail the form submission
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to send contact form email: {e}")
        
        return instance
