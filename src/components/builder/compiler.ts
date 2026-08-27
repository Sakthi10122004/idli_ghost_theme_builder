import { ThemeDocument, BuilderBlock } from "../../types/theme";
import { componentRegistry } from "@/editor/components/registry";

/**
 * Resolves a responsive style property (using desktop value by default for server-side theme files)
 */
function resolveStyleValue(val: any): string | undefined {
  if (!val) return undefined;
  if (typeof val === "string") return val;
  return val.desktop || undefined;
}

/**
 * Formats custom AST styles into inline HTML style attribute strings.
 */
function getInlineStyles(block: BuilderBlock): string {
  const styles = block.styles || {};
  const stylePairs: string[] = [];

  // 1. Typography
  if (styles.fontSize) {
    const val = resolveStyleValue(styles.fontSize);
    if (val) stylePairs.push(`font-size: ${val}`);
  }
  if (styles.textColor) {
    const val = resolveStyleValue(styles.textColor);
    if (val) stylePairs.push(`color: ${val}`);
  }
  if (styles.fontWeight) {
    const val = resolveStyleValue(styles.fontWeight);
    if (val) stylePairs.push(`font-weight: ${val}`);
  }
  if (styles.letterSpacing) {
    const val = resolveStyleValue(styles.letterSpacing);
    if (val) stylePairs.push(`letter-spacing: ${val}`);
  }
  if (styles.textAlign) {
    const val = resolveStyleValue(styles.textAlign);
    if (val) stylePairs.push(`text-align: ${val}`);
  }

  // 2. Layout & Spacing
  if (styles.marginBottom) {
    const val = resolveStyleValue(styles.marginBottom);
    if (val) stylePairs.push(`margin-bottom: ${val}`);
  }
  if (styles.paddingTop) {
    const val = resolveStyleValue(styles.paddingTop);
    if (val) stylePairs.push(`padding-top: ${val}`);
  }
  if (styles.paddingBottom) {
    const val = resolveStyleValue(styles.paddingBottom);
    if (val) stylePairs.push(`padding-bottom: ${val}`);
  }
  if (styles.width) {
    const val = resolveStyleValue(styles.width);
    if (val) {
      stylePairs.push(`width: ${val}`);
      stylePairs.push(`margin-left: auto`);
      stylePairs.push(`margin-right: auto`);
    }
  }

  // 3. Backgrounds & Borders & Shadows
  if (styles.backgroundColor) {
    const val = resolveStyleValue(styles.backgroundColor);
    if (val) stylePairs.push(`background-color: ${val}`);
  }
  if (styles.backgroundImage) {
    const val = resolveStyleValue(styles.backgroundImage);
    if (val) {
      stylePairs.push(`background-image: url('${val}')`);

      const size = resolveStyleValue(styles.backgroundSize) || "cover";
      stylePairs.push(`background-size: ${size}`);

      const repeat = resolveStyleValue(styles.backgroundRepeat) || "no-repeat";
      stylePairs.push(`background-repeat: ${repeat}`);

      const pos = resolveStyleValue(styles.backgroundPosition) || "center";
      stylePairs.push(`background-position: ${pos}`);

      const p = resolveStyleValue(styles.enableParallax) as any;
      if (p === true || p === 'true' || styles.enableParallax === true) {
        stylePairs.push(`background-attachment: fixed`);
      }
    }
  }
  if (styles.borderRadius) {
    const val = resolveStyleValue(styles.borderRadius);
    if (val) stylePairs.push(`border-radius: ${val}`);
  }
  if (styles.boxShadow) {
    const val = resolveStyleValue(styles.boxShadow);
    if (val) stylePairs.push(`box-shadow: ${val}`);
  }
  if (styles.borderWidth && styles.borderWidth !== "0px") {
    const w = resolveStyleValue(styles.borderWidth);
    const c = resolveStyleValue(styles.borderColor) || "#e2e8f0";
    stylePairs.push(`border: ${w} solid ${c}`);
  }
  if (styles.backdropBlur) {
    const b = resolveStyleValue(styles.backdropBlur);
    if (b) {
      stylePairs.push(`backdrop-filter: blur(${b})`);
      stylePairs.push(`-webkit-backdrop-filter: blur(${b})`);
    }
  }
  if (styles.opacity) {
    const o = resolveStyleValue(styles.opacity);
    if (o) stylePairs.push(`opacity: ${o}`);
  }

  if (stylePairs.length === 0) return "";
  return ` style="${stylePairs.join("; ")}"`;
}

