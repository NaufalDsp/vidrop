import { parseMediaUrl, resolveMedia } from "./media-resolver.js";
import { ResolverError } from "./resolver-error.js";

const jsonHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};

function json(payload: unknown, status = 200) {
  return Response.json(payload, { status, headers: jsonHeaders });
}

export async function handleResolveRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json({ success: false, error: { code: "METHOD_NOT_ALLOWED", message: "Use POST /api/resolve." } }, 405);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ success: false, error: { code: "INVALID_REQUEST", message: "Content-Type must be application/json." } }, 415);
  }

  try {
    const body = (await request.json()) as { url?: unknown };
    const { url, platform } = parseMediaUrl(body.url);
    const data = await resolveMedia(url, platform);
    return json({ success: true, data });
  } catch (error) {
    if (error instanceof ResolverError) {
      return json({ success: false, error: { code: error.code, message: error.message } }, error.status);
    }

    console.error("Unexpected resolver error", error);
    return json({ success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred." } }, 500);
  }
}
