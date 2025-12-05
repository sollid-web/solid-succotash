from django.conf import settings
from django.db import models
from django.utils import timezone


class SupportRequest(models.Model):
    """Inbound support message awaiting manual follow-up."""

    STATUS_PENDING = "pending"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_RESOLVED = "resolved"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_RESOLVED, "Resolved"),
    ]

    user: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="support_requests",
    )
    full_name: models.CharField = models.CharField(max_length=255, blank=True)
    contact_email: models.EmailField = models.EmailField(blank=True)
    topic: models.CharField = models.CharField(max_length=120, blank=True)
    source_url: models.CharField = models.CharField(max_length=255, blank=True)
    message: models.TextField = models.TextField()
    status: models.CharField = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    admin_notes: models.TextField = models.TextField(blank=True)
    handled_by: models.ForeignKey = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="handled_support_requests",
    )
    responded_at: models.DateTimeField = models.DateTimeField(null=True, blank=True)
    ip_address: models.GenericIPAddressField = models.GenericIPAddressField(null=True, blank=True)
    user_agent: models.TextField = models.TextField(blank=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"Support request from {self.contact_email or self.full_name or 'guest'}"


class Agreement(models.Model):
    """Versioned legal agreement presented to end users."""

    title: models.CharField = models.CharField(max_length=255)
    slug: models.SlugField = models.SlugField(help_text="Stable identifier used in links and lookups.")
    version: models.CharField = models.CharField(max_length=20, help_text="Semantic version label, e.g., 1.0.0")
    body: models.TextField = models.TextField(help_text="Markdown/plain-text body rendered for the user.")
    effective_date: models.DateField = models.DateField(default=timezone.now)
    is_active: models.BooleanField = models.BooleanField(default=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-effective_date", "-created_at"]
        unique_together = ("slug", "version")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.title} v{self.version}"

    def paragraphs(self) -> list[str]:
        """Split the body into paragraphs separated by blank lines."""

        if not self.body:
            return []
        chunks = [chunk.strip() for chunk in self.body.split("\n\n")]
        return [chunk for chunk in chunks if chunk]


class UserAgreementAcceptance(models.Model):
    """Tracks that a user accepted a specific agreement version."""

    user: models.ForeignKey = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    agreement: models.ForeignKey = models.ForeignKey(Agreement, on_delete=models.CASCADE)
    accepted_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    ip_address: models.GenericIPAddressField = models.GenericIPAddressField(null=True, blank=True)
    user_agent: models.TextField = models.TextField(blank=True)
    agreement_hash: models.CharField = models.CharField(
        max_length=64,
        blank=True,
        help_text="SHA256 hash of agreement body at acceptance time",
    )
    agreement_version: models.CharField = models.CharField(
        max_length=20,
        blank=True,
        help_text="Version string captured at acceptance time",
    )

    class Meta:
        unique_together = ("user", "agreement")
        ordering = ["-accepted_at"]

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.user} accepted {self.agreement}"


