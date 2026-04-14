"use client"

import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from "react"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
  time: string
}

type TrailItem = {
  url: string
  label: string
  time: string
}

type Visitor = {
  id: number
  label: string
  emoji: string
  city: string
  device: string
  page: string
  status: "active" | "new" | "idle"
  trail: TrailItem[]
  arrived: string
}

type ToastType = "visitor" | "link-click" | "chat"

type ToastItem = {
  id: string
  type: ToastType
  title: string
  desc: string
}

type TicketForm = {
  name: string
  email: string
  category: string
  priority: string
  description: string
}

const pages = [
  "/",
  "/markets",
  "/portfolio",
  "/pricing",
  "/about",
  "/docs",
  "/api",
  "/signup",
  "/contact",
]

const pageNames: Record<string, string> = {
  "/": "Home",
  "/markets": "Markets",
  "/portfolio": "Portfolio",
  "/pricing": "Pricing",
  "/about": "About",
  "/docs": "Documentation",
  "/api": "API Access",
  "/signup": "Get Started",
  "/contact": "Contact Sales",
}

const cities = [
  "London",
  "New York",
  "Dubai",
  "Singapore",
  "Toronto",
  "Frankfurt",
  "Tokyo",
  "Sydney",
  "Zurich",
]

const devices = [
  "Chrome · macOS",
  "Safari · iPhone",
  "Firefox · Windows",
  "Edge · Windows",
  "Chrome · Android",
  "Safari · iPad",
]

const faqs = [
  {
    q: "How do I connect my portfolio?",
    a: "Use the Portfolio page to connect your broker. WolvCapital supports 50+ brokers via secure OAuth integration.",
  },
  {
    q: "What are the pricing tiers?",
    a: "WolvCapital offers Starter, Pro, and Enterprise plans. Annual subscriptions save up to 20%.",
  },
  {
    q: "How do I access the API?",
    a: "Generate a key from the API section in your account. Full docs are available in the developer portal.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. WolvCapital uses AES-256 encryption at rest and TLS 1.3 in transit.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Cancel from Billing settings. Access remains active until the end of your current billing cycle.",
  },
]

function timeNow() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function makeVisitor(id: number): Visitor {
  const page = randomItem(pages)
  return {
    id,
    label: `Visitor #${1000 + id}`,
    emoji: ["🦁", "🐺", "🦊", "🐯", "🦅", "🐻"][id % 6],
    city: randomItem(cities),
    device: randomItem(devices),
    page,
    status: randomItem(["active", "active", "new", "idle"]),
    trail: [
      {
        url: page,
        label: pageNames[page] || page,
        time: timeNow(),
      },
    ],
    arrived: timeNow(),
  }
}

