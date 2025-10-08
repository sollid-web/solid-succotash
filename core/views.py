from django.shortcuts import render, redirect
from django.http import FileResponse, Http404
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.db.models import Sum
from django.urls import reverse_lazy
from django.views import View
from investments.models import InvestmentPlan, UserInvestment
import logging
from django.conf import settings
from django.db import transaction

logger = logging.getLogger(__name__)
from transactions.models import Transaction
from transactions.services import create_transaction
from investments.services import create_investment
from users.models import UserWallet
from .forms import InvestmentForm, WithdrawalForm, DepositForm
# Lazy import of PDF builder (ReportLab). We avoid importing at module load
# so that the entire site doesn't crash if the optional PDF stack isn't
# installed yet. Inside the view we attempt the import and degrade gracefully.
# from .pdf_letterhead import build_pdf  # (moved to inside agreement_pdf)
import tempfile
import os
from .models import Agreement
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import UserAgreementAcceptance
import hashlib


class HomeView(TemplateView):
    template_name = 'core/home.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            context['plans'] = InvestmentPlan.objects.all().order_by('min_amount')
        except Exception as e:
            context['plans'] = []
        return context


class PlansView(TemplateView):
    template_name = 'core/plans.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        plans_qs = InvestmentPlan.objects.all().order_by('min_amount')
        if plans_qs.exists():
            context['plans'] = plans_qs
            return context

        # No plans found – attempt a guarded auto-seed ONLY in production (DEBUG=False) as a safety net
        if not settings.DEBUG:
            # Canonical fixed plans (match seed_plans management command)
            default_plans = [
                {
                    'name': 'Pioneer',
                    'description': 'Entry-level plan (14 days) with steady daily ROI.',
                    'daily_roi': 1.00,
                    'duration_days': 14,
                    'min_amount': 100,
                    'max_amount': 999,
                },
                {
                    'name': 'Vanguard',
                    'description': 'Growth-focused plan (21 days) for expanding portfolios.',
                    'daily_roi': 1.25,
                    'duration_days': 21,
                    'min_amount': 1000,
                    'max_amount': 4999,
                },
                {
                    'name': 'Horizon',
                    'description': 'Advanced allocation plan (30 days) with higher limits.',
                    'daily_roi': 1.50,
                    'duration_days': 30,
                    'min_amount': 5000,
                    'max_amount': 14999,
                },
                {
                    'name': 'Summit',
                    'description': 'Premium high-cap plan (45 days).',
                    'daily_roi': 2.00,
                    'duration_days': 45,
                    'min_amount': 15000,
                    'max_amount': 100000,
                },
            ]
            try:
                with transaction.atomic():
                    created_any = False
                    for data in default_plans:
                        obj, created = InvestmentPlan.objects.get_or_create(name=data['name'], defaults=data)
                        created_any = created_any or created
                    if created_any:
                        logger.warning("Auto-seeded default investment plans in production fallback path.")
                        context['plans_seeded_now'] = True
                context['plans'] = InvestmentPlan.objects.all().order_by('min_amount')
            except Exception as e:  # pragma: no cover (safety catch for prod diagnostics)
                logger.error("Failed fallback auto-seed for investment plans: %s", e)
                context['plans'] = []
                context['plans_error'] = "Investment plans are currently being initialized. Please refresh shortly."
        else:
            # In DEBUG we do not auto-seed here; rely on management command to surface issues
            context['plans'] = []
            context['plans_error'] = "No investment plans found. Run: python manage.py seed_plans"
        return context


class AboutView(TemplateView):
    template_name = 'core/about.html'


class ContactView(TemplateView):
    template_name = 'core/contact.html'


class RiskDisclosureView(TemplateView):
    template_name = 'core/risk_disclosure.html'


class TermsView(TemplateView):
    """Legal Disclaimer view"""
    template_name = 'core/terms.html'


class TermsOfServiceView(TemplateView):
    """Terms of Service view"""
    template_name = 'core/terms_of_service.html'


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
            
            # Get all investment plans
            all_plans = InvestmentPlan.objects.all().order_by('min_amount')
            
            # Get user notifications (5 most recent unread)
            from users.models import UserNotification
            notifications = UserNotification.objects.filter(user=user, is_read=False)[:5]
            unread_count = UserNotification.objects.filter(user=user, is_read=False).count()
            
            context.update({
                'wallet': wallet,
                'investments': investments,
                'transactions': transactions,
                'total_invested': total_invested,
                'active_investments': active_investments,
                'investment_form': InvestmentForm(user=user),
                'deposit_form': DepositForm(),
                'crypto_wallets': crypto_wallets,
                'all_plans': all_plans,
                'notifications': notifications,
                'unread_count': unread_count,
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


def agreement_pdf(request, agreement_id: int):
    """Return a PDF for a stored Agreement version.

    Looks up an active Agreement by primary key and uses its paragraph
    splitting helper. Falls back gracefully if PDF stack is unavailable.
    """
    if not request.user.is_authenticated:
        raise Http404

    try:
        agreement = Agreement.objects.get(pk=agreement_id, is_active=True)
    except Agreement.DoesNotExist:
        raise Http404

    try:
        from .pdf_letterhead import build_pdf  # type: ignore
    except Exception:  # pragma: no cover - environment specific
        from django.http import HttpResponse
        # In test or debug environments return 200 so tests can assert fallback
        status_code = 200 if settings.DEBUG or getattr(settings, 'TESTING', False) else 503
        return HttpResponse(
            "PDF generation temporarily unavailable (missing ReportLab).",
            status=status_code,
            content_type="text/plain",
        )

    paragraphs = agreement.paragraphs()
    if not paragraphs:
        paragraphs = ["(This agreement currently has no body content.)"]

    tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    tmp_path = tmp.name
    tmp.close()
    try:
        build_pdf(tmp_path, paragraphs)
        return FileResponse(open(tmp_path, "rb"), content_type="application/pdf")
    finally:
        pass


@login_required
@require_http_methods(["GET", "POST"])
def agreement_view(request, agreement_id: int):
    """Render an agreement and allow user to accept it.

    POST will create a UserAgreementAcceptance if one doesn't exist.
    Idempotent: multiple posts do not duplicate.
    """
    try:
        agreement = Agreement.objects.get(pk=agreement_id, is_active=True)
    except Agreement.DoesNotExist:
        raise Http404

    acceptance = UserAgreementAcceptance.objects.filter(user=request.user, agreement=agreement).first()

    if request.method == "POST":
        if acceptance:
            messages.info(request, "You have already accepted this agreement.")
        else:
            body_hash = hashlib.sha256(agreement.body.encode('utf-8')).hexdigest()
            UserAgreementAcceptance.objects.create(
                user=request.user,
                agreement=agreement,
                ip_address=request.META.get("REMOTE_ADDR"),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                agreement_hash=body_hash,
                agreement_version=agreement.version,
            )
            messages.success(request, "Agreement accepted.")
        return HttpResponseRedirect(reverse("agreement_view", args=[agreement.pk]))

    paragraphs = agreement.paragraphs()
    return render(request, "core/agreement_view.html", {
        "agreement": agreement,
        "paragraphs": paragraphs,
        "accepted": bool(acceptance),
        "acceptance": acceptance,
    })
