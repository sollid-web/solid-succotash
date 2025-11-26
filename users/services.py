from __future__ import annotations

from typing import Any

from django.core.exceptions import ValidationError
from datetime import date, datetime
from django.db import transaction
from django.utils import timezone

from transactions.models import AdminAuditLog, AdminNotification
from transactions.notifications import create_admin_notification

from .models import KycApplication
from .notification_service import (
    notify_kyc_approved,
    notify_kyc_rejected,
    notify_kyc_submitted,
)


def _require_admin(user: Any) -> None:
    if not user or not getattr(user, "is_staff", False):
        raise ValidationError("Admin privileges are required for this action.")


def _should_notify_pending(previous_status: str | None, new_status: str) -> bool:
    return (previous_status or "draft") != new_status


def _resolve_admin_notifications(application: KycApplication, admin_user) -> None:
    AdminNotification.objects.filter(
        entity_type="kyc",
        entity_id=str(application.id),
        is_resolved=False,
    ).update(is_resolved=True, resolved_by=admin_user, resolved_at=timezone.now())


def _create_admin_alert(application: KycApplication, stage_label: str) -> None:
    create_admin_notification(
        notification_type="new_kyc",
        title=f"KYC update from {application.user.email}",
        message=(
            f"{application.user.email} submitted {stage_label} for review. "
            f"Application ID: {application.id}"
        ),
        user=application.user,
        entity_type="kyc",
        entity_id=str(application.id),
        priority="high",
    )


@transaction.atomic
def submit_personal_info(user, personal_info: dict[str, Any]) -> KycApplication:
    if not personal_info:
        raise ValidationError("Personal information is required.")

    application, _ = KycApplication.objects.select_for_update().get_or_create(user=user)
    previous_status = application.status
    # Ensure all values are JSON serializable (convert date/datetime objects to ISO strings)
    sanitized: dict[str, Any] = {}
    for key, value in personal_info.items():
        if isinstance(value, (date, datetime)):
            sanitized[key] = value.isoformat()
        else:
            sanitized[key] = value

    application.personal_info = sanitized
    application.personal_info_submitted_at = timezone.now()
    application.last_submitted_at = timezone.now()
    application.status = "pending"
    application.reviewed_by = None
    application.reviewed_at = None
    application.reviewer_notes = ""
    application.rejection_reason = ""
    application.save()

    if _should_notify_pending(previous_status, application.status):
        notify_kyc_submitted(user, application)

    _create_admin_alert(application, "personal information")
    return application


@transaction.atomic
def submit_document_info(user, document_info: dict[str, Any]) -> KycApplication:
    if not document_info:
        raise ValidationError("Document metadata is required.")

    application, _ = KycApplication.objects.select_for_update().get_or_create(user=user)
    previous_status = application.status

    application.document_info = document_info
    application.document_submitted_at = timezone.now()
    application.last_submitted_at = timezone.now()
    application.status = "pending"
    application.reviewed_by = None
    application.reviewed_at = None
    application.reviewer_notes = ""
    application.rejection_reason = ""
    application.save()

    if _should_notify_pending(previous_status, application.status):
        notify_kyc_submitted(user, application)

    _create_admin_alert(application, "identity documents")
    return application


@transaction.atomic
def approve_kyc_application(application: KycApplication, admin_user, notes: str = "") -> KycApplication:
    _require_admin(admin_user)

    if application.status != "pending":
        raise ValidationError("Only pending KYC applications can be approved.")

    application.status = "approved"
    application.reviewed_by = admin_user
    application.reviewed_at = timezone.now()
    application.reviewer_notes = notes
    application.rejection_reason = ""
    application.save()

    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="kyc",
        entity_id=str(application.id),
        action="approve",
        notes=notes,
    )

    _resolve_admin_notifications(application, admin_user)
    notify_kyc_approved(application.user, application, notes)
    return application


@transaction.atomic
def reject_kyc_application(
    application: KycApplication,
    admin_user,
    reason: str = "",
    notes: str | None = None,
) -> KycApplication:
    _require_admin(admin_user)

    if application.status != "pending":
        raise ValidationError("Only pending KYC applications can be rejected.")

    application.status = "rejected"
    application.reviewed_by = admin_user
    application.reviewed_at = timezone.now()
    application.reviewer_notes = notes or reason
    application.rejection_reason = reason or notes or ""
    application.save()

    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="kyc",
        entity_id=str(application.id),
        action="reject",
        notes=reason or notes or "",
    )

    _resolve_admin_notifications(application, admin_user)
    notify_kyc_rejected(application.user, application, application.rejection_reason)
    return application