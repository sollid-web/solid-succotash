from django.db import models

class ChatMessage(models.Model):
    USER = "user"
    ASSISTANT = "assistant"

    ROLE_CHOICES = [
        (USER, "User"),
        (ASSISTANT, "Assistant"),
    ]

    session_id = models.CharField(max_length=128, db_index=True)
    role = models.CharField(max_length=16, choices=ROLE_CHOICES)
    content = models.TextField()
    is_human_handover = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [models.Index(fields=["session_id", "created_at"])]

    def __str__(self):
        return f"{self.session_id} | {self.role} | {self.created_at:%Y-%m-%d %H:%M:%S}"


class ChatSession(models.Model):
    STATUS_CHOICES = [
        ("bot", "Bot Handling"),
        ("waiting", "Waiting for Human"),
        ("active", "Human Active"),
        ("closed", "Closed"),
    ]

    session_id = models.CharField(max_length=128, unique=True, db_index=True)
    user_email = models.EmailField(blank=True, null=True)
    user_name = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="bot")
    human_requested_at = models.DateTimeField(null=True, blank=True)
    agent_joined_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    alert_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user_email or self.session_id} — {self.status}"
