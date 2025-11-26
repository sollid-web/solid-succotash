from core.management.commands.fetch_mail import _decode_mime_header
from email.message import EmailMessage
import email


def test_decode_simple_ascii():
    assert _decode_mime_header("Simple subject") == "Simple subject"


def test_decode_mime_q_encoded():
    # Q-encoding for UTF-8
    raw = "=?UTF-8?Q?Ol=C3=A1_Subject?="
    assert "Olá Subject" in _decode_mime_header(raw)


def test_decode_handles_none_value():
    assert _decode_mime_header(None) == ""


def test_parse_from_and_subject():
    raw = EmailMessage()
    raw["From"] = '"Test User" <test@example.com>'
    raw["Subject"] = 'Test Email'
    body = "Hello\n"
    raw.set_content(body)

    msg = email.message_from_string(raw.as_string())
    # Ensure helpers operate on real msg headers
    subject = _decode_mime_header(msg.get("Subject"))
    assert subject == "Test Email"
    assert msg.get("From") == '"Test User" <test@example.com>'
