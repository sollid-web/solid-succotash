'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  text: string
  className?: string
}

export default function ShareButtons({ url, text, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: text, text, url })
        return
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`

  return (
    <div className={`flex items-center gap-2 ${className ?? ''}`}>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share
      </a>
      <button
        type="button"
        onClick={handleNativeShare}
        aria-label="Copy link"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition"
        style={{
          background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)',
          border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.15)',
          color: copied ? '#10b981' : '#fff',
        }}
      >
        {copied ? '✓ Copied' : 'Copy Link'}
      </button>
    </div>
  )
}
