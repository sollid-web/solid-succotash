from __future__ import annotations

from datetime import date, datetime
from typing import Any

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from transactions.models import AdminAuditLog, AdminNotification
from transactions.notifications import create_admin_notification

from .models import KycApplication, KycDocument
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
        if isinstance(value, date | datetime):
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

    # Send email notification to user about KYC submission
    try:
        from core.email_service import EmailService

        EmailService.send_templated_email(
            template_name="kyc_submitted",
            to_emails=getattr(user, "email", ""),
            context={"user": user, "application": application, "stage": "personal_info"},
            subject=f"KYC Submitted - {EmailService.BRAND_NAME}",
            email_type="kyc_submitted",
            user=user,
        )
    except Exception:
        pass

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

    # Send email notification to user about KYC document submission
    try:
        from core.email_service import EmailService

        EmailService.send_templated_email(
            template_name="kyc_submitted",
            to_emails=getattr(user, "email", ""),
            context={"user": user, "application": application, "stage": "documents"},
            subject=f"KYC Documents Submitted - {EmailService.BRAND_NAME}",
            email_type="kyc_submitted",
            user=user,
        )
    except Exception:
        pass
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
    # Email user about application approval
    try:
        from core.email_service import EmailService

        EmailService.send_templated_email(
            template_name="kyc_approved",
            to_emails=getattr(application.user, "email", ""),
            context={"user": application.user, "application": application, "notes": notes},
            subject=f"KYC Approved - {EmailService.BRAND_NAME}",
            email_type="kyc_approved",
            user=application.user,
        )
    except Exception:
        pass
    # Admin email alert for approved KYC
    try:
        from core.email_service import EmailService
        EmailService.send_admin_alert(
            subject="KYC Approved",
            message=f"KYC application {application.id} for user {application.user.email} was approved.",
        )
    except Exception:
        pass
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
    # Admin email alert for rejected KYC
    try:
        from core.email_service import EmailService

        EmailService.send_admin_alert(
            subject="KYC Rejected",
            message=(
                f"KYC application {application.id} for user {application.user.email} was rejected. "
                f"Reason: {application.rejection_reason or 'N/A'}"
            ),
        )
    except Exception:
        pass

    # Email user about application rejection
    try:
        from core.email_service import EmailService

        EmailService.send_templated_email(
            template_name="kyc_rejected",
            to_emails=getattr(application.user, "email", ""),
            context={
                "user": application.user,
                "application": application,
                "reason": application.rejection_reason,
            },
            subject=f"KYC Rejected - {EmailService.BRAND_NAME}",
            email_type="kyc_rejected",
            user=application.user,
        )
    except Exception:
        pass

    return application


@transaction.atomic
def submit_kyc_document(user, document_type: str, document_file) -> KycDocument:
    """Create or update a KYC document submission"""
    if not document_type or document_type not in dict(KycDocument.DOCUMENT_TYPE_CHOICES):
        raise ValidationError(
            f"Invalid document type. Must be one of: {', '.join([t[0] for t in KycDocument.DOCUMENT_TYPE_CHOICES])}"
        )

    if not document_file:
        raise ValidationError("Document file is required.")

    # validate file type and size early so we don't create application if bad
    allowed_types = ["image/png", "image/jpeg", "application/pdf"]
    content_type = getattr(document_file, "content_type", None)
    if content_type not in allowed_types:
        raise ValidationError({"document_file": ["Invalid file type."]})

    max_size = 5 * 1024 * 1024  # 5MB
    size = getattr(document_file, "size", 0)
    if size > max_size:
        raise ValidationError({"document_file": ["File too large. Maximum is 5MB."]})

    # Get or create KycApplication for this user
    kyc_application, _ = KycApplication.objects.select_for_update().get_or_create(user=user)

    # Create or update document
    document, created = KycDocument.objects.select_for_update().get_or_create(
        user=user,
        document_type=document_type,
        defaults={
            "kyc_application": kyc_application,
            "document_file": document_file,
            "status": "pending",
        },
    )

    if not created:
        # Update existing document with new file
        document.document_file = document_file
        document.status = "pending"
        document.submitted_at = timezone.now()
        document.reviewed_by = None
        document.reviewed_at = None
        document.rejection_reason = ""
        document.save()

    _create_admin_alert(kyc_application, f"{document.get_document_type_display()} document")
    notify_kyc_submitted(user, kyc_application)

    # Email user to confirm document upload
    try:
        from core.email_service import EmailService

        EmailService.send_templated_email(
            template_name="kyc_document_submitted",
            to_emails=getattr(user, "email", ""),
            context={"user": user, "application": kyc_application, "document": document},
            subject=f"KYC Document Received - {EmailService.BRAND_NAME}",
            email_type="kyc_submitted",
            user=user,
        )
    except Exception:
        pass

    return document


@transaction.atomic
def approve_kyc_document(document: KycDocument, admin_user, notes: str = "") -> KycDocument:
    """Approve a KYC document submission"""
    _require_admin(admin_user)

    if document.status != "pending":
        raise ValidationError(f"Only pending documents can be approved. Current status: {document.status}")

    document.approve(admin_user)

    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="kyc_document",
        entity_id=str(document.id),
        action="approve",
        notes=notes,
    )

    # Notify user
    try:
        kyc_app = document.kyc_application or KycApplication.objects.filter(user=document.user).first()
        if kyc_app:
            notify_kyc_approved(document.user, kyc_app, notes)
            # Email user about document approval
            try:
                from core.email_service import EmailService

                EmailService.send_templated_email(
                    template_name="kyc_document_approved",
                    to_emails=getattr(document.user, "email", ""),
                    context={"user": document.user, "application": kyc_app, "document": document, "notes": notes},
                    subject=f"KYC Document Approved - {EmailService.BRAND_NAME}",
                    email_type="kyc_approved",
                    user=document.user,
                )
            except Exception:
                pass
    except Exception:
        pass

    return document


@transaction.atomic
def reject_kyc_document(document: KycDocument, admin_user, reason: str) -> KycDocument:
    """Reject a KYC document submission"""
    _require_admin(admin_user)

    if document.status != "pending":
        raise ValidationError(f"Only pending documents can be rejected. Current status: {document.status}")

    if not reason:
        raise ValidationError("Rejection reason is required.")

    document.reject(admin_user, reason)

    AdminAuditLog.objects.create(
        admin=admin_user,
        entity="kyc_document",
        entity_id=str(document.id),
        action="reject",
        notes=reason,
    )

    # Notify user
    try:
        kyc_app = document.kyc_application or KycApplication.objects.filter(user=document.user).first()
        if kyc_app:
            notify_kyc_rejected(document.user, kyc_app, reason)
            # Email user about document rejection
            try:
                from core.email_service import EmailService

                EmailService.send_templated_email(
                    template_name="kyc_document_rejected",
                    to_emails=getattr(document.user, "email", ""),
                    context={"user": document.user, "application": kyc_app, "document": document, "reason": reason},
                    subject=f"KYC Document Rejected - {EmailService.BRAND_NAME}",
                    email_type="kyc_rejected",
                    user=document.user,
                )
            except Exception:
                pass
    except Exception:
        pass

    return document
