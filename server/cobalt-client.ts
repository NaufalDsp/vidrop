import { ResolverError } from "./resolver-error.js";

const REQUEST_TIMEOUT_MS = 45_000;

export type CobaltResponse = {
  status?: unknown;
  url?: unknown;
  filename?: unknown;
  audio?: unknown;
  picker?: Array<{ type?: unknown; url?: unknown; thumb?: unknown }>;
  error?: { code?: unknown };
};

export async function requestCobalt(
  sourceUrl: string,
  options: Record<string, unknown>,
  platformName: string,
): Promise<CobaltResponse> {
  const providerUrl = process.env.MEDIA_RESOLVER_URL ?? process.env.COBALT_API_URL;
  if (!providerUrl) throw new ResolverError("RESOLVER_PROVIDER_NOT_CONFIGURED", `${platformName} needs a configured media resolver service.`, 503);

  let endpoint: URL;
  try { endpoint = new URL(providerUrl); } catch { throw new ResolverError("RESOLVER_PROVIDER_NOT_CONFIGURED", "The media resolver URL is invalid.", 503); }
  if (endpoint.protocol !== "https:" && endpoint.hostname !== "localhost" && endpoint.hostname !== "127.0.0.1") {
    throw new ResolverError("RESOLVER_PROVIDER_NOT_CONFIGURED", "The media resolver must use HTTPS.", 503);
  }

  const headers: Record<string, string> = { Accept: "application/json", "Content-Type": "application/json" };
  const apiKey = process.env.MEDIA_RESOLVER_API_KEY ?? process.env.COBALT_API_KEY;
  if (apiKey) headers.Authorization = `Api-Key ${apiKey}`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ url: sourceUrl, filenameStyle: "basic", localProcessing: "disabled", ...options }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") throw new ResolverError("REQUEST_TIMEOUT", `${platformName} processing took too long.`, 504);
    throw new ResolverError("NETWORK_ERROR", "The media resolver service could not be reached.");
  }

  if (response.status === 429) throw new ResolverError("RATE_LIMITED", "The media resolver is temporarily rate limited.", 429);
  if (response.status === 401 || response.status === 403) throw new ResolverError("RESOLVER_AUTH_FAILED", "The media resolver rejected its credentials.", 502);
  if (!response.ok) throw new ResolverError("RESOLVER_ERROR", "The media resolver returned an unexpected response.");
  try { return await response.json() as CobaltResponse; } catch { throw new ResolverError("RESOLVER_ERROR", "The media resolver returned invalid data."); }
}
