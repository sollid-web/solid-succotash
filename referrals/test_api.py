from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from .models import ReferralCode, Referral, ReferralSetting

User = get_user_model()


class ReferralAPITest(TestCase):
    """Test referral API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='user@test.com',
            password='testpass123'
        )
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='testpass123'
        )
    
    def test_generate_referral_code_authenticated(self):
        """Test generating referral code when authenticated"""
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/referrals/generate-code/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('code', response.data)
        self.assertTrue(response.data['created'])
    
    def test_generate_referral_code_idempotent(self):
        """Test generating code multiple times returns same code"""
        self.client.force_authenticate(user=self.user)
        
        response1 = self.client.post('/api/referrals/generate-code/')
        code1 = response1.data['code']
        
        response2 = self.client.post('/api/referrals/generate-code/')
        code2 = response2.data['code']
        
        self.assertEqual(code1, code2)
        self.assertFalse(response2.data['created'])
    
    def test_generate_code_unauthenticated(self):
        """Test generating code without authentication"""
        response = self.client.post('/api/referrals/generate-code/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_referral_dashboard(self):
        """Test referral dashboard endpoint"""
        self.client.force_authenticate(user=self.user)
        ReferralCode.objects.create(user=self.user, code='TEST1234')
        
        response = self.client.get('/api/referrals/dashboard/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['code'], 'TEST1234')
        self.assertIn('stats', response.data)
        self.assertEqual(response.data['stats']['total_referrals'], 0)
    
    def test_referral_dashboard_with_referrals(self):
        """Test dashboard with existing referrals"""
        self.client.force_authenticate(user=self.user)
        ReferralCode.objects.create(user=self.user)
        
        # Create some referrals
        referred1 = User.objects.create_user(
            username='ref1',
            email='ref1@test.com',
            password='testpass123'
        )
        referred2 = User.objects.create_user(
            username='ref2',
            email='ref2@test.com',
            password='testpass123'
        )
        
        Referral.objects.create(
            referred_user=referred1,
            referrer=self.user,
            code='TEST1234'
        )
        ref2 = Referral.objects.create(
            referred_user=referred2,
            referrer=self.user,
            code='TEST1234'
        )
        ref2.mark_credited()
        
        response = self.client.get('/api/referrals/dashboard/')
        
        self.assertEqual(response.data['stats']['total_referrals'], 2)
        self.assertEqual(response.data['stats']['pending'], 1)
        self.assertEqual(response.data['stats']['credited'], 1)
    
    def test_signup_hook_valid(self):
        """Test signup hook with valid data"""
        ReferralCode.objects.create(user=self.user, code='VALIDCODE')
        referred = User.objects.create_user(
            username='newuser',
            email='newuser@test.com',
            password='testpass123'
        )
        
        response = self.client.post('/api/referrals/signup-hook/', {
            'user_id': str(referred.id),
            'code': 'VALIDCODE',
            'meta': {'ip': '127.0.0.1'}
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['ok'])
        self.assertTrue(response.data['created'])
        self.assertIsNotNone(response.data['referral_id'])
    
    def test_signup_hook_invalid_code(self):
        """Test signup hook with invalid code"""
        referred = User.objects.create_user(
            username='newuser',
            email='newuser@test.com',
            password='testpass123'
        )
        
        response = self.client.post('/api/referrals/signup-hook/', {
            'user_id': str(referred.id),
            'code': 'INVALID1'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['ok'])
        self.assertFalse(response.data['created'])
    
    def test_signup_hook_missing_data(self):
        """Test signup hook with missing data"""
        response = self.client.post('/api/referrals/signup-hook/', {
            'code': 'TEST1234'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['ok'])
    
    def test_manual_reward_admin_only(self):
        """Test manual reward requires admin"""
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post('/api/referrals/manual-reward/', {
            'referral_id': 'test-id',
            'amount': '50.00'
        })
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_manual_reward_success(self):
        """Test admin creating manual reward"""
        self.client.force_authenticate(user=self.admin)
        
        referred = User.objects.create_user(
            username='newuser',
            email='newuser@test.com',
            password='testpass123'
        )
        referral = Referral.objects.create(
            referred_user=referred,
            referrer=self.user,
            code='TEST1234'
        )
        
        response = self.client.post('/api/referrals/manual-reward/', {
            'referral_id': str(referral.id),
            'amount': '50.00',
            'currency': 'USD',
            'notes': 'Test reward'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['ok'])
        self.assertIn('reward_id', response.data)
        self.assertIn('transaction_id', response.data)
        self.assertEqual(response.data['status'], 'pending_approval')
