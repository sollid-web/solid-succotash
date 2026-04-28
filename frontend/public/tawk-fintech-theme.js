/**
 * Tawk.to Widget Color Scheme Configuration
 * Professional fintech theme: Dark Navy (#002350) + White text
 * 
 * Usage:
 * 1. Include this script in your HTML head or body
 * 2. Define TAWK_PROPERTY_ID before this script loads
 * 3. Styles apply automatically via Tawk_API.onLoad callback
 */

(function() {
  'use strict'

  // Configuration
  const TAWK_PROPERTY_ID = window.TAWK_PROPERTY_ID || 'your_property_id_here'
  const FINTECH_COLORS = {
    primary: '#002350',      // Dark Navy
    primaryDark: '#001840',  // Darker Navy (hover state)
    text: '#ffffff',         // White
    border: '#e5e7eb',       // Light gray
  }

  // Initialize Tawk API object
  window.Tawk_API = window.Tawk_API || {}
  window.Tawk_LoadStart = new Date()

  /**
   * Apply custom fintech styling to Tawk widget
   * Called via Tawk_API.onLoad to ensure widget is ready
   */
  function applyTawkCustomStyles() {
    // Create and inject custom stylesheet
    const styleElement = document.createElement('style')
    styleElement.id = 'tawk-fintech-theme'
    styleElement.textContent = `
      /* ============================================
         TAWK.TO PROFESSIONAL FINTECH THEME
         Primary: Dark Navy (#002350)
         Text: White (#ffffff)
      ============================================ */

      /* Widget Container */
      #tawk-container,
      .tawk-bubble {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      }

      /* Chat Widget Header */
      .tawk-branding-header,
      .tawk-chat-header,
      .tawk-header {
        background-color: ${FINTECH_COLORS.primary} !important;
        background: linear-gradient(135deg, ${FINTECH_COLORS.primary} 0%, ${FINTECH_COLORS.primaryDark} 100%) !important;
        color: ${FINTECH_COLORS.text} !important;
        border: none !important;
      }

      /* Header Title and Close Button */
      .tawk-header-title,
      .tawk-chat-header-title {
        color: ${FINTECH_COLORS.text} !important;
        font-weight: 600;
      }

      .tawk-header-close,
      .tawk-close-btn,
      .tawk-minimize-btn {
        color: ${FINTECH_COLORS.text} !important;
        opacity: 0.9;
      }

      .tawk-header-close:hover,
      .tawk-close-btn:hover,
      .tawk-minimize-btn:hover {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.1) !important;
      }

      /* Chat Messages Container */
      .tawk-chat-box,
      .tawk-chat-content {
        background-color: #ffffff !important;
      }

      /* Messages from Agent (Support Team) */
      .tawk-message-box.tawk-from-agent,
      .tawk-message.tawk-from-agent,
      .tawk-agent-message {
        background-color: ${FINTECH_COLORS.primary} !important;
        color: ${FINTECH_COLORS.text} !important;
        border: none !important;
        border-radius: 8px;
        margin: 8px 0;
        padding: 12px 16px;
      }

      .tawk-message-box.tawk-from-agent .tawk-message-text,
      .tawk-message.tawk-from-agent .tawk-message-text,
      .tawk-agent-message .tawk-message-text {
        color: ${FINTECH_COLORS.text} !important;
      }

      /* Messages from Visitor (Customer) */
      .tawk-message-box.tawk-from-visitor,
      .tawk-message.tawk-from-visitor,
      .tawk-visitor-message {
        background-color: #f3f4f6 !important;
        color: #1f2937 !important;
        border: 1px solid ${FINTECH_COLORS.primary} !important;
        border-radius: 8px;
      }

      /* Message Timestamps */
      .tawk-message-timestamp,
      .tawk-timestamp {
        color: #9ca3af !important;
        font-size: 12px;
      }

      /* Input Area */
      .tawk-input-area,
      .tawk-message-input-box {
        background-color: #f9fafb !important;
        border-top: 1px solid ${FINTECH_COLORS.border} !important;
      }

      /* Input Field */
      .tawk-input-box,
      input.tawk-input,
      textarea.tawk-input {
        border: 2px solid ${FINTECH_COLORS.primary} !important;
        color: #1f2937 !important;
        background-color: #ffffff !important;
        border-radius: 6px;
        padding: 12px;
        font-size: 14px;
      }

      .tawk-input-box:focus,
      input.tawk-input:focus,
      textarea.tawk-input:focus {
        border-color: ${FINTECH_COLORS.primary} !important;
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 35, 80, 0.1) !important;
      }

      .tawk-input-box::placeholder,
      input.tawk-input::placeholder,
      textarea.tawk-input::placeholder {
        color: #9ca3af !important;
      }

      /* Send Button */
      .tawk-send-btn,
      .tawk-action-button.tawk-send,
      button.tawk-send-btn {
        background-color: ${FINTECH_COLORS.primary} !important;
        color: ${FINTECH_COLORS.text} !important;
        border: none !important;
        border-radius: 4px;
        padding: 8px 16px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .tawk-send-btn:hover,
      .tawk-action-button.tawk-send:hover,
      button.tawk-send-btn:hover {
        background-color: ${FINTECH_COLORS.primaryDark} !important;
        transform: translateY(-1px);
      }

      .tawk-send-btn:active,
      .tawk-action-button.tawk-send:active {
        transform: translateY(0);
      }

      /* Action Buttons */
      .tawk-action-button,
      .tawk-button {
        background-color: ${FINTECH_COLORS.primary} !important;
        color: ${FINTECH_COLORS.text} !important;
        border: none !important;
        border-radius: 4px;
        transition: background-color 0.2s ease;
      }

      .tawk-action-button:hover,
      .tawk-button:hover {
        background-color: ${FINTECH_COLORS.primaryDark} !important;
      }

      /* Widget Badge / Floating Button */
      .tawk-widget-badge,
      .tawk-bubble-icon {
        background-color: ${FINTECH_COLORS.primary} !important;
        background: linear-gradient(135deg, ${FINTECH_COLORS.primary} 0%, ${FINTECH_COLORS.primaryDark} 100%) !important;
        border: none !important;
      }

      .tawk-bubble-text {
        color: ${FINTECH_COLORS.text} !important;
      }

      /* Links in Chat */
      .tawk-message-box a,
      .tawk-message a,
      .tawk-chat-content a {
        color: ${FINTECH_COLORS.primary} !important;
        text-decoration: underline;
      }

      .tawk-message-box a:hover,
      .tawk-message a:hover {
        color: ${FINTECH_COLORS.primaryDark} !important;
      }

      /* Pre-Chat Form */
      .tawk-pre-chat-form,
      .tawk-prechat-form {
        background-color: #f9fafb !important;
      }

      .tawk-pre-chat-form input,
      .tawk-pre-chat-form textarea,
      .tawk-prechat-form input,
      .tawk-prechat-form textarea {
        border: 2px solid ${FINTECH_COLORS.primary} !important;
        color: #1f2937 !important;
        background-color: #ffffff !important;
        border-radius: 6px;
        padding: 10px 12px;
        font-size: 14px;
      }

      .tawk-pre-chat-form input:focus,
      .tawk-pre-chat-form textarea:focus,
      .tawk-prechat-form input:focus,
      .tawk-prechat-form textarea:focus {
        border-color: ${FINTECH_COLORS.primary} !important;
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 35, 80, 0.1) !important;
      }

      .tawk-pre-chat-form input::placeholder,
      .tawk-pre-chat-form textarea::placeholder,
      .tawk-prechat-form input::placeholder {
        color: #9ca3af !important;
      }

      /* Pre-Chat Form Label */
      .tawk-pre-chat-form label,
      .tawk-prechat-form label {
        color: #374151 !important;
        font-weight: 600;
      }

      /* Pre-Chat Form Buttons */
      .tawk-pre-chat-form button,
      .tawk-prechat-form button {
        background-color: ${FINTECH_COLORS.primary} !important;
        color: ${FINTECH_COLORS.text} !important;
        border: none !important;
        border-radius: 4px;
        padding: 10px 20px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .tawk-pre-chat-form button:hover,
      .tawk-prechat-form button:hover {
        background-color: ${FINTECH_COLORS.primaryDark} !important;
      }

      /* Divider / Separator */
      .tawk-divider,
      .tawk-separator {
        background-color: ${FINTECH_COLORS.border} !important;
      }

      /* Notification Badge */
      .tawk-notification-badge {
        background-color: #dc2626 !important;
        color: ${FINTECH_COLORS.text} !important;
      }

      /* Loading Indicator */
      .tawk-loading {
        color: ${FINTECH_COLORS.primary} !important;
      }

      .tawk-loading::after {
        background: ${FINTECH_COLORS.primary} !important;
      }

      /* Responsive Adjustments */
      @media (max-width: 480px) {
        .tawk-input-box,
        input.tawk-input,
        textarea.tawk-input {
          font-size: 16px; /* Prevents zoom on mobile */
        }

        .tawk-message-box.tawk-from-agent {
          font-size: 14px;
        }
      }

      /* Accessibility - High Contrast Mode */
      @media (prefers-contrast: more) {
        .tawk-input-box,
        input.tawk-input,
        textarea.tawk-input {
          border-width: 3px;
        }

        .tawk-send-btn,
        .tawk-action-button {
          border: 2px solid ${FINTECH_COLORS.primaryDark} !important;
        }
      }

      /* Dark Mode Support (if user has dark mode enabled) */
      @media (prefers-color-scheme: dark) {
        .tawk-message-box.tawk-from-visitor,
        .tawk-visitor-message {
          background-color: #374151 !important;
          color: #f3f4f6 !important;
        }
      }
    `

    // Check if stylesheet already exists
    if (!document.getElementById('tawk-fintech-theme')) {
      document.head.appendChild(styleElement)
    }

    // Optional: Log successful application
    console.log('✓ Tawk.to professional fintech theme applied')
  }

  /**
   * Main initialization function
   * Called when Tawk widget loads
   */
  window.Tawk_API.onLoad = function() {
    applyTawkCustomStyles()

    // Optional: Set visitor name/email if available
    if (typeof window.Tawk_API.setAttributes === 'function') {
      try {
        window.Tawk_API.setAttributes(
          {
            name: '',
            email: '',
          },
          function(error) {
            if (error) {
              console.warn('Tawk: Could not set attributes', error)
            }
          }
        )
      } catch (e) {
        console.warn('Tawk: Error in setAttributes:', e)
      }
    }

    // Optional: Trigger custom event for other scripts
    window.dispatchEvent(new CustomEvent('tawk-themed', { detail: FINTECH_COLORS }))
  }

  /**
   * Load Tawk widget script
   * Must be loaded after Tawk_API is defined
   */
  ;(function() {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/1h5r7jmq1`
    script.charset = 'UTF-8'
    script.setAttribute('crossorigin', '*')
    script.onerror = function() {
      console.error('Failed to load Tawk.to widget')
    }
    document.head.appendChild(script)
  })()

  /**
   * Fallback: Apply styles on demand
   * In case onLoad doesn't fire or is delayed
   */
  const styleCheckInterval = setInterval(function() {
    if (
      document.getElementById('tawk-container') ||
      document.querySelector('[id*="tawk"]')
    ) {
      applyTawkCustomStyles()
      clearInterval(styleCheckInterval)
    }
  }, 500)

  // Clear interval after 10 seconds to prevent memory leaks
  setTimeout(function() {
    clearInterval(styleCheckInterval)
  }, 10000)
})()
