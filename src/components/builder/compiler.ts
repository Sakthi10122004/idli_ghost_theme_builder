import { ThemeDocument, BuilderBlock } from "../../types/theme";
import { componentRegistry } from "@/editor/components/registry";
import { toTranslucent } from "@/editor/components/shared/background";

/**
 * Resolves a responsive style property (using desktop value by default for server-side theme files)
 */
function resolveStyleValue(val: unknown): string | undefined {
  if (!val) return undefined;
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null && "desktop" in val) {
    return (val as { desktop?: string }).desktop || undefined;
  }
  return undefined;
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
  const isLogoCloud = block.type === "logo-cloud";
  const glassBlur = isLogoCloud ? undefined : resolveStyleValue(styles.backdropBlur);
  const glassEnabled = !!glassBlur && glassBlur !== "none" && glassBlur !== "0px";

  if (styles.backgroundColor) {
    let val = resolveStyleValue(styles.backgroundColor);
    if (glassEnabled && val) {
      val = toTranslucent(val);
    }
    if (val) stylePairs.push(`background-color: ${val}`);
  } else if (glassEnabled) {
    stylePairs.push(`background-color: rgba(255, 255, 255, 0.75)`);
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

      const p = resolveStyleValue(styles.enableParallax);
      if (p === 'true' || styles.enableParallax === true) {
        stylePairs.push(`background-attachment: fixed`);
      }
    }
  }
  if (styles.borderRadius) {
    const val = resolveStyleValue(styles.borderRadius);
    if (val) stylePairs.push(`border-radius: ${val}`);
  }
  if (styles.boxShadow && !isLogoCloud) {
    const val = resolveStyleValue(styles.boxShadow);
    if (val && val !== "none") stylePairs.push(`box-shadow: ${val}`);
  }
  if (styles.borderWidth && styles.borderWidth !== "0px") {
    const w = resolveStyleValue(styles.borderWidth);
    const c = resolveStyleValue(styles.borderColor) || "#e2e8f0";
    stylePairs.push(`border: ${w} solid ${c}`);
  }
  if (glassEnabled && glassBlur) {
    stylePairs.push(`backdrop-filter: blur(${glassBlur})`);
    stylePairs.push(`-webkit-backdrop-filter: blur(${glassBlur})`);
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
  if (block.type === "heading") return "";
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
      // Find the first non-style HTML opening tag to inject attributes
      const tagRegex = /<([a-zA-Z0-9-]+)([^>]*)>/g;
      let tagMatch: RegExpExecArray | null = null;
      let m: RegExpExecArray | null;
      while ((m = tagRegex.exec(markup)) !== null) {
        if (m[1].toLowerCase() !== "style") {
          tagMatch = m;
          break;
        }
      }

      if (tagMatch) {
        const tagName = tagMatch[1];
        let attributes = tagMatch[2];
        const matchIndex = tagMatch.index;
        const matchLength = tagMatch[0].length;

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

        markup = markup.substring(0, matchIndex) + `<${tagName}${attributes}>` + markup.substring(matchIndex + matchLength);
      }
    }
    return markup;
  }
  return "";
}

/**
 * Checks whether a block or any of its descendants is a header or footer.
 */
function isHeaderOrFooterBlock(blockId: string, blocks: Record<string, BuilderBlock>): boolean {
  const block = blocks[blockId];
  if (!block) return false;
  if (block.type === "header" || block.type === "footer") return true;
  if (block.childrenIds && block.childrenIds.length > 0) {
    return block.childrenIds.some((cid) => isHeaderOrFooterBlock(cid, blocks));
  }
  return false;
}

/**
 * Compiles a page definition section list to a complete Handlebars markup string.
 */
