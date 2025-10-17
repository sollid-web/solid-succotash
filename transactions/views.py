from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.shortcuts import render
from .models import Transaction


@login_required
def list_transactions(request):
	transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
	return render(request, 'transactions/list.html', {'transactions': transactions})
