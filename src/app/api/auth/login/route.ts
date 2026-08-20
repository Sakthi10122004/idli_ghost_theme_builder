import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../../../../lib/logger";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: NextRequest) {
  logger.info("API POST /api/auth/login request received");
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      logger.warn("API POST /api/auth/login failed: Missing email or password");
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    logger.info({ email }, "Fetching user database record");
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      logger.warn({ email }, "User lookup failed: Invalid credentials");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    logger.info({ email }, "Comparing password hashes");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      logger.warn({ email }, "Password comparison failed: Invalid credentials");
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    logger.info({ userId: user.id }, "Generating session JWT");
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ success: true, userId: user.id });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    logger.info({ userId: user.id }, "Login successful: cookie session token assigned");
    return response;
  } catch (error: any) {
    logger.error({ err: error }, "API POST /api/auth/login transaction failed");
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
