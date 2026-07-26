from django.urls import path

from . import views
from .webhooks import stripe_webhook

urlpatterns = [
    # User endpoints
    path('request/',      views.RequestCardView.as_view(),      name='request-card'),
    path('me/',           views.MyCardView.as_view(),           name='my-card'),
    path('details/',      views.CardDetailsView.as_view(),      name='card-details'),
    path('transactions/', views.CardTransactionsView.as_view(), name='card-transactions'),
    path('toggle/',       views.ToggleCardStatusView.as_view(), name='toggle-card'),

    # Admin endpoints
    path('approve/<int:card_id>/', views.ApproveCardView.as_view(),    name='approve-card'),
    path('fund-balance/',          views.FundIssuingBalanceView.as_view(), name='fund-balance'),

    # Stripe webhook (no auth — Stripe calls this)
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]
