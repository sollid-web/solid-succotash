from django.urls import path
from .views import CardDetailView, CardFreezeView, CardTransactionsView

urlpatterns = [
    # Change "detail/" to "" to match the base /api/virtualcards/ call
    path("", CardDetailView.as_view(), name="card-detail"),
    path("freeze/", CardFreezeView.as_view(), name="card-freeze"),
    path("transactions/", CardTransactionsView.as_view(), name="card-transactions"),
]