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
