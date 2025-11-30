from django.urls import path
from . import views

app_name = 'referrals'

urlpatterns = [
    path('signup-hook/', views.signup_referral_hook, name='signup-hook'),
    path('dashboard/', views.referral_dashboard, name='dashboard'),
    path('generate-code/', views.generate_referral_code, name='generate-code'),
    path('manual-reward/', views.manual_reward, name='manual-reward'),
]
