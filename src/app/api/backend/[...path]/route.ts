import type { NextRequest } from "next/server";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function proxyToApi(request: NextRequest, context: RouteContext): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    const requestOrigin = new URL(request.url).origin;
    const originHeader = request.headers.get("origin");
    let origin: string | null = null;
    try {
      origin = originHeader ? new URL(originHeader).origin : null;
    } catch {
      origin = null;
    }
    if (origin !== requestOrigin) {
      return Response.json({ error: "Cross-origin requests are not allowed." }, { status: 403 });
    }
  }

  const apiBase = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!apiBase) {
    return Response.json({ error: "The API server URL is not configured." }, { status: 500 });
  }

  const { path } = await context.params;
  const encodedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  const requestUrl = new URL(request.url);
  const target = new URL(`${encodedPath}${requestUrl.search}`, apiBase.endsWith("/") ? apiBase : `${apiBase}/`);
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const session = request.cookies.get("odin_book_session")?.value;
  if (contentType) headers.set("content-type", contentType);
  if (session) headers.set("cookie", `odin_book_session=${session}`);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;
  try {
    const upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
    const responseHeaders = new Headers();
    const responseType = upstream.headers.get("content-type");
    const sessionCookie = upstream.headers.get("set-cookie");
    if (responseType) responseHeaders.set("content-type", responseType);
    if (sessionCookie) responseHeaders.set("set-cookie", sessionCookie);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json({ error: "The API server could not be reached." }, { status: 502 });
  }
}

export const GET = proxyToApi;
export const POST = proxyToApi;
export const PATCH = proxyToApi;
export const DELETE = proxyToApi;
