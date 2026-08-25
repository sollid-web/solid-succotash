import type { ReactNode } from 'react'
import './globals.css'
import AppChrome from '@/components/AppChrome'
import { TranslationProvider } from '@/components/TranslationProvider'
import WolvAiWidget from './WolvAiWidget'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TranslationProvider>
          <AppChrome>{children}</AppChrome>
        </TranslationProvider>
        <WolvAiWidget />
      </body>
    </html>
  )
}