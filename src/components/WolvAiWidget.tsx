'use client'

const WOLV_AI_URL = 'https://wolv-ai-production.up.railway.app/widget'

export default function WolvAiWidget() {
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
        src={WOLV_AI_URL}
        title="Support chat"
        allow="clipboard-write"
        loading="lazy"
      />
    </>
  )
}
