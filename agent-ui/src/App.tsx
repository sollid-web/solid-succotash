import React, { useEffect, useRef, useState, useCallback } from "react";

const API = "https://api.wolvcapital.com/api/chat";

type Status = "bot" | "waiting" | "active" | "closed";

interface Session {
  session_id: string;
  user_email: string | null;
  user_name: string | null;
  status: Status;
  human_requested_at: string | null;
  updated_at: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  is_human_handover: boolean;
  created_at: string;
}

const STATUS_LABEL: Record<Status, string> = {
  bot: "Bot",
  waiting: "Waiting",
  active: "Live",
  closed: "Closed",
};

const STATUS_COLOR: Record<Status, string> = {
  bot: "#475569",
  waiting: "#f59e0b",
  active: "#10b981",
  closed: "#334155",
};

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#1e3a5f,#2563eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [lastPoll, setLastPoll] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      const r = await fetch(`${API}/sessions/`);
      const j = await r.json();
      setSessions(j.sessions || []);
      setLastPoll(new Date().toLocaleTimeString());
    } catch {}
  }, []);

  const fetchMessages = useCallback(async (sid: string) => {
    try {
      const r = await fetch(`${API}/messages/${sid}/`);
      const j = await r.json();
      setMessages(j.messages || []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchSessions();
    pollRef.current = setInterval(fetchSessions, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchSessions]);

  useEffect(() => {
    if (!selected) return;
    fetchMessages(selected);
    const t = setInterval(() => fetchMessages(selected), 3000);
    return () => clearInterval(t);
  }, [selected, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim() || !selected || sending) return;
    setSending(true);
    const text = reply.trim();
    setReply("");
    try {
      await fetch(`${API}/agent-reply/`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ session_id: selected, message: text }),
      });
      fetchMessages(selected);
    } catch {}
    setSending(false);
  };

  const closeSession = async (sid: string) => {
    await fetch(`${API}/sessions/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "close", session_id: sid }),
    });
    if (selected === sid) setSelected(null);
    fetchSessions();
  };

  const filteredSessions = sessions.filter(
    (s) => filter === "all" || s.status === filter
  );

  const selectedSession = sessions.find((s) => s.session_id === selected);

  const waitingCount = sessions.filter((s) => s.status === "waiting").length;
  const activeCount = sessions.filter((s) => s.status === "active").length;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#060c1a",
        color: "#e8eaf0",
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: 300,
          borderRight: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 18px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "#2563eb",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                color: "#fff",
                fontFamily: "Georgia, serif",
              }}
            >
              W
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>
                Agent Dashboard
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>WolvCapital Support</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                flex: 1,
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b" }}>
                {waitingCount}
              </div>
              <div style={{ fontSize: 10, color: "#78716c" }}>Waiting</div>
            </div>
            <div
              style={{
                flex: 1,
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: "#10b981" }}>
                {activeCount}
              </div>
              <div style={{ fontSize: 10, color: "#475569" }}>Live</div>
            </div>
            <div
              style={{
                flex: 1,
                background: "rgba(99,179,237,0.07)",
                border: "1px solid rgba(99,179,237,0.15)",
                borderRadius: 8,
                padding: "8px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: "#63b3ed" }}>
                {sessions.length}
              </div>
              <div style={{ fontSize: 10, color: "#475569" }}>Total</div>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "10px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexWrap: "wrap",
          }}
        >
          {(["all", "waiting", "active", "bot", "closed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 10px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: filter === f ? "#2563eb" : "rgba(255,255,255,0.1)",
                background: filter === f ? "rgba(37,99,235,0.15)" : "transparent",
                color: filter === f ? "#63b3ed" : "#475569",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: filter === f ? 600 : 400,
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredSessions.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "#334155",
                fontSize: 13,
              }}
            >
              No sessions
            </div>
          ) : (
            filteredSessions.map((s) => (
              <div
                key={s.session_id}
                onClick={() => setSelected(s.session_id)}
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  background:
                    selected === s.session_id
                      ? "rgba(37,99,235,0.1)"
                      : "transparent",
                  borderLeft:
                    selected === s.session_id
                      ? "2px solid #2563eb"
                      : "2px solid transparent",
                  transition: "background 0.15s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 4,
                  }}
                >
                  <Avatar name={s.user_name || s.user_email || s.session_id} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#e8eaf0",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.user_name || s.user_email || s.session_id.slice(0, 12) + "…"}
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      {timeAgo(s.updated_at)}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: STATUS_COLOR[s.status],
                      background: `${STATUS_COLOR[s.status]}18`,
                      padding: "2px 7px",
                      borderRadius: 10,
                      border: `1px solid ${STATUS_COLOR[s.status]}40`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {STATUS_LABEL[s.status]}
                  </span>
                </div>
                {s.user_email && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#334155",
                      paddingLeft: 44,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {s.user_email}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Poll indicator */}
        <div
          style={{
            padding: "8px 14px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            fontSize: 10,
            color: "#1e3a5f",
          }}
        >
          {lastPoll ? `↻ ${lastPoll}` : "Connecting…"}
        </div>
      </div>

      {/* MAIN PANEL */}
      {selected && selectedSession ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Chat header */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "#080f1f",
            }}
          >
            <Avatar
              name={
                selectedSession.user_name ||
                selectedSession.user_email ||
                selectedSession.session_id
              }
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff" }}>
                {selectedSession.user_name || selectedSession.user_email || "Visitor"}
              </div>
              <div style={{ fontSize: 12, color: "#475569" }}>
                {selectedSession.user_email && `${selectedSession.user_email} · `}
                Session: {selectedSession.session_id.slice(0, 16)}…
              </div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: STATUS_COLOR[selectedSession.status],
                background: `${STATUS_COLOR[selectedSession.status]}18`,
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid ${STATUS_COLOR[selectedSession.status]}40`,
              }}
            >
              {STATUS_LABEL[selectedSession.status]}
            </span>
            {selectedSession.status !== "closed" && (
              <button
                onClick={() => closeSession(selected)}
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#f87171",
                  borderRadius: 7,
                  padding: "6px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Close
              </button>
            )}
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background: "#060c1a",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "#1e3a5f",
                  fontSize: 13,
                  marginTop: 40,
                }}
              >
                No messages yet
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-start" : "flex-end",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      padding: "10px 14px",
                      borderRadius: 12,
                      fontSize: 14,
                      lineHeight: 1.55,
                      background:
                        m.role === "user"
                          ? "#0f1729"
                          : m.is_human_handover
                          ? "rgba(37,99,235,0.2)"
                          : "rgba(16,185,129,0.1)",
                      border:
                        m.role === "user"
                          ? "1px solid rgba(255,255,255,0.07)"
                          : m.is_human_handover
                          ? "1px solid rgba(37,99,235,0.3)"
                          : "1px solid rgba(16,185,129,0.2)",
                      color:
                        m.role === "user"
                          ? "#94a3b8"
                          : m.is_human_handover
                          ? "#93c5fd"
                          : "#6ee7b7",
                      borderBottomLeftRadius: m.role === "user" ? 4 : 12,
                      borderBottomRightRadius: m.role === "user" ? 12 : 4,
                    }}
                  >
                    <div style={{ marginBottom: 4 }}>{m.content}</div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#334155",
                        textAlign: "right",
                      }}
                    >
                      {m.is_human_handover ? "👤 Agent" : m.role === "assistant" ? "🤖 Alex" : ""}
                      {" · "}
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply box */}
          {selectedSession.status !== "closed" && (
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                background: "#080f1f",
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
                placeholder="Type your reply… (Enter to send, Shift+Enter for newline)"
                rows={2}
                style={{
                  flex: 1,
                  background: "#0f1729",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "#e8eaf0",
                  fontSize: 14,
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                }}
              />
              <button
                onClick={sendReply}
                disabled={sending || !reply.trim()}
                style={{
                  background: sending || !reply.trim() ? "#1e3a5f" : "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: sending || !reply.trim() ? "not-allowed" : "pointer",
                  opacity: sending || !reply.trim() ? 0.5 : 1,
                  whiteSpace: "nowrap",
                  height: 44,
                }}
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
            color: "#1e3a5f",
          }}
        >
          <div style={{ fontSize: 40 }}>💬</div>
          <div style={{ fontSize: 15, color: "#334155" }}>
            Select a session to view the conversation
          </div>
          <div style={{ fontSize: 12, color: "#1e3a5f" }}>
            Polling every 5s · {sessions.length} session(s) loaded
          </div>
        </div>
      )}
    </div>
  );
}
