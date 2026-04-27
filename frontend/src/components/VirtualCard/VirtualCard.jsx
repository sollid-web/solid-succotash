import React, { useState } from "react";
import styles from "./VirtualCard.module.css";

export default function VirtualCard({ userData, cardData, isFrozen }) {
  const [flipped, setFlipped] = useState(false);

  // Fallbacks for missing data
  const cardNumber = cardData?.card_number || "4000 7812 3456 7717";
  const lastFour = cardNumber.slice(-4);
  const expiry = cardData?.expiry || cardData?.expiry_date || "01/29";
  const holder = cardData?.cardholder_name || userData?.fullName || "JAMES";

  return (
    <div className={styles.cardContainer} onClick={() => setFlipped((f) => !f)}>
      <div className={`${styles.cardInner} ${flipped ? styles.flipped : ""}`}>
        {/* FRONT */}
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardTop}>
              <span className={styles.brandLogo}>WolvCapital</span>
              <div className={styles.visaInfo}>
                <span className={styles.visaText}>VISA</span>
                <span className={styles.infiniteText}>INFINITE</span>
              </div>
            </div>
            <div className={styles.chipSection}>
              <div className={styles.chip} />
              <svg className={styles.contactless} viewBox="0 0 24 24" fill="none">
                <path d="M8.5 12c0-1.93 1.57-3.5 3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5.5 12c0-3.59 2.91-6.5 6.5-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="0.5" fill="currentColor" />
              </svg>
            </div>
            <div className={styles.cardNumber}>{cardNumber}</div>
            <div className={styles.cardBottom}>
              <div className={styles.holderInfo}>
                <span className={styles.label}>CARD HOLDER</span>
                <span className={styles.value}>{holder}</span>
              </div>
              <div className={styles.expiryInfo}>
                <span className={styles.label}>VALID THRU</span>
                <span className={styles.value}>{expiry}</span>
              </div>
              <div className={styles.hologram} />
            </div>
          </div>
          {isFrozen && (
            <div className={styles.frozenOverlay}>
              <span className={styles.frozenText}>FROZEN</span>
            </div>
          )}
        </div>
        {/* BACK */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.magneticStrip} />
          <div className={styles.signatureArea}>
            <div className={styles.cvvBox}>{cardData?.cvv || "•••"}</div>
          </div>
          <div className={styles.backText}>
            Issued by WolvCapital Global Services Ltd. Visa Infinite benefits apply.
          </div>
        </div>
      </div>
    </div>
  );
}
