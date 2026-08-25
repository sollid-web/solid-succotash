'use client'

import { useEffect, useRef, useState } from 'react'

const WOLV_AI_URL = 'https://supportai-maxmmdqp.manus.space'

export default function WolvAiWidget() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [src, setSrc] = useState<string | null>(null)
  // Starts collapsed so it never covers page content on load — the visitor
  // opens it deliberately, same as Intercom/Tawk/Drift-style widgets.
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Computed client-side only, so this always reflects the real page the
    // visitor is actually on (and avoids an SSR/hydration mismatch, since
    // window isn't available during server rendering).
    setSrc(`${WOLV_AI_URL}/embed?page=${encodeURIComponent(window.location.href)}`)
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    function reportPage() {
      iframe?.contentWindow?.postMessage(
        {
          source: 'wolvcapital-ai',
          type: 'navigation',
          pageUrl: window.location.href,
          pageTitle: document.title,
        },
        WOLV_AI_URL
      )
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
        setIsOpen(false)
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
          width: 400px;
          height: 660px;
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
            width: calc(100vw - 24px);
            height: min(620px, calc(100vh - 120px));
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
          diagnostics/navigation tracking fires the instant the visitor
          lands on the page — not only once they choose to open the chat.
          Only visibility toggles, never the iframe's existence. */}
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
        onClick={() => setIsOpen(open => !open)}
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