'use client';
import { WolvWalletButton } from './WolvWalletButton';

export function WolvWalletSection(): import("react/jsx-runtime").JSX.Element {
  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(42,82,190,0.22) 0%, rgba(0,168,150,0.14) 100%)',
      border: '1px solid rgba(42,82,190,0.38)',
      borderRadius: '24px',
      padding: '32px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow orbs */}
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px',
        width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(42,82,190,0.2) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-40px', left: '-40px',
        width: '140px', height: '140px',
        background: 'radial-gradient(circle, rgba(0,168,150,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(42,82,190,0.5), rgba(0,168,150,0.35))',
              border: '1px solid rgba(42,82,190,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(42,82,190,0.25)',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.8">
                <path d="M19 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 12h.01"/>
                <path d="M3 7V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '17px', fontWeight: 700, lineHeight: 1.2 }}>
                Claim Your Staking Rewards
              </div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '2px' }}>
                BNB Smart Chain · WOLV Token
              </div>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
            Connect your Web3 wallet to view your WOLV balance and claim tokens
            earned through staking rewards.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px' }} />

        {/* Wallet button */}
        <WolvWalletButton />

        {/* Footer note */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginTop: '16px', justifyContent: 'center',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00a896', display: 'inline-block' }} />
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '11px' }}>
            Tokens earned through smart contract staking on BNB Chain
          </span>
        </div>
      </div>
    </div>
  );
}
