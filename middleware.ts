export { default } from "next-auth/middleware";
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: ["/","/teachers", "/students", "/subjects", "/admins", "/payments"],
};


