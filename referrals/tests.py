from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from transactions.models import Transaction

from .models import Referral, ReferralCode, ReferralReward, ReferralSetting
from .services import create_manual_referral_reward, create_referral_if_code
from .tasks import process_deposit_referral

User = get_user_model()


class ReferralCodeModelTest(TestCase):
    """Test ReferralCode model"""

    def setUp(self):
        self.user = User.objects.create_user(
            username='referrer',
            email='referrer@test.com',
            password='testpass123'
        )

    def test_code_generation(self):
        """Test automatic code generation"""
        code = ReferralCode.objects.create(user=self.user)
        self.assertIsNotNone(code.code)
        self.assertEqual(len(code.code), 8)
        self.assertTrue(code.code.isupper())

    def test_one_code_per_user(self):
        """Test one-to-one relationship"""
        ReferralCode.objects.create(user=self.user)
        with self.assertRaises(Exception):
            ReferralCode.objects.create(user=self.user)

    def test_code_uniqueness(self):
        """Test codes are unique"""
        user2 = User.objects.create_user(
            username='user2',
            email='user2@test.com',
            password='testpass123'
        )
        code1 = ReferralCode.objects.create(user=self.user)
        code2 = ReferralCode.objects.create(user=user2)
        self.assertNotEqual(code1.code, code2.code)


class ReferralModelTest(TestCase):
    """Test Referral model"""

    def setUp(self):
        self.referrer = User.objects.create_user(
            username='referrer',
            email='referrer@test.com',
            password='testpass123'
        )
        self.referred = User.objects.create_user(
            username='referred',
            email='referred@test.com',
            password='testpass123'
        )
        self.code = ReferralCode.objects.create(user=self.referrer)

    def test_referral_creation(self):
        """Test creating referral record"""
        referral = Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )
        self.assertEqual(referral.status, Referral.STATUS_PENDING)
        self.assertFalse(referral.reward_processed)

    def test_mark_credited(self):
        """Test marking referral as credited"""
        referral = Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )
        referral.mark_credited()
        referral.refresh_from_db()

        self.assertEqual(referral.status, Referral.STATUS_CREDITED)
        self.assertTrue(referral.reward_processed)
        self.assertIsNotNone(referral.reward_processed_at)


class ReferralServiceTest(TestCase):
    """Test referral service layer functions"""

    def setUp(self):
        self.referrer = User.objects.create_user(
            username='referrer',
            email='referrer@test.com',
            password='testpass123'
        )
        self.referred = User.objects.create_user(
            username='referred',
            email='referred@test.com',
            password='testpass123'
        )
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='testpass123'
        )
        self.code = ReferralCode.objects.create(user=self.referrer)

    def test_create_referral_if_code_success(self):
        """Test successful referral creation"""
        referral = create_referral_if_code(
            self.referred,
            self.code.code,
            meta={'ip': '127.0.0.1'}
        )
        self.assertIsNotNone(referral)
        self.assertEqual(referral.referrer, self.referrer)
        self.assertEqual(referral.referred_user, self.referred)

    def test_create_referral_invalid_code(self):
        """Test referral with invalid code"""
        referral = create_referral_if_code(
            self.referred,
            'INVALID1',
            meta={'ip': '127.0.0.1'}
        )
        self.assertIsNone(referral)

    def test_prevent_self_referral(self):
        """Test self-referral prevention"""
        referral = create_referral_if_code(
            self.referrer,
            self.code.code
        )
        self.assertIsNone(referral)

    def test_prevent_duplicate_referral(self):
        """Test duplicate referral prevention"""
        create_referral_if_code(self.referred, self.code.code)
        duplicate = create_referral_if_code(self.referred, self.code.code)
        self.assertIsNone(duplicate)

    def test_create_manual_reward(self):
        """Test admin manual reward creation"""
        referral = Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )

        reward, txn = create_manual_referral_reward(
            referral=referral,
            amount=Decimal('50.00'),
            currency='USD',
            admin_user=self.admin,
            notes='Test manual reward'
        )

        self.assertEqual(reward.amount, Decimal('50.00'))
        self.assertEqual(reward.created_by, self.admin)
        self.assertFalse(reward.approved)
        self.assertEqual(txn.user, self.referrer)
        self.assertEqual(txn.status, 'pending')


