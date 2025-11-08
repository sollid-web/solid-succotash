'use client'

import { useState } from 'react'

export default function FlipVisaCard() {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleFlip()
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className="relative w-full max-w-sm h-56 cursor-pointer perspective-1000"
        onClick={handleFlip}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={isFlipped ? "Click to flip card to front" : "Click to flip card to back"}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full rounded-2xl shadow-2xl p-6 flex flex-col justify-between"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #0b2f6b 0%, #1d4ed8 50%, #2563eb 100%)'
            }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="text-white font-bold text-lg tracking-wide">WOLVCAPITAL LTD</div>
                <div className="text-blue-200 text-xs">Premium Banking</div>
              </div>
              <div className="flex space-x-2">
                <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
                  <rect width="30" height="22" rx="4" fill="#FFD700" fillOpacity="0.9"/>
                  <rect x="2" y="4" width="6" height="4" rx="1" fill="#DAA520"/>
                  <rect x="2" y="10" width="6" height="4" rx="1" fill="#DAA520"/>
                  <rect x="10" y="4" width="6" height="4" rx="1" fill="#DAA520"/>
                  <rect x="10" y="10" width="6" height="4" rx="1" fill="#DAA520"/>
                  <rect x="18" y="4" width="6" height="4" rx="1" fill="#DAA520"/>
                  <rect x="18" y="10" width="6" height="4" rx="1" fill="#DAA520"/>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M8 12 C8 12, 10 8, 12 8 C14 8, 16 12, 16 12 C16 12, 14 16, 12 16 C10 16, 8 12, 8 12Z" fill="white" fillOpacity="0.3"/>
                  <circle cx="12" cy="12" r="3" fill="white" fillOpacity="0.5"/>
                </svg>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-white font-mono text-xl tracking-wider mb-4">
                4532  ****  ****  7891
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-blue-200 text-xs mb-1">Card Holder</div>
                  <div className="text-white font-semibold text-sm">-----</div>
                </div>
                <div>
                  <div className="text-blue-200 text-xs mb-1">Expires</div>
                  <div className="text-white font-semibold text-sm">12/28</div>
                </div>
                <svg width="50" height="16" viewBox="0 0 50 16" fill="none">
                  <text x="0" y="12" fill="white" fontSize="14" fontWeight="bold" fontFamily="Arial">VISA</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #0b2f6b 0%, #1d4ed8 50%, #2563eb 100%)'
            }}
          >
            <div className="w-full h-10 bg-black mt-6"></div>
            <div className="px-6 mt-6">
              <div className="bg-white/20 h-10 rounded flex items-center justify-end px-4">
                <span className="text-white font-mono text-sm">***</span>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <div className="text-blue-200 text-xs mb-1">Security Code</div>
                  <div className="text-white text-sm">See above</div>
                </div>
                <div className="text-blue-200 text-xs text-right">
                  <div>For customer service:</div>
                  <div className="text-white font-semibold">support@wolvcapital.com</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-blue-200 text-xs">wolvcapital.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
