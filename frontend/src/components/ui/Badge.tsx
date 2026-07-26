import React from 'react'
import { cn } from '@/lib/cn'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'hero' | 'plan' | 'success' | 'pending' | 'default'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold'

    const variantStyles = {
      'hero': 'border border-white/20 bg-white/10 backdrop-blur-sm text-[#0F172A]/95',
      'plan': 'bg-[#e2f5ff] text-brand-primary',
      'success': 'bg-green-100 text-green-800 border border-green-300',
      'pending': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      'default': 'bg-gray-100 text-gray-800 border border-gray-300',
    }

    return (
      <div ref={ref} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'
