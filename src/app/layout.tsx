'use client'

import { useEffect, useRef, useState } from 'react'

const WOLV_AI_URL = 'https://supportai-maxmmdqp.manus.space'

export default function WolvAiWidget() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [src, setSrc] = useState<string | null>(null)

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

  if (!src) return null

  return (
    <>
      <style>{`
        #wolvai-widget-frame {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 400px;
          height: 660px;
          max-width: 100vw;
          max-height: 100vh;
          border: 0;
          background: transparent;
          z-index: 2147483000;
          color-scheme: light;
        }
        @media (max-width: 480px) {
          #wolvai-widget-frame {
            width: 100vw;
            height: 220px;
          }
        }
      `}</style>
      <iframe
        id="wolvai-widget-frame"
        ref={iframeRef}
        src={src}
        title="Wolvcapital AI support"
        allow="clipboard-write"
        loading="lazy"
      />
    </>
  )
}