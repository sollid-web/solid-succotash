"use client"

import React from 'react'

type Props = {
  src: string
  alt: string
  className?: string
}

export default function SignatureImage({ src, alt, className }: Props) {
  const imgRef = React.useRef<HTMLImageElement | null>(null)

  const handleError = () => {
    if (imgRef.current) {
      imgRef.current.style.display = 'none'
    }
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  )
}
