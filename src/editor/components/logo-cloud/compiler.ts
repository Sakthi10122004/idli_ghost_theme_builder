import { BuilderBlock } from "@/types/theme";
import { LogoCloudProps, defaultProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";
import { LOGO_CLOUD_MAX_WIDTH } from "./constants";

export const generateHTML = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as LogoCloudProps;
  const general = p.general;
  const logos = p.logos || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};
  
  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = p.advanced?.htmlAnchor || `logo-cloud-${block.id}`;
  
  const grayscaleClass = general.grayscale ? "grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100" : "transition-all duration-300 opacity-80 hover:opacity-100";

  const renderLogo = (logo: any) => {
    let src = logo.imageUrl;
    if (src && src.startsWith("asset://")) {
      const path = src.replace("asset://", "");
      src = `{{asset "${path}"}}`;
    }

    const inner = logo.linkUrl
      ? `<a href="${logo.linkUrl}" target="_blank" rel="noopener noreferrer" class="logo-cloud-link"><img src="${src}" alt="${logo.name}" class="logo-cloud-img" /></a>`
      : `<img src="${src}" alt="${logo.name}" class="logo-cloud-img" />`;
    return `<div class="logo-cloud-item ${grayscaleClass}">${inner}</div>`;
  };

  let contentHtml = "";

  if (general.dataSource === "dynamic") {
    const limit = general.dynamicLimit || 10;
    const tag = general.dynamicTag || "hash-partner-logo";
    
    const ghostLoop = `
      {{#foreach posts}}
        <div class="logo-cloud-item ${grayscaleClass}">
          {{#if custom_excerpt}}
            <a href="{{custom_excerpt}}" target="_blank" rel="noopener noreferrer" class="logo-cloud-link"><img src="{{feature_image}}" alt="{{title}}" class="logo-cloud-img" /></a>
          {{else}}
            <img src="{{feature_image}}" alt="{{title}}" class="logo-cloud-img" />
          {{/if}}
        </div>
      {{/foreach}}
    `;

    if (general.layoutStyle === "marquee") {
      contentHtml = `
        <div class="logo-cloud-marquee-wrapper mask-edges">
          <div class="logo-cloud-marquee animate-marquee">
            {{#get "posts" filter="tag:${tag}" limit="${limit}"}}
              ${ghostLoop}
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
        {{#get "posts" filter="tag:${tag}" limit="${limit}"}}
          <div class="logo-cloud-row">
            ${ghostLoop}
          </div>
        {{/get}}
      `;
    }
  } else {
    // Static layout rendering
    if (general.layoutStyle === "marquee") {
      // Duplicate logos to enable infinite scroll without gap
      const marqueeLogos = [...logos, ...logos, ...logos].map(renderLogo).join("");
      contentHtml = `
        <div class="logo-cloud-marquee-wrapper mask-edges">
          <div class="logo-cloud-marquee animate-marquee">
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
        <div class="logo-cloud-row">
          ${logos.map(renderLogo).join("")}
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
    color: var(--color-fg);
    margin: 0;
  }
  #${wrapperId} .logo-cloud-subheading {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-mute);
  }
  #${wrapperId} .logo-cloud-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  #${wrapperId} .logo-cloud-link {
    display: block;
    width: 100%;
    height: 100%;
    max-height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #${wrapperId} .logo-cloud-img {
    max-width: 100%;
    max-height: 4rem;
    object-fit: contain;
  }
  #${wrapperId} .logo-cloud-grid {
    display: grid;
    align-items: center;
    gap: 2.5rem 2rem;
    max-width: 32rem;
    margin: 0 auto;
  }
  #${wrapperId} .logo-cloud-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 2.5rem 3rem;
  }
  #${wrapperId} .logo-cloud-row .logo-cloud-item {
    width: 8rem;
    flex-shrink: 0;
  }
  @media (min-width: 768px) {
    #${wrapperId} .logo-cloud-grid {
      max-width: none;
    }
    #${wrapperId} .logo-cloud-row .logo-cloud-item {
      width: 10rem;
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
    padding: 1rem 0;
  }
  #${wrapperId} .mask-edges {
    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  }
  #${wrapperId} .logo-cloud-marquee {
    display: flex;
    width: max-content;
    gap: 4rem;
    align-items: center;
  }
  #${wrapperId} .logo-cloud-marquee .logo-cloud-item {
    flex-shrink: 0;
    width: 8rem;
  }
  @media (min-width: 768px) {
    #${wrapperId} .logo-cloud-marquee .logo-cloud-item { width: 10rem; }
  }
  @keyframes marquee-${block.id} {
    0% { transform: translateX(0); }
    100% { transform: translateX(-33.33%); }
  }
  #${wrapperId} .animate-marquee {
    animation: marquee-${block.id} 20s linear infinite;
  }
  #${wrapperId} .animate-marquee:hover {
    animation-play-state: paused;
  }
</style>
<div id="${wrapperId}" class="logo-cloud-section ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}">
  <div class="logo-cloud-inner">
    ${headingHtml}
    ${contentHtml}
  </div>
</div>`;
};

export const compileToHbs = generateHTML;
