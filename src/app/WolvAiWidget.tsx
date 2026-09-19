'use client'

import { useEffect } from 'react'

const NEURAL_SUPPORT_CONFIG = {
  convexUrl: 'https://ceaseless-crocodile-860.convex.site',
  // Keep the widget's site identity aligned with the site's canonical www host.
  siteUrl: 'https://www.wolvcapital.com',
  primaryColor: '#6366f1',
  greeting: 'Hi! How can I help you today?',
  agentName: 'Support',
  quickQuestions: [
    'What can you help me with?',
    'I want to speak to a human',
  ],
}

const WIDGET_SCRIPT_SRC = 'https://ceaseless-crocodile-860.convex.site/widget.js'

type NeuralSupportWindow = Window & {
  NeuralSupportConfig?: typeof NEURAL_SUPPORT_CONFIG
}

export default function WolvAiWidget() {
  useEffect(() => {
    const widgetWindow = window as NeuralSupportWindow
    widgetWindow.NeuralSupportConfig = NEURAL_SUPPORT_CONFIG

    // Avoid injecting duplicate scripts during Next.js client navigation or
    // React Strict Mode's development-only effect replay.
    if (document.querySelector(`script[src="${WIDGET_SCRIPT_SRC}"]`)) return

    const script = document.createElement('script')
    script.src = WIDGET_SCRIPT_SRC
    script.async = true
    document.body.appendChild(script)

    return () => {
      // The widget owns its DOM and session state. Leave it mounted across
      // route changes; only remove the loader's script on full unmount.
      script.remove()
    }
  }, [])

  return null
}
