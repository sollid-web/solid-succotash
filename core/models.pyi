from typing import Optional
from datetime import datetime
from django.contrib.auth.models import User

class SupportRequest(models.Model):
    user: Optional[User]
    full_name: str
    contact_email: str
    topic: str
    source_url: str
    message: str
    status: str
    admin_notes: str
    handled_by: Optional[User]
    responded_at: Optional[datetime]
    ip_address: Optional[str]
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
    ip_address: Optional[str]
    user_agent: str
    agreement_hash: str
    agreement_version: str
