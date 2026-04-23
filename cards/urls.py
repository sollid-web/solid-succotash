from django.urls import path
from .views import CardDetailView, CardFreezeView, CardTransactionsView, VerifyPasswordView

urlpatterns = [
    path("", CardDetailView.as_view(), name="card-detail"),
    path("freeze/", CardFreezeView.as_view(), name="card-freeze"),
    path("transactions/", CardTransactionsView.as_view(), name="card-transactions"),
    path("verify-password/", VerifyPasswordView.as_view(), name="card-verify-password"),
]
