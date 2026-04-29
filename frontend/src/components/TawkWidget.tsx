'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API?: any
  }
}

interface TawkWidgetProps {
  propertyId: string
}

export default function TawkWidget({ propertyId }: TawkWidgetProps) {
  useEffect(() => {
    // Configure Tawk widget with fintech color scheme on load
    const handleTawkLoad = () => {
      if (typeof window !== 'undefined' && window.Tawk_API) {
        window.Tawk_API.onLoad = function () {
          // Set custom fintech color scheme
          window.Tawk_API.setAttributes(
            {
              name: 'Fintech Theme Applied',
              email: '',
            },
            function (error: any) {
              if (error) {
                console.warn('Tawk setAttributes error:', error)
              }
            }
          )

          // Apply custom styles via CSS injection
         
        }
      }
    }

    // Call immediately in case Tawk is already loaded
    handleTawkLoad()

    // Listen for Tawk load event
    window.addEventListener('tawk-widget-loaded', handleTawkLoad)

    return () => {
      window.removeEventListener('tawk-widget-loaded', handleTawkLoad)
    }
  }, [])

  return (
    <Script
      id="tawk-widget"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {};
          var Tawk_LoadStart = new Date();
          
          Tawk_API.onLoad = function() {
            // Professional fintech styling
            applyTawkCustomStyles();
          };
          
          (function() {
            var s1 = document.createElement('script');
            var s0 = document.getElementsByTagName('script')[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/${propertyId}/1h5r7jmq1';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
            
            // Dispatch event when loaded
            window.addEventListener('load', function() {
              if (window.Tawk_API) {
                window.dispatchEvent(new Event('tawk-widget-loaded'));
              }
            });
          })();
          
          function applyTawkCustomStyles() {
            const style = document.createElement('style');
            style.textContent = \`
              /* Professional fintech Tawk.to theme */
              #tawk-container {
                --tawk-primary-color: #002350;
                --tawk-text-color: #ffffff;
                --tawk-bg-color: #ffffff;
                --tawk-border-color: #e5e7eb;
              }
              
              /* Widget header */
              .tawk-branding-header,
              .tawk-chat-header {
                background-color: #002350 !important;
                color: white !important;
              }
              
              /* Chat messages from agent */
              .tawk-message-box.tawk-from-agent {
                background-color: #002350 !important;
                color: white !important;
              }
              
              .tawk-message-box.tawk-from-agent .tawk-message-text {
                color: white !important;
              }
              
              /* Input field styling */
              .tawk-input-box {
                border: 2px solid #002350 !important;
                border-radius: 4px;
              }
              
              .tawk-input-box:focus {
                border-color: #002350 !important;
                outline: none;
              }
              
              /* Send button */
              .tawk-send-btn,
              .tawk-action-button {
                background-color: #002350 !important;
                color: white !important;
              }
              
              .tawk-send-btn:hover,
              .tawk-action-button:hover {
                background-color: #001840 !important;
              }
              
              /* Widget badge/icon */
              .tawk-widget-badge {
                background-color: #002350 !important;
              }
              
              /* Links in Tawk chat */
              .tawk-message-box a {
                color: #002350 !important;
              }
              
              /* Pre-chat form */
              .tawk-prefilled-form input,
              .tawk-prefilled-form textarea,
              .tawk-pre-chat-form input,
              .tawk-pre-chat-form textarea {
                border: 1px solid #002350 !important;
                color: #002350 !important;
              }
              
              .tawk-prefilled-form input::placeholder,
              .tawk-pre-chat-form input::placeholder {
                color: #999999 !important;
              }
              
              /* Buttons styling */
              .tawk-pre-chat-form button,
              .tawk-prefilled-form button {
                background-color: #002350 !important;
                color: white !important;
              }
              
              .tawk-pre-chat-form button:hover,
              .tawk-prefilled-form button:hover {
                background-color: #001840 !important;
              }
              
              /* Minimize button */
              .tawk-minimize {
                background-color: #002350 !important;
              }
            \`;
            document.head.appendChild(style);
          }
        `,
      }}
    />
  )
}
