import json

from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from groq import Groq

from .models import ChatMessage

client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = (
    "You are a professional support agent for WolvCapital — a premium capital markets platform. "
    "Help users with portfolios, pricing, API integration, billing, and account issues. "
    "Be warm, concise, and solution-focused. Keep replies to 2–4 sentences. "
    "If the user needs deeper support, escalate to a senior advisor or suggest submitting a support ticket."
)


def extract_user_message(payload: dict) -> str:
    message = payload.get("message")
    if isinstance(message, str) and message.strip():
        return message.strip()

    messages = payload.get("messages", [])
    if isinstance(messages, list):
        for item in reversed(messages):
            if (
                isinstance(item, dict)
                and item.get("role") == "user"
                and isinstance(item.get("content"), str)
            ):
                return item["content"].strip()

    return ""


def get_recent_session_messages(session_id: str, limit: int = 5) -> list[dict]:
    recent_messages = (
        ChatMessage.objects.filter(session_id=session_id)
        .order_by("-created_at")
        .values("role", "content")[:limit]
    )
    return list(reversed(list(recent_messages)))


@csrf_exempt
@require_POST
def chat(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    session_id = str(payload.get("session_id", "")).strip()
    if not session_id:
        return JsonResponse({"error": "session_id is required."}, status=400)

    user_content = extract_user_message(payload)
    if not user_content:
        return JsonResponse({"error": "User message is required."}, status=400)

    if not settings.GROQ_API_KEY:
        return JsonResponse({"error": "GROQ_API_KEY is not configured."}, status=500)

    saved_user_message = ChatMessage.objects.create(
        session_id=session_id,
        role=ChatMessage.USER,
        content=user_content,
        is_human_handover=False,
    )

    session_history = get_recent_session_messages(session_id)
    prompt_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *session_history,
        {"role": "user", "content": user_content},
    ]

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=1000,
            temperature=0.7,
            messages=prompt_messages,
        )

        reply = ""
        if getattr(response, "choices", None):
            first_choice = response.choices[0]
            reply = getattr(getattr(first_choice, "message", None), "content", "") or ""

        with transaction.atomic():
            ChatMessage.objects.create(
                session_id=session_id,
                role=ChatMessage.ASSISTANT,
                content=reply,
                is_human_handover=False,
            )

        return JsonResponse({"reply": reply})

    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)
