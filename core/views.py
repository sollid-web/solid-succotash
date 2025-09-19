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
from .forms import InvestmentForm, WithdrawalForm, DepositForm


class HomeView(TemplateView):
    template_name = 'core/home.html'


class PlansView(TemplateView):
    template_name = 'core/plans.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            context['plans'] = InvestmentPlan.objects.all().order_by('min_amount')
        except Exception as e:
            # Handle case where database is not properly seeded
            context['plans'] = []
            context['error'] = "Investment plans are currently being loaded. Please try again in a moment."
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
    
    def dispatch(self, request, *args, **kwargs):
        # Redirect admin users to admin panel instead of dashboard
        if request.user.is_authenticated:
            profile = getattr(request.user, 'profile', None)
            if profile and profile.role == 'admin' or request.user.is_staff:
                messages.info(request, "Admin accounts are redirected to the administration panel.")
                return redirect('/admin/')
        return super().dispatch(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        try:
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
            
            # Get crypto wallets for deposits
            from transactions.models import CryptocurrencyWallet
            crypto_wallets = CryptocurrencyWallet.objects.filter(is_active=True).order_by('currency')
            
            context.update({
                'wallet': wallet,
                'investments': investments,
                'transactions': transactions,
                'total_invested': total_invested,
                'active_investments': active_investments,
                'investment_form': InvestmentForm(user=user),
                'deposit_form': DepositForm(),
                'crypto_wallets': crypto_wallets,
            })
        except Exception as e:
            # Handle database errors gracefully
            context.update({
                'wallet': None,
                'investments': [],
                'transactions': [],
                'total_invested': 0,
                'active_investments': 0,
                'crypto_wallets': [],
                'error': "Dashboard is currently loading. Please try again in a moment."
            })
        return context


class InvestView(LoginRequiredMixin, View):
    login_url = '/accounts/login/'
    
    def post(self, request):
        form = InvestmentForm(request.POST, user=request.user)
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


class DepositView(LoginRequiredMixin, View):
    login_url = '/accounts/login/'
    
    def post(self, request):
        form = DepositForm(request.POST)
        if form.is_valid():
            try:
                # Get wallet address for crypto deposits
                wallet_address_used = ''
                if form.cleaned_data['payment_method'] in ['BTC', 'USDT', 'USDC', 'ETH']:
                    from transactions.models import CryptocurrencyWallet
                    try:
                        crypto_wallet = CryptocurrencyWallet.objects.get(
                            currency=form.cleaned_data['payment_method'],
                            is_active=True
                        )
                        wallet_address_used = crypto_wallet.wallet_address
                    except CryptocurrencyWallet.DoesNotExist:
                        messages.error(request, f"{form.cleaned_data['payment_method']} deposits are currently unavailable.")
                        return redirect('dashboard')
                
                transaction = create_transaction(
                    user=request.user,
                    tx_type='deposit',
                    amount=form.cleaned_data['amount'],
                    reference=form.cleaned_data['reference'],
                    payment_method=form.cleaned_data['payment_method'],
                    tx_hash=form.cleaned_data.get('tx_hash', ''),
                    wallet_address_used=wallet_address_used
                )
                
                if form.cleaned_data['payment_method'] == 'bank_transfer':
                    messages.success(
                        request,
                        f"Bank transfer deposit request submitted! Reference: {transaction.id}. "
                        f"Your funds will be available after admin approval."
                    )
                else:
                    messages.success(
                        request,
                        f"{form.cleaned_data['payment_method']} deposit request submitted! Reference: {transaction.id}. "
                        f"Your funds will be available after transaction confirmation and admin approval."
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
        
        try:
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
        except Exception as e:
            # Handle database errors gracefully
            context.update({
                'withdrawals': [],
                'wallet': None,
                'withdrawal_form': WithdrawalForm(),
                'error': "Withdrawals page is currently loading. Please try again in a moment."
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
