import React, { useState } from 'react';
import styles from './VirtualCard.module.css';

const VirtualCard = ({ userData, cardData, isFrozen }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={styles.cardContainer} onClick={() => setFlipped(!flipped)}>
      <div className={`${styles.cardInner} ${flipped ? styles.flipped : ''}`}>
        {/* FRONT OF CARD */}
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <div className={styles.cardContent}>
            <div className={styles.cardTop}>
              <span className={styles.brandLogo}>WolvCapital</span>
              <div className={styles.visaInfo}>
                <span className={styles.visaText}>VISA</span>
                <span className={styles.infiniteText}>Infinite</span>
              </div>
            </div>
            <div className={styles.chipSection}>
              <div className={styles.chip}></div>
            </div>
            <div className={styles.cardNumber}>
              4000 7812 3456 {cardData?.lastFour || '0401'}
            </div>
            <div className={styles.cardBottom}>
              <div className={styles.holderInfo}>
                <span className={styles.label}>Card Holder</span>
                <span className={styles.value}>{userData?.fullName || 'CIDALARID'}</span>
              </div>
              <div className={styles.expiryInfo}>
                <span className={styles.label}>Valid Thru</span>
                <span className={styles.value}>{cardData?.expiry || '04/29'}</span>
              </div>
              <div className={styles.hologram}></div>
            </div>
          </div>
        </div>
        {/* BACK OF CARD */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.magneticStrip}></div>
          <div className={styles.signatureArea}>
            <div className={styles.cvvBox}>{cardData?.cvv || '***'}</div>
          </div>
          <div className={styles.backText}>
            Issued by WolvCapital Global Services Ltd. 
            Visa Infinite benefits apply.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualCard;
import React, { useState } from 'react';
import styles from './VirtualCard.module.css'; // Corrected Import

const VirtualCard = ({ userData, cardData, isFrozen }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={styles.cardContainer} onClick={() => setFlipped(!flipped)}>
      <div className={`${styles.cardInner} ${flipped ? styles.flipped : ''}`}>
        
        {/* FRONT OF CARD */}
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          {isFrozen && (
            <div className={styles.frozenOverlay}>
              <span className={styles.frozenText}>CARD FROZEN</span>
            </div>
          )}
          
          <div className={styles.cardContent}>
            <div className={styles.cardTop}>
              <span className={styles.brandLogo}>WolvCapital</span>
              <div className={styles.visaInfo}>
                <span className={styles.visaText}>VISA</span>
                <span className={styles.infiniteText}>Infinite</span>
              </div>
            </div>

            <div className={styles.chipSection}>
              <div className={styles.chip}></div>
              {/* Contactless Icon SVG */}
              <svg className={styles.contactless} viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.03 5.07c.41-.35.46-.96.11-1.37s-.96-.46-1.37-.11C2.56 6.45.5 10.15.5 14.18s2.06 7.73 5.27 10.59c.41.35 1.02.3 1.37-.11s.3-.1.35-.41c-.35-.41-.96-.46-1.37-.11-2.85-2.54-4.68-5.83-4.68-9.41s1.83-6.87 4.68-9.41z"/>
              </svg>
            </div>

            <div className={styles.cardNumber}>
              4000 7812 3456 {cardData?.lastFour || '0401'}
            </div>

            <div className={styles.cardBottom}>
              <div className={styles.holderInfo}>
                <span className={styles.label}>Card Holder</span>
                <span className={styles.value}>{userData?.fullName || 'CIDALARID'}</span>
              </div>
              <div className={styles.expiryInfo}>
                <span className={styles.label}>Valid Thru</span>
                <span className={styles.value}>{cardData?.expiry || '04/29'}</span>
              </div>
              <div className={styles.hologram}></div>
            </div>
          </div>
        </div>

        {/* BACK OF CARD */}
        <div className={`${styles.cardFace} ${styles.cardBack}`}>
          <div className={styles.magneticStrip}></div>
          <div className={styles.signatureArea}>
            <div className={styles.cvvBox}>{cardData?.cvv || '***'}</div>
          </div>
          <div className={styles.backText}>
            Issued by WolvCapital Global Services Ltd. 
            Visa Infinite benefits apply.
          </div>
        </div>

      </div>
    </div>
  );
};

export default VirtualCard;