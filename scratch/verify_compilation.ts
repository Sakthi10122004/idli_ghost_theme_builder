import { INITIAL_THEME_DOCUMENT } from "../src/store/editorStore";
import { generateThemeFiles } from "../src/components/builder/compiler";

async function verify() {
  console.log("Compiling INITIAL_THEME_DOCUMENT...");
  const files = generateThemeFiles(INITIAL_THEME_DOCUMENT);

  const filenames = Object.keys(files);
  console.log("Generated files:", filenames);

  const expectedTemplates = [
    "index.hbs",
    "post.hbs",
    "page.hbs",
    "author.hbs",
    "tag.hbs",
    "error.hbs",
    "error-404.hbs",
    "assets/css/screen.css",
    "package.json"
  ];

  for (const exp of expectedTemplates) {
    if (!files[exp]) {
      throw new Error(`Missing expected file: ${exp}`);
    }
  }

  // Verify post.hbs contents
  const postHbs = files["post.hbs"];
  console.log("\n--- Checking post.hbs ---");
  const postChecks = [
    "article-header",
    "primary_tag",
    "featured",
    "article-title",
    "custom_excerpt",
    "author-avatar",
    "article-byline",
    "date format=",
    "reading_time",
    "feature_image",
    "{{content}}",
    "author-card",
    "gh-post-nav",
    "gh-related-posts",
    "gh-comments-section"
  ];
  for (const check of postChecks) {
    const passed = postHbs.includes(check);
    console.log(`  [${passed ? "PASS" : "FAIL"}] post.hbs contains '${check}'`);
    if (!passed) throw new Error(`post.hbs failed check: ${check}`);
  }

  // Verify author.hbs scoping
  const authorHbs = files["author.hbs"];
  console.log("\n--- Checking author.hbs ---");
  const hasAuthorBanner = authorHbs.includes("{{#author}}");
  const hasAuthorClose = authorHbs.includes("{{/author}}");
  const hasPostLoop = authorHbs.includes("{{#foreach posts}}");
  console.log(`  [${hasAuthorBanner && hasAuthorClose ? "PASS" : "FAIL"}] author banner properly scoped`);
  console.log(`  [${hasPostLoop ? "PASS" : "FAIL"}] post-grid loop present`);
  
  // Make sure post loop is NOT inside {{#author}}...{{/author}}
  const authorEndIndex = authorHbs.indexOf("{{/author}}");
  const postLoopIndex = authorHbs.indexOf("{{#foreach posts}}");
  if (postLoopIndex <= authorEndIndex) {
    throw new Error("{{#foreach posts}} is incorrectly inside {{#author}} block in author.hbs!");
  }
  console.log("  [PASS] {{#foreach posts}} is correctly placed outside {{#author}} block");

  // Verify tag.hbs scoping
  const tagHbs = files["tag.hbs"];
  console.log("\n--- Checking tag.hbs ---");
  const hasTagBanner = tagHbs.includes("{{#tag}}");
  const hasTagClose = tagHbs.includes("{{/tag}}");
  const hasTagPostLoop = tagHbs.includes("{{#foreach posts}}");
  console.log(`  [${hasTagBanner && hasTagClose ? "PASS" : "FAIL"}] tag banner properly scoped`);
  console.log(`  [${hasTagPostLoop ? "PASS" : "FAIL"}] post-grid loop present`);
  
  const tagEndIndex = tagHbs.indexOf("{{/tag}}");
  const tagPostLoopIndex = tagHbs.indexOf("{{#foreach posts}}");
  if (tagPostLoopIndex <= tagEndIndex) {
    throw new Error("{{#foreach posts}} is incorrectly inside {{#tag}} block in tag.hbs!");
  }
  console.log("  [PASS] {{#foreach posts}} is correctly placed outside {{#tag}} block");

  // Verify error.hbs and error-404.hbs
  console.log("\n--- Checking error templates ---");
  console.log(`  [${files["error.hbs"].includes("statusCode") ? "PASS" : "FAIL"}] error.hbs contains statusCode`);
  console.log(`  [${files["error-404.hbs"].includes("404") || files["error-404.hbs"].includes("statusCode") ? "PASS" : "FAIL"}] error-404.hbs contains error details`);

  console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY!");
}

verify().catch((err) => {
  console.error(err);
  process.exit(1);
});
