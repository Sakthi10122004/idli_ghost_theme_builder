import { ThemeDocument, BuilderBlock } from "../../types/theme";

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
function compileBlockToHbs(blockId: string, blocks: Record<string, BuilderBlock>): string {
  const block = blocks[blockId];
  if (!block) return "";

  let compiledChildren = "";
  if (block.childrenIds && block.childrenIds.length > 0) {
    compiledChildren = block.childrenIds
      .map((cid) => compileBlockToHbs(cid, blocks))
      .join("\n");
  }

  switch (block.type) {
    case "section": {
      const { 
        backgroundVideoUrl,
        enableParallax = false
      } = block.styles;

      const inlineStyles = getInlineStyles(block);
      
      const videoHtml = backgroundVideoUrl ? `
<video src="${resolveStyleValue(backgroundVideoUrl)}" autoplay loop muted playsinline style="position: ${enableParallax ? 'fixed' : 'absolute'}; top: 0; left: 0; width: ${enableParallax ? '100vw' : '100%'}; height: ${enableParallax ? '100vh' : '100%'}; object-fit: cover; z-index: 0; pointer-events: none;"></video>
      ` : "";

      const extraClasses = backgroundVideoUrl ? " relative overflow-hidden" : "";
      const extraStyles = (backgroundVideoUrl && enableParallax) ? "clip-path: inset(0px);" : "";

      let finalStyles = inlineStyles;
      if (extraStyles) {
        if (finalStyles.includes('style="')) {
          finalStyles = finalStyles.replace('style="', `style="${extraStyles} `);
        } else {
          finalStyles = ` style="${extraStyles}"`;
        }
      }

      return `
<section class="section${getHoverClass(block)}${extraClasses}"${finalStyles}>
  ${videoHtml}
  <div class="container-width mx-auto px-6" style="position: relative; z-index: 10;">
    ${compiledChildren}
  </div>
</section>`;
    }

    case "container":
      return `
<div class="container-inner${getHoverClass(block)}"${getInlineStyles(block)}>
  ${compiledChildren}
</div>`;

    case "columns":
      return `
<div class="flex-columns">
  ${block.childrenIds ? block.childrenIds.map((cid) => `
  <div class="column-item">
    ${compileBlockToHbs(cid, blocks)}
  </div>`).join("\n") : ""}
</div>`;

    case "heading": {
      const level = block.props.level || 2;
      return `<h${level} class="heading font-heading${getHoverClass(block)}"${getInlineStyles(block)}>${block.props.text || "Heading Content"}</h${level}>`;
    }

    case "text":
      return `<p class="text-content font-body${getHoverClass(block)}"${getInlineStyles(block)}>${block.props.text || "Paragraph Content."}</p>`;

    case "button":
      return `<a href="${block.props.href || '#'}" class="btn btn-${block.props.variant || 'primary'}${getHoverClass(block)}"${getInlineStyles(block)}>${block.props.label || 'Click Here'}</a>`;

    case "divider":
      return `<hr class="divider-hairline" />`;

    case "spacer":
      return `<div style="height: ${block.props.height || '40px'};"></div>`;

    case "image":
      return `
<figure class="image-wrapper${getHoverClass(block)}"${getInlineStyles(block)}>
  <img src="${block.props.url || ''}" alt="${block.props.alt || ''}" class="img-fluid" style="width: 100%; height: auto;" />
</figure>`;

    case "hero":
      return `
<div class="hero-block text-center py-16 mesh-glow relative overflow-hidden">
  <div class="max-w-xl mx-auto px-6">
    <span class="eyebrow bg-brand-light px-2 py-0.5 rounded-full text-xs font-semibold">Introducing V2</span>
    <h1 class="heading font-heading text-4xl font-bold mt-4">${block.props.title || "Build beautiful templates."}</h1>
    <p class="text-content font-body text-base mt-2">${block.props.subtitle || "A visual workspace built directly on layout AST compilation."}</p>
    <div class="mt-6 flex justify-center gap-3">
      <a href="#" class="btn btn-primary">${block.props.buttonLabel || "Start Free"}</a>
      <a href="#" class="btn btn-secondary">Documentation</a>
    </div>
  </div>
</div>`;

    case "newsletter":
      return `
<div class="newsletter-block py-12 px-8 bg-brand-soft border border-brand-hairline rounded-md flex flex-col md:flex-row justify-between items-center gap-6">
  <div>
    <h3 class="font-heading text-lg font-bold">${block.props.title || "Join our technical newsletter"}</h3>
    <p class="text-xs text-muted">Stay up to date with new features and tutorials.</p>
  </div>
  <form class="newsletter-form flex gap-2">
    <input type="email" placeholder="${block.props.placeholder || 'you@domain.com'}" required class="input-field" />
    <button type="submit" class="btn btn-primary shrink-0">${block.props.buttonLabel || 'Subscribe'}</button>
  </form>
</div>`;

    case "header": {
      const { 
        logoText = "THE BLOG", 
        logoImageUrl, 
        navLinks = "Articles, About, Newsletter", 
        showCta = false, 
        ctaLabel = "Subscribe", 
        ctaHref = "#" 
      } = block.props;
      
      const {
        isSticky = false,
        borderWidth = "1px",
        borderColor = "#e2e8f0",
        borderRadius,
        backgroundColor = "#ffffff"
      } = block.styles;

      const linksArray = navLinks.split(",").map((s: string) => s.trim()).filter(Boolean);

      const headerStyles = [
        `background-color: ${isSticky ? `${backgroundColor}cc` : backgroundColor}`,
        isSticky ? `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px)` : "",
        borderRadius ? `border-radius: ${borderRadius}` : "",
        borderWidth !== "0px" ? `border-bottom: ${borderWidth} solid ${borderColor}` : "border-bottom: none",
      ].filter(Boolean).join("; ");

      return `
<div class="site-header-wrapper ${isSticky ? "sticky-header" : ""}" style="${headerStyles}">
  <header class="site-header flex items-center justify-between py-4 px-6 max-w-7xl mx-auto">
    <div class="site-title font-sans font-bold">
      ${logoImageUrl ? `
        <a href="{{@site.url}}"><img src="${logoImageUrl}" alt="${logoText}" style="height: 24px; width: auto; object-fit: contain;" /></a>
      ` : `
        <a href="{{@site.url}}" style="text-decoration: none; color: inherit; text-transform: uppercase;">${logoText}</a>
      `}
    </div>
    <div class="flex items-center gap-6">
      <nav class="site-nav flex gap-4 text-xs font-medium">
        ${linksArray.map((link: string) => `<span>${link}</span>`).join("\n        ")}
      </nav>
      ${showCta ? `
      <a href="${ctaHref}" class="btn btn-primary" style="padding: 0.35rem 1rem; border-radius: 4px; font-size: 11px;">${ctaLabel}</a>
      ` : ""}
    </div>
  </header>
</div>`;
    }

    case "footer":
      return `
<footer class="site-footer py-8 border-t border-brand-hairline">
  <div class="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
    <span>© {{@site.title}} - Visual compiler output.</span>
    <nav class="flex gap-4">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </nav>
  </div>
</footer>`;

    case "post-grid":
      return `
<div class="post-grid-wrapper py-8">
  <div class="grid-columns">
    {{#foreach posts}}
    <article class="post-card">
      {{#if feature_image}}
      <div class="post-card-image">
        <a href="{{url}}"><img src="{{img_url feature_image size="m"}}" alt="{{title}}" /></a>
      </div>
      {{/if}}
      <div class="post-card-content">
        {{#if primary_tag}}
        <span class="post-tag">{{primary_tag.name}}</span>
        {{/if}}
        <h3 class="post-title"><a href="{{url}}">{{title}}</a></h3>
        <p class="post-excerpt">{{excerpt words="26"}}</p>
        <div class="post-card-meta">
          <time datetime="{{date format="YYYY-MM-DD"}}">{{date format="MMM DD, YYYY"}}</time>
          <span>{{reading_time}}</span>
        </div>
      </div>
    </article>
    {{/foreach}}
  </div>
</div>`;

    case "featured-posts":
      return `
<div class="featured-posts-block py-8">
  <div class="grid-columns">
    {{#foreach posts featured="true" limit="3"}}
    <article class="post-card border-brand-hairline shadow-level-1">
      {{#if feature_image}}
      <div class="post-card-image">
        <a href="{{url}}"><img src="{{img_url feature_image size="m"}}" alt="{{title}}" /></a>
      </div>
      {{/if}}
      <div class="post-card-content">
        <h3 class="post-title"><a href="{{url}}">{{title}}</a></h3>
        <p class="post-excerpt">{{excerpt words="20"}}</p>
      </div>
    </article>
    {{/foreach}}
  </div>
</div>`;

    case "post-content":
      return `
<article class="post-full-content py-12 max-w-2xl mx-auto px-6">
  <header class="post-header mb-8">
    <h1 class="text-3xl font-bold leading-tight">${block.props.showTitle !== false ? '{{title}}' : ''}</h1>
    <div class="post-meta text-xs text-muted mt-2">
      <time datetime="{{date format="YYYY-MM-DD"}}">{{date format="MMM DD, YYYY"}}</time>
    </div>
  </header>
  {{#if feature_image}}
    <figure class="post-feature-image rounded-md overflow-hidden my-6">
      <img src="{{feature_image}}" alt="{{title}}" class="w-full h-auto" />
    </figure>
  {{/if}}
  <div class="post-body text-sm leading-relaxed mt-4">
    {{content}}
  </div>
</article>`;

    case "accordion":
      return `
<div class="accordion-wrapper py-6 flex flex-col gap-3">
  ${(block.props.items || []).map((item: any) => `
  <div class="accordion-item border border-brand-hairline rounded-sm p-4 bg-white">
    <h4 class="text-xs font-bold text-brand-ink mb-2 flex justify-between items-center cursor-pointer">
      <span>${item.question || "FAQ Question"}</span>
      <span class="text-[10px] text-muted">▼</span>
    </h4>
    <p class="text-xs text-muted leading-relaxed">${item.answer || "Answer content."}</p>
  </div>`).join("\n")}
</div>`;

    case "testimonials":
      return `
<div class="testimonials-wrapper py-6 flex flex-col gap-4">
  ${(block.props.items || []).map((item: any) => `
  <div class="testimonial-card border border-brand-hairline rounded-sm p-6 bg-brand-soft">
    <p class="text-xs italic leading-relaxed mb-4">"${item.quote || ""}"</p>
    <div class="flex flex-col">
      <span class="text-xs font-bold">${item.author || "User"}</span>
      <span class="text-[10px] text-muted font-mono">${item.title || ""}</span>
    </div>
  </div>`).join("\n")}
</div>`;

    case "pricing-table":
      return `
<div class="pricing-table-block py-8 text-center">
  ${block.props.title ? `<h3 class="text-sm font-mono uppercase tracking-wider text-muted mb-6">${block.props.title}</h3>` : ""}
  <div class="pricing-grid flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
    ${(block.props.tiers || []).map((tier: any) => `
    <div class="pricing-tier border border-brand-hairline rounded-md p-6 bg-white flex flex-col justify-between flex-1">
      <div class="mb-6">
        <span class="tier-name text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">${tier.name}</span>
        <span class="tier-price block text-3xl font-bold mt-2">${tier.price}</span>
        <div class="tier-features flex flex-col gap-1 mt-4 text-xs text-muted">
          ${(tier.features || []).map((f: any) => `<span>✓ ${f}</span>`).join("\n")}
        </div>
      </div>
      <a href="#" class="btn btn-primary">${tier.buttonLabel || "Choose Plan"}</a>
    </div>`).join("\n")}
  </div>
</div>`;

    case "grid-gallery":
      return `
<div class="gallery-grid-wrapper py-6">
  <div class="gallery-grid">
    ${(block.props.urls || []).map((url: any) => `
    <div class="gallery-image">
      <img src="${url}" alt="Gallery Image" class="w-full h-full object-cover" />
    </div>`).join("\n")}
  </div>
</div>`;

    case "social-links":
      return `
<div class="social-links-row py-4 flex justify-center gap-6 text-xs font-mono">
  ${block.props.github ? `<a href="${block.props.github}" target="_blank" rel="noreferrer">GitHub</a>` : ""}
  ${block.props.twitter ? `<a href="${block.props.twitter}" target="_blank" rel="noreferrer">Twitter</a>` : ""}
  ${block.props.website ? `<a href="${block.props.website}" target="_blank" rel="noreferrer">Website</a>` : ""}
</div>`;

    case "video-player":
      return `
<div class="video-player-wrapper py-6 flex justify-center">
  <div class="video-container aspect-video w-full max-w-2xl bg-black rounded-md overflow-hidden">
    ${block.props.url ? `<iframe src="${block.props.url}" class="w-full h-full" allowfullscreen></iframe>` : ""}
  </div>
</div>`;

    default:
      return "";
  }
}

