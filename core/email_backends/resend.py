from __future__ import annotations

import json
import logging
import os
import urllib.error
import urllib.request
from typing import Iterable

from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend
from django.core.mail.message import EmailMessage

logger = logging.getLogger(__name__)

_RESEND_API_URL = "https://api.resend.com/emails"


def _first_html_alternative(message: EmailMessage) -> str | None:
    alternatives = getattr(message, "alternatives", None)
    if not alternatives:
        return None

    for content, mimetype in alternatives:
        if mimetype == "text/html":
            return content

    return None


class ResendEmailBackend(BaseEmailBackend):
    """Django email backend that sends mail via Resend HTTP API.

    Configure via env var `RESEND_API_KEY` or Django setting `RESEND_API_KEY`.

    Use by setting:
        EMAIL_BACKEND=core.email_backends.resend.ResendEmailBackend
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.api_key: str | None = getattr(settings, "RESEND_API_KEY", None) or os.getenv(
            "RESEND_API_KEY"
        )

    def send_messages(self, email_messages: Iterable[EmailMessage] | None) -> int:
        if not email_messages:
            return 0

        if not self.api_key:
            msg = "RESEND_API_KEY is not set; cannot send email via Resend"
            if self.fail_silently:
                logger.error(msg)
                return 0
            raise RuntimeError(msg)

        sent_count = 0
        for message in email_messages:
            if not message:
                continue

            try:
                if self._send_single(message):
                    sent_count += 1
            except Exception:
                if self.fail_silently:
                    logger.exception("Resend send failed (fail_silently=True)")
                    continue
                raise

        return sent_count

    def _send_single(self, message: EmailMessage) -> bool:
        from_email = message.from_email or getattr(settings, "DEFAULT_FROM_EMAIL", None)
        if not from_email:
            raise ValueError("No from_email set on message and DEFAULT_FROM_EMAIL is empty")

        to_list = list(message.to or [])
        if not to_list:
            logger.warning("Skipping send: no recipients")
            return False

        html = _first_html_alternative(message)
        text = None

        # If no HTML alternative exists, allow html-only messages
        if html is None and getattr(message, "content_subtype", "plain") == "html":
            html = message.body
        else:
            text = message.body

        payload: dict[str, object] = {
            "from": from_email,
            "to": to_list,
            "subject": message.subject or "",
        }

        if text:
            payload["text"] = text
        if html:
            payload["html"] = html

        if message.cc:
            payload["cc"] = list(message.cc)
        if message.bcc:
            payload["bcc"] = list(message.bcc)
        if message.reply_to:
            # Resend expects reply_to as string or list; we use list
            payload["reply_to"] = list(message.reply_to)

        extra_headers = getattr(message, "extra_headers", None) or {}
        if extra_headers:
            # Avoid leaking any potentially sensitive headers; forward as-is.
            payload["headers"] = dict(extra_headers)

        # Attachments are not used in WolvCapital's system emails; skip safely.
        if getattr(message, "attachments", None):
            logger.info("Email has attachments; Resend backend currently ignores attachments")

        timeout = int(getattr(settings, "EMAIL_TIMEOUT", 30))

        request = urllib.request.Request(
            _RESEND_API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                status = getattr(response, "status", 200)
                body = response.read().decode("utf-8", errors="ignore")

            if 200 <= status < 300:
                logger.info(
                    "Resend email sent: subject=%r to=%s status=%s",
                    message.subject,
                    to_list,
                    status,
                )
                return True

            logger.error(
                "Resend email failed: subject=%r to=%s status=%s body=%s",
                message.subject,
                to_list,
                status,
                body[:500],
            )
            return False

        except urllib.error.HTTPError as exc:
            try:
                err_body = exc.read().decode("utf-8", errors="ignore")
            except Exception:
                err_body = ""

            logger.error(
                "Resend HTTPError: subject=%r to=%s status=%s body=%s",
                message.subject,
                to_list,
                getattr(exc, "code", None),
                (err_body or str(exc))[:500],
            )
            return False

        except urllib.error.URLError as exc:
            logger.error(
                "Resend URLError: subject=%r to=%s error=%s",
                message.subject,
                to_list,
                str(exc),
            )
            return False
