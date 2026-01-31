"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";
import TawkToChat from "@/components/TawkToChat";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavBar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-semibold text-[#0b2f6b]">WolvCapital</p>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} WolvCapital. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      <TawkToChat />
    </div>
  );
}
