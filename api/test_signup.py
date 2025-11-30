from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class SignupAPITest(TestCase):
    """Test signup endpoint"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_signup_success(self):
        """Test successful signup"""
        response = self.client.post('/api/auth/complete-signup/', {
            'email': 'newuser@test.com',
            'password': 'testpass123'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'verification_sent')
        
        # Verify user was created
        user = User.objects.get(email='newuser@test.com')
        self.assertEqual(user.username, 'newuser@test.com')
        self.assertFalse(user.is_active)  # Should be inactive until verified
        self.assertTrue(user.has_usable_password())
    
    def test_signup_duplicate_email(self):
        """Test signup with duplicate email"""
        # Create first user
        User.objects.create_user(
            username='existing@test.com',
            email='existing@test.com',
            password='pass123'
        )
        
        # Try to create duplicate
        response = self.client.post('/api/auth/complete-signup/', {
            'email': 'existing@test.com',
            'password': 'newpass123'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already exists', response.data['error'])
    
    def test_signup_missing_fields(self):
        """Test signup with missing fields"""
        response = self.client.post('/api/auth/complete-signup/', {
            'email': 'test@test.com'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('required', response.data['error'])
    
    def test_signup_short_password(self):
        """Test signup with short password"""
        response = self.client.post('/api/auth/complete-signup/', {
            'email': 'test@test.com',
            'password': 'short'
        }, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('8 characters', response.data['error'])
