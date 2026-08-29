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
  --color-accent: ${colorAccent};
  
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
  --color-muted: #a3a3a3;
}

@media (prefers-color-scheme: dark) {
  html:not(.light) {
    --color-bg: #111111;
    --color-fg: #ffffff;
    --color-muted: #a3a3a3;
  }
}

/* 3. Shared Structural Utilities */
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
  border-radius: var(--radius-md);
}
.gh-content .kg-width-wide {
  grid-column: wide-start / wide-end;
}
.gh-content .kg-width-full {
  grid-column: full-start / full-end;
}

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
      card_assets: true
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

  // 4. Generate navigation partial for Ghost compatibility
  files["partials/navigation.hbs"] = `<ul class="nav">
{{#foreach navigation}}
  <li class="nav-{{slug}}{{#if current}} nav-current{{/if}}"><a href="{{url}}">{{label}}</a></li>
{{/foreach}}
</ul>`;

  // 5. Generate asset stylesheet screen.css
  files["assets/css/screen.css"] = minifyCss(getSkeletonCss(doc));

  // 6. Generate post-card.hbs
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
