import type { ReactNode } from "react";
import DashboardShell from "./_components/DashboardShell";
import { WalletProviderClient } from "@/_client/WalletProviderClient";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
          
    <WalletProviderClient>
    <DashboardShell>
        {children}
      </DashboardShell>
    </WalletProviderClient>
    );
  }
