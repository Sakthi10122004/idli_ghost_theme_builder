import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

let gscan: any;
try {
  gscan = require('gscan');
} catch (e) {
  logger.warn("gscan is not installed or available.");
}

export async function POST(req: NextRequest) {
  logger.info("API POST /api/theme/validate request received");
  
  if (!gscan) {
    logger.warn("Validation skipped, gscan not found.");
    return NextResponse.json({ success: true, warning: "Validator not installed." });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("theme") as File;
    
    if (!file) {
      logger.warn("API POST /api/theme/validate failed: Missing theme file");
      return NextResponse.json({ error: "Missing theme file in payload" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    logger.info("Running gscan validation on zip buffer");
    
    // According to gscan docs, checkZip takes a zip and an options object
    const report = await gscan.checkZip(buffer, {
      keepExtractedDir: false,
      checkVersion: 'latest' // Target the latest Ghost version
    });

    logger.info({
      hasErrors: report.results?.error?.length > 0,
      hasFatals: report.results?.fatal?.length > 0
    }, "Gscan validation completed");

    // We can map out the essential parts of the report
    return NextResponse.json({
      success: true,
      report: {
        error: report.results?.error || {},
        fatal: report.results?.fatal || {},
        warning: report.results?.warning || {}
      }
    });

  } catch (error: any) {
    logger.error({ err: error }, "API POST /api/theme/validate transaction failed");
    return NextResponse.json({ error: error.message || "Failed to validate theme" }, { status: 500 });
  }
}
