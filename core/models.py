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
