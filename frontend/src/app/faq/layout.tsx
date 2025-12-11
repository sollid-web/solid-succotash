import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ — WolvCapital | Common Questions About Digital Asset Investment",
  description: "Find answers to frequently asked questions about WolvCapital's investment plans, security features, withdrawals, verification process, and platform operations.",
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
