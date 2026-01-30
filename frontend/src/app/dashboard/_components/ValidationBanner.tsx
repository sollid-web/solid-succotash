"use client";

import Link from "next/link";

type ValidationBannerProps = {
  required: boolean;
  completed: boolean;
};

export default function ValidationBanner({ required, completed }: ValidationBannerProps) {
  if (!required || completed) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 shadow-sm sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Account Validation Pending</h2>
          <p className="mt-1 text-sm text-amber-900">
            Please complete your account validation to keep your dashboard fully active. Never share your
            password or one-time passcode (OTP) with anyone.
          </p>
        </div>
        <Link
          href="/dashboard/validation"
          className="inline-flex items-center justify-center rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
        >
          Complete validation
        </Link>
      </div>
    </div>
  );
}
