import React from 'react'
import { cn } from '@/lib/cn'
import { IconBox } from './IconBox'

interface StepCircleProps {
  number: number
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export const StepCircle: React.FC<StepCircleProps> = ({ number, icon, title, description, className }) => {
  return (
    <div className={cn('text-center', className)}>
      <div className="relative w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-white">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-brand-primary shadow-lg">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-bold text-brand-primary mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

StepCircle.displayName = 'StepCircle'
