"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, DollarSign, ShieldCheck, TrendingUp, Wallet } from "lucide-react";

type PlanDetail = {
  slug: "pioneer" | "vanguard" | "horizon" | "summit";
  name: string;
  subtitleLine: string;
  supportingLine: string;
  dailyRoiPct: number;
  durationDays: number;
  minUsd: number;
  maxUsd: number;
  ctaLabel: string;
  ctaMicrotext: string;
  secondaryLinkLabel: string;
  highlightsTitle: string;
  highlightsNote: string;
  calculatorTitle: string;
  calculatorHelper: string;
  calculatorCtaLabel: string;
  positioningTitle: string;
  positioningBody: string;
  positioningBullets: string[];
  activationTitle: string;
  activationSteps: string[];
  activationCtaLabel: string;
  trustTitle: string;
  trustBody: string;
  trustBullets: string[];
  trustLinkLabel: string;
  faqTitle: string;
  faqs: Array<{ q: string; a: string }>;
  finalCtaHeadline: string;
  finalCtaSubhead: string;
  finalCtaLabel: string;
  finalCtaMicrotext: string;
  stickyBarText: string;
  stickyCtaLabel: string;
};

function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PlanDetailPage({ plan }: { plan: PlanDetail }) {
  const [amountInput, setAmountInput] = useState(String(plan.minUsd));

  const parsedAmount = Number(amountInput);
  const clampedAmount = useMemo(() => {
    if (!Number.isFinite(parsedAmount)) return plan.minUsd;
    return Math.min(Math.max(parsedAmount, plan.minUsd), plan.maxUsd);
  }, [parsedAmount, plan.minUsd, plan.maxUsd]);

  const dailyEarnings = clampedAmount * (plan.dailyRoiPct / 100);
  const monthlyEstimate = dailyEarnings * 30;
  const weeklyEstimate = dailyEarnings * 7;
  const totalPotential = clampedAmount + dailyEarnings * plan.durationDays;

  const ctaClass =
    "inline-flex items-center justify-center rounded-full bg-[#4AB3F4] px-7 py-3.5 text-sm sm:text-base font-bold text-white shadow-sm hover:bg-[#3aa6e6] transition";

  return (
    <div className="min-h-screen bg-white">
      <div className="h-20" />

      {/* Hero */}
      <section className="py-10 sm:py-14 text-center">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0b2f6b]">
            {plan.name} Plan
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-700">{plan.subtitleLine}</p>
          <p className="mt-2 text-sm text-gray-600">{plan.supportingLine}</p>

          <div className="mt-6 flex flex-col items-center gap-2">
            <Link href={`/accounts/signup?plan=${plan.slug}`} className={ctaClass}>
              {plan.ctaLabel}
            </Link>
            <p className="text-xs text-gray-500">{plan.ctaMicrotext}</p>
            <Link
              href="#roi-calculator"
              className="text-sm font-semibold text-[#0b2f6b] underline underline-offset-4 hover:no-underline"
            >
              {plan.secondaryLinkLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b] text-center">
            {plan.highlightsTitle}
          </h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Daily ROI", value: `${plan.dailyRoiPct}% credited daily`, icon: TrendingUp },
              { label: "Duration", value: `${plan.durationDays} days growth horizon`, icon: CalendarDays },
              { label: "Investment Range", value: `${formatUsd(plan.minUsd)}–${formatUsd(plan.maxUsd)}`, icon: DollarSign },
              { label: "Withdrawals", value: "Flexible access based on platform policy", icon: Wallet },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl bg-white border border-gray-200 p-4 text-center">
                  <Icon className="h-5 w-5 text-[#0b2f6b] mx-auto" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-[#0b2f6b]">{item.label}</p>
                  <p className="mt-1 text-xs text-gray-600">{item.value}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">{plan.highlightsNote}</p>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi-calculator" className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">{plan.calculatorTitle}</h2>
            <p className="mt-2 text-sm text-gray-600">{plan.calculatorHelper}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investment Amount (USD)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  min={plan.minUsd}
                  max={plan.maxUsd}
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Enter investment amount"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-[#4AB3F4] focus:ring focus:ring-[#4AB3F4]/30"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Min {formatUsd(plan.minUsd)} • Max {formatUsd(plan.maxUsd)}
                </p>
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  Plan: <span className="font-semibold">{plan.name}</span> ({plan.dailyRoiPct}% daily)
                </div>
              </div>

              <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Estimated Daily</span>
                  <span className="font-semibold text-[#0b2f6b]">{formatUsd(dailyEarnings)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Estimated Weekly</span>
                  <span className="font-semibold text-[#0b2f6b]">{formatUsd(weeklyEstimate)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Estimated Monthly</span>
                  <span className="font-semibold text-[#0b2f6b]">{formatUsd(monthlyEstimate)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                  <span>Total Potential</span>
                  <span className="font-semibold text-[#0b2f6b]">{formatUsd(totalPotential)}</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Estimates shown are projections based on the plan’s daily ROI rate.
            </p>

            <div className="mt-6">
              <Link href={`/accounts/signup?plan=${plan.slug}`} className={ctaClass}>
                {plan.calculatorCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">{plan.positioningTitle}</h2>
          <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">{plan.positioningBody}</p>
          <ul className="mt-4 space-y-2 text-sm sm:text-base text-gray-700">
            {plan.positioningBullets.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#0b2f6b]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Activation Steps */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">{plan.activationTitle}</h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plan.activationSteps.map((step, idx) => (
              <div key={step} className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                <div className="h-7 w-7 rounded-full bg-[#0b2f6b] text-white flex items-center justify-center font-semibold text-sm mb-3">
                  {idx + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href={`/accounts/signup?plan=${plan.slug}`} className={ctaClass}>
              {plan.activationCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="bg-[#F2F9FF] py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">{plan.trustTitle}</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-700">{plan.trustBody}</p>
            <ul className="mt-4 space-y-3 text-sm sm:text-base text-gray-700">
              {plan.trustBullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#0b2f6b]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/security" className="text-sm font-semibold text-[#0b2f6b] underline underline-offset-4 hover:no-underline">
                {plan.trustLinkLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b2f6b]">{plan.faqTitle}</h2>
          <div className="mt-4 space-y-4">
            {plan.faqs.map((item) => (
              <div key={item.q} className="rounded-2xl border border-gray-200 bg-white p-4">
                <p className="font-semibold text-[#0b2f6b]">{item.q}</p>
                <p className="mt-2 text-sm text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-[#F2F9FF]">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b2f6b]">{plan.finalCtaHeadline}</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700">{plan.finalCtaSubhead}</p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <Link href={`/accounts/signup?plan=${plan.slug}`} className={ctaClass}>
              {plan.finalCtaLabel}
            </Link>
            <p className="text-xs text-gray-500">{plan.finalCtaMicrotext}</p>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-[60] bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-[#0b2f6b]">{plan.stickyBarText}</div>
          <Link href={`/accounts/signup?plan=${plan.slug}`} className={`${ctaClass} px-4 py-2 text-xs`}>
            {plan.stickyCtaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