/**
 * Compiles a page definition section list to a complete Handlebars markup string.
 */
export function compilePageToHbs(pageName: string, doc: ThemeDocument): string {
  const page = doc.pages[pageName];
  if (!page) return "";

  const mainContent = page.sections
    .map((sectionId) => compileBlockToHbs(sectionId, doc.blocks))
    .join("\n");

  if (pageName === "post") {
    return `{{!< default}}\n\n{{#post}}\n${mainContent}\n{{/post}}`;
  }
  if (pageName === "page") {
    return `{{!< default}}\n\n{{#post}}\n${mainContent}\n{{/post}}`;
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
export function getCompilerStyles(): string {
  return `
/* Ghost Custom Theme Fonts Customization System */
:root {
  --gh-font-heading: 'Geist', 'Inter', sans-serif;
  --gh-font-body: 'Geist', 'Inter', sans-serif;
}

/* Base styling */
body {
  font-family: var(--gh-font-body);
  color: #171717;
  background-color: #fafafa;
  margin: 0;
  padding: 0;
}
.container-width {
  max-width: 1200px;
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

/* Koenig Editor required classes */
.kg-width-wide {
  position: relative;
  width: 85vw;
  left: 50%;
  transform: translateX(-50%);
  max-width: 1040px;
}
.kg-width-full {
  position: relative;
  width: 100vw;
  left: 50%;
  transform: translateX(-50%);
  max-width: 100%;
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

/* Base Components styling */
.heading {
  font-family: var(--gh-font-heading);
  color: #171717;
  letter-spacing: -0.03em;
  margin-top: 0;
}
.text-content {
  color: #4d4d4d;
  line-height: 1.6;
}
.divider-hairline {
  border: 0;
  border-top: 1px solid #ebebeb;
  margin: 1.5rem 0;
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
.hero-block {
  background: radial-gradient(circle at top, rgba(0, 112, 243, 0.05), transparent 70%);
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

/* Header component styles */
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #ebebeb;
}
.site-header .site-title a {
  font-weight: 600;
  font-size: 1.1rem;
  color: #171717;
  text-decoration: none;
}
.site-header .site-nav a {
  color: #4d4d4d;
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.2s;
}
.site-header .site-nav a:hover {
  color: #171717;
}

/* Footer component styles */
.site-footer {
  border-top: 1px solid #ebebeb;
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
  color: #888888;
}
@media (min-width: 768px) {
  .site-footer {
    flex-direction: row;
  }
}
.site-footer a {
  color: #888888;
  text-decoration: none;
  transition: color 0.2s;
}
.site-footer a:hover {
  color: #171717;
}

/* Post Grid & Cards Grid */
.post-grid-wrapper .grid-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.post-card {
  border: 1px solid #ebebeb;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  transition: transform 0.2s;
}
.post-card:hover {
  transform: translateY(-2px);
}
.post-card-image img {
  width: 100%;
  height: 12rem;
  object-fit: cover;
}
.post-card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
}
.post-tag {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #888888;
  font-weight: 600;
}
.post-title {
  font-size: 1rem;
  margin: 0;
}
.post-title a {
  color: #171717;
  text-decoration: none;
}
.post-excerpt {
  font-size: 0.75rem;
  color: #888888;
  line-height: 1.5;
}
.post-card-meta {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #ebebeb;
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #888888;
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

  // 2. Generate default.hbs wrapper page
  files["default.hbs"] = `
<!DOCTYPE html>
<html lang="{{@site.locale}}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{meta_title}}</title>
  <link rel="stylesheet" type="text/css" href="{{asset "css/screen.css"}}" />
  {{ghost_head}}
</head>
<body class="{{body_class}}">
  <div class="viewport-wrapper">
    {{{body}}}
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

  // 4. Generate asset stylesheet screen.css
  files["assets/css/screen.css"] = minifyCss(getCompilerStyles());

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
