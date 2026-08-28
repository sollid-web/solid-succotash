'use client'

import { useEffect, useRef, useState } from 'react'

const WOLV_AI_URL = 'https://supportai-maxmmdqp.manus.space'
const VISITOR_KEY_NAME = 'wolvcapital-ai-visitor'
const DISMISSED_KEY = 'wolvai-dismissed' // session-scoped, separate from the persistent visitor id below

export default function WolvAiWidget() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  // Starts closed on the server/first render (so server and client markup
  // match), then flips open on mount unless the visitor already dismissed
  // it earlier this session — see the effect below.
  const [isOpen, setIsOpen] = useState(false)

  function closeWidget() {
    setIsOpen(false)
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // Storage can be unavailable (private browsing, embedded contexts,
      // etc.) — closing still works, it just won't be remembered.
    }
  }

  function reportPresence(visitorKey: string) {
    // Fire-and-forget via an Image ping — no response is read, and a
    // failure here (e.g. the endpoint not existing yet) fails silently
    // rather than breaking the widget.
    const ping = new Image()
    ping.src = `${WOLV_AI_URL}/api/support/presence?visitorKey=${encodeURIComponent(visitorKey)}&pageUrl=${encodeURIComponent(window.location.href)}&_=${Date.now()}`
  
  fetch('/api/notify-visitor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorKey, pageUrl: window.location.href }),
  }).catch(() => {})
}
  useEffect(() => {
    // Persistent visitor id: survives across separate visits (days/weeks
    // apart), so returning visitors are recognized as the same person.
    let visitorKey = window.localStorage.getItem(VISITOR_KEY_NAME)
    if (!visitorKey) {
      visitorKey = window.crypto?.randomUUID ? window.crypto.randomUUID() : `wv_${Date.now()}_${Math.random().toString(36).slice(2)}`
      window.localStorage.setItem(VISITOR_KEY_NAME, visitorKey)
    }

    setSrc(`${WOLV_AI_URL}/embed?page=${encodeURIComponent(window.location.href)}&visitorKey=${encodeURIComponent(visitorKey)}`)
    reportPresence(visitorKey)

    let alreadyDismissed = false
    try {
      alreadyDismissed = window.sessionStorage.getItem(DISMISSED_KEY) === '1'
    } catch {
      // Default to the friendlier behavior (auto-open) if storage isn't readable.
    }
    setIsOpen(!alreadyDismissed)
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    function reportPage() {
      const visitorKey = window.localStorage.getItem(VISITOR_KEY_NAME)
      iframe?.contentWindow?.postMessage(
        {
          source: 'wolvcapital-ai',
          type: 'navigation',
          pageUrl: window.location.href,
          pageTitle: document.title,
        },
        WOLV_AI_URL
      )
      if (visitorKey) reportPresence(visitorKey)
    }

    iframe.addEventListener('load', reportPage)

    // The widget lives in a cross-origin iframe pointed at a single /embed
    // page, so it can't see Next.js client-side route changes on its own.
    // Patching pushState/replaceState (and listening for popstate) tells it
    // whenever the visitor navigates within the app via the router, keeping
    // its page-context accurate without a full page reload.
    const original: Partial<Record<'pushState' | 'replaceState', typeof window.history.pushState>> = {}
    ;(['pushState', 'replaceState'] as const).forEach(name => {
      original[name] = window.history[name]
      window.history[name] = function (this: History, ...args: Parameters<History['pushState']>) {
        const result = original[name]!.apply(this, args)
        reportPage()
        return result
      }
    })
    window.addEventListener('popstate', reportPage)

    return () => {
      iframe.removeEventListener('load', reportPage)
      ;(['pushState', 'replaceState'] as const).forEach(name => {
        if (original[name]) window.history[name] = original[name]!
      })
      window.removeEventListener('popstate', reportPage)
    }
  }, [src])

  useEffect(() => {
    // The close button lives inside the iframe (cross-origin), so it can't
    // reach into this page's DOM directly — it asks us to collapse via
    // postMessage instead. Only trust messages that actually came from our
    // own widget origin.
    function handleMessage(event: MessageEvent) {
      if (event.origin !== WOLV_AI_URL) return
      if (event.data?.source === 'wolvcapital-ai' && event.data?.type === 'minimize') {
        closeWidget()
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  if (!src) return null

  return (
    <>
      <style>{`
        #wolvai-widget-frame {
          position: fixed;
          bottom: 96px;
          right: 20px;
          width: 368px;
          height: 540px;
          max-width: calc(100vw - 24px);
          max-height: calc(100vh - 120px);
          border: 0;
          border-radius: 20px;
          background: transparent;
          z-index: 2147483000;
          box-shadow: 0 24px 80px rgba(5, 8, 28, .35);
          color-scheme: light;
          transition: opacity .15s ease, transform .15s ease;
        }
        #wolvai-widget-frame[data-open="false"] {
          opacity: 0;
          pointer-events: none;
          transform: translateY(12px);
        }
        @media (max-width: 480px) {
          #wolvai-widget-frame {
            right: 12px;
            bottom: 88px;
            width: min(340px, calc(100vw - 32px));
            height: min(480px, calc(100vh - 160px));
          }
        }
        #wolvai-launcher {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          border-radius: 999px;
          border: 0;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          box-shadow: 0 12px 32px rgba(5, 8, 28, .35);
          z-index: 2147483001;
          display: grid;
          place-items: center;
          cursor: pointer;
        }
        #wolvai-launcher svg {
          width: 26px;
          height: 26px;
        }
      `}</style>

      {/* Iframe stays permanently mounted so its own useEffect-driven
          diagnostics/presence tracking fires the instant the visitor lands
          on the page — not only once they choose to open the chat. Only
          visibility toggles, never the iframe's existence. */}
      <iframe
        id="wolvai-widget-frame"
        data-open={isOpen}
        ref={iframeRef}
        src={src}
        title="Wolvcapital AI support"
        allow="clipboard-write"
        loading="lazy"
        aria-hidden={!isOpen}
      />

      <button
        id="wolvai-launcher"
        type="button"
        aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
        onClick={() => (isOpen ? closeWidget() : setIsOpen(true))}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </>
  )
}
