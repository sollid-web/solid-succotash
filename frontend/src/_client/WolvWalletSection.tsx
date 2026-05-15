'use client';
import { WolvWalletButton } from './WolvWalletButton';

export function WolvWalletSection(): import("react/jsx-runtime").JSX.Element {
  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="text-white text-lg font-semibold mb-2">Claim Your Staking Rewards</div>
        <div className="text-gray-400 text-sm">
          Connect your wallet to claim WOLV tokens earned from staking rewards
        </div>
      </div>
      <WolvWalletButton />
      <div className="mt-4 text-xs text-gray-500">
        WOLV tokens are earned through smart contract staking on BNB Chain
      </div>
    </div>
  );
}