import { cookies } from "next/headers";

type ValidationStatus = {
  validation_required: boolean;
  validation_completed: boolean;
};

const failOpen: ValidationStatus = {
  validation_required: false,
  validation_completed: true,
};

function buildCookieHeader(): string {
  const store = cookies();
  const all = store.getAll();
  if (!all.length) {
    return "";
  }
  return all.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

export async function getValidationStatus(): Promise<ValidationStatus> {
  const baseUrl = process.env.DJANGO_BASE_URL;
  if (!baseUrl) {
    return failOpen;
  }

  const cookieHeader = buildCookieHeader();

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/me/validation-status`, {
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
