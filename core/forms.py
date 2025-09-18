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