export default function SupportChat() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || ""
  const [dashOpen, setDashOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [newToday, setNewToday] = useState(0)
  const [chatCount, setChatCount] = useState(0)
  const [unread, setUnread] = useState(1)
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to WolvCapital Support! I'm here to help with plans, portfolio questions, or account issues.",
      time: timeNow(),
    },
  ])
  const [history, setHistory] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [faqFilter, setFaqFilter] = useState("")
  const [ticket, setTicket] = useState<TicketForm>({
    name: "",
    email: "",
    category: "",
    priority: "High",
    description: "",
  })
  const [ticketSuccess, setTicketSuccess] = useState(false)
  const [tab, setTab] = useState<"chat" | "faq" | "ticket">("chat")
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [clock, setClock] = useState(timeNow())
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const filteredFaqs = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(faqFilter.toLowerCase()) ||
          faq.a.toLowerCase().includes(faqFilter.toLowerCase()),
      ),
    [faqFilter],
  )

  useEffect(() => {
    const initialVisitors: Visitor[] = []
    let index = 0
    const baseVisitor = makeVisitor(index++)
    baseVisitor.label = "You (Current User)"
    baseVisitor.emoji = "🧑‍💼"
    baseVisitor.city = "Your City"
    baseVisitor.status = "active"
    initialVisitors.push(baseVisitor)

    for (let i = 0; i < 3; i += 1) {
      const visitor = makeVisitor(index++)
      visitor.status = ["active", "idle", "active"][i]
      const extraPage = randomItem(pages)
      visitor.trail.push({
        url: extraPage,
        time: timeNow(),
        label: pageNames[extraPage] || extraPage,
      })
      initialVisitors.push(visitor)
    }

    setVisitors(initialVisitors)
    setNewToday(initialVisitors.length)
  }, [])

  useEffect(() => {
    const visitorTimer = window.setInterval(() => {
      setVisitors((current) => {
        const nextVisitor = makeVisitor(current.length ? current[current.length - 1].id + 1 : 1)
        return current.length >= 8 ? [...current.slice(1), nextVisitor] : [...current, nextVisitor]
      })
      setNewToday((count) => count + 1)
      showToast(
        "visitor",
        "👤 New Visitor Arrived",
        "A fresh visitor just landed on the site.",
      )
    }, 12000)

    const navTimer = window.setInterval(() => {
      setVisitors((current) => {
        if (!current.length) return current
        const targetIndex = Math.floor(Math.random() * current.length)
        const updated = [...current]
        const visitor = { ...updated[targetIndex] }
        const nextPage = randomItem(pages)
        if (nextPage !== visitor.page) {
          visitor.page = nextPage
          visitor.status = "active"
          visitor.trail = [
            ...visitor.trail,
            {
              url: nextPage,
              time: timeNow(),
              label: pageNames[nextPage] || nextPage,
            },
          ]
          updated[targetIndex] = visitor
          showToast(
            "link-click",
            "🔗 Visitor Navigation",
            `${visitor.emoji} ${visitor.label} moved to ${pageNames[nextPage] || nextPage}`,
          )
        }
        return updated
      })
    }, 9000)

    const clockTimer = window.setInterval(() => {
      setClock(timeNow())
    }, 1000)

    return () => {
      window.clearInterval(visitorTimer)
      window.clearInterval(navTimer)
      window.clearInterval(clockTimer)
    }
  }, [])

  useEffect(() => {
    if (chatOpen) {
      setUnread(0)
    }
  }, [chatOpen])

  useEffect(() => {
    if (!selectedVisitor) return
    setSelectedVisitor((current) => {
      if (!current) return null
      return visitors.find((visitor) => visitor.id === current.id) || current
    })
  }, [visitors, selectedVisitor])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, chatOpen])

  function showToast(type: ToastType, title: string, desc: string) {
    const id = `${type}-${Date.now()}`
    const toast: ToastItem = { id, type, title, desc }
    setToasts((current) => [...current, toast])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4000)
  }

  function openDetail(visitor: Visitor) {
    setSelectedVisitor(visitor)
  }

  function closeDetail() {
    setSelectedVisitor(null)
  }

  function handleNavClick(label: string, url: string) {
    setVisitors((current) => {
      const updated = current.map((visitor) => {
        if (visitor.id !== 0) return visitor
        const nextTrail = [
          ...visitor.trail,
          { url, time: timeNow(), label },
        ]
        return {
          ...visitor,
          page: url,
          status: "active",
          trail: nextTrail,
        }
      })
      return updated
    })
    showToast("link-click", `🔗 You navigated: ${label}`, `Tracked navigation to ${url}`)
  }

  const activeCount = visitors.filter((visitor) => visitor.status !== "idle").length

  async function sendMessage(overrideText?: string) {
    const trimmed = (overrideText ?? input).trim()
    if (!trimmed) return

    const userMessage: ChatMessage = { role: "user", content: trimmed, time: timeNow() }
    setMessages((current) => [...current, userMessage])
    setHistory((current) => [...current, { role: "user", content: trimmed }].slice(-20))
    setInput("")
    setLoading(true)
    setChatCount((count) => count + 1)

    if (!backendUrl) {
      const fallback = {
        role: "assistant" as const,
        content:
          "⚠️ Backend API URL is not configured. Set NEXT_PUBLIC_API_URL in frontend/.env.local and restart the app.",
        time: timeNow(),
      }
      setMessages((current) => [...current, fallback])
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${backendUrl}/api/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...history, { role: "user", content: trimmed }] }),
      })
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      const reply = data.reply || "I couldn't process that. Please try again or submit a ticket."
      const assistantMessage: ChatMessage = { role: "assistant", content: reply, time: timeNow() }
      setMessages((current) => [...current, assistantMessage])
      setHistory((current) => [...current, { role: "assistant", content: reply }].slice(-20))
      showToast("chat", "💬 Support Reply", reply)
    } catch (error) {
      const errMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again later."
      setMessages((current) => [
        ...current,
        { role: "assistant", content: `⚠️ ${errMessage}`, time: timeNow() },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSendKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  function handleTicketSubmit() {
    if (!ticket.name || !ticket.email || !ticket.category || !ticket.description) {
      window.alert("Please fill in all ticket fields before submitting.")
      return
    }

    setTicketSuccess(true)
    showToast("chat", "🎟 Ticket Submitted", `${ticket.name} submitted a new support ticket.`)
    setTicket({ name: "", email: "", category: "", priority: "High", description: "" })
    setTimeout(() => setTicketSuccess(false), 5000)
  }

  return (
    <div className="support-chat-widget">
      <div className="notif-toasts">
        {toasts.map((toast) => (
          <div key={toast.id} className={`notif-toast ${toast.type}`}>
            <div className="toast-icon">{toast.type === "visitor" ? "👤" : toast.type === "link-click" ? "🔗" : "💬"}</div>
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-desc">{toast.desc}</div>
            </div>
            <button className="toast-close" onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <button className="dash-toggle" onClick={() => setDashOpen((open) => !open)} title="Open Agent Dashboard">
        <div className="live-dot" />
        AGENT PANEL
      </button>

      <div className={`agent-dashboard ${dashOpen ? "open" : ""}`}>
        <div className="dash-header">
          <div className="dash-title">
            <div className="live-dot" />
            WolvCapital · Live Visitors
          </div>
          <div className="dash-sub">{clock}</div>
        </div>
        <div className="dash-stats">
          <div className="stat-box">
            <div className="stat-num">{activeCount}</div>
            <div className="stat-lbl">Active</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{newToday}</div>
            <div className="stat-lbl">New Today</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{chatCount}</div>
            <div className="stat-lbl">Chats</div>
          </div>
        </div>
        <div className="visitors-section">
          <div className="section-label">Live Visitors</div>
          {visitors.length === 0 ? (
            <div className="visitor-card">No visitors yet.</div>
          ) : (
            visitors.slice().reverse().map((visitor) => {
              const badgeClass = visitor.status === "new" ? "badge-new" : visitor.status === "active" ? "badge-active" : "badge-idle"
              const label = visitor.status === "new" ? "NEW" : visitor.status === "active" ? "ACTIVE" : "IDLE"
              return (
                <div key={visitor.id} className={`visitor-card ${visitor.status === "active" ? "active" : ""} ${visitor.status === "new" ? "new-visitor" : ""}`} onClick={() => openDetail(visitor)}>
                  <div className="visitor-top">
                    <div className="visitor-icon">{visitor.emoji}</div>
                    <div className="visitor-id">{visitor.label}</div>
                    <span className={`visitor-badge ${badgeClass}`}>{label}</span>
                  </div>
                  <div className="visitor-page">
                    Now: <span className="page-pill">{pageNames[visitor.page] || visitor.page}</span>
                  </div>
                  <div className="link-trail">
                    {visitor.trail.slice(-2).map((trail, index) => (
                      <div className="trail-item" key={`${visitor.id}-${index}`}>
                        <span className="trail-arrow">→</span>
                        <span className="trail-link">{trail.label}</span>
                        <span className="trail-time">{trail.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="visitor-time">📍 {visitor.city} · {visitor.device} · Arrived {visitor.arrived}</div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className={`visitor-detail ${selectedVisitor ? "open" : ""}`} onClick={(event) => {
        if (event.target === event.currentTarget) closeDetail()
      }}>
        <div className="vd-panel">
          <div className="vd-header">
            <div className="vd-title">{selectedVisitor ? `${selectedVisitor.emoji} ${selectedVisitor.label}` : "Visitor Details"}</div>
            <button className="vd-close" onClick={closeDetail}>
              ✕
            </button>
          </div>
          {selectedVisitor ? (
            <>
              <div className="vd-info-grid">
                <div className="vd-info-box">
                  <div className="vd-info-lbl">Location</div>
                  <div className="vd-info-val">📍 {selectedVisitor.city}</div>
                </div>
                <div className="vd-info-box">
                  <div className="vd-info-lbl">Device</div>
                  <div className="vd-info-val">💻 {selectedVisitor.device}</div>
                </div>
                <div className="vd-info-box">
                  <div className="vd-info-lbl">Status</div>
                  <div className="vd-info-val">{selectedVisitor.status.toUpperCase()}</div>
                </div>
                <div className="vd-info-box">
                  <div className="vd-info-lbl">Arrived</div>
                  <div className="vd-info-val">🕐 {selectedVisitor.arrived}</div>
                </div>
              </div>
              <div className="vd-section-title">🔗 Navigation Trail ({selectedVisitor.trail.length} pages)</div>
              {selectedVisitor.trail.map((trail, index) => (
                <div className="vd-trail-item" key={`${selectedVisitor.id}-${index}`}>
                  <div className="vd-trail-num">{index + 1}</div>
                  <div className="vd-trail-url">{trail.label}</div>
                  <div className="vd-trail-time">{trail.time}</div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>

      <button className="chat-launcher" onClick={() => setChatOpen((open) => !open)} aria-label="Chat with WolvCapital Support">
        <div className="notif-dot">{unread > 0 ? unread : ""}</div>
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      </button>

      <div className={`chat-window ${chatOpen ? "open" : ""}`}>
        <div className="chat-header">
          <div className="agent-av">W</div>
          <div className="agent-info">
            <div className="agent-name">Wolv<span>Capital</span> Support</div>
            <div className="agent-status"><div className="dot" />Online · usually instant</div>
          </div>
          <div className="hdr-btns">
            <button className="hdr-btn" type="button" title="Close chat" onClick={() => setChatOpen(false)}>－</button>
          </div>
        </div>

        <div className="chat-tabs">
          <button className={`tab-btn ${tab === "chat" ? "active" : ""}`} type="button" onClick={() => setTab("chat")}>💬 Chat</button>
          <button className={`tab-btn ${tab === "faq" ? "active" : ""}`} type="button" onClick={() => setTab("faq")}>📖 FAQ</button>
          <button className={`tab-btn ${tab === "ticket" ? "active" : ""}`} type="button" onClick={() => setTab("ticket")}>🎟 Ticket</button>
        </div>

        {tab === "chat" ? (
          <>
            <div className="chat-messages" id="messages">
              <div className="day-div">Today</div>
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}-${message.time}`} className={`msg-row ${message.role === "user" ? "user" : ""}`}>
                  <div className={`msg-av ${message.role === "user" ? "u" : ""}`}>{message.role === "user" ? "👤" : "W"}</div>
                  <div className="bub-wrap">
                    <div className={`bub ${message.role === "user" ? "user-bub" : "agent-bub"}`}>{message.content}</div>
                    <div className="msg-t">{message.time}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="quick-reps">
              {[
                { label: "📊 My Portfolio", value: "Check my portfolio" },
                { label: "💰 Pricing", value: "Pricing plans" },
                { label: "🔌 API Help", value: "API integration help" },
                { label: "🙋 Advisor", value: "Speak to an advisor" },
              ].map((reply) => (
                <button key={reply.value} className="qr" onClick={() => sendMessage(reply.value)} type="button">
                  {reply.label}
                </button>
              ))}
            </div>

            <div className="chat-input-area">
              <div className="input-row">
                <textarea
                  id="chat-input"
                  placeholder="Ask WolvCapital anything…"
                  rows={1}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleSendKey}
                  className="chat-textarea"
                />
                <button className="send-btn" type="button" onClick={sendMessage} disabled={loading}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
              <div className="input-footer">
                <div className="powered-by">Powered by <strong>WolvCapital</strong> AI</div>
                <div className="char-count">{input.length}/500</div>
              </div>
            </div>
          </>
        ) : tab === "faq" ? (
          <div className="faq-panel">
            <input
              className="faq-search"
              placeholder="🔍 Search help articles…"
              value={faqFilter}
              onChange={(event) => setFaqFilter(event.target.value)}
            />
            <div className="faq-list">
              {filteredFaqs.map((faq) => (
                <div className="faq-item" key={faq.q}>
                  <button type="button" className="faq-q" onClick={(event) => {
                    const item = event.currentTarget.parentElement
                    item?.classList.toggle("open")
                  }}>
                    {faq.q}<span className="arr">▼</span>
                  </button>
                  <div className="faq-a">{faq.a}</div>
                </div>
              ))}
              {filteredFaqs.length === 0 ? <div className="faq-no-results">No help articles found.</div> : null}
            </div>
          </div>
        ) : (
          <div className="ticket-panel">
            <div><label>Full Name</label><input type="text" value={ticket.name} onChange={(event) => setTicket({ ...ticket, name: event.target.value })} placeholder="John Smith" /></div>
            <div><label>Email</label><input type="email" value={ticket.email} onChange={(event) => setTicket({ ...ticket, email: event.target.value })} placeholder="john@company.com" /></div>
            <div><label>Category</label>
              <select value={ticket.category} onChange={(event) => setTicket({ ...ticket, category: event.target.value })}>
                <option value="">Select category…</option>
                <option>Portfolio & Investments</option>
                <option>Billing & Subscriptions</option>
                <option>API & Integrations</option>
                <option>Account & Login</option>
                <option>Technical Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div><label>Priority</label>
              <select value={ticket.priority} onChange={(event) => setTicket({ ...ticket, priority: event.target.value })}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
            <div><label>Description</label><textarea value={ticket.description} onChange={(event) => setTicket({ ...ticket, description: event.target.value })} placeholder="Describe your issue…" /></div>
            <button className="submit-btn" type="button" onClick={handleTicketSubmit}>Submit Ticket →</button>
            {ticketSuccess ? <div className="success-msg">✅ Ticket submitted! Our team will respond within 4 business hours.</div> : null}
          </div>
        )}
      </div>

      <style jsx global>{`
        .support-chat-widget .notif-toasts {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
          width: 340px;
        }
        .support-chat-widget .notif-toast {
          background: rgba(12, 37, 80, 0.96);
          border: 1px solid rgba(26, 58, 110, 1);
          border-left: 4px solid #2d8bff;
          border-radius: 12px;
          padding: 11px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
          transform: translateY(-10px);
          opacity: 1;
          pointer-events: auto;
        }
        .support-chat-widget .notif-toast.visitor { border-left-color: #ffb547; }
        .support-chat-widget .notif-toast.link-click { border-left-color: #7c5cfc; }
        .support-chat-widget .notif-toast.chat { border-left-color: #00e5a0; }
        .support-chat-widget .toast-icon { font-size: 18px; flex-shrink: 0; }
        .support-chat-widget .toast-body { flex: 1; }
        .support-chat-widget .toast-title { font-size: 12.5px; font-weight: 600; color: #eaf3ff; }
        .support-chat-widget .toast-desc { font-size: 11px; color: #a8bfd6; margin-top: 1px; }
        .support-chat-widget .toast-close { background: none; border: none; color: #a8bfd6; cursor: pointer; font-size: 14px; padding: 2px 4px; transition: color 0.2s; }
        .support-chat-widget .toast-close:hover { color: #eaf3ff; }

        .support-chat-widget .dash-toggle {
          position: fixed;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          z-index: 600;
          background: #1565ff;
          border: none;
          border-radius: 0 10px 10px 0;
          color: white;
          cursor: pointer;
          padding: 12px 8px;
          writing-mode: vertical-rl;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s;
          box-shadow: 4px 0 20px rgba(21, 101, 255, 0.4);
        }
        .support-chat-widget .dash-toggle:hover { background: #2d8bff; }
        .support-chat-widget .dash-toggle .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #00e5a0;
        }

        .support-chat-widget .agent-dashboard {
          position: fixed;
          top: 0;
          left: 0;
          width: 320px;
          height: 100vh;
          background: #04142e;
          border-right: 1px solid rgba(26, 58, 110, 1);
          display: flex;
          flex-direction: column;
          z-index: 500;
          transform: translateX(-320px);
          transition: transform 0.4s cubic-bezier(.77, 0, .175, 1);
        }
        .support-chat-widget .agent-dashboard.open { transform: translateX(0); }
        .support-chat-widget .dash-header {
          padding: 18px 16px 14px;
          border-bottom: 1px solid rgba(26, 58, 110, 1);
          background: linear-gradient(180deg, #04142e, #071c3f);
        }
        .support-chat-widget .dash-title {
          font-size: 15px;
          font-weight: 700;
          color: #eaf3ff;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .support-chat-widget .dash-sub { font-size: 11.5px; color: #5a84b8; }
        .support-chat-widget .dash-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding: 12px 16px; border-bottom: 1px solid rgba(26, 58, 110, 1); }
        .support-chat-widget .stat-box { background: #071c3f; border: 1px solid rgba(26, 58, 110, 1); border-radius: 10px; padding: 10px 8px; text-align: center; }
        .support-chat-widget .stat-num { font-size: 20px; font-weight: 700; color: #2d8bff; line-height: 1; }
        .support-chat-widget .stat-lbl { font-size: 10px; color: #5a84b8; margin-top: 3px; font-weight: 500; }
        .support-chat-widget .visitors-section { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
        .support-chat-widget .visitors-section::-webkit-scrollbar { width: 3px; }
        .support-chat-widget .visitors-section::-webkit-scrollbar-thumb { background: rgba(26, 58, 110, 1); border-radius: 3px; }
        .support-chat-widget .section-label { font-size: 10px; font-weight: 700; color: #5a84b8; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 16px 6px; flex-shrink: 0; }
        .support-chat-widget .visitor-card { margin: 0 10px 6px; background: #071c3f; border: 1px solid rgba(26, 58, 110, 1); border-radius: 12px; padding: 10px 12px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
        .support-chat-widget .visitor-card:hover { border-color: #2d8bff; background: #0c2550; }
        .support-chat-widget .visitor-card::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: #5a84b8; transition: background 0.2s; }
        .support-chat-widget .visitor-card.active::before { background: #00e5a0; }
        .support-chat-widget .visitor-card.new-visitor::before { background: #ffb547; }
        .support-chat-widget .visitor-top { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .support-chat-widget .visitor-icon { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #1565ff, #2d8bff); display: flex; align-items: center; justify-content: center; font-size: 13px; }
        .support-chat-widget .visitor-id { font-size: 12px; font-weight: 600; color: #eaf3ff; flex: 1; }
        .support-chat-widget .visitor-badge { font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
        .support-chat-widget .badge-new { background: rgba(255, 181, 71, 0.15); color: #ffb547; border: 1px solid rgba(255, 181, 71, 0.3); }
        .support-chat-widget .badge-active { background: rgba(0, 229, 160, 0.1); color: #00e5a0; border: 1px solid rgba(0, 229, 160, 0.25); }
        .support-chat-widget .badge-idle { background: rgba(90, 132, 184, 0.15); color: #5a84b8; border: 1px solid rgba(26, 58, 110, 1); }
        .support-chat-widget .visitor-page { font-size: 11px; color: #5a84b8; display: flex; align-items: center; gap: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .support-chat-widget .page-pill { background: rgba(45, 139, 255, 0.12); border: 1px solid rgba(45, 139, 255, 0.25); color: #2d8bff; padding: 1px 8px; border-radius: 20px; font-size: 10.5px; }
        .support-chat-widget .visitor-time { font-size: 10px; color: #5a84b8; margin-top: 4px; }
        .support-chat-widget .link-trail { margin-top: 6px; display: flex; flex-direction: column; gap: 3px; }
        .support-chat-widget .trail-item { display: flex; align-items: center; gap: 5px; font-size: 10.5px; color: #5a84b8; }
        .support-chat-widget .trail-arrow { color: rgba(26, 58, 110, 1); font-size: 9px; }
        .support-chat-widget .trail-link { color: #2d8bff; font-weight: 500; font-size: 10px; background: rgba(45, 139, 255, 0.08); padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(45, 139, 255, 0.2); }
        .support-chat-widget .trail-time { font-size: 9.5px; color: rgba(26, 58, 110, 1); margin-left: auto; }

        .support-chat-widget .visitor-detail { position: fixed; inset: 0; z-index: 9998; background: rgba(2, 11, 26, 0.8); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .support-chat-widget .visitor-detail.open { display: flex; opacity: 1; pointer-events: all; }
        .support-chat-widget .vd-panel { background: #04142e; border: 1px solid rgba(26, 58, 110, 1); border-radius: 18px; width: 420px; max-height: 70vh; overflow-y: auto; padding: 20px; box-shadow: 0 32px 80px rgba(2, 11, 26, 0.85), 0 8px 24px rgba(0, 80, 255, 0.12); transform: scale(0.95); transition: transform 0.3s; }
        .support-chat-widget .visitor-detail.open .vd-panel { transform: scale(1); }
        .support-chat-widget .vd-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .support-chat-widget .vd-close { margin-left: auto; width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(26, 58, 110, 1); background: #071c3f; color: #5a84b8; cursor: pointer; }
        .support-chat-widget .vd-close:hover { background: rgba(26, 58, 110, 1); color: #eaf3ff; }
        .support-chat-widget .vd-title { font-size: 16px; font-weight: 700; color: #eaf3ff; }
        .support-chat-widget .vd-info-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
        .support-chat-widget .vd-info-box { background: #071c3f; border: 1px solid rgba(26, 58, 110, 1); border-radius: 10px; padding: 10px 12px; }
        .support-chat-widget .vd-info-lbl { font-size: 10px; color: #5a84b8; margin-bottom: 3px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; }
        .support-chat-widget .vd-info-val { font-size: 13px; color: #eaf3ff; font-weight: 500; }
        .support-chat-widget .vd-section-title { font-size: 10px; color: #5a84b8; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 12px 0 6px; }
        .support-chat-widget .vd-trail-item { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 8px; background: #071c3f; border: 1px solid rgba(26, 58, 110, 1); margin-bottom: 5px; }
        .support-chat-widget .vd-trail-num { width: 20px; height: 20px; border-radius: 50%; background: rgba(21, 101, 255, 0.2); border: 1px solid rgba(21, 101, 255, 0.4); display: flex; align-items: center; justify-content: center; font-size: 10px; color: #2d8bff; font-weight: 700; }
        .support-chat-widget .vd-trail-url { font-size: 12px; color: #2d8bff; flex: 1; font-weight: 500; }
        .support-chat-widget .vd-trail-time { font-size: 10px; color: #5a84b8; flex-shrink: 0; }

        .support-chat-widget .chat-launcher {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1565ff, #2d8bff);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 30px rgba(21, 101, 255, 0.55), 0 0 0 0 rgba(21, 101, 255, 0.3);
          z-index: 1000;
          transition: transform 0.3s cubic-bezier(.34, 1.56, .64, 1);
        }
        .support-chat-widget .chat-launcher:hover { transform: scale(1.08); }
        .support-chat-widget .chat-launcher.open { transform: rotate(45deg) scale(1.05); }
        .support-chat-widget .chat-launcher svg { width: 25px; height: 25px; fill: white; }
        .support-chat-widget .notif-dot { position: absolute; top: 3px; right: 3px; width: 15px; height: 15px; border-radius: 50%; background: #ff4d6d; border: 2.5px solid #020b1a; font-size: 9px; color: white; font-weight: 700; display: flex; align-items: center; justify-content: center; }

        .support-chat-widget .chat-window {
          position: fixed;
          bottom: 98px;
          right: 28px;
          width: 370px;
          height: 590px;
          background: #04142e;
          border-radius: 20px;
          border: 1px solid rgba(26, 58, 110, 1);
          box-shadow: 0 32px 80px rgba(2, 11, 26, 0.85), 0 8px 24px rgba(0, 80, 255, 0.12);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 999;
          transform: translateY(24px) scale(0.93);
          opacity: 0;
          pointer-events: none;
          transition: all 0.38s cubic-bezier(.34, 1.56, .64, 1);
        }
        .support-chat-widget .chat-window.open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: all;
        }
        .support-chat-widget .chat-header { background: linear-gradient(160deg, #04142e 0%, #071c3f 100%); padding: 16px 18px 14px; border-bottom: 1px solid rgba(26, 58, 110, 1); display: flex; align-items: center; gap: 11px; position: relative; }
        .support-chat-widget .agent-av { width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #1565ff 0%, #2d8bff 100%); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; color: white; flex-shrink: 0; position: relative; }
        .support-chat-widget .agent-av::after { content: ""; position: absolute; bottom: 1px; right: 1px; width: 11px; height: 11px; border-radius: 50%; background: #00e5a0; border: 2.5px solid #04142e; }
        .support-chat-widget .agent-info { flex: 1; }
        .support-chat-widget .agent-name { font-size: 14.5px; font-weight: 700; color: #eaf3ff; }
        .support-chat-widget .agent-name span { color: #2d8bff; }
        .support-chat-widget .agent-status { font-size: 11px; color: #00e5a0; font-weight: 500; display: flex; align-items: center; gap: 4px; }
        .support-chat-widget .agent-status .dot { width: 5px; height: 5px; border-radius: 50%; background: #00e5a0; }
        .support-chat-widget .hdr-btns { display: flex; gap: 5px; }
        .support-chat-widget .hdr-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(26, 58, 110, 1); background: #071c3f; color: #5a84b8; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .support-chat-widget .hdr-btn:hover { background: rgba(26, 58, 110, 1); color: #eaf3ff; }
        .support-chat-widget .chat-tabs { display: flex; background: #020b1a; border-bottom: 1px solid rgba(26, 58, 110, 1); }
        .support-chat-widget .tab-btn { flex: 1; padding: 9px 4px; font-size: 11.5px; font-weight: 600; color: #5a84b8; border: none; background: transparent; cursor: pointer; border-bottom: 2px solid transparent; letter-spacing: 0.01em; }
        .support-chat-widget .tab-btn.active { color: #2d8bff; border-bottom-color: #1565ff; background: rgba(21, 101, 255, 0.07); }
        .support-chat-widget .tab-btn:hover:not(.active) { color: #eaf3ff; background: rgba(255, 255, 255, 0.03); }
        .support-chat-widget .chat-messages { flex: 1; overflow-y: auto; padding: 16px 14px; display: flex; flex-direction: column; gap: 10px; }
        .support-chat-widget .chat-messages::-webkit-scrollbar { width: 3px; }
        .support-chat-widget .chat-messages::-webkit-scrollbar-thumb { background: rgba(26, 58, 110, 1); border-radius: 3px; }
        .support-chat-widget .day-div { display: flex; align-items: center; gap: 8px; color: #5a84b8; font-size: 10.5px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; }
        .support-chat-widget .msg-row { display: flex; gap: 7px; max-width: 100%; }
        .support-chat-widget .msg-row.user { flex-direction: row-reverse; }
        .support-chat-widget .msg-av { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #1565ff, #2d8bff); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: white; flex-shrink: 0; align-self: flex-end; }
        .support-chat-widget .msg-av.u { background: #071c3f; border: 1px solid rgba(26, 58, 110, 1); font-size: 13px; }
        .support-chat-widget .bub-wrap { display: flex; flex-direction: column; max-width: 78%; gap: 2px; }
        .support-chat-widget .msg-row.user .bub-wrap { align-items: flex-end; }
        .support-chat-widget .bub { padding: 9px 13px; border-radius: 16px; font-size: 13px; line-height: 1.55; color: #eaf3ff; background: #071c3f; border: 1px solid rgba(26, 58, 110, 1); word-break: break-word; }
        .support-chat-widget .bub.user-bub { background: linear-gradient(135deg, #1565ff, #2d8bff); border-color: transparent; color: white; border-radius: 16px 16px 4px 16px; }
        .support-chat-widget .bub.agent-bub { border-radius: 16px 16px 16px 4px; }
        .support-chat-widget .msg-t { font-size: 10px; color: #5a84b8; padding: 0 3px; }
        .support-chat-widget .quick-reps { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; }
        .support-chat-widget .qr { padding: 5px 11px; border-radius: 20px; border: 1px solid rgba(26, 58, 110, 1); background: rgba(21, 101, 255, 0.08); color: #2d8bff; font-size: 11.5px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .support-chat-widget .qr:hover { background: #1565ff; color: white; border-color: #1565ff; }
        .support-chat-widget .chat-input-area { border-top: 1px solid rgba(26, 58, 110, 1); background: #020b1a; padding: 11px 13px; flex-shrink: 0; }
        .support-chat-widget .input-row { display: flex; align-items: flex-end; gap: 7px; background: #071c3f; border: 1px solid rgba(26, 58, 110, 1); border-radius: 13px; padding: 7px 9px; transition: border-color 0.2s; }
        .support-chat-widget .input-row:focus-within { border-color: #1565ff; box-shadow: 0 0 0 3px rgba(21, 101, 255, 0.15); }
        .support-chat-widget .chat-textarea { flex: 1; background: transparent; border: none; outline: none; color: #eaf3ff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 13px; resize: none; max-height: 90px; min-height: 20px; line-height: 1.5; }
        .support-chat-widget .chat-textarea::placeholder { color: #5a84b8; }
        .support-chat-widget .send-btn { width: 32px; height: 32px; border-radius: 9px; border: none; background: linear-gradient(135deg, #1565ff, #2d8bff); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; box-shadow: 0 3px 10px rgba(21, 101, 255, 0.4); }
        .support-chat-widget .send-btn:hover { opacity: 0.85; transform: scale(1.06); }
        .support-chat-widget .send-btn:disabled { opacity: 0.35; cursor: default; transform: none; }
        .support-chat-widget .send-btn svg { width: 15px; height: 15px; }
        .support-chat-widget .input-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 7px; padding: 0 2px; }
        .support-chat-widget .powered-by { font-size: 10px; color: #5a84b8; }
        .support-chat-widget .powered-by strong { color: #2d8bff; }
        .support-chat-widget .char-count { font-size: 10px; color: #5a84b8; }
      `}</style>
    </div>
  )
}
