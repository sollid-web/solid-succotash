import React from 'react'
import { cn } from '@/lib/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cta-sky' | 'white' | 'plan' | 'plan-sky' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  asLink?: boolean
  href?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'cta-sky',
      size = 'md',
      className,
      children,
      asLink = false,
      href,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-[7px] focus:outline-none'

    const variantStyles = {
      'cta-sky': 'bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold hover:from-sky-500 hover:to-sky-600 hover:brightness-110 active:translate-y-0.5',
      'white': 'bg-white text-brand-primary border-2 border-gray-300 hover:border-brand-secondary hover:shadow-lg active:translate-y-0.5',
      'plan': 'bg-transparent border border-white/18 text-[#0F172A]/75 hover:bg-white/7 active:translate-y-0.5',
      'plan-sky': 'bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold border-transparent hover:brightness-110 active:translate-y-0.5',
      'outline': 'border-2 border-current text-current hover:bg-current hover:text-[#0F172A] active:translate-y-0.5',
    }

    const sizeStyles = {
      'sm': 'px-3 py-2 text-sm',
      'md': 'px-6 py-2.5 text-base',
      'lg': 'px-8 py-3.5 text-base',
    }

    const buttonClassName = cn(baseStyles, variantStyles[variant], sizeStyles[size], className)

    if (asLink && href) {
      return (
        <a href={href} className={buttonClassName}>
          {children}
        </a>
      )
    }

    return (
      <button ref={ref} className={buttonClassName} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
