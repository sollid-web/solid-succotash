from django.urls import path
from .views import chat, request_human, agent_reply, get_sessions, get_messages

urlpatterns = [
    path("", chat, name="chat"),
    path("human/", request_human, name="chat_human"),
    path("agent-reply/", agent_reply, name="agent_reply"),
    path("sessions/", get_sessions, name="chat_sessions"),
    path("messages/<str:session_id>/", get_messages, name="chat_messages"),
]
