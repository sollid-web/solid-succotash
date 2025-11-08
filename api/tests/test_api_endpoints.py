"""
Integration tests for API endpoints
"""
import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

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

    def test_logout(self, authenticated_client):
        """Test user logout"""
        url = reverse('api-logout')
        response = authenticated_client.post(url)

        assert response.status_code == status.HTTP_200_OK


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
