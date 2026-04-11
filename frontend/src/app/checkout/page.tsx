'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const CHECKOUT_ITEMS = [
  {
    id: 'investment-plan',
    name: 'Investment Plan Request',
    description: 'Submit a new request for funding and admin review.',
    amount: 500,
  },
  {
    id: 'wallet-topup',
    name: 'Wallet Funding',
    description: 'Top up your wallet for future transactions and deposits.',
    amount: 250,
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')

  const selectedItems = useMemo(
    () => CHECKOUT_ITEMS.filter((item) => selectedItemIds.includes(item.id)),
    [selectedItemIds],
  )

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.amount, 0),
    [selectedItems],
  )

  const handleAddToCheckout = (itemId: string) => {
    setSelectedItemIds((current) =>
      current.includes(itemId) ? current : [...current, itemId],
    )
  }

  const handleCompleteCheckout = () => {
    const txId = `TX-${Date.now()}`
    const params = new URLSearchParams({
      status: 'completed',
      txId,
      amount: subtotal.toString(),
      email: customerEmail,
      name: customerName,
    })
    router.push(`/checkout/success?${params.toString()}`)
  }

  const isCheckoutReady =
    selectedItems.length > 0 &&
    customerEmail.trim().length > 0 &&
    customerName.trim().length > 0

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Checkout</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Checkout</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Add your customer details and a checkout item to trigger the Trustpilot invitation flow.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Available checkout items</h2>
              <div className="mt-5 space-y-4">
                {CHECKOUT_ITEMS.map((item) => {
                  const isAdded = selectedItemIds.includes(item.id)
                  return (
                    <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                          <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-slate-900">${item.amount}</span>
                          <button
                            type="button"
                            onClick={() => handleAddToCheckout(item.id)}
                            disabled={isAdded}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                              isAdded
                                ? 'cursor-not-allowed bg-slate-300 text-slate-700'
                                : 'bg-slate-900 text-[#0F172A] hover:bg-slate-800'
                            }`}
                          >
                            {isAdded ? 'Added' : 'Add to checkout'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Checkout preview</h2>
              <div className="mt-5 rounded-3xl bg-slate-50 p-5">
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-slate-600">No items added yet. Click “Add to checkout” to begin.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">${item.amount}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                      <span className="text-sm font-semibold text-slate-700">Total</span>
                      <span className="text-xl font-bold text-slate-900">${subtotal}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Customer details</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Enter the customer name and email so the invitation email can be sent on completion.
                </p>
              </div>
              <div className="space-y-4 rounded-3xl bg-slate-50 p-5">
                <label className="block text-sm font-semibold text-slate-700">
                  Full name
                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Jane Doe"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Email address
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(event) => setCustomerEmail(event.target.value)}
                    placeholder="jane@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900"
                  />
                </label>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-700">Selected items</p>
                <p className="mt-3 text-3xl font-bold text-slate-900">${subtotal}</p>
              </div>
              <button
                type="button"
                disabled={!isCheckoutReady}
                onClick={handleCompleteCheckout}
                className={`inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-[#0F172A] transition ${
                  !isCheckoutReady
                    ? 'cursor-not-allowed bg-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Complete checkout
              </button>
              <p className="text-xs text-slate-500">
                The success page will load with the completed status and trigger the Trustpilot invitation widget.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
