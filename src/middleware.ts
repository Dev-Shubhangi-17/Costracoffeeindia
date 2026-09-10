import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Ephemeral in-memory store for Edge rate-limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = 100; // Max 100 requests per minute
  const windowMs = 60 * 1000;

  // Cleanup map to prevent memory leakage in long-running edge contexts
  if (rateLimitMap.size > 5000) {
    rateLimitMap.forEach((val, key) => {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    });
  }

  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return false;
  }

  record.count += 1;
  return record.count > limit;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.ip || request.headers.get("x-real-ip") || "127.0.0.1";

  // 1. Rate Limiting on API routes
  if (pathname.startsWith("/api")) {
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // 2. Transport Layer Security - Force HTTPS redirection in production
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const host = request.headers.get("host") || "";
  if (
    process.env.NODE_ENV === "production" &&
    forwardedProto &&
    forwardedProto !== "https"
  ) {
    return NextResponse.redirect(`https://${host}${pathname}`, 301);
  }

  // 3. Security Headers setup
  const response = NextResponse.next();
  const headers = response.headers;

  // Strict HSTS
  headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Content Security Policy (CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com https://*.firebaseapp.com https://*.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https://images.unsplash.com https://*.razorpay.com https://razorpay.com https://*.firebaseusercontent.com https://*.google.com https://*.googleusercontent.com;
    connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.razorpay.com https://*.razorpay.com https://lumberjack.razorpay.com https://lumberjack-cx.razorpay.com;
    font-src 'self' https://fonts.gstatic.com;
    frame-src 'self' https://checkout.razorpay.com https://*.razorpay.com https://api.razorpay.com;
    child-src 'self' https://checkout.razorpay.com https://*.razorpay.com https://api.razorpay.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
  `.replace(/\s{2,}/g, " ").trim();

  headers.set("Content-Security-Policy", cspHeader);
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  return response;
}

// Next.js Middleware Matcher Configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public assets folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
