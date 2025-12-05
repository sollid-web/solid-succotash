from django.urls import path

from . import views

urlpatterns = [
    path("healthz/", views.healthz, name="healthz"),
    path("agreements/<int:agreement_id>/pdf/", views.agreement_pdf, name="agreement_pdf"),
    path("contact/", views.contact_view, name="contact"),

    # Email Inbox
    path("inbox/", views.inbox_view, name="inbox"),
    path("inbox/<int:email_id>/", views.inbox_detail_view, name="inbox_detail"),
    path("inbox/<int:email_id>/action/", views.inbox_action_view, name="inbox_action"),
    path("inbox/sync/", views.inbox_sync_view, name="inbox_sync"),
]