/**
 * Returns CSS classes for visual hover micro-animations.
 */
function getHoverClass(block: BuilderBlock): string {
  const effect = block.styles?.hoverEffect;
  if (!effect) return "";
  const val = typeof effect === "string" ? effect : (effect.desktop || "");
  if (val === "scale") return " hover-effect-scale";
  if (val === "float") return " hover-effect-float";
  if (val === "glow") return " hover-effect-glow";
  return "";
}

/**
 * Compiles a specific visual builder block to its Handlebars/HTML string.
 */
function compileBlockToHbs(blockId: string, blocks: Record<string, BuilderBlock>, isPageContext: boolean = false): string {
  const block = blocks[blockId];
  if (!block) return "";

  let compiledChildren = "";
  if (block.childrenIds && block.childrenIds.length > 0) {
    compiledChildren = block.childrenIds
      .map((cid) => compileBlockToHbs(cid, blocks, isPageContext))
      .join("\n");
  }

  const def = componentRegistry[block.type];
  if (def) {
    let markup = def.compileToHbs(block, compiledChildren, isPageContext, blocks);
    const inline = getInlineStyles(block);
    const hover = getHoverClass(block);

    if (inline || hover) {
      const tagMatch = markup.match(/^<([a-zA-Z0-9-]+)([^>]*)>/);
      if (tagMatch) {
        const tagName = tagMatch[1];
        let attributes = tagMatch[2];

        if (hover) {
          if (attributes.includes('class="')) {
            attributes = attributes.replace('class="', `class="${hover.trim()} `);
          } else {
            attributes = `${attributes} class="${hover.trim()}"`;
          }
        }

        if (inline) {
          const styleMatch = inline.match(/style="([^"]+)"/);
          if (styleMatch) {
            const inlineStylesStr = styleMatch[1];
            if (attributes.includes('style="')) {
              attributes = attributes.replace('style="', `style="${inlineStylesStr}; `);
            } else {
              attributes = `${attributes} style="${inlineStylesStr}"`;
            }
          }
        }

        markup = markup.replace(tagMatch[0], `<${tagName}${attributes}>`);
      }
    }
    return markup;
  }
  return "";
}

/**
 * Compiles a page definition section list to a complete Handlebars markup string.
 */
export function compilePageToHbs(pageName: string, doc: ThemeDocument): string {
  const page = doc.pages[pageName];
  if (!page) return "";

  const isPageContext = pageName === "page" || pageName.startsWith("custom-");
  const mainContent = page.sections
    .filter((sectionId) => {
      const b = doc.blocks[sectionId];
      return b && b.type !== "header" && b.type !== "footer";
    })
    .map((sectionId) => compileBlockToHbs(sectionId, doc.blocks, isPageContext))
    .join("\n");

  if (pageName === "post") {
    return `{{!< default}}\n\n{{#post}}\n${mainContent}\n{{/post}}`;
  }
  if (pageName === "page") {
    return `{{!< default}}\n\n{{#post}}\n{{#if @page.show_title_and_feature_image}}\n  <header class="page-header py-8 max-w-2xl mx-auto px-6">\n    <h1 class="text-3xl font-bold tracking-tight">{{title}}</h1>\n  </header>\n{{/if}}\n${mainContent}\n{{/post}}`;
  }
  if (pageName === "author") {
    return `{{!< default}}\n\n{{#author}}\n${mainContent}\n{{/author}}`;
  }
  if (pageName === "tag") {
    return `{{!< default}}\n\n{{#tag}}\n${mainContent}\n{{/tag}}`;
  }

  return `{{!< default}}\n\n${mainContent}`;
}

/**
 * Returns basic premium global styles to be packaged alongside theme templates.
 */
