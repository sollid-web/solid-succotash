'use client'

import Link from 'next/link'

export default function DisclosureBar() {
  return (
    <div className="hidden fixed top-20 w-full bg-amber-50 border-b-4 border-amber-400 px-4 sm:px-6 lg:px-8 py-3 z-40">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed text-center">
          <strong>Important:</strong> All staking positions carry risk, including potential loss of principal. Digital assets are highly volatile. Rewards are not guaranteed. WolvCapital is a regulated digital asset custodian platform.{' '}
          <Link href="/risk-disclosure" className="font-bold underline hover:text-amber-800">
            Review our Risk Disclosure
          </Link>{' '}
          before staking.
        </p>
      </div>
    </div>
  )
}
