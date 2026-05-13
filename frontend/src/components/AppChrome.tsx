"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import DisclosureTicker from "@/components/DisclosureTicker";
import MobileBottomBar from "@/components/MobileBottomBar";
import Footer from "@/components/sections/Footer";
import TidioWidget from "@/components/TidioWidget";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <DisclosureTicker />
      <NavBar />
      <main className="flex-1 w-full pt-16">{children}</main>
      <MobileBottomBar />
      <Footer />
      {/* Support Chat */}
      <TidioWidget />
    </div>
  );
}