export function getCompilerStyles(doc?: ThemeDocument): string {
  const settings = doc?.settings;
  const tokens = settings?.designTokens;

  const fontHeading = tokens?.typography?.headingFont || settings?.fontFamily || "'Geist', 'Inter', sans-serif";
  const fontBody = tokens?.typography?.bodyFont || settings?.fontFamily || "'Geist', 'Inter', sans-serif";
  const colorBackground = tokens?.colors?.background || '#fafafa';
  const colorForeground = tokens?.colors?.foreground || '#171717';
  const colorPrimary = tokens?.colors?.primary || settings?.primaryColor || '#171717';
  const colorMuted = tokens?.colors?.muted || '#4d4d4d';
  const colorAccent = tokens?.colors?.accent || '#3b82f6';
  const containerWidthVal = settings?.containerWidth ? `${settings.containerWidth}px` : '1200px';

  return `
/* Ghost Custom Theme Fonts Customization System */
:root {
  --gh-font-heading: ${fontHeading};
  --gh-font-body: ${fontBody};
  --color-background: ${colorBackground};
  --color-foreground: ${colorForeground};
  --color-primary: ${colorPrimary};
  --color-muted: ${colorMuted};
  --color-accent: ${colorAccent};
  --container-width: ${containerWidthVal};
}


.container-width {
  max-width: var(--container-width);
}
.mx-auto { margin-left: auto; margin-right: auto; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-16 { padding-top: 4rem; padding-bottom: 4rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }

/* Sticky Header */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 999;
}

/* Hover effects */
.hover-effect-scale {
  transition: transform 0.2s ease !important;
}
.hover-effect-scale:hover {
  transform: scale(1.02) !important;
}
.hover-effect-float {
  transition: transform 0.2s ease !important;
}
.hover-effect-float:hover {
  transform: translateY(-4px) !important;
}
.hover-effect-glow {
  transition: box-shadow 0.2s ease !important;
}
.hover-effect-glow:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
}



/* Layout Grid components */
.flex-columns {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}
.column-item {
  flex: 1;
  min-width: 250px;
}


.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 100px;
  text-decoration: none;
  transition: all 0.2s ease;
}
.btn-primary {
  background-color: #171717;
  color: #ffffff;
}
.btn-primary:hover {
  background-color: #000000;
}
.btn-secondary {
  background-color: #ffffff;
  color: #171717;
  border: 1px solid #ebebeb;
}
.btn-secondary:hover {
  background-color: #fafafa;
}


/* Custom Blocks */
.hero-block .hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 48rem;
  margin: 0 auto;
}
.hero-block .hero-eyebrow {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #f1f5f9;
  color: #3b82f6;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.hero-block .hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 1rem;
  line-height: 1.2;
}
.hero-block .hero-subtitle {
  font-size: 1.125rem;
  color: #4b5563;
  margin-top: 1rem;
  line-height: 1.6;
}
.hero-block .hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}
.newsletter-block {
  background-color: #fafafa;
  border: 1px solid #ebebeb;
  border-radius: 6px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.gallery-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}



/* Accordion Component */
.accordion-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.accordion-item {
  border: 1px solid #ebebeb;
  border-radius: 6px;
  padding: 1rem;
  background-color: #ffffff;
}

/* Tags Grid Archive */
.tag-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.tag-card {
  border: 1px solid #ebebeb;
  border-radius: 6px;
  padding: 1rem;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #171717;
}
.tag-card:hover {
  background-color: #fafafa;
}

/* Author Profile */
.author-profile-card {
  border: 1px solid #ebebeb;
  border-radius: 6px;
  padding: 1.5rem;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

/* Social links row */
.social-links-row a {
  color: #4d4d4d;
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.2s;
}
.social-links-row a:hover {
  color: #171717;
}

/* ============================================================
   HEADER FIXES — merge these rules into your compiled stylesheet.
   ============================================================ */

/* ---- 1. Make the style variables actually do something ---- */
.gh-head{
  margin-bottom: var(--mb, 0px);
  box-shadow: var(--shadow, none);
  opacity: var(--opacity, 1);
}
.gh-head[style*="--backdrop-blur"]:not([style*="--backdrop-blur: none"]){
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
}

/* ---- 2. Full palette coverage (light mode) ---- */
.gh-head.color-mode-light.palette-default,
.gh-head.palette-default{ background-color:#ffffff; color:#111827; }
.gh-head.color-mode-light.palette-classic{ background-color:#f3f4f6; color:#111827; }
.gh-head.color-mode-light.palette-dynamic{ background-color:#fee2e2; color:#7f1d1d; }
.gh-head.color-mode-light.palette-sand{ background-color:#f5f5f4; color:#44403c; }
.gh-head.color-mode-light.palette-zinc{ background-color:#f4f4f5; color:#27272a; }
.gh-head.color-mode-light.palette-graphite{ background-color:#e4e4e7; color:#18181b; }
.gh-head.color-mode-light.palette-stone{ background-color:#e7e5e4; color:#1c1917; }
.gh-head.color-mode-light.palette-ocean{ background-color:#e0f2fe; color:#0c4a6e; }
.gh-head.color-mode-light.palette-indigo{ background-color:#e0e7ff; color:#1e1b4b; }
.gh-head.color-mode-light.palette-violet{ background-color:#ede9fe; color:#4c1d95; }
.gh-head.color-mode-light.palette-rose{ background-color:#ffe4e6; color:#881337; }
.gh-head.color-mode-light.palette-amber{ background-color:#fef3c7; color:#78350f; }
.gh-head.color-mode-light.palette-sage{ background-color:#d1fae5; color:#064e3b; }

/* ---- 3. Full palette coverage (dark mode) ---- */
.gh-head.color-mode-dark.palette-default,
.gh-head.color-mode-dark.palette-dark{ background-color:#18181b; color:#ffffff; }
.gh-head.color-mode-dark.palette-classic{ background-color:#111827; color:#ffffff; }
.gh-head.color-mode-dark.palette-dynamic{ background-color:#b91c1c; color:#ffffff; }
.gh-head.color-mode-dark.palette-sand{ background-color:#292524; color:#ffffff; }
.gh-head.color-mode-dark.palette-zinc{ background-color:#27272a; color:#ffffff; }
.gh-head.color-mode-dark.palette-graphite{ background-color:#18181b; color:#ffffff; }
.gh-head.color-mode-dark.palette-stone{ background-color:#1c1917; color:#ffffff; }
.gh-head.color-mode-dark.palette-ocean{ background-color:#0c4a6e; color:#e0f2fe; }
.gh-head.color-mode-dark.palette-indigo{ background-color:#1e1b4b; color:#e0e7ff; }
.gh-head.color-mode-dark.palette-violet{ background-color:#2e1065; color:#ede9fe; }
.gh-head.color-mode-dark.palette-rose{ background-color:#4c0519; color:#ffe4e6; }
.gh-head.color-mode-dark.palette-amber{ background-color:#451a03; color:#fef3c7; }
.gh-head.color-mode-dark.palette-sage{ background-color:#064e3b; color:#d1fae5; }

/* ---- 4. Inherit mode ---- */
@media (prefers-color-scheme: dark){
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-default,
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-dark{ background-color:#18181b; color:#ffffff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-classic{ background-color:#111827; color:#ffffff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-dynamic{ background-color:#b91c1c; color:#ffffff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-sand{ background-color:#292524; color:#ffffff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-zinc{ background-color:#27272a; color:#ffffff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-graphite{ background-color:#18181b; color:#ffffff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-stone{ background-color:#1c1917; color:#ffffff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-ocean{ background-color:#0c4a6e; color:#e0f2fe; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-indigo{ background-color:#1e1b4b; color:#e0e7ff; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-violet{ background-color:#2e1065; color:#ede9fe; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-rose{ background-color:#4c0519; color:#ffe4e6; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-amber{ background-color:#451a03; color:#fef3c7; }
  .gh-head:not(.color-mode-light):not(.color-mode-dark).palette-sage{ background-color:#064e3b; color:#d1fae5; }
}

/* ---- 5. Subscribe button contrast per palette ---- */
.gh-head.color-mode-dark .gh-head-btn,
.gh-head.palette-dynamic .gh-head-btn,
.gh-head.palette-indigo.color-mode-dark .gh-head-btn,
.gh-head.palette-violet.color-mode-dark .gh-head-btn,
.gh-head.palette-rose.color-mode-dark .gh-head-btn{
  background-color:#ffffff; color:#000 !important;
}
@media (prefers-color-scheme: dark){
  .gh-head:not(.color-mode-light):not(.color-mode-dark) .gh-head-btn{
    background-color:#ffffff; color:#000 !important;
  }
}
.gh-head-btn:hover{ opacity:0.85; }

/* ---- 6. Missing hover state on nav links ---- */
.gh-head-menu a{ opacity:0.9; transition:opacity 0.2s ease; }
.gh-head-menu a:hover{ opacity:1; }

/* ---- 7. Section width & content width ---- */
@media (min-width: 768px) {
  .gh-head.section-width-narrow{ max-width:896px; margin:8px auto; border-radius:12px; }
  .gh-head.section-width-standard{ max-width:1152px; margin:8px auto; border-radius:12px; }
  .gh-head.section-width-wide{ max-width:1280px; margin:0 auto; }
  .gh-head.section-width-full{ max-width:none; }
}

.gh-head-inner{ max-width:none; } /* remove the old hardcoded 1200px */
.gh-head-inner.content-width-narrow{ max-width:768px; margin:0 auto; }
.gh-head-inner.content-width-standard{ max-width:1024px; margin:0 auto; }
.gh-head-inner.content-width-wide{ max-width:1152px; margin:0 auto; }
.gh-head-inner.content-width-full{ max-width:none; }
`;
}

