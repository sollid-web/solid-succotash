import type { ReactNode } from "react";
import DashboardShell from "./_components/DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      banner={
        <div className="rounded-lg border border-amber-200 bg-amber-100 px-4 py-3 text-amber-900">
          <p className="text-sm font-medium">
            Security Alert: Please complete your account validation inside your dashboard. We
            will never ask for your password or OTP by email.
          </p>
        </div>
      }
    >
      {children}
    </DashboardShell>
  );
}
