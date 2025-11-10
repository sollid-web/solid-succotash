from django.urls import path

from . import views

urlpatterns = [
    path("healthz/", views.healthz, name="healthz"),
    path("agreements/<int:agreement_id>/pdf/", views.agreement_pdf, name="agreement_pdf"),
]
