import React from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured' | 'hover'
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl border transition-all duration-200'

    const variantStyles = {
      'default': 'bg-white border-gray-200 shadow-sm hover:shadow-md',
      'featured': 'bg-white/9 border-sky-400/50 border-t-4 shadow-sm hover:bg-white/12 hover:shadow-lg',
      'hover': 'bg-white border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1',
    }

    return (
      <div ref={ref} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
