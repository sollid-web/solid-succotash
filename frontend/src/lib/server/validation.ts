import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/api";

type ValidationStatus = {
  validation_required: boolean;
  validation_completed: boolean;
};

const failOpen: ValidationStatus = {
  validation_required: false,
  validation_completed: true,
};

async function buildCookieHeader(): Promise<string> {
  const store = await cookies();
  const all = store.getAll();
  if (!all.length) {
    return "";
  }
  return all.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

export async function getValidationStatus(): Promise<ValidationStatus> {
  const cookieHeader = await buildCookieHeader();

  try {
    const response = await fetch(buildApiUrl("/api/me/validation-status"), {
      method: "GET",
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (response.status === 401 || !response.ok) {
      return failOpen;
    }

    const data = (await response.json()) as ValidationStatus;
    return {
      validation_required: Boolean(data?.validation_required),
      validation_completed: Boolean(data?.validation_completed),
    };
  } catch {
    return failOpen;
  }
}

export { getValidationStatus as fetchValidationStatus };
