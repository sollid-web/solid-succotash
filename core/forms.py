from django import forms
from investments.models import InvestmentPlan
from django.core.validators import MinValueValidator


class InvestmentForm(forms.Form):
    plan = forms.ModelChoiceField(
        queryset=InvestmentPlan.objects.all(),
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    amount = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter investment amount',
            'step': '0.01'
        })
    )
    
    def __init__(self, *args, user=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = user
    
    def clean(self):
        cleaned_data = super().clean()
        plan = cleaned_data.get('plan')
        amount = cleaned_data.get('amount')
        
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
        ('bank_transfer', 'Bank Transfer'),
        ('BTC', 'Bitcoin (BTC)'),
        ('USDT', 'Tether USD (USDT)'),
        ('USDC', 'USD Coin (USDC)'),
        ('ETH', 'Ethereum (ETH)'),
    ]
    
    payment_method = forms.ChoiceField(
        choices=PAYMENT_METHOD_CHOICES,
        widget=forms.Select(attrs={
            'class': 'form-control',
            'onchange': 'toggleCryptoFields(this.value)'
        }),
        initial='bank_transfer'
    )
    amount = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter deposit amount',
            'step': '0.01'
        })
    )
    reference = forms.CharField(
        max_length=500,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Enter payment reference, transaction ID, or proof of payment',
            'rows': 3
        }),
        help_text="For bank transfers: provide transaction reference. For crypto: provide transaction hash."
    )
    tx_hash = forms.CharField(
        max_length=255,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control crypto-field',
            'placeholder': 'Enter transaction hash (required for crypto deposits)',
            'style': 'display: none;'
        }),
        help_text="Required for cryptocurrency deposits"
    )
    
    def clean(self):
        cleaned_data = super().clean()
        payment_method = cleaned_data.get('payment_method')
        tx_hash = cleaned_data.get('tx_hash')
        
        # Require tx_hash for crypto payments
        if payment_method in ['BTC', 'USDT', 'USDC', 'ETH'] and not tx_hash:
            raise forms.ValidationError("Transaction hash is required for cryptocurrency deposits")
        
        return cleaned_data


class WithdrawalForm(forms.Form):
    amount = forms.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        widget=forms.NumberInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter withdrawal amount',
            'step': '0.01'
        })
    )
    reference = forms.CharField(
        max_length=500,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Enter withdrawal details (bank account, wallet address, etc.)',
            'rows': 3
        }),
        help_text="Provide your bank account details or wallet address for the withdrawal"
    )