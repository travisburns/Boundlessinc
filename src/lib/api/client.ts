/**
 * Thin typed fetch wrapper for the Boundless Enterprises .NET API.
 * Keeps request/response handling and error normalization in one place so
 * feature-level `*.api.ts` modules stay declarative.
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5080";

export interface ApiErrorShape {
  status: number;
  title: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(shape: ApiErrorShape) {
    super(shape.title);
    this.name = "ApiError";
    this.status = shape.status;
    this.errors = shape.errors;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable body; set automatically with the correct content type. */
  json?: unknown;
  /** Bearer token to attach to the Authorization header. */
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { json, token, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  if (json !== undefined) finalHeaders.set("Content-Type", "application/json");
  if (token) finalHeaders.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : undefined,
  });

  if (!response.ok) {
    let shape: ApiErrorShape = { status: response.status, title: response.statusText };
    try {
      const problem = await response.json();
      shape = {
        status: response.status,
        title: problem.title ?? response.statusText,
        errors: problem.errors,
      };
    } catch {
      /* non-JSON error body; keep the status text */
    }
    throw new ApiError(shape);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT" }),
  patch: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH" }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
