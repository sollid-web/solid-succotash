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
    "inline-flex items-center justify-center rounded-full bg-[#4AB3F4] px-7 py-3.5 text-sm sm:text-base font-bold text-[#0F172A] shadow-sm hover:bg-[#3aa6e6] transition";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060c1a" }}>
      <div style={{ height: "80px" }} />

      {/* Hero */}
      <section style={{ padding: "48px 20px 40px", textAlign: "center", background: "linear-gradient(160deg,#060c1a 0%,#0d1f4e 45%,#0a3d35 100%)", borderBottom: "1px solid rgba(0,168,150,0.25)" }}>
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h1 style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 800, color: "#ffffff", marginBottom: "12px" }}>
            {plan.name} Plan
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)" }}>{plan.subtitleLine}</p>
          <p style={{ color: "rgba(255,255,255,0.65)" }}>{plan.supportingLine}</p>

          <div className="mt-6 flex flex-col items-center gap-2">
            <Link href={`/accounts/signup?plan=${plan.slug}`} className={ctaClass}>
              {plan.ctaLabel}
            </Link>
            <p style={{ color: "rgba(255,255,255,0.45)" }}>{plan.ctaMicrotext}</p>
            <Link
              href="#roi-calculator"
              style={{ color: "#00c9b1" }}
            >
              {plan.secondaryLinkLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <h2 style={{ color: "#00c9b1" }}>
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
                <div key={item.label} style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon style={{ color: "#00c9b1" }} aria-hidden="true" />
                  <p style={{ color: "#00c9b1" }}>{item.label}</p>
                  <p style={{ color: "rgba(255,255,255,0.65)" }}>{item.value}</p>
                </div>
              );
            })}
          </div>
          <p style={{ color: "rgba(255,255,255,0.45)" }}>{plan.highlightsNote}</p>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi-calculator" className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 style={{ color: "#00c9b1" }}>{plan.calculatorTitle}</h2>
            <p style={{ color: "rgba(255,255,255,0.65)" }}>{plan.calculatorHelper}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label style={{ color: "rgba(255,255,255,0.75)" }}>
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
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <p style={{ color: "rgba(255,255,255,0.45)" }}>
                  Min {formatUsd(plan.minUsd)} • Max {formatUsd(plan.maxUsd)}
                </p>
                <div style={{ color: "rgba(255,255,255,0.75)" }}>
                  Plan: <span className="font-semibold">{plan.name}</span> ({plan.dailyRoiPct}% daily)
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)" }}>
                <div style={{ color: "rgba(255,255,255,0.65)" }}>
                  <span>Estimated Daily</span>
                  <span style={{ color: "#00c9b1" }}>{formatUsd(dailyEarnings)}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.65)" }}>
                  <span>Estimated Weekly</span>
                  <span style={{ color: "#00c9b1" }}>{formatUsd(weeklyEstimate)}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.65)" }}>
                  <span>Estimated Monthly</span>
                  <span style={{ color: "#00c9b1" }}>{formatUsd(monthlyEstimate)}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.65)" }}>
                  <span>Total Potential</span>
                  <span style={{ color: "#00c9b1" }}>{formatUsd(totalPotential)}</span>
                </div>
              </div>
            </div>

            <p style={{ color: "rgba(255,255,255,0.45)" }}>
              Estimates shown are projections based on the plan’s APY rate.
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
          <h2 style={{ color: "#00c9b1" }}>{plan.positioningTitle}</h2>
          <p style={{ color: "rgba(255,255,255,0.75)" }}>{plan.positioningBody}</p>
          <ul style={{ color: "rgba(255,255,255,0.75)" }}>
            {plan.positioningBullets.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 style={{ color: "#00c9b1" }} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Activation Steps */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 style={{ color: "#00c9b1" }}>{plan.activationTitle}</h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plan.activationSteps.map((step, idx) => (
              <div key={step} style={{ color: "rgba(255,255,255,0.75)" }}>
                <div style={{ color: "#ffffff" }}>
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
          <div style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <h2 style={{ color: "#00c9b1" }}>{plan.trustTitle}</h2>
            <p style={{ color: "rgba(255,255,255,0.75)" }}>{plan.trustBody}</p>
            <ul style={{ color: "rgba(255,255,255,0.75)" }}>
              {plan.trustBullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <ShieldCheck style={{ color: "#00c9b1" }} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link href="/security" style={{ color: "#00c9b1" }}>
                {plan.trustLinkLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 style={{ color: "#00c9b1" }}>{plan.faqTitle}</h2>
          <div className="mt-4 space-y-4">
            {plan.faqs.map((item) => (
              <div key={item.q} style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "#00c9b1" }}>{item.q}</p>
                <p style={{ color: "rgba(255,255,255,0.75)" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-[#F2F9FF]">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl text-center">
          <h2 style={{ color: "#00c9b1" }}>{plan.finalCtaHeadline}</h2>
          <p style={{ color: "rgba(255,255,255,0.75)" }}>{plan.finalCtaSubhead}</p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <Link href={`/accounts/signup?plan=${plan.slug}`} className={ctaClass}>
              {plan.finalCtaLabel}
            </Link>
            <p style={{ color: "rgba(255,255,255,0.45)" }}>{plan.finalCtaMicrotext}</p>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div style={{ color: "#00c9b1" }}>{plan.stickyBarText}</div>
          <Link href={`/accounts/signup?plan=${plan.slug}`} className={`${ctaClass} px-4 py-2 text-xs`}>
            {plan.stickyCtaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
