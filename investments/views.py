from django.shortcuts import render

from .models import InvestmentPlan


def plans_list(request):
    plans = InvestmentPlan.objects.all().order_by("min_amount")
    return render(request, "investments/plans.html", {"plans": plans})
