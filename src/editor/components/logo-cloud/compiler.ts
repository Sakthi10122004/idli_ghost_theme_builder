import { BuilderBlock } from "@/types/theme";
import { LogoCloudProps, resolveLogoCloudProps, GENERIC_SVG_PLACEHOLDER } from "./schema";
import { getBackgroundCSS } from "../shared/background";
import { LOGO_CLOUD_MAX_WIDTH } from "./constants";

export const generateHTML = (block: BuilderBlock): string => {
  const p: LogoCloudProps = resolveLogoCloudProps(block.props);
  const general = p.general;
  const logos = p.logos || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};
  
  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = p.advanced?.htmlAnchor || `logo-cloud-${block.id}`;
  
  const grayscaleClass = general.grayscale 
    ? "grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100" 
    : "transition-all duration-300 opacity-80 hover:opacity-100";

  const renderLogo = (logo: { id: string; name: string; imageUrl?: string; linkUrl?: string }) => {
    let src = logo.imageUrl?.trim();
    if (src && src.startsWith("asset://")) {
      const path = src.replace("asset://", "");
      src = `{{asset "${path}"}}`;
    }
    const finalSrc = src || GENERIC_SVG_PLACEHOLDER;

    const inner = logo.linkUrl
      ? `<a href="${logo.linkUrl}" target="_blank" rel="noopener noreferrer" class="logo-cloud-link"><img src="${finalSrc}" alt="${logo.name || 'Logo'}" class="logo-cloud-img" /></a>`
      : `<img src="${finalSrc}" alt="${logo.name || 'Logo'}" class="logo-cloud-img" />`;
    return `<div class="logo-cloud-item ${grayscaleClass}">${inner}</div>`;
  };

  let contentHtml = "";

  if (general.dataSource === "dynamic") {
    const limit = general.dynamicLimit === "all" ? 100 : (general.dynamicLimit || 10);
    const tag = general.dynamicTag || "hash-partner-logo";
    
    const ghostLoop = `
      {{#foreach posts}}
        {{#if feature_image}}
          <div class="logo-cloud-item ${grayscaleClass}">
            {{#if custom_excerpt}}
              <a href="{{custom_excerpt}}" target="_blank" rel="noopener noreferrer" class="logo-cloud-link"><img src="{{feature_image}}" alt="{{title}}" class="logo-cloud-img" /></a>
            {{else}}
              <img src="{{feature_image}}" alt="{{title}}" class="logo-cloud-img" />
            {{/if}}
          </div>
        {{/if}}
      {{/foreach}}
    `;

    if (general.layoutStyle === "marquee") {
      contentHtml = `
        <div class="logo-cloud-marquee-wrapper mask-edges">
          <div class="logo-cloud-marquee-track">
            {{#get "posts" filter="tag:${tag}" limit="${limit}"}}
              ${ghostLoop}
              ${ghostLoop}
            {{/get}}
          </div>
        </div>
      `;
    } else if (general.layoutStyle === "grid") {
      contentHtml = `
        {{#get "posts" filter="tag:${tag}" limit="${limit}"}}
          <div class="logo-cloud-grid" style="--logo-cloud-cols: ${general.columns}; grid-template-columns: repeat(var(--logo-cloud-cols), minmax(0, 1fr));">
            ${ghostLoop}
          </div>
        {{/get}}
      `;
    } else {
      contentHtml = `
        <div class="logo-cloud-row-wrapper">
          <div class="logo-cloud-row">
            {{#get "posts" filter="tag:${tag}" limit="${limit}"}}
              ${ghostLoop}
            {{/get}}
          </div>
        </div>
      `;
    }
  } else {
    // Static layout rendering
    if (general.layoutStyle === "marquee") {
      const baseList = logos.length > 0
        ? logos.length < 6
          ? [...logos, ...logos, ...logos]
          : logos
        : [];
      const marqueeLogos = [...baseList, ...baseList].map(renderLogo).join("");
      contentHtml = `
        <div class="logo-cloud-marquee-wrapper mask-edges">
          <div class="logo-cloud-marquee-track">
            ${marqueeLogos}
          </div>
        </div>
      `;
    } else if (general.layoutStyle === "grid") {
      contentHtml = `
        <div class="logo-cloud-grid" style="--logo-cloud-cols: ${general.columns}; grid-template-columns: repeat(var(--logo-cloud-cols), minmax(0, 1fr));">
          ${logos.map(renderLogo).join("")}
        </div>
      `;
    } else {
      // row layout
      contentHtml = `
        <div class="logo-cloud-row-wrapper">
          <div class="logo-cloud-row">
            ${logos.map(renderLogo).join("")}
          </div>
        </div>
      `;
    }
  }

  const headingHtml = (general.heading || general.subheading) ? `
    <div class="logo-cloud-header">
      ${general.heading ? `<h2 class="logo-cloud-heading">${general.heading}</h2>` : ''}
      ${general.subheading ? `<p class="logo-cloud-subheading">${general.subheading}</p>` : ''}
    </div>
  ` : '';

  return `<style>
  #${wrapperId} {
    ${bgCss}
    padding-top: ${spacing.paddingTop || '4rem'};
    padding-bottom: ${spacing.paddingBottom || '4rem'};
    position: relative;
    width: 100%;
  }
  #${wrapperId} .logo-cloud-inner {
    max-width: ${LOGO_CLOUD_MAX_WIDTH};
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  #${wrapperId} .logo-cloud-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  #${wrapperId} .logo-cloud-heading {
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.5;
    color: var(--color-fg, #171717);
    margin: 0;
  }
  #${wrapperId} .logo-cloud-subheading {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-muted, var(--color-mute, #888888));
  }
  #${wrapperId} .logo-cloud-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1rem;
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  #${wrapperId} .logo-cloud-link {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #${wrapperId} .logo-cloud-img {
    height: 2rem;
    max-height: 2.25rem;
    width: auto;
    max-width: 10rem;
    object-fit: contain;
    transition: all 0.3s ease;
  }
  #${wrapperId} .logo-cloud-grid {
    display: grid;
    align-items: center;
    justify-items: center;
    gap: 2.5rem 2rem;
    max-width: 32rem;
    margin: 0 auto;
  }
  @media (min-width: 768px) {
    #${wrapperId} .logo-cloud-grid {
      max-width: none;
    }
  }

  /* Row layout */
  #${wrapperId} .logo-cloud-row-wrapper {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0.5rem 0;
  }
  #${wrapperId} .logo-cloud-row-wrapper::-webkit-scrollbar {
    display: none;
  }
  #${wrapperId} .logo-cloud-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    gap: 2.5rem;
    min-width: max-content;
    margin: 0 auto;
  }
  @media (min-width: 768px) {
    #${wrapperId} .logo-cloud-row {
      gap: 3.5rem;
    }
  }

  /* Marquee */
  #${wrapperId} .logo-cloud-marquee-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0.5rem 0;
  }
  #${wrapperId} .mask-edges {
    mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 1) 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 8%, rgba(0, 0, 0, 1) 92%, transparent 100%);
  }
  #${wrapperId} .logo-cloud-marquee-track {
    display: flex;
    width: max-content;
    align-items: center;
    gap: 3rem;
    padding-right: 3rem;
    animation: marquee-${block.id} 28s linear infinite;
  }
  #${wrapperId} .logo-cloud-marquee-track:hover {
    animation-play-state: paused;
  }
  @keyframes marquee-${block.id} {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  /* Dark mode overrides */
  html.dark #${wrapperId},
  html.dark-mode #${wrapperId} {
    background-color: var(--color-bg) !important;
  }
  html.dark #${wrapperId} .logo-cloud-heading,
  html.dark-mode #${wrapperId} .logo-cloud-heading {
    color: var(--color-fg) !important;
  }
  html.dark #${wrapperId} .logo-cloud-subheading,
  html.dark-mode #${wrapperId} .logo-cloud-subheading {
    color: var(--color-muted, var(--color-mute, #a3a3a3)) !important;
  }
  ${general.invertInDark !== false ? `
  html.dark #${wrapperId} .logo-cloud-item img,
  html.dark-mode #${wrapperId} .logo-cloud-item img {
    filter: invert(1) brightness(0.95);
  }
  html.dark #${wrapperId} .logo-cloud-item:hover img,
  html.dark-mode #${wrapperId} .logo-cloud-item:hover img {
    filter: invert(1) brightness(1);
  }
  ` : ''}
</style>
<div id="${wrapperId}" class="logo-cloud-section ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}">
  <div class="logo-cloud-inner">
    ${headingHtml}
    ${contentHtml}
  </div>
</div>`;
};

export const compileToHbs = generateHTML;
