urlpatterns = [
    # Change "detail/" to "" so the base URL works
    path("", CardDetailView.as_view(), name="card-detail"), 
    path("freeze/", CardFreezeView.as_view(), name="card-freeze"),
    path("transactions/", CardTransactionsView.as_view(), name="card-transactions"),
]