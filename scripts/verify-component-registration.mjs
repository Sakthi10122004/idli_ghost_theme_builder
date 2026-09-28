import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const componentsDir = path.join(rootDir, "src/editor/components");
const registryFile = path.join(componentsDir, "registry.ts");
const templatesFile = path.join(componentsDir, "blockTemplates.ts");

const REQUIRED_FILES = ["schema.ts", "canvas.tsx", "sidebar.tsx", "compiler.ts"];
const EXCLUDED_DIRS = new Set(["shared"]);
// System/page-shell components that are rendered as global wrappers or page templates rather than draggable blocks
const SYSTEM_COMPONENTS = new Set(["header", "footer", "error-view"]);

console.log("🔍 Verifying component structure and registration...\n");

if (!fs.existsSync(registryFile)) {
  console.error("❌ registry.ts not found at", registryFile);
  process.exit(1);
}

if (!fs.existsSync(templatesFile)) {
  console.error("❌ blockTemplates.ts not found at", templatesFile);
  process.exit(1);
}

const registryContent = fs.readFileSync(registryFile, "utf-8");
const templatesContent = fs.readFileSync(templatesFile, "utf-8");

const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
const componentDirs = entries
  .filter((e) => e.isDirectory() && !EXCLUDED_DIRS.has(e.name))
  .map((e) => e.name)
  .sort();

let hasErrors = false;
let successCount = 0;

for (const comp of componentDirs) {
  const compPath = path.join(componentsDir, comp);
  const missingFiles = [];

  for (const reqFile of REQUIRED_FILES) {
    if (!fs.existsSync(path.join(compPath, reqFile))) {
      missingFiles.push(reqFile);
    }
  }

  if (missingFiles.length > 0) {
    console.error(`❌ [${comp}]: Missing modular files: ${missingFiles.join(", ")}`);
    hasErrors = true;
    continue;
  }

  // Check registration in registry.ts
  // Must have an import from "./<comp>/..." or key in componentRegistry
  const importRegex = new RegExp(`from\\s+["']\\.\\/${comp}\\/schema["']`);
  const keyRegex = new RegExp(`['"]?${comp}['"]?\\s*:\\s*\\{`);

  const hasImport = importRegex.test(registryContent);
  const hasRegistryKey = keyRegex.test(registryContent);

  if (!hasImport || !hasRegistryKey) {
    console.error(`❌ [${comp}]: Not registered in src/editor/components/registry.ts (imported: ${hasImport}, in registry: ${hasRegistryKey})`);
    hasErrors = true;
    continue;
  }

  // Check palette listing in blockTemplates.ts (unless system component)
  if (!SYSTEM_COMPONENTS.has(comp)) {
    const templateRegex = new RegExp(`type:\\s*["']${comp}["']`);
    if (!templateRegex.test(templatesContent)) {
      console.error(`❌ [${comp}]: User-facing block missing from BLOCK_TEMPLATES in blockTemplates.ts`);
      hasErrors = true;
      continue;
    }
  }

  console.log(`✅ [${comp}]: Complete (all 4 files present, registered in registry.ts and blockTemplates.ts)`);
  successCount++;
}

console.log("\n" + "=".repeat(60));
if (hasErrors) {
  console.error(`❌ Component verification FAILED! ${successCount}/${componentDirs.length} components passed.`);
  process.exit(1);
} else {
  console.log(`🎉 All ${successCount}/${componentDirs.length} components verified successfully!`);
  process.exit(0);
}