class EmailInbox(models.Model):
    """Professional business email inbox for received messages."""

    STATUS_UNREAD = "unread"
    STATUS_READ = "read"
    STATUS_REPLIED = "replied"
    STATUS_ARCHIVED = "archived"
    STATUS_SPAM = "spam"
    STATUS_CHOICES = [
        (STATUS_UNREAD, "Unread"),
        (STATUS_READ, "Read"),
        (STATUS_REPLIED, "Replied"),
        (STATUS_ARCHIVED, "Archived"),
        (STATUS_SPAM, "Spam"),
    ]

    PRIORITY_LOW = "low"
    PRIORITY_NORMAL = "normal"
    PRIORITY_HIGH = "high"
    PRIORITY_URGENT = "urgent"
    PRIORITY_CHOICES = [
        (PRIORITY_LOW, "Low"),
        (PRIORITY_NORMAL, "Normal"),
        (PRIORITY_HIGH, "High"),
        (PRIORITY_URGENT, "Urgent"),
    ]

    # Email metadata
    message_id = models.CharField(max_length=255, unique=True, help_text="Unique email message ID")
    subject = models.CharField(max_length=500)
    from_email = models.EmailField()
    from_name = models.CharField(max_length=255, blank=True)
    to_email = models.EmailField()
    cc = models.TextField(blank=True, help_text="Comma-separated CC recipients")
    bcc = models.TextField(blank=True, help_text="Comma-separated BCC recipients")
    reply_to = models.EmailField(blank=True)

    # Content
    body_text = models.TextField(help_text="Plain text version")
    body_html = models.TextField(blank=True, help_text="HTML version")

    # Attachments
    has_attachments = models.BooleanField(default=False)
    attachment_info = models.JSONField(default=dict, blank=True, help_text="Attachment metadata")

    # Status and organization
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_UNREAD)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default=PRIORITY_NORMAL)
    is_starred = models.BooleanField(default=False)
    labels = models.CharField(max_length=255, blank=True, help_text="Comma-separated labels")
    folder = models.CharField(max_length=50, default="inbox")

    # Tracking
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_emails",
        help_text="Admin user handling this email"
    )
    read_at = models.DateTimeField(null=True, blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)

    # Metadata
    received_at = models.DateTimeField(help_text="When email was received by mail server")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, help_text="When fetched into system")
    updated_at = models.DateTimeField(auto_now=True)

    # Raw email storage
    raw_headers = models.JSONField(default=dict, blank=True)
    raw_email = models.TextField(blank=True, help_text="Complete raw email for forensics")

    class Meta:
        ordering = ["-received_at"]
        indexes = [
            models.Index(fields=["-received_at"]),
            models.Index(fields=["status"]),
            models.Index(fields=["from_email"]),
            models.Index(fields=["assigned_to"]),
            models.Index(fields=["is_starred"]),
        ]
        verbose_name = "Email"
        verbose_name_plural = "Inbox"

    def __str__(self):
        return f"{self.from_email}: {self.subject[:50]}"

    def mark_as_read(self, user=None):
        """Mark email as read."""
        if self.status == self.STATUS_UNREAD:
            self.status = self.STATUS_READ
            self.read_at = timezone.now()
            if user:
                self.assigned_to = user
            self.save()

    def mark_as_replied(self):
        """Mark email as replied."""
        self.status = self.STATUS_REPLIED
        self.replied_at = timezone.now()
        self.save()

    def toggle_star(self):
        """Toggle starred status."""
        self.is_starred = not self.is_starred
        self.save()

    @property
    def preview(self):
        """Return first 150 characters of body text."""
        return self.body_text[:150] + "..." if len(self.body_text) > 150 else self.body_text

    @property
    def cc_list(self):
        """Return CC recipients as list."""
        return [email.strip() for email in self.cc.split(",") if email.strip()]

    @property
    def label_list(self):
        """Return labels as list."""
        return [label.strip() for label in self.labels.split(",") if label.strip()]


class EmailTemplate(models.Model):
    """Reusable email templates for quick responses."""

    name = models.CharField(max_length=255, unique=True)
    subject = models.CharField(max_length=500)
    body = models.TextField(help_text="Use {{variable}} for placeholders")
    category = models.CharField(max_length=100, blank=True, help_text="e.g., Support, Sales, Billing")
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"


class IncomingEmail(models.Model):
    subject = models.CharField(max_length=512, blank=True)
    sender = models.CharField(max_length=512, blank=True)
    recipients = models.CharField(max_length=1024, blank=True)
    body = models.TextField(blank=True)
    raw_date = models.CharField(max_length=128, blank=True)
    received_by = models.CharField(max_length=255, blank=True)  # which mailbox received it
    created_at = models.DateTimeField(auto_now_add=True)


class EmailAttachment(models.Model):
    email = models.ForeignKey(IncomingEmail, related_name='attachments', on_delete=models.CASCADE)
    filename = models.CharField(max_length=255)
    file = models.FileField(upload_to='email_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class PlatformCertificate(models.Model):
    """Public-facing certificate of operation details.

    Non-financial metadata to improve platform transparency. Managed via Django admin.
    """

    title = models.CharField(max_length=255, default="Certificate of Operation")
    certificate_id = models.CharField(max_length=64, unique=True)
    issue_date = models.DateField(default=timezone.now)
    jurisdiction = models.CharField(max_length=255, default="United States")
    issuing_authority = models.CharField(max_length=255, help_text="Name of the issuing authority")
    verification_url = models.URLField(max_length=500, blank=True)

    authority_seal_url = models.URLField(max_length=500, blank=True)
    signature_1_url = models.URLField(max_length=500, blank=True)
    signature_2_url = models.URLField(max_length=500, blank=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.title} ({self.certificate_id})"
