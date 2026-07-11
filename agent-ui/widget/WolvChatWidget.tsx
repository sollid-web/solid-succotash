
'use client';

import { useState, useEffect, useRef } from 'react';

import Pusher from 'pusher-js';



const PUSHER_KEY = 'b9cc4a723e4a8e6cfd75';

const PUSHER_CLUSTER = 'eu';

const BRIDGE_URL = 'https://api.wolvcapital.com'; // update after deploy



interface Message {

  id: string;

  role: 'visitor' | 'agent';

  content: string;

  timestamp: number;

}



function generateVisitorId() {

  const stored = localStorage.getItem('wolv_visitor_id');

  if (stored) return stored;

  const id = 'v_' + Math.random().toString(36).slice(2) + Date.now();

  localStorage.setItem('wolv_visitor_id', id);

  return id;

}



export default function WolvChatWidget() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([

    { id: '0', role: 'agent', content: '👋 Hi! Welcome to WolvCapital. How can I help you today?', timestamp: Date.now() },

  ]);

  const [input, setInput] = useState('');

  const [sending, setSending] = useState(false);

  const [unread, setUnread] = useState(0);

  const [agentTyping, setAgentTyping] = useState(false);

  const [visitorId] = useState(generateVisitorId);

  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pusherRef = useRef<Pusher | null>(null);



  useEffect(() => {

    // Connect to Pusher

    const pusher = new Pusher(PUSHER_KEY, { cluster: PUSHER_CLUSTER });

    pusherRef.current = pusher;



    pusher.connection.bind('connected', () => setConnected(true));

    pusher.connection.bind('disconnected', () => setConnected(false));



    const channel = pusher.subscribe(`chat-${visitorId}`);



    channel.bind('agent-message', (data: { content: string; id: string }) => {

      const msg: Message = { id: data.id, role: 'agent', content: data.content, timestamp: Date.now() };

      setMessages(prev => [...prev, msg]);

      setAgentTyping(false);

      if (!open) {

        setUnread(prev => prev + 1);

        // Browser push notification

        if (Notification.permission === 'granted') {

          new Notification('WolvCapital Support', {

            body: data.content,

            icon: '/favicon.svg',

          });

        }

      }

    });



    channel.bind('agent-typing', () => {

      setAgentTyping(true);

      setTimeout(() => setAgentTyping(false), 3000);

    });



    return () => {

      pusher.unsubscribe(`chat-${visitorId}`);

      pusher.disconnect();

    };

  }, [visitorId, open]);



  useEffect(() => {

    if (open) {

      setUnread(0);

      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      // Request notification permission

      if (Notification.permission === 'default') {

        Notification.requestPermission();

      }

    }

  }, [open, messages]);



  const sendMessage = async () => {

    if (!input.trim() || sending) return;

    const content = input.trim();

    setInput('');

    setSending(true);



    const msg: Message = { id: Date.now().toString(), role: 'visitor', content, timestamp: Date.now() };

    setMessages(prev => [...prev, msg]);



    try {

      await fetch(`${BRIDGE_URL}/api/chat/send`, {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({

          visitorId,

          content,

          visitorName: localStorage.getItem('wolv_visitor_name') || 'Visitor',

          page: window.location.pathname,

        }),

      });

    } catch {

      console.error('Failed to send message');

    } finally {

      setSending(false);

    }

  };



  const handleKeyDown = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      sendMessage();

    }

  };



  return (

    <>

      <style>{`

        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        @keyframes blink { 0%,100%{opacity:0.3} 50%{opacity:1} }

        .wolv-chat-bubble { animation: fadeUp 0.3s ease forwards; }

        .wolv-typing-dot { animation: blink 1.2s infinite; display:inline-block;width:6px;height:6px;border-radius:50%;background:#2A52BE;margin:0 2px; }

        .wolv-typing-dot:nth-child(2){animation-delay:0.2s}

        .wolv-typing-dot:nth-child(3){animation-delay:0.4s}

      `}</style>



      {/* Toggle button */}

      <button

        onClick={() => setOpen(o => !o)}

        style={{

          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,

          width: '56px', height: '56px', borderRadius: '50%',

          background: 'linear-gradient(135deg, #2A52BE, #1E3A8A)',

          border: 'none', cursor: 'pointer',

          boxShadow: '0 4px 24px rgba(42,82,190,0.45)',

          display: 'flex', alignItems: 'center', justifyContent: 'center',

          transition: 'transform 0.2s',

        }}

      >

        {open ? (

          <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">

            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>

          </svg>

        ) : (

          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">

            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>

          </svg>

        )}

        {unread > 0 && !open && (

          <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#00a896', color: '#fff', borderRadius: '99px', padding: '1px 6px', fontSize: '11px', fontWeight: 700 }}>

            {unread}

          </span>

        )}

      </button>



      {/* Chat window */}

      {open && (

        <div className="wolv-chat-bubble" style={{

          position: 'fixed', bottom: '90px', right: '24px', zIndex: 9998,

          width: '360px', height: '520px',

          background: '#0a0f1e',

          border: '1px solid rgba(42,82,190,0.3)',

          borderRadius: '20px',

          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',

          display: 'flex', flexDirection: 'column',

          overflow: 'hidden',

          fontFamily: "'DM Sans', system-ui, sans-serif",

        }}>



          {/* Header */}

          <div style={{ padding: '16px', background: 'linear-gradient(135deg, #0f1a35, #1a2a5e)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>

            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #2A52BE, #00a896)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: '#fff', flexShrink: 0 }}>W</div>

            <div style={{ flex: 1 }}>

              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>WolvCapital Support</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>

                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: connected ? '#00a896' : '#f59e0b', display: 'inline-block' }} />

                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{connected ? 'Online · Typically replies in minutes' : 'Connecting...'}</span>

              </div>

            </div>

          </div>



          {/* Messages */}

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {messages.map(msg => (

              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'visitor' ? 'flex-end' : 'flex-start' }}>

                <div style={{

                  maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'visitor' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',

                  background: msg.role === 'visitor' ? 'linear-gradient(135deg, #2A52BE, #1E3A8A)' : 'rgba(255,255,255,0.06)',

                  border: msg.role === 'visitor' ? 'none' : '1px solid rgba(255,255,255,0.08)',

                  color: '#fff', fontSize: '13px', lineHeight: 1.6,

                }}>

                  {msg.content}

                </div>

              </div>

            ))}

            {agentTyping && (

              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>

                <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>

                  <span className="wolv-typing-dot" />

                  <span className="wolv-typing-dot" />

                  <span className="wolv-typing-dot" />

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>



          {/* Input */}

          <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>

            <textarea

              value={input}

              onChange={e => setInput(e.target.value)}

              onKeyDown={handleKeyDown}

              placeholder="Type a message..."

              rows={1}

              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: 1.5 }}

            />

            <button

              onClick={sendMessage}

              disabled={!input.trim() || sending}

              style={{ width: '38px', height: '38px', borderRadius: '10px', background: input.trim() ? '#2A52BE' : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}

            >

              <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7"/>

              </svg>

            </button>

          </div>



          {/* Footer */}

          <div style={{ padding: '8px', textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>

            Powered by WolvCapital · wolvcapital.com

          </div>

        </div>

      )}

    </>

  );

}

