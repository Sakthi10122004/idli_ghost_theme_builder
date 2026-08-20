import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../../../../lib/logger";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export async function POST(req: NextRequest) {
  logger.info("API POST /api/auth/register request received");
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      logger.warn("API POST /api/auth/register failed: Missing email or password");
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    logger.info({ email }, "Checking user existence in database");
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.warn({ email }, "User already exists");
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    logger.info({ email }, "Hashing user credentials");
    const hashedPassword = await bcrypt.hash(password, 10);

    logger.info({ email }, "Creating user database record");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

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

    logger.info({ userId: user.id }, "Successfully registered user and set session token cookie");
    return response;
  } catch (error: any) {
    logger.error({ err: error }, "API POST /api/auth/register transaction failed");
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
