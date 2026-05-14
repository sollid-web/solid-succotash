'use client'
import { Button } from '@/components/ui/Button'
export default function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden flex gap-2 p-2 z-40" style={{ background: 'rgba(6,12,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(42,82,190,0.2)' }}>
      <Button variant="cta-sky" size="md" asLink href="/accounts/signup" className="flex-1" style={{ background: 'linear-gradient(135deg, #2A52BE, #00a896)', boxShadow: '0 0 16px rgba(0,168,150,0.3)' }}>
        Start Investing
      </Button>
      <Button variant="cta-sky" size="md" asLink href="/accounts/signup" className="flex-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,168,150,0.3)', color: '#fff' }}>
        Create Free Account
      </Button>
    </div>
  )
}
