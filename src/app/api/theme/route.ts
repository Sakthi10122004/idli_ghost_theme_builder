import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { logger } from "../../../lib/logger";

export async function GET(req: NextRequest) {
  logger.info({ ip: req.headers.get("x-forwarded-for") || "unknown" }, "API GET /api/theme request received");
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      logger.warn("API GET /api/theme failed: Missing userId");
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
    }

    logger.info({ userId }, "Fetching theme record from PostgreSQL");
    const record = await prisma.theme.findUnique({
      where: { userId },
    });

    if (!record) {
      logger.info({ userId }, "No theme record found for user");
      return NextResponse.json({ document: null });
    }

    logger.info({ userId }, "Theme successfully loaded");
    return NextResponse.json({ document: record.document });
  } catch (error: any) {
    logger.error({ err: error }, "API GET /api/theme transaction failed");
    return NextResponse.json({ error: error.message || "Failed to load theme" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  logger.info("API POST /api/theme request received");
  try {
    const body = await req.json();
    const { userId, document } = body;

    if (!userId || !document) {
      logger.warn("API POST /api/theme failed: Missing userId or document");
      return NextResponse.json({ error: "Missing userId or document payload" }, { status: 400 });
    }

    logger.info({ userId }, "Serializing theme AST");
    const serializedDoc = JSON.parse(JSON.stringify(document));

    logger.info({ userId }, "Upserting theme record in PostgreSQL database");
    await prisma.theme.upsert({
      where: { userId },
      update: { document: serializedDoc },
      create: { userId, document: serializedDoc },
    });

    logger.info({ userId }, "Theme successfully updated");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error({ err: error }, "API POST /api/theme transaction failed");
    return NextResponse.json({ error: error.message || "Failed to save theme" }, { status: 500 });
  }
}
