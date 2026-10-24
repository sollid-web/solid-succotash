'use client'
import { useState } from 'react'

/** Contract address with copy-to-clipboard and BscScan link. */
export default function ContractRow({ name, address, href }: { name: string; address: string; href: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch { /* clipboard unavailable */ }
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] py-3 last:border-0">
      <span className="text-sm font-medium text-white/75">{name}</span>
      <span className="flex items-center gap-2">
        <code className="text-xs text-teal-300" style={{ fontFamily: "'DM Mono', monospace" }}>{address.slice(0, 8)}…{address.slice(-6)}</code>
        <button type="button" onClick={copy} className="rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white/80 transition hover:border-teal-400/50 hover:bg-white/10" aria-label={`Copy ${name} address`}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <a href={href} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white/80 transition hover:border-teal-400/50 hover:bg-white/10">BscScan ↗</a>
      </span>
    </div>
  )
}
