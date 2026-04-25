from django.urls import path
from .views import CardDetailView, CardFreezeView, CardTransactionsView, VerifyPasswordView, SetPinView, CheckPinView

urlpatterns = [
    path("", CardDetailView.as_view(), name="card-detail"),
    path("freeze/", CardFreezeView.as_view(), name="card-freeze"),
    path("transactions/", CardTransactionsView.as_view(), name="card-transactions"),
    path("verify-password/", VerifyPasswordView.as_view(), name="card-verify-password"),
    path("set-pin/", SetPinView.as_view(), name="card-set-pin"),
    path("check-pin/", CheckPinView.as_view(), name="card-check-pin"),
]
