import React, { useState } from "react";
import styles from "./VirtualCard.module.css";

// Fix: handle both flat expiry_date and expiry_month/expiry_year formats
function formatExpiry(cardData) {
  if (cardData?.expiry_date) return cardData.expiry_date;
  if (cardData?.expiry_month && cardData?.expiry_year) {
    const m = String(cardData.expiry_month).padStart(2, "0");
    const y = String(cardData.expiry_year).slice(-2);
    return `${m}/${y}`;
  }
  return "••/••";
}

export default function VirtualCard({ userData, cardData, isFrozen }) {
  const [flipped, setFlipped] = useState(false);

  const cardNumber = cardData?.card_number || "•••• •••• •••• ••••";
  const expiry = formatExpiry(cardData);
  const holder = cardData?.cardholder_name || userData?.fullName || "CARD HOLDER";
  const cvv = cardData?.cvv || "•••";

  return (
    <div className={styles.cardContainer} onClick={() => setFlipped((f) => !f)}>
      <div className={`${styles.cardInner} ${flipped ? styles.flipped : ""}`}>

        {/* FRONT */}
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardTop}>
              <div className={styles.brandLogo}>
                <span className={styles.brandWolv}>Wolv</span>
                <span className={styles.brandCap}>Capital</span>
              </div>
              <div className={styles.visaInfo}>
                <span className={styles.visaText}>VISA</span>
                <span className={styles.infiniteText}>Infinite</span>
              </div>
            </div>

            <div className={styles.chipSection}>
              <div className={styles.chip}>
                <div className={styles.chipGrid} />
                <div className={styles.chipCenter} />
              </div>
              <svg className={styles.contactless} viewBox="0 0 24 24" fill="none">
                <path d="M12 3C8 7 8 17 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M15.5 6C13 8.5 13 15.5 15.5 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
                <path d="M19 9C17.5 10.5 17.5 13.5 19 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.45"/>
              </svg>
            </div>

            <div className={styles.cardNumber}>{cardNumber}</div>

            <div className={styles.cardBottom}>
              <div className={styles.holderInfo}>
                <span className={styles.label}>Card Holder</span>
                <span className={styles.value}>{holder}</span>
              </div>
              <div className={styles.expiryInfo}>
                <span className={styles.label}>Valid Thru</span>
                <span className={styles.value}>{expiry}</span>
              </div>
              <div className={styles.hologram} />
            </div>
          </div>

          {isFrozen && (
            <div className={styles.frozenOverlay}>
              <span className={styles.frozenIcon}>❄️</span>
              <span className={styles.frozenText}>CARD FROZEN</span>
            </div>
          )}
        </div>

        {/* BACK */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.backContactInfo}>
            <div>Tel. +1 800 XXX XXXX (Toll-Free USA)</div>
            <div>WolvCapital Global Contact Center</div>
          </div>

          <div className={styles.magneticStrip} />

          <div className={styles.signatureRow}>
            <div className={styles.signatureArea}>
              <span className={styles.signatureText}>WolvCapital Online Banking</span>
            </div>
            <div className={styles.cvvBox}>
              <div className={styles.cvvValue}>{cvv}</div>
              <div className={styles.cvvLabel}>CVV/CVC</div>
            </div>
          </div>

          <div className={styles.backFooter}>
            <div className={styles.backText}>
              Issued by WolvCapital Global Services Ltd. Visa Infinite benefits apply.
            </div>
            <div className={styles.backVisa}>
              <span className={styles.visaTextBack}>VISA</span>
              <span className={styles.infiniteTextBack}>Infinite</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}