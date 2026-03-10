'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

export default function CardPurchaseFlow() {
  const router = useRouter()
  const [step, setStep] = useState<number>(1)
  const [amount, setAmount] = useState<number>(50)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  const submitCardRequest = async () => {
    setLoading(true)
    setError('')
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : ''
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cards/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ purchase_amount: amount }),
      })

      if (res.status === 201) {
        setSuccess(true)
      } else {
        const data = await res.json()
        throw new Error(data?.error || data?.detail || 'Request failed')
      }
    } catch (err: any) {
      setError(err.message || 'Unable to submit request')
    } finally {
      setLoading(false)
    }
  }

  const handleProceed = () => {
    if (amount < 50) {
      setError('Minimum purchase amount is $50')
      return
    }
    setError('')
    setStep(2)
  }

  const handleConfirmPayment = () => {
    setStep(3)
    submitCardRequest()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-2xl font-bold">Get Your Virtual Card</h2>

        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Purchase Amount (USD)</label>
            <input
              type="number"
              min={50}
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleProceed}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm">
              Please deposit <strong>${amount.toFixed(2)}</strong> to the wallet address below or through the
              payment gateway.  Follow on‑screen instructions to complete your transfer.
            </p>
            <div className="p-4 bg-gray-800 rounded border border-gray-700 font-mono">
              WALLET-ADDRESS-1234-ABCD
            </div>
            <button
              onClick={handleConfirmPayment}
              className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
            >
              I have made the payment
            </button>
            <button
              onClick={() => setStep(1)}
              className="w-full py-2 mt-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-200 font-medium"
            >
              Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-center">
            {loading && <Loader2 className="mx-auto animate-spin" />}
            {success && (
              <>
                <CheckCircle2 className="mx-auto text-green-400" />
                <p className="text-green-300">
                  Card request submitted. Pending admin approval.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  Back to dashboard
                </button>
              </>
            )}
            {!loading && error && (
              <>
                <XCircle className="mx-auto text-red-400" />
                <p className="text-red-300">{error}</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  Back to dashboard
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
