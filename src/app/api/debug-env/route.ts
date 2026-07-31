import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? null,
    AUTH_URL: process.env.AUTH_URL ?? null,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? null,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST ?? null,
    VERCEL: process.env.VERCEL ?? null,
    VERCEL_URL: process.env.VERCEL_URL ?? null,
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
  });
}
