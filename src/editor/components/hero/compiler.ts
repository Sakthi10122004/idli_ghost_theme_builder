import { BuilderBlock } from "@/types/theme";

const getBackgroundCSS = (styles: any): string => {
  const bgType = styles?.backgroundType || "solid";
  const defaultBg = "transparent";

  switch (bgType) {
    case "solid":
      return `background-color: ${styles?.backgroundColor || defaultBg};`;
    case "linear": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
      return `background-image: linear-gradient(${angle}deg, ${c1}, ${c2});`;
    }
    case "radial": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const pos = styles?.gradientPosition || "center";
      return `background-image: radial-gradient(circle at ${pos}, ${c1}, ${c2});`;
    }
    case "mesh": {
      const m1 = styles?.meshColor1 || "#ff0080";
      const m2 = styles?.meshColor2 || "#7928ca";
      const m3 = styles?.meshColor3 || "#0070f3";
      return `
    background-color: ${defaultBg};
    background-image: 
      radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
      radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
      radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%);
      `;
    }
    case "pattern": {
      const pType = styles?.patternType || "dots";
      const pColor = styles?.patternColor || "#000000";
      if (pType === "dots") {
        return `
    background-color: ${defaultBg};
    background-image: radial-gradient(${pColor} 1px, transparent 1px);
    background-size: 20px 20px;
        `;
      } else if (pType === "lines") {
        return `
    background-color: ${defaultBg};
    background-image: repeating-linear-gradient(45deg, ${pColor}20 0, ${pColor}20 1px, transparent 1px, transparent 10px);
        `;
      } else if (pType === "noise") {
        return `
    background-color: ${pColor};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E");
        `;
      }
      return `background-color: ${defaultBg};`;
    }
    case "image": {
      const url = styles?.bgImageUrl || "";
      const overlayColor = styles?.bgOverlayColor || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
      
      let r = 0, g = 0, b = 0;
      if (overlayColor.length === 7) {
        r = parseInt(overlayColor.slice(1, 3), 16);
        g = parseInt(overlayColor.slice(3, 5), 16);
        b = parseInt(overlayColor.slice(5, 7), 16);
      }
      
      const overlay = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      return `
    background-color: ${defaultBg};
    background-image: linear-gradient(${overlay}, ${overlay})${url ? `, url('${url}')` : ""};
    background-size: cover;
    background-position: center;
      `;
    }
    default:
      return `background-color: ${defaultBg};`;
  }
};

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
  const imageUrl = p.imageUrl || "";
  const imageAlt = p.imageAlt || "Hero Image";
  const layout = block.styles?.layout || "center";

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
  const bgCSS = getBackgroundCSS(block.styles);

  let blockTextAlign = "center";
  let contentFlexDirectionDesktop = "column";
  let contentFlexDirectionMobile = "column";
  let contentAlignItems = "center";
  let textContainerAlignItems = "center";
  let actionsJustifyContent = "center";
  let contentMaxWidth = "800px";
  let blockDisplay = "block";
  let blockFlexDirection = "column";
  let blockJustifyContent = "flex-start";
  
  switch(layout) {
    case "left":
      blockTextAlign = "left";
      contentAlignItems = "flex-start";
      textContainerAlignItems = "flex-start";
      actionsJustifyContent = "flex-start";
      break;
    case "bottom":
      blockTextAlign = "center";
      blockDisplay = "flex";
      blockJustifyContent = "flex-end";
      break;
    case "split-left":
      blockTextAlign = "left";
      contentFlexDirectionDesktop = "row";
      contentAlignItems = "center";
      textContainerAlignItems = "flex-start";
      actionsJustifyContent = "flex-start";
      contentMaxWidth = "1200px";
      break;
    case "split-right":
      blockTextAlign = "left";
      contentFlexDirectionDesktop = "row-reverse";
      contentAlignItems = "center";
      textContainerAlignItems = "flex-start";
      actionsJustifyContent = "flex-start";
      contentMaxWidth = "1200px";
      break;
    case "center":
    default:
      break;
  }

  return `
<style>
  #${uid}.hero-block {
    ${!useSiteData ? bgCSS : ''}
    position: relative;
    overflow: hidden;
    text-align: ${blockTextAlign};
    padding: ${pt} 0 ${pb} 0;
    ${blockDisplay === 'flex' ? `display: flex; flex-direction: ${blockFlexDirection}; justify-content: ${blockJustifyContent};` : ''}
  }
  #${uid} .hero-content {
    display: flex;
    flex-direction: ${contentFlexDirectionMobile};
    align-items: ${contentAlignItems};
    justify-content: center;
    gap: 2.5rem;
    max-width: ${contentMaxWidth};
    margin: 0 auto;
    padding: 0 1.5rem;
    position: relative;
    z-index: 10;
    width: 100%;
  }
  @media (min-width: 768px) {
    #${uid} .hero-content {
      flex-direction: ${contentFlexDirectionDesktop};
    }
  }
  #${uid} .hero-text-container {
    display: flex;
    flex-direction: column;
    align-items: ${textContainerAlignItems};
    gap: 1.25rem;
    ${layout.startsWith('split') ? 'width: 100%; flex: 1;' : ''}
  }
  @media (min-width: 768px) {
    #${uid} .hero-text-container {
      ${layout.startsWith('split') ? 'width: 50%;' : ''}
    }
  }
  #${uid} .hero-image-container {
    width: 100%;
    display: flex;
    justify-content: center;
    flex: 1;
  }
  @media (min-width: 768px) {
    #${uid} .hero-image-container {
      width: 50%;
    }
  }
  #${uid} .hero-image-container img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-height: 600px;
    object-fit: cover;
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
    justify-content: ${actionsJustifyContent};
    margin-top: 1.5rem;
    width: 100%;
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
<div id="${uid}" class="hero-block ${!useSiteData && block.styles?.backgroundType === "mesh" ? 'mesh-glow' : ''}" ${useSiteData ? `{{#if @site.cover_image}}style="background-color: #111111; color: #ffffff; background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url({{@site.cover_image}}); background-size: cover; background-position: center;"{{else}}style="background-color: #111111; color: #ffffff;"{{/if}}` : ''}>
  <div class="hero-content">
    <div class="hero-text-container">
      ${eyebrowHtml}
      <h1 class="hero-title heading">${title}</h1>
      <p class="hero-subtitle text-content">${subtitle}</p>
      <div class="hero-actions">
        <a href="${buttonUrl}" class="hero-btn hero-btn-primary" ${buttonBgColor || buttonTextColor ? `style="${buttonBgColor ? `background-color: ${buttonBgColor}; border-color: ${buttonBgColor};` : ''} ${buttonTextColor ? `color: ${buttonTextColor};` : ''}"` : ''}>${buttonLabel}</a>
        ${showSecondaryButton ? `<a href="${secondaryButtonUrl}" class="hero-btn hero-btn-secondary">${secondaryButtonLabel}</a>` : ''}
      </div>
    </div>
    ${layout.startsWith('split') && imageUrl ? `
    <div class="hero-image-container">
      <img src="${imageUrl}" alt="${imageAlt}" />
    </div>
    ` : ''}
  </div>
</div>`;
};