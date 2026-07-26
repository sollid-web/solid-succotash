import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

from .models import ChatMessage, ChatSession
from .telegram import extract_session_from_text


@csrf_exempt
def telegram_webhook(request):
    if request.method != "POST":
        return JsonResponse({"ok": True, "info": "telegram webhook alive"})

    try:
        update = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"ok": True})

    message = update.get("message") or update.get("edited_message")
    if not message:
        return JsonResponse({"ok": True})

    text = (message.get("text") or "").strip()
    if not text:
        return JsonResponse({"ok": True})

    replied = message.get("reply_to_message")
    session_id = None
    if replied:
        session_id = extract_session_from_text(replied.get("text", ""))

    if not session_id and text.lower().startswith("session:"):
        parts = text.split("|", 1)
        session_id = extract_session_from_text(parts[0])
        text = parts[1].strip() if len(parts) > 1 else ""

    if not session_id or not text:
        return JsonResponse({"ok": True})

    session, _ = ChatSession.objects.get_or_create(session_id=session_id)
    if session.status in ("bot", "waiting"):
        session.status = "active"
        if not session.agent_joined_at:
            session.agent_joined_at = timezone.now()
        session.save(update_fields=["status", "agent_joined_at", "updated_at"])

    ChatMessage.objects.create(
        session_id=session_id,
        role=ChatMessage.ASSISTANT,
        content=text,
        is_human_handover=True,
    )

    return JsonResponse({"ok": True})