class ProcessDepositReferralTest(TestCase):
    """Test deposit referral processing"""

    def setUp(self):
        self.referrer = User.objects.create_user(
            username='referrer',
            email='referrer@test.com',
            password='testpass123'
        )
        self.referred = User.objects.create_user(
            username='referred',
            email='referred@test.com',
            password='testpass123'
        )
        self.code = ReferralCode.objects.create(user=self.referrer)

        # Seed referral settings
        ReferralSetting.objects.create(
            key='deposit_reward',
            value={
                "percent": 2.5,
                "enabled": True,
                "apply_once": True,
                "min_deposit": 10,
                "max_reward_amount": 100
            }
        )

    def test_process_deposit_referral_success(self):
        """Test successful deposit referral processing"""
        # Create pending referral
        referral = Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )

        result = process_deposit_referral(
            referred_user_id=self.referred.id,
            deposit_amount=Decimal('100.00'),
            currency='USD'
        )

        self.assertTrue(result['ok'])
        self.assertEqual(Decimal(result['reward_amount']), Decimal('2.50'))

        # Verify referral marked as credited
        referral.refresh_from_db()
        self.assertTrue(referral.reward_processed)
        self.assertEqual(referral.status, Referral.STATUS_CREDITED)

        # Verify reward created
        reward = ReferralReward.objects.get(referral=referral)
        self.assertEqual(reward.amount, Decimal('2.50'))
        self.assertEqual(reward.reward_type, ReferralReward.TYPE_DEPOSIT)
        self.assertFalse(reward.approved)

        # Verify transaction created
        txn = Transaction.objects.get(id=result['transaction_id'])
        self.assertEqual(txn.user, self.referrer)
        self.assertEqual(txn.amount, Decimal('2.50'))
        self.assertEqual(txn.status, 'pending')

    def test_process_deposit_below_minimum(self):
        """Test deposit below minimum threshold"""
        Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )

        result = process_deposit_referral(
            referred_user_id=self.referred.id,
            deposit_amount=Decimal('5.00')
        )

        self.assertFalse(result['ok'])
        self.assertEqual(result['reason'], 'deposit_below_minimum')

    def test_process_deposit_with_cap(self):
        """Test reward amount capping"""
        Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )

        # Deposit that would exceed cap (2.5% of 5000 = 125, cap is 100)
        result = process_deposit_referral(
            referred_user_id=self.referred.id,
            deposit_amount=Decimal('5000.00')
        )

        self.assertTrue(result['ok'])
        self.assertEqual(Decimal(result['reward_amount']), Decimal('100.00'))

    def test_no_pending_referral(self):
        """Test processing when no referral exists"""
        result = process_deposit_referral(
            referred_user_id=self.referred.id,
            deposit_amount=Decimal('100.00')
        )

        self.assertFalse(result['ok'])
        self.assertEqual(result['reason'], 'no_pending_referral')

    def test_rewards_disabled(self):
        """Test processing when rewards are disabled"""
        ReferralSetting.objects.filter(key='deposit_reward').update(
            value={
                "percent": 2.5,
                "enabled": False,
                "apply_once": True,
                "min_deposit": 10
            }
        )

        Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )

        result = process_deposit_referral(
            referred_user_id=self.referred.id,
            deposit_amount=Decimal('100.00')
        )

        self.assertFalse(result['ok'])
        self.assertEqual(result['reason'], 'deposit_rewards_disabled')

    def test_already_processed_referral(self):
        """Test processing already credited referral"""
        referral = Referral.objects.create(
            referred_user=self.referred,
            referrer=self.referrer,
            code=self.code.code
        )
        referral.mark_credited()

        result = process_deposit_referral(
            referred_user_id=self.referred.id,
            deposit_amount=Decimal('100.00')
        )

        self.assertFalse(result['ok'])
        self.assertEqual(result['reason'], 'no_pending_referral')


class ReferralSettingTest(TestCase):
    """Test ReferralSetting model"""

    def test_setting_get_existing(self):
        """Test retrieving existing setting"""
        ReferralSetting.objects.create(
            key='test_setting',
            value={'enabled': True}
        )

        value = ReferralSetting.get('test_setting')
        self.assertEqual(value, {'enabled': True})

    def test_setting_get_default(self):
        """Test retrieving with default value"""
        value = ReferralSetting.get(
            'nonexistent',
            default={'enabled': False}
        )
        self.assertEqual(value, {'enabled': False})

    def test_setting_get_none(self):
        """Test retrieving nonexistent without default"""
        value = ReferralSetting.get('nonexistent')
        self.assertIsNone(value)
