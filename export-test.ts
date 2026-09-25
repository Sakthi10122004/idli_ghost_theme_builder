// export-test.ts — run with: npx tsx --tsconfig ./tsconfig.json export-test.ts
import { generateThemeFiles } from "./src/components/builder/compiler";
import { INITIAL_THEME_DOCUMENT } from "./src/store/editorStore";
import { ThemeDocument } from "./src/types/theme";
import fs from "fs";
import path from "path";

const files = generateThemeFiles(INITIAL_THEME_DOCUMENT as unknown as ThemeDocument);
const outDir = path.join(__dirname, "exported-theme-output");
fs.mkdirSync(outDir, { recursive: true });
for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(outDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content as string, "utf-8");
}
console.log("Exported:", Object.keys(files).length, "files");
