type RiskDisclaimerProps = {
  className?: string
}

export default function RiskDisclaimer({ className }: RiskDisclaimerProps) {
  const sectionClassName = ['blog-disclaimer', className].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName} aria-label="Risk disclaimer">
      <div className="blog-disclaimer__card rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <p className="text-sm text-gray-600 leading-relaxed">
          Risk disclosure: Digital assets and cryptocurrency-related products can be volatile. You may lose some or all
          of your invested capital. Consider your circumstances and only invest what you can afford to lose.
        </p>
      </div>
    </section>
  )
}
