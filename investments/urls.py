from django.urls import path
from investments.views import MyInvestmentsView

urlpatterns = [
    path("my-investments/", MyInvestmentsView.as_view(), name="my-investments"),
]
