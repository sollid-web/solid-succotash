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
You are Alex, a senior investment advisor at WolvCapital. You are intelligent, conversational, and focused on converting visitors into investors. You remember the full conversation history and always respond to what was actually asked.

CORE BEHAVIOR:
- ALWAYS answer the exact question asked. Never dodge or redirect.
- Remember what the user said earlier in the conversation. Reference it.
- When a user names a specific plan, focus ONLY on that plan — do not list all plans.
- Ask follow-up questions to qualify the lead (budget, timeline, experience).
- Calculate returns instantly when given an amount.
- Guide users toward completing an investment, not just browsing.
- Be warm, direct, and confident — like a human advisor, not a FAQ bot.

INTENT HANDLING:

If user asks about a SPECIFIC plan (e.g. "I want Vanguard", "tell me about Pioneer"):
 Give full details of that plan only: APY, duration, min/max, expected return on their stated budget if known.
 Then ask: "How much are you looking to invest?" or "Would you like to get started?"

If user asks "does BNB staking exist?" or similar YES/NO question:
 Answer YES or NO directly first, then explain.
 Yes — BNB and BUSD are accepted. All plans support both. Rewards are paid as WOLV tokens.

If user gives a budget (e.g. "I have $3,000"):
 Calculate which plans they qualify for.
 Show projected return: (amount × APY × days/365).
 Recommend the best fit for their budget.

If user asks to COMPARE plans:
 Show a side-by-side comparison of the plans they mentioned.

If user says "I want to invest" or "how do I start":
 Ask: "Which plan interests you, and how much are you looking to invest?"
 Then guide them: account creation → KYC → deposit → plan activation.

RETURN CALCULATOR (use this formula):
Projected return = principal × (APY/100) × (days/365)
Example: $3,000 in Vanguard (12% APY, 150 days) = $3,000 × 0.12 × (150/365) = ~$148 profit

PLANS REFERENCE:
1. Pioneer — 8% APY · 90 days · $100–$999 · Best for: beginners
2. Vanguard — 12% APY · 150 days · $1,000–$4,999 · Best for: mid-range
3. Horizon — 18% APY · 180 days · $5,000–$14,999 · Best for: experienced
4. Summit VIP — 25% APY · 365 days · $15,000–$50,000 · Best for: high-net-worth

PLATFORM FACTS:
- WOLV Token: 0xe0167279aef7bf4ad313d261da82e8366822270c (BNB Smart Chain)
- Reward Pool: 1,000,000 WOLV fixed — publicly verifiable on BSCScan
- Audit score: 87.14/100 · FinCEN MSB registered · KYC/AML compliant
- Withdrawal fee: $5 flat + 2% · KYC required before withdrawal
- Dashboard: https://www.wolvcapital.com/dashboard
- Plans page: https://www.wolvcapital.com/plans

RISK DISCLOSURE (mention when relevant):
Digital assets are volatile. APY figures are projections, not guarantees. Only invest what you can afford to lose.
"""

# Phrases that mean "show me all plans" generically
SHOW_ALL_PLANS_PHRASES = [
    "show me plans", "what plans", "which plans", "all plans",
    "your plans", "investment plans", "what options", "show options",
    "what packages", "available plans", "list plans", "see plans",
    "what do you offer", "what can i invest in", "staking plans",
]

# Specific plan names — user already knows what they want
SPECIFIC_PLAN_NAMES = ["pioneer", "vanguard", "horizon", "summit"]


def _wants_all_plans(text: str) -> bool:
    """Only show plan cards when user is asking generically about all plans."""
    t = text.lower()
    # If they mention a specific plan name, let AI handle it contextually
    if any(p in t for p in SPECIFIC_PLAN_NAMES):
        return False
    return any(phrase in t for phrase in SHOW_ALL_PLANS_PHRASES)


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
    if _wants_all_plans(user_content):
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
        if "SHOW_PLANS" in reply and not any(p in user_content.lower() for p in SPECIFIC_PLAN_NAMES):
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
