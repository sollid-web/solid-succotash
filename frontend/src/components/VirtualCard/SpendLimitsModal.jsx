'use client'

export default function SpendLimitsModal({ open, onClose }) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="max-w-lg rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Spending Limits</h2>
            <p className="mt-1 text-sm text-slate-500">This modal is for UI only and does not change card limits.</p>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 text-slate-700">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Monthly limit</div>
            <div className="mt-2 text-lg font-semibold">$5,000</div>
            <div className="text-sm text-slate-500">Used $2,100 of $5,000</div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Single purchase cap</div>
            <div className="mt-2 text-lg font-semibold">$1,500</div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Allowed categories</div>
            <div className="mt-2 text-sm text-slate-500">E-commerce, software, subscriptions, travel</div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
