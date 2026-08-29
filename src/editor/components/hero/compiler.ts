import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const p = block.props || {};
  const useSiteData = p.useSiteData ?? false;
  const eyebrowText = p.eyebrowText || "";
  const title = useSiteData ? "{{@site.title}}" : (p.title || "Build beautiful templates.");
  const subtitle = useSiteData ? "{{@site.description}}" : (p.subtitle || "A visual workspace built directly on layout AST compilation logic.");
  const buttonLabel = p.buttonLabel || "Start Free";
  const buttonUrl = p.buttonUrl || "#";
  const buttonBgColor = p.buttonBgColor;
  const buttonTextColor = p.buttonTextColor;
  const showSecondaryButton = p.showSecondaryButton ?? true;
  const secondaryButtonLabel = p.secondaryButtonLabel || "Documentation";
  const secondaryButtonUrl = p.secondaryButtonUrl || "#";

  // FIX: the eyebrow badge used to be `subtitle ? "Introducing Builder V2" :
  // "Introducing"` — text with no relationship to whether a subtitle exists,
  // and referencing the internal page-builder tool by name. It's now a
  // normal editable field, and simply omitted if left blank.
  const eyebrowHtml = eyebrowText
    ? `<span class="hero-eyebrow">${eyebrowText}</span>`
    : "";

  // FIX: both buttons previously hardcoded href="#" with no way to set a
  // real destination anywhere in the schema. Both now use the URL fields
  // added to schema.ts/sidebar.tsx.
  const secondaryButtonHtml = showSecondaryButton
    ? `<a href="${secondaryButtonUrl}" class="btn btn-secondary">${secondaryButtonLabel}</a>`
    : "";

  // FIX: the shipped screen.css has `.hero-block{ .hero-content{...}
  // .hero-eyebrow{...} .hero-title{...} .hero-subtitle{...}
  // .hero-actions{...} }` — nested CSS that was minified without being run
  // through a Sass/PostCSS build step first, so those selectors only work
  // as valid CSS in browsers with native CSS Nesting support. Rather than
  // depend on that stylesheet at all, this component now ships its own
  // scoped, flat, already-responsive <style> block, keyed to a unique id so
  // it can't collide with other hero blocks on the same page.
  const uid = `hero-${Math.random().toString(36).slice(2, 9)}`;

  const pt = block.styles?.paddingTop || '3rem';
  const pb = block.styles?.paddingBottom || '5rem';

  return `
<style>
  #${uid}.hero-block {
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: ${pt} 0 ${pb} 0;
  }
  #${uid} .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1.5rem;
    position: relative;
    z-index: 10;
  }
  #${uid} .hero-eyebrow {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }
  #${uid} .hero-title {
    font-size: 2.75rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: inherit;
  }
  @media (min-width: 768px) {
    #${uid} .hero-title {
      font-size: 3.5rem;
    }
  }
  #${uid} .hero-subtitle {
    font-size: 1.125rem;
    color: inherit;
    opacity: 0.8;
    margin: 0;
    max-width: 600px;
    line-height: 1.625;
  }
  @media (min-width: 768px) {
    #${uid} .hero-subtitle {
      font-size: 1.25rem;
    }
  }
  #${uid} .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }
  #${uid} .hero-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.875rem 2rem;
    border-radius: 9999px;
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  #${uid} .hero-btn-primary {
    background-color: ${buttonBgColor || '#171717'};
    color: ${buttonTextColor || '#ffffff'};
    border: 1px solid transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  #${uid} .hero-btn-primary:hover {
    opacity: 0.9;
  }
  #${uid} .hero-btn-secondary {
    background-color: transparent;
    color: inherit;
    border: 2px solid ${useSiteData ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
  }
  #${uid} .hero-btn-secondary:hover {
    border-color: ${useSiteData ? '#ffffff' : '#171717'};
    ${!useSiteData ? 'color: #171717;' : ''}
  }
  html.dark #${uid} .hero-btn-secondary {
    border-color: rgba(255,255,255,0.2);
  }
  html.dark #${uid} .hero-btn-secondary:hover {
    border-color: #ffffff;
    color: #ffffff;
  }
</style>
<div id="${uid}" class="hero-block ${!useSiteData ? 'mesh-glow' : ''}" ${useSiteData ? `{{#if @site.cover_image}}style="background-color: #111111; color: #ffffff; background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url({{@site.cover_image}}); background-size: cover; background-position: center;"{{/if}}` : ''}>
  <div class="hero-content">
    ${eyebrowHtml}
    <h1 class="hero-title heading">${title}</h1>
    <p class="hero-subtitle text-content">${subtitle}</p>
    <div class="hero-actions">
      <a href="${buttonUrl}" class="hero-btn hero-btn-primary" ${buttonBgColor || buttonTextColor ? `style="${buttonBgColor ? `background-color: ${buttonBgColor}; border-color: ${buttonBgColor};` : ''} ${buttonTextColor ? `color: ${buttonTextColor};` : ''}"` : ''}>${buttonLabel}</a>
      ${showSecondaryButton ? `<a href="${secondaryButtonUrl}" class="hero-btn hero-btn-secondary">${secondaryButtonLabel}</a>` : ''}
    </div>
  </div>
</div>`;
};