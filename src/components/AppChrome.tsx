"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis } from "lenis/dist/lenis-react";
import NavBar from "@/components/NavBar";
import DisclosureTicker from "@/components/DisclosureTicker";
import Footer from "@/components/sections/Footer";
import AuroraBackground from "@/components/web3/AuroraBackground";
import ScrollReveal from "@/components/web3/ScrollReveal";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (hideChrome) {
    return <ReactLenis root>{children}</ReactLenis>;
  }

  return (
    <ReactLenis root>
      <AuroraBackground />
      <ScrollReveal />
      <div className="relative z-[1] flex min-h-screen flex-col bg-transparent">
        <DisclosureTicker />
        <NavBar />
        <main className="flex-1 w-full pt-16">{children}</main>
        <Footer />
        {/* Support Chat */}
      </div>
    </ReactLenis>
  );
}
