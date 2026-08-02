import { Capacitor } from "@capacitor/core";
import { APP_URL } from "@/lib/app-info";

/** Resolve an app API path for the current runtime (web vs bundled Capacitor). */
export function resolveApiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (Capacitor.isNativePlatform()) return `${APP_URL}${normalized}`;
  return normalized;
}

/** Origins allowed to call /api/* from the Capacitor WebView shell. */
export const CAPACITOR_API_ORIGINS = new Set([
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
  "ionic://localhost",
]);

export function applyCapacitorCors(request: Request, response: Response): Response {
  const origin = request.headers.get("Origin");
  if (!origin || !CAPACITOR_API_ORIGINS.has(origin)) return response;

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function corsPreflightResponse(request: Request): Response {
  const origin = request.headers.get("Origin");
  if (!origin || !CAPACITOR_API_ORIGINS.has(origin)) {
    return new Response(null, { status: 204 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    },
  });
}
