import Script from 'next/script'

// Ensure process.env is typed correctly for Node.js
declare const process: {
  env: { [key: string]: string | undefined }
}

const DEFAULT_PROPERTY = '6910bc388e8c101957916042'
const DEFAULT_WIDGET = '1j9klug1o'

// @ts-ignore
const enabledFlag = process.env.NEXT_PUBLIC_TAWK_ENABLED
const TAWK_CONFIG = {
  enabled: enabledFlag ? enabledFlag !== 'false' : true,
  // @ts-ignore
  propertyId: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || DEFAULT_PROPERTY,
  // @ts-ignore
  widgetId: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || DEFAULT_WIDGET,
  // @ts-ignore
  debug: process.env.NEXT_PUBLIC_TAWK_DEBUG === '1',
}

const isProduction = process.env.NODE_ENV === 'production'

const log = (message: string, level: 'info' | 'warn' = 'info') => {
  if (isProduction) {
    return
  }

  const prefix = `[TawkToChat] ${message}`
  if (level === 'warn') {
    console.warn(prefix)
  } else {
    console.info(prefix)
  }
}

export default function TawkToChat() {
  if (!TAWK_CONFIG.enabled) {
    log('Disabled via NEXT_PUBLIC_TAWK_ENABLED')
    return null
  }

  if (!TAWK_CONFIG.propertyId || !TAWK_CONFIG.widgetId) {
    log('Missing property or widget ID. Skipping script injection.', 'warn')
    return null
  }

  const src = `https://embed.tawk.to/${TAWK_CONFIG.propertyId}/${TAWK_CONFIG.widgetId}`

  return (
    <>
      {TAWK_CONFIG.debug && (
        <Script id="tawkto-debug" strategy="afterInteractive">
          {`window.Tawk_API = window.Tawk_API || {};
window.Tawk_API.onLoad = function () {
  console.info('[TawkToChat] Widget loaded');
};
window.Tawk_API.onChatMaximized = function () {
  console.info('[TawkToChat] Chat maximized');
};
window.Tawk_API.onChatMinimized = function () {
  console.info('[TawkToChat] Chat minimized');
};
window.Tawk_API.onChatStarted = function () {
  console.info('[TawkToChat] Chat started');
};
window.Tawk_API.onChatEnded = function () {
  console.info('[TawkToChat] Chat ended');
};`}
        </Script>
      )}
      <Script id="tawkto-widget-src" strategy="afterInteractive" src={src} crossOrigin="anonymous" />
    </>
  )
}