export function compilePageToHbs(pageName: string, doc: ThemeDocument): string {
  const page = doc.pages[pageName];
  if (!page) return "";

  const isPageContext = pageName === "page" || pageName.startsWith("custom-");
  const mainContent = page.sections
    .filter((sectionId) => !isHeaderOrFooterBlock(sectionId, doc.blocks))
    .map((sectionId) => compileBlockToHbs(sectionId, doc.blocks, isPageContext))
    .join("\n");

  if (pageName === "post") {
    return `{{!< default}}\n\n{{#post}}\n${mainContent}\n{{/post}}`;
  }
  if (pageName === "page") {
    // Avoid duplicate title if mainContent already contains a visual heading, page-detail, or title
    const hasTitleOrHeading =
      mainContent.includes("{{title}}") ||
      mainContent.includes("heading") ||
      mainContent.includes("post-header");

    const headerMarkup = !hasTitleOrHeading
      ? `\n{{#if @page.show_title_and_feature_image}}\n  <header class="page-header py-8 max-w-2xl mx-auto px-6">\n    <h1 class="text-3xl font-bold tracking-tight">{{title}}</h1>\n  </header>\n{{/if}}`
      : (!mainContent.includes("@page.show_title_and_feature_image")
          ? `\n{{#if @page.show_title_and_feature_image}}\n  {{!-- Page title managed via visual builder blocks --}}\n{{/if}}`
          : "");

    return `{{!< default}}\n\n{{#post}}${headerMarkup}\n${mainContent}\n{{/post}}`;
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
export function getSkeletonCss(doc?: ThemeDocument): string {
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
/* 1. CSS Reset & Base Typography */
*, *::before, *::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-fg);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  margin-top: 0;
  margin-bottom: 0.5em;
  color: var(--color-fg);
}
a {
  color: var(--color-primary);
  text-decoration: none;
}
ul.nav, ul.nav-secondary {
  list-style: none;
  margin: 0;
  padding: 0;
}
.site-footer .footer-bottom ul.nav,
.site-footer .footer-bottom ul.nav-secondary,
.site-footer .footer-secondary-nav ul.nav,
.site-footer .footer-secondary-nav ul.nav-secondary,
.site-footer .footer-nav-column ul.nav,
.site-footer .footer-nav-column ul.nav-secondary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}
.site-footer .footer-nav-column ul.nav,
.site-footer .footer-nav-column ul.nav-secondary {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}
.site-footer .footer-bottom ul.nav li,
.site-footer .footer-bottom ul.nav-secondary li,
.site-footer .footer-secondary-nav ul.nav li,
.site-footer .footer-secondary-nav ul.nav-secondary li,
.site-footer .footer-nav-column ul.nav li,
.site-footer .footer-nav-column ul.nav-secondary li {
  display: inline-flex;
  margin: 0;
  padding: 0;
}

/* 2. Design Tokens */
:root {
  --font-heading: ${fontHeading};
  --font-body: ${fontBody};
  --gh-font-heading: var(--font-heading);
  --gh-font-body: var(--font-body);
  --color-bg: ${colorBackground};
  --color-fg: ${colorForeground};
  --color-primary: ${colorPrimary};
  --color-muted: ${colorMuted};
  --color-mute: var(--color-muted);
  --color-accent: ${colorAccent};
  --color-canvas: var(--color-bg);
  --color-ink: var(--color-fg);
  
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-section: 5rem;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-pill: 9999px;

  --container-width: ${containerWidthVal};
  --content-width: 720px;
}

html.dark, html.dark-mode {
  --color-bg: #111111;
  --color-fg: #ffffff;
  --color-primary: #ffffff;
  --color-on-primary: #000000;
  --color-muted: #a3a3a3;
  --color-mute: #a3a3a3;
  --color-hairline: #333333;
  --color-canvas: #111111;
  --color-ink: #ffffff;
}

/* Ensure sections and buttons adapt cleanly in Ghost dark mode */
html.dark .section,
html.dark-mode .section,
html.dark .logo-cloud-section,
html.dark-mode .logo-cloud-section {
  background-color: var(--color-bg);
  color: var(--color-fg);
}

html.dark .section[style*="background-color: #ffffff"],
html.dark-mode .section[style*="background-color: #ffffff"],
html.dark .section[style*="background-color:#ffffff"],
html.dark-mode .section[style*="background-color:#ffffff"],
html.dark .section[style*="background-color: rgb(255, 255, 255)"],
html.dark-mode .section[style*="background-color: rgb(255, 255, 255)"] {
  background-color: var(--color-bg) !important;
}

