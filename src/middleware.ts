import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getMiddlewareClient } from "@/lib/supabase/server";

const WINDOW_MS = 60_000;
const LIMIT = 60;
const buckets = new Map<string, { count: number; expiresAt: number }>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and page navigations
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/html")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = getMiddlewareClient({ req: request, res: response });
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const ip = request.ip ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "0.0.0.0";
  const key = session?.user?.id ? `uid:${session.user.id}` : `ip:${ip}`;

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.expiresAt < now) {
    buckets.set(key, { count: 1, expiresAt: now + WINDOW_MS });
  } else if (bucket.count >= LIMIT) {
    const retryAfter = Math.max(bucket.expiresAt - now, 0);
    return NextResponse.json({ error: "Rate limit exceeded", retryAfterMs: retryAfter }, { status: 429 });
  } else {
    bucket.count += 1;
    buckets.set(key, bucket);
  }

  return response;
}

export const config = {
  matcher: "/api/:path*"
};
