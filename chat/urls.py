from django.urls import path
from .views import chat, request_human, agent_reply, manage_session, get_messages, visitor_ping

urlpatterns = [
    path("", chat, name="chat"),
    path("human/", request_human, name="chat_human"),
    path("agent-reply/", agent_reply, name="agent_reply"),
    path("sessions/", manage_session, name="chat_sessions"),
    path("messages/<str:session_id>/", get_messages, name="chat_messages"),
    path("visitor/", visitor_ping, name="visitor_ping"),
]
