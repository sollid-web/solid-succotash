# Investment plans are exposed via the REST API at /api/plans/
# See api.views.InvestmentPlanViewSet for the API implementation
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from investments.models import UserInvestment
from investments.serializers import InvestmentRowSerializer


class MyInvestmentsView(ListAPIView):
    """
    Returns the user's investments with correct lifecycle status.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = InvestmentRowSerializer

    def get_queryset(self):
        return (
            UserInvestment.objects
            .filter(user=self.request.user)
            .select_related("plan")
        )
