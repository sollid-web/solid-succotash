import type { ReactNode } from "react";
import DashboardShell from "./_components/DashboardShell";
import { WalletProvider } from "@/_client/WalletProvider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <DashboardShell>{children}</DashboardShell>
    </WalletProvider>
  );
}
