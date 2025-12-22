from datetime import date, datetime

from django.contrib.auth.models import User
from django.db import models


class SupportRequest(models.Model):
    user: User | None
    full_name: str
    contact_email: str
    topic: str
    source_url: str
    message: str
    status: str
    admin_notes: str
    handled_by: User | None
    responded_at: datetime | None
    ip_address: str | None
    user_agent: str
    created_at: datetime
    updated_at: datetime


class Agreement(models.Model):
    title: str
    slug: str
    version: str
    body: str
    effective_date: datetime
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserAgreementAcceptance(models.Model):
    user: User
    agreement: Agreement
    accepted_at: datetime
    ip_address: str | None
    user_agent: str
    agreement_hash: str
    agreement_version: str


class PlatformCertificate(models.Model):
    title: str
    certificate_id: str
    issue_date: date
    jurisdiction: str
    issuing_authority: str
    verification_url: str
    authority_seal_url: str
    signature_1_url: str
    signature_2_url: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
