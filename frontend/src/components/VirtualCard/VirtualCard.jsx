'use client'

import { useEffect, useState } from 'react'
import styles from './VirtualCard.module.css'

export default function VirtualCard({ cardData, onFreeze }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFrozen, setIsFrozen] = useState(Boolean(cardData?.is_frozen))

  useEffect(() => {
    setIsFrozen(Boolean(cardData?.is_frozen))
  }, [cardData?.is_frozen])

  useEffect(() => {
    if (typeof onFreeze === 'function') {
      onFreeze(isFrozen)
    }
  }, [isFrozen, onFreeze])

  const numberDisplay = cardData?.number
    ? cardData.number.replace(/\s+/g, ' ').trim()
    : `•••• •••• •••• ${cardData?.last4 ?? '0000'}`

  const expiry = cardData?.exp_month && cardData?.exp_year
    ? `${String(cardData.exp_month).padStart(2, '0')}/${String(cardData.exp_year).slice(-2)}`
    : 'MM/YY'

  return (
    <div className={styles.cardContainer} onClick={() => setIsFlipped((prev) => !prev)}>
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}>
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.25em] text-slate-200">Virtual card</div>
              <div className="mt-6 text-2xl font-semibold tracking-[0.16em]">{numberDisplay}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-100">
              <div>
                <div className="text-xs uppercase text-slate-300">Cardholder</div>
                <div className="mt-1 font-medium">{cardData?.holder_name || 'Cardholder'}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-300">Expires</div>
                <div className="mt-1 font-medium">{expiry}</div>
              </div>
            </div>
          </div>
          {isFrozen && (
            <div className={styles.frozenOverlay}>
              <div className={styles.frozenText}>CARD FROZEN</div>
            </div>
          )}
        </div>

        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="h-10 rounded-xl bg-slate-900/10" />
            </div>
            <div className="space-y-4 text-slate-100">
              <div>
                <div className="text-xs uppercase text-slate-300">Security code</div>
                <div className="mt-2 text-3xl font-semibold tracking-[0.4em]">{cardData?.cvc || '•••'}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-300">Card number</div>
                <div className="mt-2 text-sm tracking-[0.22em]">{numberDisplay}</div>
              </div>
            </div>
          </div>
          {isFrozen && (
            <div className={styles.frozenOverlay}>
              <div className={styles.frozenText}>CARD FROZEN</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
