import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const maintenance = process.env.MAINTENANCE_MODE === "true"

  if (maintenance && !request.nextUrl.pathname.startsWith("/maintenance")) {
    return NextResponse.rewrite(new URL("/maintenance", request.url))
  }

  return NextResponse.next()
}
