import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { logger } from "../../../../lib/logger";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function GET(req: NextRequest) {
  logger.info("API GET /api/auth/me request received");
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      logger.info("API GET /api/auth/me request: No cookie token present");
      return NextResponse.json({ authenticated: false });
    }

    logger.info("Verifying JWT cookie token");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    logger.info({ userId: decoded.userId }, "User successfully authenticated");
    return NextResponse.json({ authenticated: true, userId: decoded.userId, email: decoded.email });
  } catch (error) {
    logger.warn("Token validation failed or expired");
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST() {
  logger.info("API POST /api/auth/me logout request received");
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "", { maxAge: 0, path: "/" });
  logger.info("Successfully deleted cookie session token");
  return response;
}
