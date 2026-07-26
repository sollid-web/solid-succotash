'use client'
import React from 'react'

function StarIcon({ white }: { white?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={white ? '#FFFFFF' : '#FFFFFF'} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function MiniStars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="w-4 h-4 rounded-sm flex items-center justify-center"
          style={{ background: i <= count ? '#00B67A' : '#DCDCE6' }}
        >
          <StarIcon />
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ stars, name, country, text }: { stars: number; name: string; country: string; text: string }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <MiniStars count={stars} />
        <span className="text-xs font-medium text-gray-700">{name}</span>
        <span className="text-xs text-gray-400">{country} · Verified</span>
      </div>
      <p className="text-sm text-gray-700 leading-snug">{text}</p>
    </div>
  )
}

export default function TrustpilotWidget() {
  return (
    <section className="flex flex-wrap items-center justify-between gap-6 border border-gray-100 rounded-2xl px-7 py-5 bg-white">

      {/* Score */}
      <div className="flex flex-col gap-1">
        <p className="text-xs text-gray-500">Rated on Trustpilot</p>
        <p className="text-3xl font-medium">4.3





      
        </p>
        <div className="flex gap-1 my-1">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: '#00B67A' }}
            >
              <StarIcon />
            </span>
          ))}
          <span
            className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'linear-gradient(to right, #00B67A 40%, #DCDCE6 40%)' }}
          >
            <StarIcon />
          </span>
        </div>
        <p className="text-xs text-gray-500">10 verified reviews</p>
      </div>

      {/* Reviews */}
      <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
        <ReviewCard stars={5} name="Lucas" country="SG" text="WolvCapital's support team genuinely deserves a review. Every time I reached out, I got a fast and clear response without the usual back-and-forth or generic replies." />
        <ReviewCard stars={5} name="Cunningham" country="NL" text="I've been using WolvCapital for a while now, specifically their Pioneer Investment Plan, and my experience has been genuinely positive so far." />
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{ background: '#00B67A' }}
          >
            <StarIcon white />
          </div>
          <span className="font-medium">Trustpilot</span>
        </div>
        <a
          href="https://www.trustpilot.com/review/wolvcapital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs border border-green-400 text-green-700 rounded-lg px-4 py-1.5"
        >
          See all reviews
        </a>
        <a
          href="https://www.trustpilot.com/review/wolvcapital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white rounded-lg px-4 py-1.5"
          style={{ background: '#00B67A' }}
        >
          Leave a review
        </a>
      </div>

    </section>
  )
}