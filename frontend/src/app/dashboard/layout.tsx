import type { ReactNode } from "react";
import DashboardShell from "./_components/DashboardShell";
import dynamic from "next/dynamic";

const WalletProvider = dynamic(
  () => import("@/_client/WalletProvider").then(m => m.WalletProvider),
  { ssr: false }
);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell>
      <WalletProvider>
        {children}
      </WalletProvider>
    </DashboardShell>
  );
}
