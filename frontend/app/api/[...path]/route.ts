import { NextRequest, NextResponse } from "next/server";

const BACKEND = "http://host.docker.internal:8000";

async function proxy(request: NextRequest, path: string[]) {
  const url = new URL(request.url);
  const backendUrl = new URL(`${BACKEND}/api/${path.join("/")}/`);
  backendUrl.search = url.search;

  console.log(`[proxy] ${request.method} ${backendUrl.toString()}`);

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const init: RequestInit = { method: request.method, headers };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  try {
    const res = await fetch(backendUrl.toString(), init);
    const body = await res.text();
    console.log(`[proxy] response status: ${res.status}`);
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(`[proxy] fetch failed:`, e);
    return new NextResponse(JSON.stringify({ error: "proxy failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxy(request, path);
}
