import React from 'react'
import { cn } from '@/lib/cn'

interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'blue' | 'green' | 'purple' | 'amber' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const IconBox = React.forwardRef<HTMLDivElement, IconBoxProps>(
  ({ variant = 'blue', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'flex items-center justify-center rounded-lg flex-shrink-0 shadow-lg'

    const variantStyles = {
      'blue': 'bg-gradient-to-br from-brand-primary to-brand-secondary',
      'green': 'bg-gradient-to-br from-green-600 to-green-700',
      'purple': 'bg-gradient-to-br from-purple-600 to-purple-700',
      'amber': 'bg-gradient-to-br from-amber-500 to-amber-600',
      'indigo': 'bg-gradient-to-br from-indigo-600 to-indigo-700',
    }

    const sizeStyles = {
      'sm': 'w-10 h-10',
      'md': 'w-14 h-14',
      'lg': 'w-16 h-16',
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

IconBox.displayName = 'IconBox'
