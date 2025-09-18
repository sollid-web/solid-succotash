from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.db.models import Sum
from django.urls import reverse_lazy
from django.views import View
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction
from transactions.services import create_transaction
from investments.services import create_investment
from users.models import UserWallet
from .forms import InvestmentForm, WithdrawalForm


class HomeView(TemplateView):
    template_name = 'core/home.html'


class PlansView(TemplateView):
    template_name = 'core/plans.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['plans'] = InvestmentPlan.objects.all().order_by('min_amount')
        return context


class AboutView(TemplateView):
    template_name = 'core/about.html'


class ContactView(TemplateView):
    template_name = 'core/contact.html'


class RiskDisclosureView(TemplateView):
    template_name = 'core/risk_disclosure.html'


class TermsView(TemplateView):
    template_name = 'core/terms.html'


class PrivacyView(TemplateView):
    template_name = 'core/privacy.html'


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'core/dashboard.html'
    login_url = '/accounts/login/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Get or create wallet
        wallet, created = UserWallet.objects.get_or_create(user=user)
        
        # Get user investments
        investments = UserInvestment.objects.filter(user=user).select_related('plan')
        
        # Get recent transactions
        transactions = Transaction.objects.filter(user=user)[:10]
        
        # Calculate stats
        total_invested = investments.filter(status='approved').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        active_investments = investments.filter(status='approved').count()
        
        context.update({
            'wallet': wallet,
            'investments': investments,
            'transactions': transactions,
            'total_invested': total_invested,
            'active_investments': active_investments,
            'investment_form': InvestmentForm(),
        })
        return context


class InvestView(LoginRequiredMixin, View):
    login_url = '/accounts/login/'
    
    def post(self, request):
        form = InvestmentForm(request.POST)
        if form.is_valid():
            try:
                investment = create_investment(
                    user=request.user,
                    plan=form.cleaned_data['plan'],
                    amount=form.cleaned_data['amount']
                )
                messages.success(
                    request,
                    f"Investment request submitted successfully! Reference: {investment.id}"
                )
            except Exception as e:
                messages.error(request, str(e))
        else:
            for error in form.non_field_errors():
                messages.error(request, error)
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
        
        return redirect('dashboard')


class WithdrawalsView(LoginRequiredMixin, TemplateView):
    template_name = 'core/withdrawals.html'
    login_url = '/accounts/login/'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Get withdrawal history
        withdrawals = Transaction.objects.filter(
            user=user, 
            tx_type='withdrawal'
        ).order_by('-created_at')
        
        # Get wallet
        wallet, created = UserWallet.objects.get_or_create(user=user)
        
        context.update({
            'withdrawals': withdrawals,
            'wallet': wallet,
            'withdrawal_form': WithdrawalForm(),
        })
        return context


class WithdrawView(LoginRequiredMixin, View):
    login_url = '/accounts/login/'
    
    def post(self, request):
        form = WithdrawalForm(request.POST)
        if form.is_valid():
            try:
                # Check if user has sufficient balance
                wallet, created = UserWallet.objects.get_or_create(user=request.user)
                amount = form.cleaned_data['amount']
                
                if wallet.balance < amount:
                    messages.error(
                        request,
                        f"Insufficient funds. Your balance is ${wallet.balance}"
                    )
                else:
                    transaction = create_transaction(
                        user=request.user,
                        tx_type='withdrawal',
                        amount=amount,
                        reference=form.cleaned_data['reference']
                    )
                    messages.success(
                        request,
                        f"Withdrawal request submitted! Reference: {transaction.id}"
                    )
            except Exception as e:
                messages.error(request, str(e))
        else:
            for error in form.non_field_errors():
                messages.error(request, error)
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
        
        return redirect('withdrawals')
