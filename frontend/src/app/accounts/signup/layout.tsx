import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — WolvCapital | Create Free Investment Account",
  description:
    "Create your free WolvCapital account today. Join 45,000+ global investors earning 1%–2% daily ROI with secure digital asset investment. AML/KYC compliant platform with professional monitoring.",
  keywords: "sign up, create account, investment account, cryptocurrency investment, digital asset platform, WolvCapital registration, investor account, secure signup",
  openGraph: {
    title: "Sign Up — WolvCapital | Start Earning Today",
    description: "Create free account → Choose plan → Earn 1%–2% daily ROI. Join 45,000+ investors with AML/KYC compliant platform and 256-bit encryption.",
    images: ["/og-images/home-og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up — WolvCapital",
    description: "Create your free investment account. Start earning 1%–2% daily ROI today.",
    images: ["/og-images/home-og.png"],
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
