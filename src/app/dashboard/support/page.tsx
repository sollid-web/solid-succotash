'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || ''

type Session = {
  session_id: string
  user_email: string
  user_name: string
  status: string
  human_requested_at: string
  updated_at: string
}

type Message = {
  role: string
  content: string
  is_human_handover: boolean
  created_at: string
}

export default function AgentSupportPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifGranted, setNotifGranted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevSessionCount = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Check if admin
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token || !API) { setLoading(false); return }
    fetch(`${API}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    }).then(r => r.json()).then(data => {
      setIsAdmin(Boolean(data.is_staff || data.is_superuser))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(p => {
        setNotifGranted(p === 'granted')
      })
    }
    // Create audio for alert sound
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA==')
  }, [])

  const notify = useCallback((title: string, body: string) => {
    // Browser notification
    if (notifGranted) {
      new Notification(title, { body, icon: '/favicon.ico' })
    }
    // Vibrate phone
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200])
    }
    // Play sound
    try { audioRef.current?.play() } catch {}
  }, [notifGranted])

  // Poll sessions every 3 seconds
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/chat/sessions/`)
      if (!res.ok) return
      const data = await res.json()
      const newSessions: Session[] = data.sessions || []
      
      // Alert if new session arrived
      if (newSessions.length > prevSessionCount.current && prevSessionCount.current > 0) {
        const newest = newSessions[0]
        notify(
          '🚨 Human Support Requested!',
          `${newest.user_name || newest.user_email || 'A user'} needs help`
        )
      }
      prevSessionCount.current = newSessions.length
      setSessions(newSessions)
    } catch {}
  }, [notify])

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 3000)
    return () => clearInterval(interval)
  }, [fetchSessions])

  // Poll messages for selected session every 3 seconds
  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`${API}/api/chat/messages/${sessionId}/`)
      if (!res.ok) return
      const data = await res.json()
      setMessages(data.messages || [])
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch {}
  }, [])

  useEffect(() => {
    if (!selectedSession) return
    fetchMessages(selectedSession.session_id)
    const interval = setInterval(() => fetchMessages(selectedSession.session_id), 3000)
    return () => clearInterval(interval)
  }, [selectedSession, fetchMessages])

  const sendReply = async () => {
    if (!reply.trim() || !selectedSession) return
    setSending(true)
    try {
      await fetch(`${API}/api/chat/agent-reply/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: selectedSession.session_id,
          message: reply.trim()
        })
      })
      setReply('')
      await fetchMessages(selectedSession.session_id)
    } catch {}
    setSending(false)
  }

  const closeSession = async (sessionId: string) => {
    try {
      await fetch(`${API}/api/chat/sessions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, action: 'close' })
      })
      setSessions(s => s.filter(x => x.session_id !== sessionId))
      if (selectedSession?.session_id === sessionId) setSelectedSession(null)
    } catch {}
  }

  if (loading) return (
    <div style={{ color: '#fff', padding: 40, textAlign: 'center' }}>Loading...</div>
  )

  if (!isAdmin) return (
    <div style={{ padding: 32 }}>
      <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Support</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>Get help from our team</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, maxWidth: 800 }}>
        {[
          { icon: '💬', title: 'Live Chat', desc: 'Get instant help via the chat widget at the bottom right', color: '#3b82f6' },
          { icon: '📧', title: 'Email Support', desc: 'Send us your questions and we\'ll respond within 24h', color: '#00a896' },
          { icon: '📋', title: 'FAQ & Guides', desc: 'Browse our help center for common questions', color: '#8b5cf6' },
        ].map(item => (
          <div key={item.title} style={{ borderRadius: 20, padding: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{item.icon}</div>
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: 0, background: '#04142e', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(26,58,110,1)' }}>
      
      {/* Sessions List */}
      <div style={{ width: 300, borderRight: '1px solid rgba(26,58,110,1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(26,58,110,1)', background: '#020b1a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5a0', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#eaf3ff', fontWeight: 700, fontSize: 14 }}>Live Support Inbox</span>
          </div>
          <div style={{ color: '#5a84b8', fontSize: 11, marginTop: 4 }}>
            {sessions.length} active {sessions.length === 1 ? 'session' : 'sessions'}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sessions.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: '#5a84b8', fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
              No active sessions
            </div>
          ) : sessions.map(session => (
            <div
              key={session.session_id}
              onClick={() => setSelectedSession(session)}
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid rgba(26,58,110,0.5)',
                cursor: 'pointer',
                background: selectedSession?.session_id === session.session_id
                  ? 'rgba(21,101,255,0.12)' : 'transparent',
                borderLeft: selectedSession?.session_id === session.session_id
                  ? '3px solid #2d8bff' : '3px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#1565ff,#2d8bff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {(session.user_name || session.user_email || 'U')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#eaf3ff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.user_name || 'Unknown User'}
                  </div>
                  <div style={{ color: '#5a84b8', fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {session.user_email || session.session_id.slice(0, 16)}
                  </div>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                  background: session.status === 'waiting' ? 'rgba(245,158,11,0.15)' : 'rgba(0,229,160,0.1)',
                  color: session.status === 'waiting' ? '#f59e0b' : '#00e5a0',
                  border: `1px solid ${session.status === 'waiting' ? 'rgba(245,158,11,0.3)' : 'rgba(0,229,160,0.25)'}`,
                  textTransform: 'uppercase'
                }}>
                  {session.status === 'waiting' ? '⏳ Waiting' : '✅ Active'}
                </span>
              </div>
              <div style={{ color: '#5a84b8', fontSize: 10, paddingLeft: 40 }}>
                {new Date(session.human_requested_at).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedSession ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(26,58,110,1)', background: '#020b1a', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#1565ff,#2d8bff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
              {(selectedSession.user_name || selectedSession.user_email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#eaf3ff', fontWeight: 700, fontSize: 14 }}>{selectedSession.user_name || 'Unknown User'}</div>
              <div style={{ color: '#5a84b8', fontSize: 11 }}>{selectedSession.user_email}</div>
            </div>
            <button
              onClick={() => closeSession(selectedSession.session_id)}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.1)', color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Close Session
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row' : 'row-reverse', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.role === 'user' ? '#071c3f' : 'linear-gradient(135deg,#1565ff,#2d8bff)', border: msg.role === 'user' ? '1px solid rgba(26,58,110,1)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0 }}>
                  {msg.role === 'user' ? '👤' : msg.is_human_handover ? '🎧' : 'W'}
                </div>
                <div style={{ maxWidth: '70%' }}>
                  <div style={{
                    padding: '9px 13px', borderRadius: msg.role === 'user' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                    background: msg.role === 'user' ? '#071c3f' : msg.is_human_handover ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#1565ff,#2d8bff)',
                    border: msg.role === 'user' ? '1px solid rgba(26,58,110,1)' : 'none',
                    color: '#eaf3ff', fontSize: 13, lineHeight: 1.55
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ color: '#5a84b8', fontSize: 10, marginTop: 3, textAlign: msg.role === 'user' ? 'left' : 'right' }}>
                    {msg.is_human_handover ? '🎧 Agent · ' : ''}{new Date(msg.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Box */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(26,58,110,1)', background: '#020b1a', display: 'flex', gap: 10 }}>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() }}}
              placeholder="Type your reply… (Enter to send)"
              rows={2}
              style={{ flex: 1, background: '#071c3f', border: '1px solid rgba(26,58,110,1)', borderRadius: 12, padding: '10px 14px', color: '#eaf3ff', fontSize: 13, resize: 'none', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={sendReply}
              disabled={sending || !reply.trim()}
              style={{ padding: '0 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#1565ff,#2d8bff)', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: sending || !reply.trim() ? 0.5 : 1 }}
            >
              {sending ? '...' : 'Send ➤'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#5a84b8' }}>
          <div style={{ fontSize: 48 }}>💬</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#eaf3ff' }}>Select a session to start chatting</div>
          <div style={{ fontSize: 13 }}>Waiting sessions appear on the left</div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
