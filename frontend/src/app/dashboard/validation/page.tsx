import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function buildCookieHeader(): string {
  const store = cookies();
  const all = store.getAll();
  if (!all.length) {
    return "";
  }
  return all.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

async function completeValidation() {
  "use server";

  const baseUrl = process.env.DJANGO_BASE_URL;
  if (!baseUrl) {
    return;
  }

  const cookieHeader = buildCookieHeader();

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/me/complete-validation`, {
      method: "POST",
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      credentials: "include",
      cache: "no-store",
    });

    if (response.ok) {
      redirect("/dashboard");
    }
  } catch {
    return;
  }
}

export default function ValidationPage() {
  return (
    <div className="max-w-3xl">
      <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Account validation</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">Complete your account validation</h1>
        <p className="mt-3 text-sm text-gray-600 sm:text-base">
          Confirming your details keeps your dashboard fully active and protects your account. We will never ask for
          your password or one-time passcode (OTP).
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form action={completeValidation}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900 sm:w-auto"
            >
              Complete Validation
            </button>
          </form>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900 sm:w-auto"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
