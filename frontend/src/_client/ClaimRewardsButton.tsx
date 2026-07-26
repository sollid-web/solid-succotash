'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

import { useState, useEffect } from 'react';

// Replace with your actual Staking/Rewards Contract Address on BNB Chain

const REWARDS_CONTRACT = '0xb233cf74b14abf9d9702d585c540030125599579'; 

const REWARDS_ABI = [

  {

    name: 'claimRewards',

    type: 'function',

    stateMutability: 'nonpayable',

    inputs: [],

    outputs: [],

  },

] as const;

export function ClaimRewardsButton() {

  const [successMessage, setSuccessMessage] = useState(false);

  // 1. The hook to initiate the transaction

  const { 

    data: hash, 

    isPending: isAwaitingWallet, 

    writeContract, 

    error: writeError 

  } = useWriteContract();

  // 2. The hook to track the transaction on the blockchain

  const { 

    isLoading: isMining, 

    isSuccess 

  } = useWaitForTransactionReceipt({ 

    hash,

  });

  // Handle successful claim UI state

  useEffect(() => {

    if (isSuccess) {

      setSuccessMessage(true);

      const timer = setTimeout(() => setSuccessMessage(false), 5000);

      return () => clearTimeout(timer);

    }

  }, [isSuccess]);

  const handleClaim = () => {

    writeContract({

      address: REWARDS_CONTRACT,

      abi: REWARDS_ABI,

      functionName: 'claimRewards',

    });

  };

  // Determine button state and styling

  const isBusy = isAwaitingWallet || isMining;

  

  let buttonText = 'Claim WOLV Rewards';

  if (isAwaitingWallet) buttonText = 'Confirm in Wallet...';

  if (isMining) buttonText = 'Mining on BNB Chain...';

  if (successMessage) buttonText = '✓ Rewards Claimed!';

  return (

    <div className="flex flex-col items-center w-full mt-4">

      <button

        onClick={handleClaim}

        disabled={isBusy || successMessage}

        className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-lg ${

          isBusy 

            ? 'bg-gray-600 cursor-not-allowed opacity-70 text-gray-300'

            : successMessage

            ? 'bg-green-600 text-white border border-green-500'

            : 'bg-gradient-to-r from-[#00a896] to-[#0a6c62] text-white hover:scale-[1.02] border border-[#00a896]/50'

        }`}

      >

        {buttonText}

      </button>

      {/* Error Feedback */}

      {writeError && (

        <div className="mt-3 text-xs text-red-400 bg-red-400/10 p-2 rounded-lg border border-red-400/20 w-full text-center">

          {writeError.message.includes('User rejected') 

            ? 'Transaction was cancelled in your wallet.' 

            : 'An error occurred. Please try again.'}

        </div>

      )}

      

      {/* Hash tracking (Optional but great for Web3 users) */}

      {hash && !isSuccess && !writeError && (

        <a 

          href={`https://bscscan.com/tx/${hash}`} 

          target="_blank" 

          rel="noopener noreferrer"

          className="mt-3 text-xs text-[#00a896] hover:underline"

        >

          View transaction on BscScan ↗

        </a>

      )}

    </div>

  );

}