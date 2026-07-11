import json
import os
import resend

from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone

from groq import Groq

from .models import ChatMessage, ChatSession

client = Groq(api_key=settings.GROQ_API_KEY)

PLANS_DATA = [
    {
        "name": "Pioneer",
        "apy": "8%",
        "duration": "90 Days",
        "min": "$100",
        "max": "$999",
        "best_for": "First-time investors",
        "url": "https://www.wolvcapital.com/plans/pioneer",
        "color": "#3b82f6",
    },
    {
        "name": "Vanguard",
        "apy": "12%",
        "duration": "150 Days",
        "min": "$1,000",
        "max": "$4,999",
        "best_for": "Mid-range allocations",
        "url": "https://www.wolvcapital.com/plans/vanguard",
        "color": "#8b5cf6",
    },
    {
        "name": "Horizon",
        "apy": "18%",
        "duration": "180 Days",
        "min": "$5,000",
        "max": "$14,999",
        "best_for": "Experienced investors",
        "url": "https://www.wolvcapital.com/plans/horizon",
        "color": "#06b6d4",
    },
    {
        "name": "Summit VIP",
        "apy": "25%",
        "duration": "365 Days",
        "min": "$15,000",
        "max": "$50,000",
        "best_for": "High-net-worth investors",
        "url": "https://www.wolvcapital.com/plans/summit",
        "color": "#f59e0b",
    },
]

SYSTEM_PROMPT = """
You are Alex, a senior support advisor at WolvCapital. You are warm, professional, and highly knowledgeable.

RESPONSE RULES:
- Be concise but complete. Never truncate important information.
- When asked about plans/investments, respond ONLY with: SHOW_PLANS
- When asked about staking, WOLV token, or how it works, explain clearly with exact figures.
- Always use exact numbers: APY rates, contract addresses, fees, durations.
- Never say "I recommend visiting our website" without also answering the question directly.
- When a user seems ready to invest, direct them to: https://www.wolvcapital.com/dashboard
- For KYC questions, explain the 4-step process clearly.
- For withdrawal questions, state: $5 flat fee + 2% of amount, KYC required.

ABOUT WOLVCAPITAL:
WolvCapital is a blockchain-verified investment platform on BNB Smart Chain. Every return is recorded on-chain — independently verifiable on BSCScan.
- WOLV Token: 0xe0167279aef7bf4ad313d261da82e8366822270c
- Reward Pool: 0xb233cf74b14abf9d9702d585c540030125599579 (1,000,000 WOLV fixed)
- Audit score: 87.14/100 — no critical vulnerabilities
- FinCEN MSB registered · KYC/AML compliant · 256-bit SSL

INVESTMENT PLANS:
1. Pioneer — 8% APY · 90 days · $100–$999
2. Vanguard — 12% APY · 150 days · $1,000–$4,999
3. Horizon — 18% APY · 180 days · $5,000–$14,999
4. Summit VIP — 25% APY · 365 days · $15,000–$50,000

FEES: $5 flat + 2% withdrawal fee. Minimum deposit $50. KYC required before any withdrawal.

RISK: Digital assets are volatile. APY figures are projections, not guarantees. Only invest what you can afford to lose.
"""

PLAN_KEYWORDS = [
    "plan", "plans", "investment", "invest", "apy", "returns", "pioneer",
    "vanguard", "horizon", "summit", "staking plan", "which plan", "what plan",
    "show me", "options", "packages", "tiers",
]


def _wants_plans(text: str) -> bool:
    t = text.lower()
    return any(k in t for k in PLAN_KEYWORDS)


def extract_user_message(payload: dict) -> str:
    if isinstance(payload.get("message"), str):
        return payload["message"].strip()
    for item in payload.get("messages", []):
        if item.get("role") == "user":
            return item["content"].strip()
    return ""


