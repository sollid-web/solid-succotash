"""
Integration tests for API endpoints
"""
import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from django.core.cache import cache

User = get_user_model()


@pytest.fixture
def api_client():
    """Fixture for API client"""
    return APIClient()


@pytest.fixture
def user(db):
    """Fixture for creating a test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """Fixture for authenticated API client"""
    token, _ = Token.objects.get_or_create(user=user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
    return api_client


@pytest.mark.django_db
class TestAuthenticationEndpoints:
    """Test authentication-related endpoints"""

    def test_login_success(self, api_client, user):
        """Test successful login"""
        url = reverse('api-login')
        data = {
            'email': user.email,  # API uses email, not username
            'password': 'testpass123'
        }
        response = api_client.post(url, data)

        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data
        assert 'user' in response.data
        assert response.data['user']['email'] == user.email

    def test_login_invalid_credentials(self, api_client, user):
        """Test login with invalid credentials"""
        url = reverse('api-login')
        data = {
            'email': user.email,  # API uses email, not username
            'password': 'wrongpassword'
        }
        response = api_client.post(url, data)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_lockout_after_too_many_failures(self, api_client, user, settings, db):
        cache.clear()
        settings.MAX_FAILED_LOGIN_ATTEMPTS = 3
        settings.FAILED_LOGIN_WINDOW_SECONDS = 60
        settings.FAILED_LOGIN_LOCKOUT_SECONDS = 60

        UserModel = get_user_model()
        other = UserModel.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )

        url = reverse('api-login')
        wrong = {
            'email': user.email,
            'password': 'wrongpassword'
        }

        # First two failures are normal 401s
        resp1 = api_client.post(url, wrong)
        assert resp1.status_code == status.HTTP_401_UNAUTHORIZED
        resp2 = api_client.post(url, wrong)
        assert resp2.status_code == status.HTTP_401_UNAUTHORIZED

        # Third failure triggers lockout (429)
        resp3 = api_client.post(url, wrong)
        assert resp3.status_code == status.HTTP_429_TOO_MANY_REQUESTS
        assert 'Retry-After' in resp3

        # Even with correct password, lockout should still apply
        ok = {
            'email': user.email,
            'password': 'testpass123'
        }
        resp4 = api_client.post(url, ok)
        assert resp4.status_code == status.HTTP_429_TOO_MANY_REQUESTS

        # Global lockout: a different account from the same IP should also be blocked
        ok2 = {
            'email': other.email,
            'password': 'otherpass123'
        }
        resp5 = api_client.post(url, ok2)
        assert resp5.status_code == status.HTTP_429_TOO_MANY_REQUESTS

    def test_logout(self, authenticated_client):
        """Test user logout"""
        url = reverse('api-logout')
        response = authenticated_client.post(url)

        assert response.status_code == status.HTTP_200_OK

    def test_verification_flow(self, api_client, db):
        """Test send and verify email code endpoints."""
        send_url = reverse('send_verification_code')
        verify_url = reverse('verify_email_code')
        complete_url = reverse('complete_signup')

        email = 'newuser@example.com'
        # Send code
        resp = api_client.post(send_url, {'email': email}, format='json')
        assert resp.status_code in (status.HTTP_200_OK, status.HTTP_429_TOO_MANY_REQUESTS)

        # For test simplicity, simulate verification by retrieving code from DB
        from users.verification import EmailVerification
        ev = EmailVerification.objects.filter(user__email=email).order_by('-created_at').first()
        assert ev is not None

        # Verify code
        resp = api_client.post(verify_url, {'email': email, 'code': ev.code}, format='json')
        assert resp.status_code == status.HTTP_200_OK

        # Complete signup (password set)
        resp = api_client.post(complete_url, {'email': email, 'password': 'testpass123'}, format='json')
        assert resp.status_code == status.HTTP_200_OK
        assert 'token' in resp.data


@pytest.mark.django_db
class TestUserEndpoints:
    """Test user-related endpoints"""

    def test_get_current_user(self, authenticated_client, user):
        """Test retrieving current user details"""
        url = reverse('api-current-user')
        response = authenticated_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == user.email
        assert response.data['first_name'] == user.first_name
        assert response.data['last_name'] == user.last_name

    def test_get_current_user_unauthenticated(self, api_client):
        """Test current user endpoint without authentication"""
        url = reverse('api-current-user')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestCryptoWalletEndpoints:
    """Test cryptocurrency wallet endpoints"""

    def test_list_crypto_wallets(self, api_client):
        """Test retrieving list of company crypto wallets"""
        url = reverse('api-crypto-wallets-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)

        # Check that we have the expected wallets
        currencies = [wallet['currency'] for wallet in response.data]
        assert 'BTC' in currencies
        assert 'ETH' in currencies

    def test_crypto_wallet_structure(self, api_client):
        """Test that crypto wallet data has correct structure"""
        url = reverse('api-crypto-wallets-list')
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

        if response.data:
            wallet = response.data[0]
            # Check the fields that are actually returned by the serializer
            assert 'currency' in wallet
            assert 'wallet_address' in wallet  # Field is wallet_address, not address
            assert 'network' in wallet
            assert 'is_active' in wallet
