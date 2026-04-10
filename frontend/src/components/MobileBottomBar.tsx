'use client'

import { Button } from '@/components/ui/Button'

export default function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 flex gap-2 p-2 z-40">
      <Button variant="cta-sky" size="md" asLink href="/accounts/signup" className="flex-1">
        Start Investing
      </Button>
      <Button variant="cta-sky" size="md" asLink href="/accounts/signup" className="flex-1">
        Create Free Account
      </Button>
    </div>
  )
}