def get_recent_session_messages(session_id: str, limit: int = 6) -> list[dict]:
    messages = (
        ChatMessage.objects.filter(session_id=session_id)
        .order_by("-created_at")[:limit]
    )
    result = []
    for m in reversed(list(messages)):
        result.append({"role": m.role, "content": m.content})
    return result


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

    ChatMessage.objects.create(
        session_id=session_id,
        role=ChatMessage.USER,
        content=user_content,
        is_human_handover=False,
    )

    # Telegram alert
    try:
        from .telegram import notify_new_message
        _sess = ChatSession.objects.filter(session_id=session_id).first()
        notify_new_message(
            session_id, user_content,
            user_name=(_sess.user_name if _sess else "") or "",
            user_email=(_sess.user_email if _sess else "") or "",
        )
    except Exception as _e:
        print(f"[Telegram] notify failed: {_e}")

    # Human agent active — skip AI
    try:
        _active = ChatSession.objects.filter(session_id=session_id, status="active").exists()
    except Exception:
        _active = False
    if _active:
        return JsonResponse({"reply": None, "human_active": True})

    # Detect plan intent — return structured cards
    if _wants_plans(user_content):
        reply_text = "Here are our current investment plans:"
        ChatMessage.objects.create(
            session_id=session_id,
            role=ChatMessage.ASSISTANT,
            content=reply_text,
            is_human_handover=False,
        )
        return JsonResponse({
            "reply": reply_text,
            "type": "plans",
            "plans": PLANS_DATA,
        })

    session_history = get_recent_session_messages(session_id)
    prompt_messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *session_history,
        {"role": "user", "content": user_content},
    ]

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=800,
            temperature=0.5,
            messages=prompt_messages,
        )

        reply = ""
        if getattr(response, "choices", None):
            first_choice = response.choices[0]
            reply = getattr(getattr(first_choice, "message", None), "content", "") or ""

        # Strip SHOW_PLANS if model returns it anyway
        if "SHOW_PLANS" in reply:
            reply = "Here are our current investment plans:"
            ChatMessage.objects.create(
                session_id=session_id,
                role=ChatMessage.ASSISTANT,
                content=reply,
                is_human_handover=False,
            )
            return JsonResponse({
                "reply": reply,
                "type": "plans",
                "plans": PLANS_DATA,
            })

        with transaction.atomic():
            ChatMessage.objects.create(
                session_id=session_id,
                role=ChatMessage.ASSISTANT,
                content=reply,
                is_human_handover=False,
            )

        return JsonResponse({"reply": reply, "type": "text"})

    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)


@csrf_exempt
def request_human(request):
    if request.method == "GET":
        return JsonResponse({"status": "ok"})
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    session_id = str(payload.get("session_id", "")).strip()
    user_email = str(payload.get("user_email", "")).strip()
    user_name = str(payload.get("user_name", "")).strip()

    if not session_id:
        return JsonResponse({"error": "session_id required"}, status=400)

    session, _ = ChatSession.objects.get_or_create(session_id=session_id)
    session.status = "waiting"
    if user_email:
        session.user_email = user_email
    if user_name:
        session.user_name = user_name
    session.human_requested_at = timezone.now()
    session.save()

    try:
        from .telegram import notify_human_requested
        notify_human_requested(session_id, user_email=user_email, user_name=user_name)
    except Exception as e:
        print(f"[Telegram] human request notify failed: {e}")

    return JsonResponse({"status": "waiting", "message": "A human agent will join shortly."})


@csrf_exempt
def agent_reply(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    session_id = str(payload.get("session_id", "")).strip()
    message = str(payload.get("message", "")).strip()

    if not session_id or not message:
        return JsonResponse({"error": "session_id and message required"}, status=400)

    session, _ = ChatSession.objects.get_or_create(session_id=session_id)
    if session.status in ("bot", "waiting"):
        session.status = "active"
        if not session.agent_joined_at:
            session.agent_joined_at = timezone.now()
        session.save(update_fields=["status", "agent_joined_at", "updated_at"])

    ChatMessage.objects.create(
        session_id=session_id,
        role=ChatMessage.ASSISTANT,
        content=message,
        is_human_handover=True,
    )
    return JsonResponse({"status": "sent"})


@csrf_exempt
def manage_session(request):
    if request.method == "GET":
        sessions = ChatSession.objects.order_by("-updated_at")[:50]
        return JsonResponse({
            "sessions": [
                {
                    "session_id": s.session_id,
                    "user_email": s.user_email,
                    "user_name": s.user_name,
                    "status": s.status,
                    "human_requested_at": s.human_requested_at.isoformat() if s.human_requested_at else None,
                    "updated_at": s.updated_at.isoformat(),
                }
                for s in sessions
            ]
        })
    if request.method == "POST":
        try:
            payload = json.loads(request.body.decode("utf-8"))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        action = payload.get("action")
        session_id = payload.get("session_id")
        if action == "close" and session_id:
            ChatSession.objects.filter(session_id=session_id).update(status="closed")
            return JsonResponse({"status": "closed"})
    return JsonResponse({"error": "Invalid request"}, status=400)


@csrf_exempt
def get_messages(request, session_id: str):
    messages = ChatMessage.objects.filter(session_id=session_id).order_by("created_at")
    return JsonResponse({
        "messages": [
            {
                "role": m.role,
                "content": m.content,
                "is_human_handover": m.is_human_handover,
                "created_at": m.created_at.isoformat(),
            }
            for m in messages
        ]
    })


@csrf_exempt
def visitor_ping(request):
    if request.method != "POST":
        return JsonResponse({"status": "ok"})
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"status": "ok"})
    session_id = str(payload.get("session_id", "")).strip()
    page = str(payload.get("page", "")).strip()
    if session_id:
        session, created = ChatSession.objects.get_or_create(session_id=session_id)
        if page and not session.user_name:
            pass
        session.save(update_fields=["updated_at"])
    return JsonResponse({"status": "ok"})
