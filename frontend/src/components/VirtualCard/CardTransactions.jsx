'use client'

export default function CardTransactions({ transactions, loading, error }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recent Card Transactions</h2>
          <p className="text-sm text-slate-500">Latest purchases and refunds for your virtual card.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Loading transactions…</div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-500">No transactions yet.</div>
      ) : (
        <div className="space-y-3">
          {transactions.map((txn, index) => {
            const date = txn.date ? new Date(txn.date * 1000) : null
            return (
              <div key={index} className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{txn.merchant || 'Unknown Merchant'}</div>
                  <div className="text-sm text-slate-500">{date ? date.toLocaleDateString('en-US') : 'Unknown date'}</div>
                </div>
                <div className="flex flex-col items-start text-right sm:items-end">
                  <span className="font-semibold text-slate-900">{txn.currency?.toUpperCase()} {((txn.amount || 0) / 100).toFixed(2)}</span>
                  <span className="text-sm text-slate-500">{txn.type || 'Purchase'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
