'use client';

import { useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

interface WalletConnectQRProps {
  onClose?: () => void;
}

export function WalletConnectQR({ onClose }: WalletConnectQRProps) {
  const { connect, connectors } = useConnect();
  const [uri, setUri] = useState<string>('');
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    const walletConnectConnector = connectors.find(
      (connector) => connector.id === 'walletConnect'
    );

    if (walletConnectConnector && 'getProvider' in walletConnectConnector) {
      const setupListener = async () => {
        try {
          const provider = await (walletConnectConnector as any).getProvider();

          const handleDisplayUri = (uri: string) => {
            setUri(uri);
          };

          provider.on('display_uri', handleDisplayUri);

          // Trigger connection to get URI
          connect({ connector: walletConnectConnector });

          return () => {
            provider.off('display_uri', handleDisplayUri);
          };
        } catch (error) {
          console.error('Failed to setup WalletConnect QR:', error);
        }
      };

      setupListener();
    }
  }, [connect, connectors]);

  if (!uri) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        background: 'rgba(0,0,0,0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(0,168,150,0.3)',
          borderTop: '3px solid #00a896',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#fff', margin: 0, fontSize: '14px' }}>
          Generating QR Code...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(uri)}&bgcolor=0b2f6b&color=ffffff&format=png&margin=2`;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      padding: '24px',
      background: 'rgba(11, 47, 107, 0.95)',
      borderRadius: '16px',
      border: '1px solid rgba(0,168,150,0.3)',
      maxWidth: '320px'
    }}>
      <h3 style={{
        color: '#fff',
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: 600,
        textAlign: 'center'
      }}>
        Connect Wallet
      </h3>

      <p style={{
        color: 'rgba(255,255,255,0.7)',
        margin: 0,
        fontSize: '14px',
        textAlign: 'center',
        lineHeight: 1.4
      }}>
        Scan this QR code with your mobile wallet app to connect
      </p>

      <div style={{
        padding: '16px',
        background: '#fff',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {qrError ? (
          <div style={{
            width: '200px',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.05)',
            borderRadius: '8px',
            color: 'rgba(0,0,0,0.6)',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📱</div>
            QR Code Error
          </div>
        ) : (
          <img
            src={qrSrc}
            alt="WalletConnect QR Code"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '8px'
            }}
            onError={() => setQrError(true)}
          />
        )}
      </div>

      <div style={{
        display: 'flex',
        gap: '8px',
        width: '100%'
      }}>
        <button
          onClick={() => navigator.clipboard.writeText(uri)}
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'rgba(0,168,150,0.1)',
            border: '1px solid rgba(0,168,150,0.3)',
            borderRadius: '8px',
            color: '#00a896',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Copy Link
        </button>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        )}
      </div>

      <p style={{
        color: 'rgba(255,255,255,0.5)',
        margin: '8px 0 0 0',
        fontSize: '12px',
        textAlign: 'center',
        lineHeight: 1.3
      }}>
        Compatible with MetaMask, Trust Wallet, Coinbase Wallet, and more
      </p>
    </div>
  );
}