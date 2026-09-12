import { BuilderBlock } from "@/types/theme";
import { HeroSlide } from "./schema";

const getBackgroundCSS = (styles?: Record<string, unknown>): string => {
  const bgType = (styles?.backgroundType as string) || "solid";
  const defaultBg = "transparent";

  switch (bgType) {
    case "solid": {
      const bg = styles?.backgroundColor as string;
      if (!bg || bg === "#ffffff" || bg === "#fff") {
        return `background-color: var(--color-bg, #ffffff);`;
      }
      return `background-color: ${bg};`;
    }
    case "linear": {
      const c1 = (styles?.gradientColor1 as string) || "#000000";
      const c2 = (styles?.gradientColor2 as string) || "#333333";
      const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
      return `background-image: linear-gradient(${angle}deg, ${c1}, ${c2});`;
    }
    case "radial": {
      const c1 = (styles?.gradientColor1 as string) || "#000000";
      const c2 = (styles?.gradientColor2 as string) || "#333333";
      const pos = (styles?.gradientPosition as string) || "center";
      return `background-image: radial-gradient(circle at ${pos}, ${c1}, ${c2});`;
    }
    case "mesh": {
      const m1 = (styles?.meshColor1 as string) || "#ff0080";
      const m2 = (styles?.meshColor2 as string) || "#7928ca";
      const m3 = (styles?.meshColor3 as string) || "#0070f3";
      return `
    background-color: ${defaultBg};
    background-image: 
      radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
      radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
      radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%);
      `;
    }
    case "pattern": {
      const pType = (styles?.patternType as string) || "dots";
      const pColor = (styles?.patternColor as string) || "#000000";
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
      const url = (styles?.bgImageUrl as string) || "";
      const overlayColor = (styles?.bgOverlayColor as string) || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? (styles.bgOverlayOpacity as number) : 0.5;

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

export const compileToHbs = (block: BuilderBlock): string => {
  const p = block.props || {};
  const isCarousel = !!p.enableCarousel;
  const useSiteData = p.useSiteData ?? false;
  const useCoverImageAsBackground = p.useCoverImageAsBackground ?? true;
  const showCover = useSiteData && useCoverImageAsBackground;
  const textColor = (p.textColor as string) || "";
  const layout = (block.styles?.layout as string) || "center";

  const uid = `hero-${Math.random().toString(36).slice(2, 9)}`;

  const pt = (block.styles?.paddingTop as string) || "3rem";
  const pb = (block.styles?.paddingBottom as string) || "5rem";
  const bgCSS = getBackgroundCSS(block.styles as Record<string, unknown>);

  let r = 0, g = 0, b = 0;
  const overlayColor = (block.styles?.bgOverlayColor as string) || "#000000";
  if (overlayColor.length === 7) {
    r = parseInt(overlayColor.slice(1, 3), 16);
    g = parseInt(overlayColor.slice(3, 5), 16);
    b = parseInt(overlayColor.slice(5, 7), 16);
  }
  const overlayOpacity = block.styles?.bgOverlayOpacity !== undefined ? (block.styles.bgOverlayOpacity as number) : 0.6;
  const overlay = `rgba(${r}, ${g}, ${b}, ${overlayOpacity})`;

  let blockTextAlign = "center";
  let contentFlexDirectionDesktop = "column";
  const contentFlexDirectionMobile = "column";
  let contentAlignItems = "center";
  let textContainerAlignItems = "center";
  let actionsJustifyContent = "center";
  let contentMaxWidth = "800px";
  let blockDisplay = "block";
  const blockFlexDirection = "column";
  let blockJustifyContent = "flex-start";

  switch (layout) {
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

  // Common styles shared across carousel and standard hero
  const commonStyles = `
<style>
  #${uid}.hero-block {
    ${showCover ? 'background-color: #111111; background-size: cover; background-position: center;' : bgCSS}
    position: relative;
    overflow: hidden;
    text-align: ${blockTextAlign};
    padding: ${pt} 0 ${pb} 0;
    ${blockDisplay === 'flex' ? `display: flex; flex-direction: ${blockFlexDirection}; justify-content: ${blockJustifyContent};` : ''}
    ${textColor ? `color: ${textColor};` : (showCover ? 'color: #ffffff;' : '')}
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
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-height: 600px;
    object-fit: cover;
  }
  #${uid} .hero-eyebrow {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background-color: ${(showCover || textColor) ? 'rgba(255, 255, 255, 0.15)' : 'rgba(59, 130, 246, 0.15)'};
    color: ${textColor ? textColor : (showCover ? '#ffffff' : '#3b82f6')};
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
    background-color: ${p.buttonBgColor || '#171717'};
    color: ${p.buttonTextColor || '#ffffff'};
    border: 1px solid transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  #${uid} .hero-btn-primary:hover {
    opacity: 0.9;
  }
  #${uid} .hero-btn-secondary {
    background-color: transparent;
    color: inherit;
    border: 2px solid ${(showCover || textColor) ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
  }
  #${uid} .hero-btn-secondary:hover {
    border-color: ${(showCover || textColor) ? (textColor || '#ffffff') : '#171717'};
    ${!(showCover || textColor) ? 'color: #171717;' : ''}
  }
  html.dark #${uid}.hero-block {
    ${!showCover && (!block.styles?.backgroundType || block.styles?.backgroundType === 'solid') && (!block.styles?.backgroundColor || block.styles?.backgroundColor === '#ffffff' || block.styles?.backgroundColor === '#fff') ? 'background-color: var(--color-bg, #111111);' : ''}
    ${!textColor && !showCover ? 'color: var(--color-fg, #ffffff);' : ''}
  }
  html.dark #${uid} .hero-btn-primary {
    background-color: ${p.buttonBgColor && p.buttonBgColor !== '#171717' ? p.buttonBgColor : '#ffffff'};
    color: ${p.buttonTextColor && p.buttonTextColor !== '#ffffff' ? p.buttonTextColor : '#000000'};
  }
  html.dark #${uid} .hero-btn-secondary {
    border-color: rgba(255,255,255,0.2);
  }
  html.dark #${uid} .hero-btn-secondary:hover {
    border-color: #ffffff;
    color: #ffffff;
  }
  html.dark #${uid} .hero-eyebrow {
    background-color: ${(showCover || textColor) ? 'rgba(255, 255, 255, 0.15)' : 'rgba(59, 130, 246, 0.25)'};
    color: ${textColor ? textColor : (showCover ? '#ffffff' : '#60a5fa')};
  }

  /* Carousel specific styles */
  #${uid} .carousel-slide {
    display: none;
    width: 100%;
    animation: ${p.transitionEffect === 'fade' ? 'heroFade 0.5s ease-in-out' : 'heroSlide 0.4s ease-out'};
  }
  #${uid} .carousel-slide.active {
    display: block;
  }
  @keyframes heroFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes heroSlide {
    from { opacity: 0; transform: translateX(16px); }
    to { opacity: 1; transform: translateX(0); }
  }
  #${uid} .carousel-btn-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 0.85);
    color: #171717;
    border: 1px solid rgba(0,0,0,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }
  #${uid} .carousel-btn-nav:hover {
    background-color: #ffffff;
    transform: translateY(-50%) scale(1.05);
  }
  #${uid} .carousel-prev { left: 1rem; }
  #${uid} .carousel-next { right: 1rem; }
  #${uid} .carousel-dots {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 2rem;
    position: relative;
    z-index: 20;
  }
  #${uid} .carousel-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 9999px;
    background-color: rgba(0,0,0,0.2);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  #${uid} .carousel-dot.active {
    width: 1.75rem;
    background-color: #171717;
  }
  html.dark #${uid} .carousel-btn-nav {
    background-color: rgba(30, 30, 30, 0.85);
    color: #ffffff;
    border-color: rgba(255,255,255,0.1);
  }
  html.dark #${uid} .carousel-btn-nav:hover {
    background-color: #262626;
  }
  html.dark #${uid} .carousel-dot {
    background-color: rgba(255,255,255,0.3);
  }
  html.dark #${uid} .carousel-dot.active {
    background-color: #ffffff;
  }
</style>`;

  // If CAROUSEL is enabled
  if (isCarousel) {
    const isDynamic = p.carouselMode === "dynamic";
    const dynamicTag = p.dynamicTag || "hero-carousel";
    const showArrows = p.showArrows ?? true;
    const showDots = p.showDots ?? true;
    const autoplay = p.autoplay ?? true;
    const autoplayInterval = p.autoplayInterval || 5000;

    let slidesHtml = "";

    if (isDynamic) {
      slidesHtml = `
  {{#get "posts" filter="tag:${dynamicTag}" limit="10" as |heroPosts|}}
    {{#foreach heroPosts}}
    <div class="carousel-slide{{#if @first}} active{{/if}}">
      <div class="hero-content">
        <div class="hero-text-container">
          <span class="hero-eyebrow">{{primary_tag.name}}</span>
          <h1 class="hero-title heading">{{title}}</h1>
          <p class="hero-subtitle text-content">{{excerpt}}</p>
          <div class="hero-actions">
            <a href="{{url}}" class="hero-btn hero-btn-primary">${p.buttonLabel || "Read Article"}</a>
            ${(p.showSecondaryButton ?? true) ? `<a href="${p.secondaryButtonUrl || "#"}" class="hero-btn hero-btn-secondary">${p.secondaryButtonLabel || "Documentation"}</a>` : ''}
          </div>
        </div>
        ${layout.startsWith('split') ? `
        {{#if feature_image}}
        <div class="hero-image-container">
          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" />
        </div>
        {{/if}}
        ` : ''}
      </div>
    </div>
    {{/foreach}}
  {{/get}}`;
    } else {
      const slides: HeroSlide[] = (p.slides && p.slides.length > 0) ? p.slides : [
        {
          id: "slide-1",
          eyebrowText: "Featured",
          title: "Discover Verve Edition",
          subtitle: "Experience modern publishing with fluid visual storytelling.",
          buttonLabel: "Explore Now",
          buttonUrl: "#",
          imageUrl: "",
          imageAlt: "Slide 1 Image",
        }
      ];

      slidesHtml = slides.map((slide, idx) => `
    <div class="carousel-slide${idx === 0 ? ' active' : ''}">
      <div class="hero-content">
        <div class="hero-text-container">
          ${slide.eyebrowText ? `<span class="hero-eyebrow">${slide.eyebrowText}</span>` : ''}
          <h1 class="hero-title heading">${slide.title}</h1>
          <p class="hero-subtitle text-content">${slide.subtitle}</p>
          <div class="hero-actions">
            <a href="${slide.buttonUrl || '#'}" class="hero-btn hero-btn-primary">${slide.buttonLabel || p.buttonLabel || "Learn More"}</a>
            ${(p.showSecondaryButton ?? true) ? `<a href="${p.secondaryButtonUrl || "#"}" class="hero-btn hero-btn-secondary">${p.secondaryButtonLabel || "Documentation"}</a>` : ''}
          </div>
        </div>
        ${layout.startsWith('split') && slide.imageUrl ? `
        <div class="hero-image-container">
          <img src="${slide.imageUrl}" alt="${slide.imageAlt || slide.title}" />
        </div>
        ` : ''}
      </div>
    </div>`).join('\n');
    }

    const scriptHtml = `
<script>
  (function() {
    const root = document.getElementById('${uid}');
    if (!root) return;
    const slides = root.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;

    let currentIndex = 0;
    let timer = null;

    function showSlide(index) {
      slides.forEach(function(s, i) {
        s.classList.toggle('active', i === index);
      });
      const dots = root.querySelectorAll('.carousel-dot');
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    const prevBtn = root.querySelector('.carousel-prev');
    const nextBtn = root.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        const next = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(next);
        resetTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        const next = (currentIndex + 1) % slides.length;
        showSlide(next);
        resetTimer();
      });
    }

    const dots = root.querySelectorAll('.carousel-dot');
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        const idx = parseInt(dot.getAttribute('data-index') || '0', 10);
        showSlide(idx);
        resetTimer();
      });
    });

    function resetTimer() {
      if (timer) clearInterval(timer);
      ${autoplay ? `timer = setInterval(function() {
        showSlide((currentIndex + 1) % slides.length);
      }, ${autoplayInterval});` : ''}
    }

    ${autoplay ? `resetTimer();` : ''}
  })();
</script>`;

    const arrowsHtml = showArrows ? `
  <button type="button" class="carousel-btn-nav carousel-prev" aria-label="Previous slide">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
  </button>
  <button type="button" class="carousel-btn-nav carousel-next" aria-label="Next slide">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
  </button>` : '';

    const dotsHtml = showDots ? `
  <div class="carousel-dots">
    ${!isDynamic && ((p.slides as HeroSlide[] | undefined) || []).map((_: HeroSlide, idx: number) => `
      <button type="button" class="carousel-dot${idx === 0 ? ' active' : ''}" data-index="${idx}" aria-label="Slide ${idx + 1}"></button>
    `).join('')}
  </div>` : '';

    return `
${commonStyles}
<div id="${uid}" class="hero-block ${!showCover && block.styles?.backgroundType === "mesh" ? 'mesh-glow' : ''}">
  ${slidesHtml}
  ${arrowsHtml}
  ${dotsHtml}
</div>
${scriptHtml}`;
  }

  // STANDARD NON-CAROUSEL HERO
  const eyebrowHtml = p.eyebrowText
    ? `<span class="hero-eyebrow">${p.eyebrowText}</span>`
    : "";

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

  return `
${commonStyles}
<div id="${uid}" class="hero-block ${!showCover && block.styles?.backgroundType === "mesh" ? 'mesh-glow' : ''}" ${showCover ? `{{#if @site.cover_image}}style="background-image: linear-gradient(${overlay}, ${overlay}), url({{@site.cover_image}});"{{/if}}` : ''}>
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
    ${layout.startsWith('split') ? (
      useSiteData ? `
    {{#if @site.cover_image}}
    <div class="hero-image-container">
      <img src="{{@site.cover_image}}" alt="{{@site.title}}" />
    </div>
    {{/if}}
      ` : (imageUrl ? `
    <div class="hero-image-container">
      <img src="${imageUrl}" alt="${imageAlt}" />
    </div>
      ` : '')
    ) : ''}
  </div>
</div>`;
};