/**
 * Generates the full packaged Ghost theme file list content.
 */
export function generateThemeFiles(doc: ThemeDocument): Record<string, string> {
  const files: Record<string, string> = {};

  // 1. Generate package.json definition
  files["package.json"] = JSON.stringify({
    name: doc.metadata.name.toLowerCase().replace(/\s+/g, "-"),
    description: doc.metadata.description || "Visual theme compiled from AST builder",
    version: doc.metadata.version || "1.0.0",
    engines: {
      ghost: ">=4.0.0"
    },
    keywords: [
      "ghost-theme"
    ],
    config: {
      posts_per_page: 5,
      card_assets: true,
      custom: {
        feed_layout: {
          type: "select",
          options: ["Classic", "Grid", "List"],
          default: "Classic"
        }
      }
    },
    author: {
      name: doc.metadata.author,
      email: "support@example.com"
    }
  }, null, 2);

  // 2. Extract global partials
  let headerCompiled = "";
  let footerCompiled = "";
  Object.values(doc.blocks).forEach((block) => {
    if (block.type === "header" && !headerCompiled) {
      headerCompiled = compileBlockToHbs(block.id, doc.blocks, false);
    }
    if (block.type === "footer" && !footerCompiled) {
      footerCompiled = compileBlockToHbs(block.id, doc.blocks, false);
    }
  });

  if (headerCompiled) files["partials/header.hbs"] = headerCompiled;
  if (footerCompiled) files["partials/footer.hbs"] = footerCompiled;

  // 3. Generate default.hbs wrapper page
  files["default.hbs"] = `
<!DOCTYPE html>
<html lang="{{@site.locale}}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{meta_title}}</title>
  <link rel="stylesheet" type="text/css" href="{{asset "built/screen.css"}}" />
  {{ghost_head}}
</head>
<body class="{{body_class}}">
  <div class="site-wrapper">
    ${headerCompiled ? '{{> "header"}}' : ''}
    <main id="site-main" class="site-main">
      {{{body}}}
    </main>
    ${footerCompiled ? '{{> "footer"}}' : ''}
  </div>
  <script src="{{asset "built/casper.js"}}" defer></script>
  {{ghost_foot}}
</body>
</html>`;

  // 3. Compile layout pages
  Object.keys(doc.pages).forEach((pageName) => {
    const compiledHtml = compilePageToHbs(pageName, doc);
    if (pageName === "home") {
      files["index.hbs"] = compiledHtml;
    } else {
      files[`${pageName}.hbs`] = compiledHtml;
    }
  });

  // 4. Generate navigation partial for Ghost compatibility
  files["partials/navigation.hbs"] = `<ul class="nav">
{{#foreach navigation}}
  <li class="nav-{{slug}}{{#if current}} nav-current{{/if}}"><a href="{{url}}">{{label}}</a></li>
{{/foreach}}
</ul>`;

  // 5. Generate asset stylesheet screen.css
  files["assets/css/screen.css"] = minifyCss(getCompilerStyles(doc));

  return files;
}

/**
 * Strips comments, line returns, and spacing patterns to minify CSS code contents.
 */
function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/\s+/g, " ")             // Compress consecutive spaces/returns into single spaces
    .replace(/\s*([{}|:;,])\s*/g, "$1") // Trim spaces around braces, colons, semi-colons, and commas
    .trim();
}
