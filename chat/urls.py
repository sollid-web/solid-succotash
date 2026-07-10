from django.urls import path
from django.http import JsonResponse
from .views import chat, request_human, agent_reply, manage_session, get_messages, visitor_ping

def _placeholder(request, **kwargs):
    return JsonResponse({"error": "module not loaded"}, status=503)

try:
    from .telegram_webhook import telegram_webhook
except Exception as e:
    print(f"[chat.urls] telegram_webhook import failed: {e}")
    telegram_webhook = _placeholder

try:
    from .widget_view import widget_js
except Exception as e:
    print(f"[chat.urls] widget_view import failed: {e}")
    widget_js = _placeholder

urlpatterns = [
    path("test/", lambda r: __import__("django.http", fromlist=["JsonResponse"]).JsonResponse({"ok": True}), name="chat_test"),
    path("", chat, name="chat"),
    path("human/", request_human, name="chat_human"),
    path("agent-reply/", agent_reply, name="agent_reply"),
    path("sessions/", manage_session, name="chat_sessions"),
    path("messages/<str:session_id>/", get_messages, name="chat_messages"),
    path("visitor/", visitor_ping, name="visitor_ping"),
    path("telegram-webhook/", telegram_webhook, name="telegram_webhook"),
    path("widget.js", widget_js, name="widget_js"),
]
