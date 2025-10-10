from django.conf import settings
from django.db import models
from django.utils import timezone


class Agreement(models.Model):
	"""Versioned legal agreement presented to end users."""

	title = models.CharField(max_length=255)
	slug = models.SlugField(help_text="Stable identifier used in links and lookups.")
	version = models.CharField(max_length=20, help_text="Semantic version label, e.g., 1.0.0")
	body = models.TextField(help_text="Markdown/plain-text body rendered for the user.")
	effective_date = models.DateField(default=timezone.now)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

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

	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE)
	accepted_at = models.DateTimeField(auto_now_add=True)
	ip_address = models.GenericIPAddressField(null=True, blank=True)
	user_agent = models.TextField(blank=True)
	agreement_hash = models.CharField(
		max_length=64,
		blank=True,
		help_text="SHA256 hash of agreement body at acceptance time",
	)
	agreement_version = models.CharField(
		max_length=20,
		blank=True,
		help_text="Version string captured at acceptance time",
	)

	class Meta:
		unique_together = ("user", "agreement")
		ordering = ["-accepted_at"]

	def __str__(self) -> str:  # pragma: no cover - trivial
		return f"{self.user} accepted {self.agreement}"
