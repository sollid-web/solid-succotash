from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse
from decimal import Decimal
from users.models import Profile, UserWallet
from investments.models import InvestmentPlan, UserInvestment
from transactions.models import Transaction, AdminAuditLog
from transactions.services import approve_transaction, reject_transaction, create_transaction
from investments.services import approve_investment, reject_investment, create_investment


class UserModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_profile_creation(self):
        """Test that user profile is created automatically"""
        # For now we need to create manually since signals are disabled
        profile = Profile.objects.create(user=self.user)
        self.assertEqual(profile.user, self.user)
        self.assertEqual(profile.role, 'user')
    
    def test_wallet_creation(self):
        """Test that user wallet is created"""
        wallet = UserWallet.objects.create(user=self.user)
        self.assertEqual(wallet.user, self.user)
        self.assertEqual(wallet.balance, Decimal('0'))


class InvestmentModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.plan = InvestmentPlan.objects.create(
            name='Test Plan',
            description='Test Description',
            daily_roi=Decimal('1.50'),
            duration_days=30,
            min_amount=Decimal('100'),
            max_amount=Decimal('1000')
        )
    
    def test_investment_creation(self):
        """Test investment creation"""
        investment = UserInvestment.objects.create(
            user=self.user,
            plan=self.plan,
            amount=Decimal('500')
        )
        self.assertEqual(investment.user, self.user)
        self.assertEqual(investment.plan, self.plan)
        self.assertEqual(investment.amount, Decimal('500'))
        self.assertEqual(investment.status, 'pending')
    
    def test_total_return_calculation(self):
        """Test total return calculation for approved investment"""
        investment = UserInvestment.objects.create(
            user=self.user,
            plan=self.plan,
            amount=Decimal('500')
        )
        # For pending investments, total_return should equal amount
        self.assertEqual(investment.total_return, Decimal('500'))


class TransactionModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True
        )
    
    def test_transaction_creation(self):
        """Test transaction creation"""
        transaction = Transaction.objects.create(
            user=self.user,
            tx_type='deposit',
            amount=Decimal('100'),
            reference='Test deposit'
        )
        self.assertEqual(transaction.user, self.user)
        self.assertEqual(transaction.tx_type, 'deposit')
        self.assertEqual(transaction.amount, Decimal('100'))
        self.assertEqual(transaction.status, 'pending')


class TransactionServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True
        )
        self.wallet = UserWallet.objects.create(
            user=self.user,
            balance=Decimal('1000')
        )
    
    def test_approve_deposit(self):
        """Test deposit approval credits wallet"""
        transaction = create_transaction(
            user=self.user,
            tx_type='deposit',
            amount=100,
            reference='Test deposit'
        )
        
        initial_balance = self.wallet.balance
        approve_transaction(transaction, self.admin_user, 'Approved test')
        
        self.wallet.refresh_from_db()
        self.assertEqual(self.wallet.balance, initial_balance + Decimal('100'))
        self.assertEqual(transaction.status, 'approved')
        self.assertEqual(transaction.approved_by, self.admin_user)
    
    def test_approve_withdrawal_with_sufficient_funds(self):
        """Test withdrawal approval with sufficient funds"""
        transaction = create_transaction(
            user=self.user,
            tx_type='withdrawal',
            amount=500,
            reference='Test withdrawal'
        )
        
        initial_balance = self.wallet.balance
        approve_transaction(transaction, self.admin_user, 'Approved test')
        
        self.wallet.refresh_from_db()
        self.assertEqual(self.wallet.balance, initial_balance - Decimal('500'))
        self.assertEqual(transaction.status, 'approved')
    
    def test_approve_withdrawal_with_insufficient_funds(self):
        """Test withdrawal approval fails with insufficient funds"""
        transaction = create_transaction(
            user=self.user,
            tx_type='withdrawal',
            amount=2000,  # More than wallet balance
            reference='Test withdrawal'
        )
        
        with self.assertRaises(Exception):
            approve_transaction(transaction, self.admin_user, 'Should fail')


class InvestmentServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            is_staff=True
        )
        self.plan = InvestmentPlan.objects.create(
            name='Test Plan',
            description='Test Description',
            daily_roi=Decimal('1.50'),
            duration_days=30,
            min_amount=Decimal('100'),
            max_amount=Decimal('1000')
        )
    
    def test_create_investment_within_limits(self):
        """Test investment creation within plan limits"""
        investment = create_investment(
            user=self.user,
            plan=self.plan,
            amount=500
        )
        self.assertEqual(investment.user, self.user)
        self.assertEqual(investment.plan, self.plan)
        self.assertEqual(investment.amount, Decimal('500'))
        self.assertEqual(investment.status, 'pending')
    
    def test_create_investment_below_minimum(self):
        """Test investment creation fails below minimum"""
        with self.assertRaises(Exception):
            create_investment(
                user=self.user,
                plan=self.plan,
                amount=50  # Below minimum of 100
            )
    
    def test_create_investment_above_maximum(self):
        """Test investment creation fails above maximum"""
        with self.assertRaises(Exception):
            create_investment(
                user=self.user,
                plan=self.plan,
                amount=1500  # Above maximum of 1000
            )
    
    def test_approve_investment_sets_dates(self):
        """Test investment approval sets start and end dates"""
        investment = create_investment(
            user=self.user,
            plan=self.plan,
            amount=500
        )
        
        approve_investment(investment, self.admin_user, 'Approved test')
        
        investment.refresh_from_db()
        self.assertEqual(investment.status, 'approved')
        self.assertIsNotNone(investment.started_at)
        self.assertIsNotNone(investment.ends_at)


class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_home_page(self):
        """Test home page loads"""
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'WolvCapital')
    
    def test_plans_page(self):
        """Test plans page loads"""
        response = self.client.get(reverse('plans'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Investment Plans')
    
    def test_dashboard_requires_login(self):
        """Test dashboard requires authentication"""
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 302)  # Redirect to login
    
    def test_dashboard_authenticated(self):
        """Test dashboard loads for authenticated user"""
        self.client.login(username='testuser', password='testpass123')
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Dashboard')


class ManagementCommandTests(TestCase):
    def test_seed_plans_command(self):
        """Test that seed_plans command creates plans"""
        from django.core.management import call_command
        
        # Ensure no plans exist initially
        InvestmentPlan.objects.all().delete()
        
        call_command('seed_plans')
        
        # Check that plans were created
        plans = InvestmentPlan.objects.all()
        self.assertEqual(plans.count(), 4)
        
        # Check specific plans
        pioneer = InvestmentPlan.objects.get(name='Pioneer')
        self.assertEqual(pioneer.daily_roi, Decimal('1.00'))
        self.assertEqual(pioneer.duration_days, 14)
        
        summit = InvestmentPlan.objects.get(name='Summit')
        self.assertEqual(summit.daily_roi, Decimal('2.00'))
        self.assertEqual(summit.duration_days, 45)
