import stripe
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from .models import CardTransaction, VirtualCard


class CardsAPITests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username="card_user",
            email="card_user@example.com",
            password="pass12345",
        )
        self.admin = User.objects.create_user(
            username="card_admin",
            email="card_admin@example.com",
            password="pass12345",
            is_staff=True,
            is_superuser=True,  # ensure IsAdminUser passes
        )
        self.client = APIClient()

    def auth_client(self, user):
        self.client.force_authenticate(user=user)
        return self.client

    def test_request_card(self):
        client = self.auth_client(self.user)
        resp = client.post(
            reverse('request-card'),
            {'purchase_amount': 1000},
            format='json'
        )
        self.assertEqual(resp.status_code, 201)
        self.assertTrue(VirtualCard.objects.filter(user=self.user).exists())

        # duplicate request should fail
        resp2 = client.post(
            reverse('request-card'),
            {'purchase_amount': 1000},
            format='json'
        )
        self.assertEqual(resp2.status_code, 400)

    def test_approve_card_and_details(self):
        card = VirtualCard.objects.create(user=self.user, purchase_amount=1000, status='pending')

        fake_cardholder = type('O', (), {'id': 'ich_123'})
        fake_card = type('O', (), {
            'id': 'ic_456',
            'last4': '4444',
            'exp_month': 12,
            'exp_year': 2030,
            'brand': 'visa',
        })

        # patch stripe methods
        original_ch_create = stripe.issuing.Cardholder.create
        original_card_create = stripe.issuing.Card.create
        original_card_retrieve = stripe.issuing.Card.retrieve
        stripe.issuing.Cardholder.create = lambda **kw: fake_cardholder
        stripe.issuing.Card.create = lambda **kw: fake_card
        stripe.issuing.Card.retrieve = lambda cid, expand=None: type(
            'O', (), {
                'number': '4000056655665556',
                'cvc': '123',
                'exp_month': fake_card.exp_month,
                'exp_year': fake_card.exp_year,
                'last4': fake_card.last4,
                'brand': fake_card.brand,
                'status': 'active',
            }
        )

        client = self.auth_client(self.admin)
        resp = client.post(reverse('approve-card', kwargs={'card_id': card.id}))
        self.assertEqual(resp.status_code, 200)
        card.refresh_from_db()
        self.assertEqual(card.status, 'active')
        self.assertEqual(card.stripe_card_id, 'ic_456')

        # details endpoint
        client = self.auth_client(self.user)
        resp2 = client.get(reverse('card-details'))
        self.assertEqual(resp2.status_code, 200)
        data = resp2.json().get('card_details', {})
        self.assertEqual(data['last4'], '4444')

        # restore stripe
        stripe.issuing.Cardholder.create = original_ch_create
        stripe.issuing.Card.create = original_card_create
        stripe.issuing.Card.retrieve = original_card_retrieve

    def test_toggle_freeze_unfreeze(self):
        card = VirtualCard.objects.create(user=self.user, purchase_amount=1000, status='active', stripe_card_id='ic_foo')
        # monkeypatch stripe.modify
        orig_mod = stripe.issuing.Card.modify
        stripe.issuing.Card.modify = lambda cid, status=None: None

        client = self.auth_client(self.user)
        resp = client.post(reverse('toggle-card'), {'action': 'freeze'}, format='json')
        self.assertEqual(resp.status_code, 200)
        card.refresh_from_db()
        self.assertEqual(card.status, 'inactive')
        resp2 = client.post(reverse('toggle-card'), {'action': 'unfreeze'}, format='json')
        self.assertEqual(resp2.status_code, 200)
        card.refresh_from_db()
        self.assertEqual(card.status, 'active')

        stripe.issuing.Card.modify = orig_mod

    def test_webhook_authorization_created(self):
        card = VirtualCard.objects.create(user=self.user, purchase_amount=1000, status='active', stripe_card_id='ic_bar', current_balance=1000)
        APIClient()
        payload = {
            'type': 'issuing_authorization.created',
            'data': {'object': {
                'id': 'auth_abc',
                'card': {'id': 'ic_bar'},
                'amount': 500,
                'currency': 'usd',
                'merchant_data': {'name': 'Shop'},
            }}
        }
        # patch webhook constructor to bypass signature
        original_construct = stripe.Webhook.construct_event
        stripe.Webhook.construct_event = lambda p, h, s: payload
        from django.test import RequestFactory

        from .webhooks import stripe_webhook
        rf = RequestFactory()
        req = rf.post('/cards/webhook/', data=str(payload), content_type='application/json')
        resp = stripe_webhook(req)
        # restore
        stripe.Webhook.construct_event = original_construct
        self.assertEqual(resp.status_code, 200)
        card.refresh_from_db()
        self.assertEqual(card.current_balance, 995.0)
        self.assertTrue(CardTransaction.objects.filter(card=card, amount=5.0).exists())

