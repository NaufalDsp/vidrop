import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { handleResolveRequest } from "./resolve-handler.ts";

const MAX_BODY_BYTES = 8 * 1024;

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.length;
    if (total > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
}

async function writeWebResponse(webResponse: Response, response: ServerResponse) {
  response.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => response.setHeader(key, value));
  response.end(Buffer.from(await webResponse.arrayBuffer()));
}

export function localResolveApi(): Plugin {
  return {
    name: "vidrop-local-resolve-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
        if (pathname !== "/api/resolve") {
          next();
          return;
        }

        try {
          const method = request.method ?? "GET";
          const body = method === "GET" || method === "HEAD" ? undefined : await readBody(request);
          const webRequest = new Request("http://localhost/api/resolve", {
            method,
            headers: { "Content-Type": request.headers["content-type"] ?? "" },
            body,
          });
          await writeWebResponse(await handleResolveRequest(webRequest), response);
        } catch (error) {
          const isTooLarge = error instanceof Error && error.message === "PAYLOAD_TOO_LARGE";
          response.statusCode = isTooLarge ? 413 : 500;
          response.setHeader("Content-Type", "application/json; charset=utf-8");
          response.end(JSON.stringify({
            success: false,
            error: {
              code: isTooLarge ? "PAYLOAD_TOO_LARGE" : "SERVER_ERROR",
              message: isTooLarge ? "Request body is too large." : "Local API failed unexpectedly.",
            },
          }));
        }
      });
    },
  };
}
