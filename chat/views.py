import json

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from groq import Groq

client = Groq(api_key=settings.GROQ_API_KEY)

SYSTEM_PROMPT = (
    "You are a professional support agent for WolvCapital — a premium capital markets platform. "
    "Help users with portfolios, pricing, API integration, billing, and account issues. "
    "Be warm, concise, and solution-focused. Keep replies to 2–4 sentences. "
    "If the user needs deeper support, escalate to a senior advisor or suggest submitting a support ticket."
)


@csrf_exempt
@require_POST
def chat(request):
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON body."}, status=400)

    messages = payload.get("messages", [])
    if not isinstance(messages, list):
        return JsonResponse({"error": "Invalid messages payload."}, status=400)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=1000,
            temperature=0.7,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *messages,
            ],
        )

        reply = ""
        if getattr(response, "choices", None):
            first_choice = response.choices[0]
            reply = getattr(getattr(first_choice, "message", None), "content", "") or ""

        return JsonResponse({"reply": reply})

    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)
