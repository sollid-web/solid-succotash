import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found — WolvCapital',
  description: 'The page you are looking for could not be found. Return to WolvCapital to explore investment plans and digital asset opportunities.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0b2f6b] to-[#2563eb]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-200 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link 
            href="/" 
            className="inline-block bg-white text-[#0b2f6b] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Return Home
          </Link>
          <Link 
            href="/contact" 
            className="inline-block bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#0b2f6b] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
