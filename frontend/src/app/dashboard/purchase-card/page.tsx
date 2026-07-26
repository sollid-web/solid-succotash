'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PurchaseCardRedirect() {
  const router = useRouter()
  useEffect(() => { router.replace('/dashboard/card') }, [router])
  return null
}
