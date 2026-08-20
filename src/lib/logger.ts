import path from "path";
import fs from "fs";

// Simple stub logger interface
interface SimpleLogger {
  info(arg1: any, arg2?: string): void;
  warn(arg1: any, arg2?: string): void;
  error(arg1: any, arg2?: string): void;
}

let serverLogger: SimpleLogger;

if (typeof window === "undefined") {
  // Server-only dynamic require to avoid webpack/turbopack client bundling failures
  const bunyan = require("bunyan");

  const logsDir = path.join(process.cwd(), "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const logFilePath = path.join(logsDir, "project.log");

  serverLogger = bunyan.createLogger({
    name: "ghost-theme-builder",
    streams: [
      {
        level: "info",
        stream: process.stdout,
      },
      {
        level: "info",
        path: logFilePath,
      },
    ],
  });
} else {
  // Client fallback stub logger
  serverLogger = {
    info: (arg1: any, arg2?: string) => {
      console.log(arg2 || arg1, arg2 ? arg1 : "");
    },
    warn: (arg1: any, arg2?: string) => {
      console.warn(arg2 || arg1, arg2 ? arg1 : "");
    },
    error: (arg1: any, arg2?: string) => {
      console.error(arg2 || arg1, arg2 ? arg1 : "");
    },
  };
}

export const logger = serverLogger;
