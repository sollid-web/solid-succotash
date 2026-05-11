"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
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
      <Header />
      <DisclosureTicker />
      <main className="flex-1 w-full pt-16">{children}</main>
      <MobileBottomBar />
      <Footer />
      {/* Support Chat */}
      <TidioWidget />
    </div>
  );
}
