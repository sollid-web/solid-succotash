import React from 'react'
import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
  centered?: boolean
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  label,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  centered = false,
}) => {
  return (
    <div className={cn(centered && 'text-center', className)}>
      {label && (
        <span className="text-xs uppercase tracking-wider font-bold text-sky-600 block mb-2">
          {label}
        </span>
      )}
      <h2 className={cn('text-4xl lg:text-5xl font-bold text-brand-primary leading-tight mb-4', titleClassName)}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-gray-600 text-lg leading-relaxed max-w-2xl',
            centered && 'mx-auto',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

SectionHeader.displayName = 'SectionHeader'
