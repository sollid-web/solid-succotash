import os
import json
import re
import requests

TELEGRAM_API = "https://api.telegram.org/bot{token}/{method}"


def _token() -> str:
    return os.environ.get("TELEGRAM_BOT_TOKEN", "")


def _chat_id() -> str:
    return os.environ.get("TELEGRAM_CHAT_ID", "")


def send_telegram(text: str, reply_markup: None = None):
    token = _token()
    chat_id = _chat_id()
    if not token or not chat_id:
        print("[Telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set")
        return None
    try:
        payload = {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True,
        }
        if reply_markup:
            payload["reply_markup"] = json.dumps(reply_markup)
        r = requests.post(
            TELEGRAM_API.format(token=token, method="sendMessage"),
            json=payload, timeout=8,
        )
        data = r.json()
        if not data.get("ok"):
            print(f"[Telegram] send failed: {data}")
            return None
        return data.get("result")
    except Exception as e:
        print(f"[Telegram] send error: {e}")
        return None


def notify_new_visitor(session_id: str, page: str = "", location: str = "", meta: str = ""):
    text = (
        f"🟢 <b>New visitor</b>\n"
        f"{location + chr(10) if location else ''}"
        f"{meta + chr(10) if meta else ''}"
        f"📄 {page or 'unknown page'}\n\n"
        f"<code>session:{session_id}</code>"
    )
    send_telegram(text)


def notify_new_message(session_id: str, content: str, user_name: str = "", user_email: str = ""):
    who = user_name or user_email or "Visitor"
    text = (
        f"💬 <b>{who}</b>\n"
        f"{content}\n\n"
        f"↩️ <i>Reply to this message to respond to the visitor.</i>\n"
        f"<code>session:{session_id}</code>"
    )
    return send_telegram(text)


def notify_human_requested(session_id: str, user_name: str = "", user_email: str = ""):
    who = user_name or user_email or "Visitor"
    text = (
        f"⚡ <b>{who} requested a human agent</b>\n"
        f"{user_email or ''}\n\n"
        f"↩️ <i>Reply to this message to respond.</i>\n"
        f"<code>session:{session_id}</code>"
    )
    return send_telegram(text)


def extract_session_from_text(text: str):
    if not text:
        return None
    m = re.search(r"session:([A-Za-z0-9_\-]+)", text)
    return m.group(1) if m else None
