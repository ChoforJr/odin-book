import type { ApiError } from "../types/api";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`/api/backend${path}`, {
    ...init,
    credentials: "same-origin",
    cache: "no-store",
    headers,
  });

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get("content-type") ?? "";
  const body: unknown = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorBody: ApiError =
      typeof body === "object" && body !== null ? (body as ApiError) : {};
    const validationMessage =
      "errors" in errorBody && Array.isArray(errorBody.errors)
        ? errorBody.errors
            .map((item: { msg?: unknown }) =>
              typeof item.msg === "string" ? item.msg : null,
            )
            .filter((message): message is string => message !== null)
            .join(". ")
        : undefined;
    const message =
      validationMessage ||
      ("error" in errorBody && typeof errorBody.error === "string"
        ? errorBody.error
        : "The request could not be completed.");
    throw new ApiRequestError(message, response.status);
  }

  return body as T;
}

export function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}