/* Heading dark mode adaptation */
html.dark .heading-dark-adaptive,
html.dark-mode .heading-dark-adaptive,
html.dark .heading[style*="color: #000000"],
html.dark-mode .heading[style*="color: #000000"],
html.dark .heading[style*="color:#000000"],
html.dark-mode .heading[style*="color:#000000"],
html.dark .heading[style*="color: #171717"],
html.dark-mode .heading[style*="color: #171717"],
html.dark .heading[style*="color:#171717"],
html.dark-mode .heading[style*="color:#171717"],
html.dark .heading[style*="color: #0a0a0a"],
html.dark-mode .heading[style*="color: #0a0a0a"],
html.dark .heading[style*="color: #111111"],
html.dark-mode .heading[style*="color: #111111"],
html.dark .heading[style*="color: rgb(0, 0, 0)"],
html.dark-mode .heading[style*="color: rgb(0, 0, 0)"],
html.dark .heading[style*="color: rgb(23, 23, 23)"],
html.dark-mode .heading[style*="color: rgb(23, 23, 23)"],
html.dark .heading[style*="color: black"],
html.dark-mode .heading[style*="color: black"],
html.dark .text-dark-adaptive,
html.dark-mode .text-dark-adaptive,
html.dark .text-dark-adaptive p,
html.dark-mode .text-dark-adaptive p,
html.dark .text-content[style*="color: #000000"],
html.dark-mode .text-content[style*="color: #000000"],
html.dark .text-content[style*="color:#000000"],
html.dark-mode .text-content[style*="color:#000000"],
html.dark .text-content[style*="color: #171717"],
html.dark-mode .text-content[style*="color: #171717"],
html.dark .text-content[style*="color:#171717"],
html.dark-mode .text-content[style*="color:#171717"],
html.dark .text-content[style*="color: rgb(0, 0, 0)"],
html.dark-mode .text-content[style*="color: rgb(0, 0, 0)"],
html.dark .text-content[style*="color: rgb(23, 23, 23)"],
html.dark-mode .text-content[style*="color: rgb(23, 23, 23)"],
html.dark .text-content[style*="color: black"],
html.dark-mode .text-content[style*="color: black"] {
  color: var(--color-fg, #ffffff) !important;
}

html.dark .btn-primary,
html.dark-mode .btn-primary {
  background-color: #ffffff !important;
  color: #000000 !important;
}

html.dark .btn-secondary,
html.dark-mode .btn-secondary {
  background-color: var(--color-bg) !important;
  color: var(--color-fg) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

/* 3. Ghost Native Post & Page Share (#/share) - All Layouts & Themes */
.gh-share-wrapper,
.gh-share-dock-wrapper,
.gh-share-grid,
.gh-share-inline {
  display: flex;
  align-items: center;
  margin: 1.25rem 0;
  width: 100%;
  box-sizing: border-box;
}

/* Alignment */
.gh-share-align-left {
  justify-content: flex-start;
  text-align: left;
}
.gh-share-align-center {
  justify-content: center;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.gh-share-align-right {
  justify-content: flex-end;
  text-align: right;
}

/* Primary Share Trigger Button */
.gh-share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body, inherit);
  font-weight: 500;
  text-decoration: none !important;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  line-height: 1;
  border-radius: 9999px;
  white-space: nowrap;
  box-sizing: border-box;
}
.gh-share-btn svg,
.gh-share-direct-btn svg,
.gh-share-grid-tile svg,
.gh-share-more-btn svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

/* Button Sizing */
.gh-share-btn.gh-share-sm {
  font-size: 0.75rem;
  padding: 0.4rem 0.85rem;
  gap: 0.375rem;
}
.gh-share-btn.gh-share-md {
  font-size: 0.8125rem;
  padding: 0.5rem 1.1rem;
  gap: 0.5rem;
}
.gh-share-btn.gh-share-lg {
  font-size: 0.875rem;
  padding: 0.65rem 1.35rem;
  gap: 0.625rem;
}

/* Button Variants */
.gh-share-btn.gh-share-pill {
  background-color: var(--color-primary, #171717);
  color: #ffffff !important;
  border: 1px solid transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.gh-share-btn.gh-share-pill:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.gh-share-btn.gh-share-outline {
  background-color: transparent;
  border: 1px solid currentColor;
  color: var(--color-fg, #171717) !important;
}
.gh-share-btn.gh-share-outline:hover {
  opacity: 0.8;
  background-color: rgba(0, 0, 0, 0.04);
}
.gh-share-btn.gh-share-ghost {
  background-color: transparent;
  border: 1px solid transparent;
  color: var(--color-fg, #171717) !important;
}
.gh-share-btn.gh-share-ghost:hover {
  background-color: rgba(0, 0, 0, 0.06);
}
.gh-share-btn.gh-share-icon-only {
  padding: 0.5rem !important;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: var(--color-fg, #171717) !important;
}

/* Direct Platform Icons */
.gh-share-direct-links {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding-left: 0.625rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  margin-left: 0.375rem;
}
.gh-share-direct-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  color: var(--color-muted, #737373);
  text-decoration: none !important;
  transition: all 0.15s ease;
  box-sizing: border-box;
}
.gh-share-direct-btn:hover {
  color: var(--color-fg, #171717);
  background-color: rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

/* Layout 2: Editorial Card */
.gh-share-card {
  width: 100%;
  max-width: 600px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  margin: 1.75rem 0;
  box-sizing: border-box;
}
.gh-share-card.gh-share-align-center {
  margin-left: auto;
  margin-right: auto;
}
.gh-share-card.gh-share-align-right {
  margin-left: auto;
  margin-right: 0;
}
.gh-share-card-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-family: var(--font-heading, monospace);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted, #737373);
  margin-bottom: 0.375rem;
}
.gh-share-card-eyebrow svg {
  width: 12px;
  height: 12px;
  color: #9333ea;
}
.gh-share-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-fg, #171717);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}
.gh-share-card-subtitle {
  font-size: 0.8125rem;
  color: var(--color-muted, #666666);
  margin: 0 0 1rem 0;
  line-height: 1.5;
}
.gh-share-card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
.gh-share-card-copybox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
  padding: 0.375rem 0.5rem 0.375rem 0.75rem;
  margin-top: 0.875rem;
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--color-muted, #666666);
  gap: 0.5rem;
}
.gh-share-card-copybox span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gh-share-card-copybox a {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  color: var(--color-fg, #171717);
  text-decoration: none !important;
  font-size: 0.6875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
  flex-shrink: 0;
}
.gh-share-card-copybox a:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Layout 3: Floating Dock */
.gh-share-dock {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
}

/* Layout 4: Social Grid */
.gh-share-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
.gh-share-grid-tile {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none !important;
  transition: transform 0.15s ease, opacity 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.gh-share-grid-tile:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}
.gh-share-grid-ghost {
  background-color: #faf5ff;
  color: #7e22ce !important;
  border: 1px solid #e9d5ff;
}
.gh-share-grid-x {
  background-color: #000000;
  color: #ffffff !important;
  border: 1px solid #000000;
}
.gh-share-grid-linkedin {
  background-color: #0077b5;
  color: #ffffff !important;
  border: 1px solid #0077b5;
}
.gh-share-grid-whatsapp {
  background-color: #25d366;
  color: #ffffff !important;
  border: 1px solid #25d366;
}
.gh-share-grid-copy {
  background-color: #ffffff;
  color: var(--color-fg, #171717) !important;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

/* Layout 5: Inline Minimal */
.gh-share-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-muted, #737373);
  line-height: 1.5;
}
.gh-share-inline .gh-share-label {
  font-weight: 600;
  color: var(--color-fg, #171717);
}
.gh-share-inline a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.15s ease;
}
.gh-share-inline a:hover {
  color: var(--color-primary, #171717);
}
.gh-share-inline a.gh-share-more-btn {
  color: #7e22ce;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Dark Mode Adaptation for Share Components */
html.dark .gh-share-card,
html.dark-mode .gh-share-card {
  background-color: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
html.dark .gh-share-card-title,
html.dark-mode .gh-share-card-title {
  color: #ffffff !important;
}
html.dark .gh-share-card-subtitle,
html.dark-mode .gh-share-card-subtitle {
  color: #a3a3a3 !important;
}
html.dark .gh-share-card-actions,
html.dark-mode .gh-share-card-actions {
  border-top-color: rgba(255, 255, 255, 0.1);
}
html.dark .gh-share-card-copybox,
html.dark-mode .gh-share-card-copybox {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #a3a3a3;
}
html.dark .gh-share-card-copybox a,
html.dark-mode .gh-share-card-copybox a {
  background: #262626;
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}
html.dark .gh-share-dock,
html.dark-mode .gh-share-dock {
  background-color: rgba(24, 24, 27, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
html.dark .gh-share-direct-links,
html.dark-mode .gh-share-direct-links {
  border-left-color: rgba(255, 255, 255, 0.15);
}
html.dark .gh-share-direct-btn,
html.dark-mode .gh-share-direct-btn {
  color: #a3a3a3;
}
html.dark .gh-share-direct-btn:hover,
html.dark-mode .gh-share-direct-btn:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}
html.dark .gh-share-grid-x,
html.dark-mode .gh-share-grid-x {
  background-color: #ffffff;
  color: #000000 !important;
}
html.dark .gh-share-grid-ghost,
html.dark-mode .gh-share-grid-ghost {
  background-color: rgba(147, 51, 234, 0.15);
  border-color: rgba(147, 51, 234, 0.3);
  color: #d8b4fe !important;
}
html.dark .gh-share-grid-copy,
html.dark-mode .gh-share-grid-copy {
  background-color: #262626;
  border-color: rgba(255, 255, 255, 0.15);
  color: #ffffff !important;
}
html.dark .gh-share-pill,
html.dark-mode .gh-share-pill {
  background-color: #ffffff !important;
  color: #000000 !important;
}
html.dark .gh-share-outline,
html.dark-mode .gh-share-outline {
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
}
html.dark .gh-share-ghost,
html.dark-mode .gh-share-ghost {
  color: #ffffff !important;
}
html.dark .gh-share-ghost:hover,
html.dark-mode .gh-share-ghost:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
html.dark .gh-share-icon-only,
html.dark-mode .gh-share-icon-only {
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff !important;
}
html.dark .gh-share-inline .gh-share-label,
html.dark-mode .gh-share-inline .gh-share-label {
  color: #ffffff;
}
html.dark .gh-share-inline a.gh-share-more-btn,
html.dark-mode .gh-share-inline a.gh-share-more-btn {
  color: #c084fc;
}


/* 3. Shared Structural Utilities & Hover Micro-Interactions */
.hover-effect-scale {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
}
.hover-effect-scale:hover {
  transform: scale(1.02) !important;
  z-index: 30 !important;
}

.hover-effect-float {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
}
.hover-effect-float:hover {
  transform: translateY(-4px) !important;
  z-index: 30 !important;
}

.hover-effect-glow {
  transition: box-shadow 0.25s ease, transform 0.25s ease !important;
}
.hover-effect-glow:hover {
  box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.08) !important;
  z-index: 30 !important;
}

.container-width {
  max-width: var(--container-width);
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: var(--color-primary);
  color: #fff;
  padding: 8px;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 0;
}

/* 4. Ghost .gh-content Post Typography & Cards */
.gh-canvas {
  display: grid;
  grid-template-columns: 
    [full-start] minmax(4vmin, auto)
    [wide-start] minmax(auto, 240px)
    [main-start] min(var(--content-width), calc(100% - 8vw)) [main-end]
    minmax(auto, 240px) [wide-end]
    minmax(4vmin, auto) [full-end];
}
.gh-canvas > * {
  grid-column: main-start / main-end;
}

.gh-content {
  font-size: 1.125rem;
  line-height: 1.7;
}

.gh-content > * + * {
  margin-top: 1.5em;
  margin-bottom: 0;
}

.gh-content p {
  margin: 0 0 1.5em 0;
}

.gh-content h2, .gh-content h3, .gh-content h4 {
  margin-top: 2em;
}

.gh-content a {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.gh-content ul, .gh-content ol {
  padding-left: 1.5em;
  margin-bottom: 1.5em;
}

.gh-content blockquote {
  margin: 1.5em 0;
  padding: 0 1.5em;
  border-left: 3px solid var(--color-primary);
  font-style: italic;
}

.gh-content .kg-blockquote-alt {
  font-size: 1.5em;
  font-style: italic;
  text-align: center;
  border: none;
  padding: 0;
  color: var(--color-muted);
}

.gh-content hr {
  border: 0;
  border-top: 1px solid rgba(0,0,0,0.1);
  margin: 3em 0;
}

/* Ghost Image Cards */
.gh-content .kg-image-card, 
.gh-content .kg-gallery-card {
  margin: 2em 0;
}
.gh-content .kg-image-card figcaption,
.gh-content .kg-gallery-card figcaption {
  font-size: 0.85em;
  color: var(--color-muted);
  text-align: center;
  margin-top: 0.5em;
}
.gh-content .kg-image {
  max-width: 100%;
  height: auto;
}
.gh-content .kg-width-wide {
  grid-column: wide-start / wide-end;
}
.gh-content .kg-width-full {
  grid-column: full-start / full-end;
}

/* 4. Global Radius & Layout Utilities */
.rounded-none { border-radius: 0px !important; }
.rounded-sm { border-radius: 4px !important; }
.rounded-md { border-radius: 8px !important; }
.rounded-lg { border-radius: 12px !important; }
.rounded-xl { border-radius: 16px !important; }
.rounded-2xl { border-radius: 24px !important; }
.rounded-full { border-radius: 9999px !important; }
.overflow-hidden { overflow: hidden !important; }
.object-cover { object-fit: cover !important; }
.object-contain { object-fit: contain !important; }
.object-fill { object-fit: fill !important; }

/* Ghost Gallery Cards */
.gh-content .kg-gallery-container {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.gh-content .kg-gallery-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1em;
}
.gh-content .kg-gallery-image img {
  display: block;
  margin: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

/* Ghost Embed Cards */
.gh-content .kg-embed-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2em 0;
  width: 100%;
}
.gh-content .kg-embed-card iframe {
  max-width: 100%;
}

/* Ghost Bookmark Cards */
.gh-content .kg-bookmark-card {
  margin: 2em 0;
  width: 100%;
  background: var(--color-bg);
}
.gh-content .kg-bookmark-container {
  display: flex;
  color: var(--color-fg);
  text-decoration: none;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.gh-content .kg-bookmark-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1.5em;
  justify-content: flex-start;
}
.gh-content .kg-bookmark-title {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.gh-content .kg-bookmark-description {
  font-size: 0.9em;
  color: var(--color-muted);
  line-height: 1.5;
  margin-bottom: 1em;
}
.gh-content .kg-bookmark-metadata {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.8em;
  margin-top: auto;
}
.gh-content .kg-bookmark-icon {
  width: 20px;
  height: 20px;
}
.gh-content .kg-bookmark-author, 
.gh-content .kg-bookmark-publisher {
  color: var(--color-muted);
}
.gh-content .kg-bookmark-thumbnail {
  position: relative;
  min-width: 33%;
  max-height: 100%;
}
.gh-content .kg-bookmark-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}
@media (max-width: 600px) {
  .gh-content .kg-bookmark-container {
    flex-direction: column;
  }
  .gh-content .kg-bookmark-thumbnail {
    min-height: 200px;
    order: -1;
  }
}

/* Ghost Callout Cards */
.gh-content .kg-callout-card {
  display: flex;
  padding: 1.25em 1.75em;
  border-radius: var(--radius-md);
  margin: 1.5em 0;
  background: rgba(0,0,0,0.03);
}
.gh-content .kg-callout-card-accent {
  background: var(--color-accent);
  color: #fff;
}
.gh-content .kg-callout-emoji {
  margin-right: 1em;
  font-size: 1.5em;
}
.gh-content .kg-callout-text {
  font-size: 1em;
  line-height: 1.5;
}

/* Ghost Button Cards */
.gh-content .kg-button-card {
  display: flex;
  margin: 2em 0;
}
.gh-content .kg-button-card.kg-align-center {
  justify-content: center;
}
.gh-content .kg-btn {
  display: inline-block;
  padding: 0.8em 1.5em;
  font-weight: bold;
  text-decoration: none;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: #fff;
  transition: opacity 0.2s;
}
.gh-content .kg-btn-accent {
  background: var(--color-accent);
  color: #fff;
}
.gh-content .kg-btn:hover {
  opacity: 0.9;
}

/* Ghost Toggle Cards */
.gh-content .kg-toggle-card {
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: var(--radius-md);
  padding: 1.25em;
  margin: 1.5em 0;
}
.gh-content .kg-toggle-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
.gh-content .kg-toggle-heading-text {
  margin: 0;
  font-size: 1.1em;
}
.gh-content .kg-toggle-card-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  color: var(--color-muted);
}
.gh-content .kg-toggle-card[data-kg-toggle-state="close"] .kg-toggle-content {
  display: none;
}
.gh-content .kg-toggle-content {
  margin-top: 1em;
  font-size: 0.95em;
  color: var(--color-muted);
}

/* Ghost Header Cards */
.gh-content .kg-header-card {
  padding: 4em 2em;
  text-align: center;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-md);
  margin: 2em 0;
}
.gh-content .kg-header-card-header {
  font-size: 2.5em;
  margin-bottom: 0.25em;
}
.gh-content .kg-header-card-subheader {
  font-size: 1.25em;
  font-weight: normal;
  opacity: 0.8;
}

/* Ghost Signup Cards */
.gh-content .kg-signup-card {
  background: rgba(0,0,0,0.03);
  border-radius: var(--radius-md);
  padding: 2em;
  margin: 2em 0;
  text-align: center;
}
.gh-content .kg-signup-card-heading {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}
.gh-content .kg-signup-card-subheading {
  font-size: 1.1em;
  color: var(--color-muted);
  margin-bottom: 1.5em;
}
.gh-content .kg-signup-card-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  max-width: 400px;
  margin: 0 auto;
}
.gh-content .kg-signup-card-input {
  padding: 0.75em 1em;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-sm);
  font-family: inherit;
}
.gh-content .kg-signup-card-button {
  padding: 0.75em 1em;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: bold;
  cursor: pointer;
}
.gh-content .kg-signup-card-disclaimer {
  font-size: 0.85em;
  color: var(--color-muted);
  margin-top: 1em;
}

/* Ghost File/Audio Cards */
.gh-content .kg-audio-card, 
.gh-content .kg-file-card {
  display: flex;
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: var(--radius-md);
  padding: 1em;
  margin: 1.5em 0;
}
.gh-content .kg-file-card-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  width: 100%;
}
.gh-content .kg-file-card-contents {
  flex-grow: 1;
}
.gh-content .kg-file-card-title {
  font-weight: bold;
}
.gh-content .kg-file-card-caption,
.gh-content .kg-file-card-metadata {
  font-size: 0.85em;
  color: var(--color-muted);
}
.gh-content .kg-file-card-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary);
}

/* Ghost Code/Pre */
.gh-content pre {
  background: #111;
  color: #fff;
  padding: 1.5em;
  border-radius: var(--radius-md);
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.9em;
  margin: 1.5em 0;
}
.gh-content code {
  background: rgba(0,0,0,0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
  font-size: 0.9em;
}
.gh-content pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}

/* Ghost Tables */
.gh-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}
.gh-content th, .gh-content td {
  padding: 0.75em;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  text-align: left;
}
.gh-content th {
  font-weight: bold;
}

/* Micro-Interactions: Hover Effects */
.hover-effect-scale {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
}
.hover-effect-scale:hover {
  transform: scale(1.02) !important;
  z-index: 30 !important;
}
.hover-effect-float {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease !important;
}
.hover-effect-float:hover {
  transform: translateY(-4px) !important;
  z-index: 30 !important;
}
.hover-effect-glow {
  transition: box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.hover-effect-glow:hover {
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.12), 0 12px 32px -4px rgba(0, 0, 0, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.08) !important;
  z-index: 30 !important;
}
html.dark .hover-effect-glow:hover {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.15), 0 12px 32px -4px rgba(0, 0, 0, 0.6) !important;
}
`;
}

/**
 * Generates the full packaged Ghost theme file list content.
 */
export function generateThemeFiles(doc: ThemeDocument): Record<string, string> {
  const files: Record<string, string> = {};

  const pkgConfig: Record<string, unknown> = {
    posts_per_page: 5,
    card_assets: true
  };

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
    config: pkgConfig,
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
    <a class="skip-link" href="#site-main">Skip to content</a>
    ${headerCompiled ? '{{> "header"}}' : ''}
    <main id="site-main" class="site-main">
      {{{body}}}
    </main>
    ${footerCompiled ? '{{> "footer"}}' : ''}
  </div>
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

  // 4. Generate navigation partial for Ghost compatibility (supporting both primary and secondary navigation)
  files["partials/navigation.hbs"] = `{{#if isSecondary}}
<ul class="nav nav-secondary" role="menu">
  {{#foreach navigation}}
    <li class="{{link_class for=(url) class=(concat "nav-" slug)}}" role="menuitem">
      <a href="{{url absolute="true"}}">{{label}}</a>
    </li>
  {{/foreach}}
</ul>
{{else}}
<ul class="nav" role="menu">
  {{#foreach navigation}}
    <li class="{{link_class for=(url) class=(concat "nav-" slug)}}" role="menuitem">
      <a href="{{url absolute="true"}}">{{label}}</a>
    </li>
  {{/foreach}}
</ul>
{{/if}}`;

  // 5. Generate asset stylesheet screen.css
  files["assets/css/screen.css"] = minifyCss(getSkeletonCss(doc));

  // 6. Generate content.hbs partial (supporting {{> "content" width="wide"}} or {{> "content"}})
  files["partials/content.hbs"] = `{{!--
    Standard Ghost content partial supporting {{> "content" width="wide"}} or {{> "content"}}
--}}
<section class="gh-content gh-canvas{{#if width}} gh-canvas-{{width}}{{/if}}">
    {{content}}
</section>
`;

  // 7. Generate post-card.hbs
  files["partials/post-card.hbs"] = `
<article class="gh-post-card {{post_class}}">
  <a class="gh-post-card-link" href="{{url}}">
    {{#if feature_image}}
    <div class="gh-post-card-image">
      <img
        srcset="{{img_url feature_image size="s"}} 300w,
                {{img_url feature_image size="m"}} 600w,
                {{img_url feature_image size="l"}} 1000w,
                {{img_url feature_image size="xl"}} 2000w"
        sizes="(max-width: 1000px) 400px, 800px"
        src="{{img_url feature_image size="m"}}"
        alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
        loading="lazy"
      />
    </div>
    {{/if}}
    <div class="gh-post-card-content">
      <h2 class="gh-post-card-title">{{title}}</h2>
      <p class="gh-post-card-excerpt">{{excerpt}}</p>
      <footer class="gh-post-card-meta">
        <span class="gh-post-card-date"><time datetime="{{date format="YYYY-MM-DD"}}">{{date format="D MMM YYYY"}}</time></span>
        <span class="gh-post-card-reading-time">{{reading_time}}</span>
      </footer>
    </div>
  </a>
</article>
`;

  // 7. Inject bundled assets
  if (doc.assets) {
    Object.entries(doc.assets).forEach(([path, dataUri]) => {
      // Strip 'data:image/png;base64,' prefix
      const base64Data = dataUri.split(',')[1];
      if (base64Data) {
        files[path] = base64Data;
      }
    });
  }

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
