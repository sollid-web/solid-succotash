'use client';
import { WolvWalletButton } from './WolvWalletButton';

export function WolvWalletSection() {
  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="text-white text-lg font-semibold mb-2">Connect Your Wallet</div>
        <div className="text-gray-400 text-sm">
          Connect your wallet to receive WOLV tokens from your investment profits
        </div>
      </div>
      <WolvWalletButton />
      <div className="mt-4 text-xs text-gray-500">
        WOLV tokens are automatically distributed based on your investment performance
      </div>
    </div>
  );
}