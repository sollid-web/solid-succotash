'use client'
import { useEffect } from 'react'

export default function TidioWidget() {
  useEffect(() => {
    const d = document
    const s = d.createElement('script')
    s.src = '//code.tidio.co/x2gf9dyrsem5iaaxewp9sv3luqsbfygq.js'
    s.async = true
    d.getElementsByTagName('head')[0].appendChild(s)
  }, [])
  return null
}
