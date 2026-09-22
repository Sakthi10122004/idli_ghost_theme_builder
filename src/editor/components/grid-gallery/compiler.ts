import { BuilderBlock } from "@/types/theme";
import {
  GridGalleryProps,
  GalleryItem,
  defaultProps,
  DEFAULT_GALLERY_ITEMS,
} from "./schema";
import { getBackgroundCSS } from "../shared/background";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as GridGalleryProps;
  const general = p.general || defaultProps.general;
  const appearance = p.appearance || defaultProps.appearance;
  const spacing = p.spacing || defaultProps.spacing;
  const styles = block.styles || {};

  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = p.advanced?.htmlAnchor || `gallery-${block.id}`;

  const layoutStyle = general.layoutStyle || "grid";
  const columns = general.columns || 3;
  const gapKey = general.gap || "md";
  const cornerStyle = general.cornerStyle || "rounded";
  const hoverEffect = general.hoverEffect || "zoom";
  const useDynamicData = general.useDynamicData ?? false;
  const dynamicTag = general.dynamicTag || "gallery";
  const autoScroll = general.autoScroll ?? false;

  const rawItems = p.items || (p.urls ? p.urls.map((url: string, i: number) => ({ id: String(i), url, caption: "", alt: "" })) : DEFAULT_GALLERY_ITEMS);
  const items: GalleryItem[] = Array.isArray(rawItems) ? rawItems : DEFAULT_GALLERY_ITEMS;

  const gapValueMap = { sm: "0.75rem", md: "1.25rem", lg: "2rem" };
  const gapCss = gapValueMap[gapKey] || "1.25rem";

  const borderRadiusCss = cornerStyle === "rectangle" ? "0px" : "0.75rem";

  const resolveHbsSrc = (src: string) => {
    if (src && src.startsWith("asset://")) {
      const path = src.replace("asset://", "");
      return `{{asset "${path}"}}`;
    }
    return src || "";
  };

  // Manual item: static image box with caption overlay
  const renderManualItem = (item: GalleryItem, extraClass = "gallery-item") => {
    const src = resolveHbsSrc(item.url);
    const altText = item.alt || item.caption || "Gallery Image";
    const captionHtml = item.caption
      ? `<div class="gallery-caption-overlay"><span class="gallery-caption-title">${item.caption}</span></div>`
      : "";

    return `
      <div class="${extraClass}">
        <div class="gallery-item-inner">
          <img src="${src}" alt="${altText}" loading="lazy" class="gallery-img" />
          ${captionHtml}
        </div>
      </div>
    `;
  };

  // Dynamic Ghost item loop: used inside {{#get}} blocks
  const ghostItemLoop = (itemClass = "gallery-item", linkWrap = true) => {
    const inner = linkWrap
      ? `<a href="{{url}}" class="gallery-item-inner gallery-item-link" title="{{title}}">
            <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" class="gallery-img" />
            <div class="gallery-caption-overlay">
              <span class="gallery-caption-title">{{title}}</span>
            </div>
          </a>`
      : `<div class="gallery-item-inner">
            <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" class="gallery-img" />
            <div class="gallery-caption-overlay">
              <span class="gallery-caption-title">{{title}}</span>
            </div>
          </div>`;

    return `
    {{#foreach posts}}
      {{#if feature_image}}
        <div class="${itemClass}">
          ${inner}
        </div>
      {{/if}}
    {{/foreach}}
    `;
  };

  const headingHtml =
    general.heading || general.subheading
      ? `
    <div class="gallery-header">
      ${general.heading ? `<h2 class="gallery-heading">${general.heading}</h2>` : ""}
      ${general.subheading ? `<p class="gallery-subheading">${general.subheading}</p>` : ""}
    </div>
  `
      : "";

  let contentMarkup = "";

  // ───────────────────────────── CAROUSEL ─────────────────────────────
  if (layoutStyle === "carousel") {
    if (autoScroll) {
      if (useDynamicData) {
        contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
        <div class="gallery-carousel-wrapper">
          <div class="gallery-carousel-track gallery-layout-carousel">
            ${ghostItemLoop("gallery-carousel-item")}
            ${ghostItemLoop("gallery-carousel-item")}
          </div>
        </div>
      {{/get}}`;
      } else {
        const baseList =
          items.length > 0 ? (items.length < 6 ? [...items, ...items, ...items] : items) : [];
        const doubled = [...baseList, ...baseList];
        contentMarkup = `
        <div class="gallery-carousel-wrapper">
          <div class="gallery-carousel-track gallery-layout-carousel">
            ${doubled.map((item) => renderManualItem(item, "gallery-carousel-item")).join("\n")}
          </div>
        </div>
      `;
      }
    } else {
      // Manual scroll
      if (useDynamicData) {
        contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
        <div class="gallery-carousel-manual${items.length <= 2 ? " gallery-carousel-center" : ""}">
          ${ghostItemLoop("gallery-carousel-item")}
        </div>
      {{/get}}`;
      } else {
        contentMarkup = `
        <div class="gallery-carousel-manual${items.length <= 2 ? " gallery-carousel-center" : ""}">
          ${items.map((item) => renderManualItem(item, "gallery-carousel-item")).join("\n")}
        </div>
      `;
      }
    }

  // ───────────────────────────── MASONRY ─────────────────────────────
  } else if (layoutStyle === "masonry") {
    if (autoScroll) {
      const col = (direction: "up" | "down") => {
        const loop = useDynamicData
          ? `${ghostItemLoop("gallery-masonry-autoscroll-card")}${ghostItemLoop("gallery-masonry-autoscroll-card")}`
          : `${items.map((item) => renderManualItem(item, "gallery-masonry-autoscroll-card")).join("\n")}
             ${items.map((item) => renderManualItem(item, "gallery-masonry-autoscroll-card")).join("\n")}`;
        return `
        <div class="masonry-autoscroll-column masonry-col-${direction}">
          <div class="masonry-autoscroll-track">
            ${loop}
          </div>
        </div>`;
      };

      if (useDynamicData) {
        contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
        <div class="gallery-masonry-autoscroll">
          ${col("up")}
          ${col("down")}
          ${col("up")}
        </div>
      {{/get}}`;
      } else {
        contentMarkup = `
        <div class="gallery-masonry-autoscroll">
          ${col("up")}
          ${col("down")}
          ${col("up")}
        </div>
      `;
      }
    } else {
      if (useDynamicData) {
        contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
        <div class="gallery-items gallery-layout-masonry">
          ${ghostItemLoop("gallery-item")}
        </div>
      {{/get}}`;
      } else {
        contentMarkup = `
        <div class="gallery-items gallery-layout-masonry">
          ${items.map((item) => renderManualItem(item)).join("\n")}
        </div>
      `;
      }
    }

  // ───────────────────────────── GRID ─────────────────────────────
  } else if (layoutStyle === "grid") {
    if (useDynamicData) {
      contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
      <div class="gallery-items gallery-layout-grid">
        ${ghostItemLoop("gallery-item")}
      </div>
    {{/get}}`;
    } else {
      contentMarkup = `
      <div class="gallery-items gallery-layout-grid">
        ${items.map((item) => renderManualItem(item)).join("\n")}
      </div>
    `;
    }

  // ───────────────────────────── LIST ─────────────────────────────
  } else if (layoutStyle === "list") {
    if (useDynamicData) {
      contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
      <div class="gallery-layout-list">
        {{#foreach posts}}
          {{#if feature_image}}
            <div class="gallery-list-item">
              <a href="{{url}}" class="gallery-list-thumb-link gallery-item-link" title="{{title}}">
                <div class="gallery-list-thumb">
                  <img src="{{img_url feature_image size="s"}}" alt="{{title}}" loading="lazy" class="gallery-img" />
                </div>
              </a>
              <div class="gallery-list-info">
                <span class="gallery-list-caption">{{title}}</span>
                <span class="gallery-list-cta">View Image &rarr;</span>
              </div>
            </div>
          {{/if}}
        {{/foreach}}
      </div>
    {{/get}}`;
    } else {
      const listItems = items.map((item) => {
        const src = resolveHbsSrc(item.url);
        const caption = item.caption || item.alt || "Gallery Image";
        const altText = item.alt || item.caption || "Gallery Image";
        return `
        <div class="gallery-list-item">
          <div class="gallery-list-thumb">
            <div class="gallery-item-inner">
              <img src="${src}" alt="${altText}" loading="lazy" class="gallery-img" />
            </div>
          </div>
          <div class="gallery-list-info">
            <span class="gallery-list-caption">${caption}</span>
            <span class="gallery-list-cta">View Image &rarr;</span>
          </div>
        </div>`;
      });
      contentMarkup = `
      <div class="gallery-layout-list">
        ${listItems.join("\n")}
      </div>
    `;
    }

  // ───────────────────────────── BENTO ─────────────────────────────
  } else if (layoutStyle === "bento") {
    if (useDynamicData) {
      contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
      <div class="gallery-layout-bento">
        {{#foreach posts}}
          {{#if feature_image}}
            <div class="gallery-bento-card">
              <a href="{{url}}" class="gallery-item-link gallery-bento-link" title="{{title}}">
                <div class="gallery-bento-image">
                  <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" class="gallery-img" />
                </div>
                <div class="gallery-bento-info">
                  <span class="gallery-bento-caption">{{title}}</span>
                  <span class="gallery-bento-cta">View Full Image &rarr;</span>
                </div>
              </a>
            </div>
          {{/if}}
        {{/foreach}}
      </div>
    {{/get}}`;
    } else {
      const bentoItems = items.map((item, idx) => {
        const src = resolveHbsSrc(item.url);
        const caption = item.caption || item.alt || "Gallery Image";
        const altText = item.alt || item.caption || "Gallery Image";
        const isLarge = idx % 3 === 0;
        return `
        <div class="gallery-bento-card${isLarge ? " gallery-bento-card-large" : ""}">
          <div class="gallery-item-inner gallery-bento-link">
            <div class="gallery-bento-image">
              <img src="${src}" alt="${altText}" loading="lazy" class="gallery-img" />
            </div>
            <div class="gallery-bento-info">
              <span class="gallery-bento-caption">${caption}</span>
              <span class="gallery-bento-cta">View Full Image &rarr;</span>
            </div>
          </div>
        </div>`;
      });
      contentMarkup = `
      <div class="gallery-layout-bento">
        ${bentoItems.join("\n")}
      </div>
    `;
    }

  // ───────────────────────────── COLLAGE ─────────────────────────────
  } else if (layoutStyle === "collage") {
    if (useDynamicData) {
      contentMarkup = `{{#get "posts" filter="tags:${dynamicTag}" limit="100"}}
      <div class="gallery-layout-collage">
        {{#foreach posts}}
          {{#if feature_image}}
            <div class="gallery-collage-item">
              <a href="{{url}}" class="gallery-collage-link" title="{{title}}">
                <div class="gallery-collage-image">
                  <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" class="gallery-img" />
                </div>
                <div class="gallery-collage-caption">
                  <span>{{title}}</span>
                </div>
              </a>
            </div>
          {{/if}}
        {{/foreach}}
      </div>
    {{/get}}`;
    } else {
      const collageItems = items.map((item, idx) => {
        const src = resolveHbsSrc(item.url);
        const caption = item.caption || item.alt || "";
        const altText = item.alt || item.caption || "Gallery Image";
        return `
        <div class="gallery-collage-item">
          <div class="gallery-collage-link">
            <div class="gallery-collage-image">
              <img src="${src}" alt="${altText}" loading="lazy" class="gallery-img" />
            </div>
            ${caption ? `<div class="gallery-collage-caption"><span>${caption}</span></div>` : ""}
          </div>
        </div>`;
      });
      contentMarkup = `
      <div class="gallery-layout-collage">
        ${collageItems.join("\n")}
      </div>
    `;
    }
  }

  // ───────────────────────────── HOVER CSS ─────────────────────────────
  let hoverCss = "";
  if (hoverEffect === "zoom") {
    hoverCss = `
      #${wrapperId} .gallery-img {
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #${wrapperId} .gallery-item:hover .gallery-img,
      #${wrapperId} .gallery-list-item:hover .gallery-img,
      #${wrapperId} .gallery-bento-card:hover .gallery-img,
      #${wrapperId} .gallery-carousel-item:hover .gallery-img {
        transform: scale(1.06);
      }
    `;
  } else if (hoverEffect === "overlay") {
    hoverCss = `
      #${wrapperId} .gallery-img {
        transition: transform 0.4s ease;
      }
      #${wrapperId} .gallery-caption-overlay {
        opacity: 0;
      }
      #${wrapperId} .gallery-item:hover .gallery-caption-overlay,
      #${wrapperId} .gallery-carousel-item:hover .gallery-caption-overlay {
        opacity: 1;
      }
      #${wrapperId} .gallery-item:hover .gallery-img {
        transform: scale(1.04);
      }
    `;
  } else if (hoverEffect === "fade") {
    hoverCss = `
      #${wrapperId} .gallery-img {
        transition: opacity 0.3s ease;
      }
      #${wrapperId} .gallery-item:hover .gallery-img,
      #${wrapperId} .gallery-list-item:hover .gallery-img,
      #${wrapperId} .gallery-bento-card:hover .gallery-img,
      #${wrapperId} .gallery-carousel-item:hover .gallery-img {
        opacity: 0.8;
      }
    `;
  }

  // ───────────────────────────── CSS OUTPUT ─────────────────────────────
  return `<style>
  #${wrapperId} {
    ${bgCss}
    padding-top: ${spacing.paddingTop || "4rem"};
    padding-bottom: ${spacing.paddingBottom || "4rem"};
    position: relative;
    width: 100%;
  }
  #${wrapperId} .gallery-inner {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  #${wrapperId} .gallery-header {
    text-align: center;
    max-width: 42rem;
    margin: 0 auto 3rem auto;
  }
  #${wrapperId} .gallery-heading {
    font-family: var(--gh-font-heading, inherit);
    font-size: 2.25rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.025em;
    color: ${appearance?.headingColor || "var(--color-ink, #171717)"};
    margin: 0;
  }
  #${wrapperId} .gallery-subheading {
    margin-top: 0.75rem;
    font-family: var(--gh-font-body, inherit);
    font-size: 1.125rem;
    line-height: 1.6;
    color: ${appearance?.subheadingColor || "var(--color-mute, #4d4d4d)"};
    margin-bottom: 0;
  }

  /* ---- Shared Item Box ---- */
  #${wrapperId} .gallery-item-inner {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: ${borderRadiusCss};
    background-color: var(--color-canvas-soft, #f5f5f5);
    border: 1px solid var(--color-hairline, #ebebeb);
    display: block;
    text-decoration: none;
  }
  #${wrapperId} .gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  #${wrapperId} .gallery-caption-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%);
    display: flex;
    align-items: flex-end;
    padding: 1rem;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  #${wrapperId} .gallery-caption-title {
    color: ${appearance?.captionColor || "#ffffff"};
    font-family: var(--gh-font-body, inherit);
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  #${wrapperId} .gallery-item-link {
    text-decoration: none;
    color: inherit;
  }

  ${hoverCss}

  /* ---- Grid Layout ---- */
  #${wrapperId} .gallery-layout-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: ${gapCss};
  }
  #${wrapperId} .gallery-layout-grid .gallery-item {
    aspect-ratio: 4 / 3;
    width: 100%;
  }

  /* ---- Masonry Layout ---- */
  #${wrapperId} .gallery-layout-masonry {
    column-count: 1;
    column-gap: ${gapCss};
  }
  #${wrapperId} .gallery-layout-masonry .gallery-item {
    break-inside: avoid;
    margin-bottom: ${gapCss};
    width: 100%;
  }
  #${wrapperId} .gallery-layout-masonry .gallery-img {
    height: auto;
  }

  /* ---- Masonry Auto-Scroll ---- */
  #${wrapperId} .gallery-masonry-autoscroll {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${gapCss};
    height: 520px;
    overflow: hidden;
  }
  #${wrapperId} .masonry-autoscroll-column {
    overflow: hidden;
    position: relative;
  }
  #${wrapperId} .masonry-autoscroll-track {
    display: flex;
    flex-direction: column;
    gap: ${gapCss};
  }
  #${wrapperId} .masonry-col-up .masonry-autoscroll-track {
    animation: gallery-masonry-up-${block.id} 30s linear infinite;
  }
  #${wrapperId} .masonry-col-down .masonry-autoscroll-track {
    animation: gallery-masonry-down-${block.id} 30s linear infinite;
  }
  #${wrapperId} .gallery-masonry-autoscroll:hover .masonry-autoscroll-track {
    animation-play-state: paused;
  }
  @keyframes gallery-masonry-up-${block.id} {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  @keyframes gallery-masonry-down-${block.id} {
    0% { transform: translateY(-50%); }
    100% { transform: translateY(0); }
  }
  #${wrapperId} .gallery-masonry-autoscroll-card {
    position: relative;
    height: 220px;
    border-radius: ${borderRadiusCss};
    overflow: hidden;
    flex-shrink: 0;
  }
  #${wrapperId} .gallery-masonry-autoscroll-card .gallery-item-inner {
    border-radius: ${borderRadiusCss};
  }

  /* ---- Carousel Auto-Scroll ---- */
  #${wrapperId} .gallery-carousel-wrapper {
    width: 100%;
    overflow: hidden;
    position: relative;
    padding-bottom: 0.5rem;
    mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 4%, rgba(0, 0, 0, 1) 96%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 4%, rgba(0, 0, 0, 1) 96%, transparent 100%);
  }
  #${wrapperId} .gallery-carousel-track {
    display: flex;
    width: max-content;
    align-items: center;
    gap: ${gapCss};
    padding-right: ${gapCss};
    animation: gallery-carousel-scroll-${block.id} 28s linear infinite;
  }
  #${wrapperId} .gallery-carousel-track:hover {
    animation-play-state: paused;
  }
  @keyframes gallery-carousel-scroll-${block.id} {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }

  /* ---- Carousel Manual Scroll ---- */
  #${wrapperId} .gallery-carousel-manual {
    display: flex;
    gap: ${gapCss};
    overflow-x: auto;
    padding-bottom: 1rem;
    scroll-snap-type: x mandatory;
    width: 100%;
    box-sizing: border-box;
  }
  #${wrapperId} .gallery-carousel-manual.gallery-carousel-center {
    justify-content: center;
  }

  /* ---- Shared Carousel Item ---- */
  #${wrapperId} .gallery-carousel-item {
    flex: 0 0 280px;
    aspect-ratio: 4 / 3;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
  @media (min-width: 640px) {
    #${wrapperId} .gallery-carousel-item {
      flex: 0 0 320px;
    }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .gallery-carousel-item {
      flex: 0 0 360px;
    }
  }
  #${wrapperId} .gallery-layout-carousel {
    display: flex;
    width: max-content;
    gap: ${gapCss};
    padding-right: ${gapCss};
    animation: gallery-carousel-scroll-${block.id} 28s linear infinite;
  }
  #${wrapperId} .gallery-layout-carousel:hover {
    animation-play-state: paused;
  }

  /* ---- Grid Responsive ---- */
  @media (min-width: 640px) {
    #${wrapperId} .gallery-layout-grid {
      grid-template-columns: repeat(${Math.min(2, columns)}, 1fr);
    }
    #${wrapperId} .gallery-layout-masonry {
      column-count: ${Math.min(2, columns)};
    }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .gallery-layout-grid {
      grid-template-columns: repeat(${columns}, 1fr);
    }
    #${wrapperId} .gallery-layout-masonry {
      column-count: ${columns};
    }
  }



  /* ---- List Layout ---- */
  #${wrapperId} .gallery-layout-list {
    display: flex;
    flex-direction: column;
    gap: ${gapCss};
  }
  #${wrapperId} .gallery-list-item {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: ${borderRadiusCss};
    background-color: var(--color-bg, #ffffff);
    transition: box-shadow 0.2s ease;
  }
  #${wrapperId} .gallery-list-item:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
  @media (min-width: 640px) {
    #${wrapperId} .gallery-list-item {
      flex-direction: row;
      align-items: center;
    }
  }
  #${wrapperId} .gallery-list-thumb {
    flex: 0 0 100%;
    height: 10rem;
    overflow: hidden;
    border-radius: ${borderRadiusCss};
    border: 1px solid var(--color-hairline, #ebebeb);
  }
  @media (min-width: 640px) {
    #${wrapperId} .gallery-list-thumb {
      flex: 0 0 10rem;
      height: 7rem;
    }
  }
  #${wrapperId} .gallery-list-thumb .gallery-item-inner {
    border-radius: ${borderRadiusCss};
    border: none;
    height: 100%;
  }
  #${wrapperId} .gallery-list-thumb-link {
    display: block;
    flex: 0 0 10rem;
    height: 7rem;
    overflow: hidden;
    border-radius: ${borderRadiusCss};
    border: 1px solid var(--color-hairline, #ebebeb);
    text-decoration: none;
  }
  #${wrapperId} .gallery-list-thumb-link .gallery-img {
    height: 100%;
  }
  #${wrapperId} .gallery-list-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  #${wrapperId} .gallery-list-caption {
    font-family: var(--gh-font-body, inherit);
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-ink, #171717);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  #${wrapperId} .gallery-list-cta {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-link, #0070f3);
    font-family: var(--gh-font-body, inherit);
  }

  /* ---- Bento Grid Layout ---- */
  #${wrapperId} .gallery-layout-bento {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${gapCss};
  }
  @media (min-width: 768px) {
    #${wrapperId} .gallery-layout-bento {
      grid-template-columns: repeat(2, 1fr);
    }
    #${wrapperId} .gallery-bento-card-large {
      grid-column: span 2;
    }
  }
  #${wrapperId} .gallery-bento-card {
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: ${borderRadiusCss};
    overflow: hidden;
    background-color: var(--color-bg, #ffffff);
    transition: box-shadow 0.2s ease;
  }
  #${wrapperId} .gallery-bento-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  }
  #${wrapperId} .gallery-bento-link {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    height: 100%;
    border-radius: 0;
    border: none;
    background: none;
  }
  @media (min-width: 768px) {
    #${wrapperId} .gallery-bento-card-large .gallery-bento-link {
      flex-direction: row;
      align-items: stretch;
    }
  }
  #${wrapperId} .gallery-bento-image {
    overflow: hidden;
    aspect-ratio: 4 / 3;
  }
  #${wrapperId} .gallery-bento-card-large .gallery-bento-image {
    flex: 0 0 50%;
    aspect-ratio: auto;
  }
  #${wrapperId} .gallery-bento-image .gallery-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .gallery-bento-info {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    justify-content: center;
  }
  #${wrapperId} .gallery-bento-caption {
    font-family: var(--gh-font-body, inherit);
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-ink, #171717);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  #${wrapperId} .gallery-bento-cta {
    font-size: 0.75rem;
    font-weight: 600;
    color: #059669;
    font-family: var(--gh-font-body, inherit);
  }

  /* ---- Collage Layout ---- */
  #${wrapperId} .gallery-layout-collage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem 1rem 4rem;
  }
  @media (min-width: 640px) {
    #${wrapperId} .gallery-layout-collage {
      gap: 1.5rem;
      padding: 3rem 1rem 4rem;
    }
  }
  @media (min-width: 768px) {
    #${wrapperId} .gallery-layout-collage {
      gap: 2rem;
    }
  }
  #${wrapperId} .gallery-collage-item {
    position: relative;
    transition: all 0.3s ease;
  }
  #${wrapperId} .gallery-collage-item:hover {
    z-index: 40 !important;
    transform: scale(1.03) rotate(0deg) !important;
  }
  #${wrapperId} .gallery-collage-link {
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg, #ffffff);
    padding: 0.625rem 0.625rem 2rem 0.625rem;
    border: 1px solid var(--color-hairline, #ebebeb);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    text-decoration: none;
    color: inherit;
    width: 100%;
  }
  @media (min-width: 640px) {
    #${wrapperId} .gallery-collage-link {
      padding: 0.75rem 0.75rem 2.5rem 0.75rem;
    }
  }
  @media (min-width: 768px) {
    #${wrapperId} .gallery-collage-link {
      padding: 1rem 1rem 3rem 1rem;
    }
  }
  #${wrapperId} .gallery-collage-image {
    width: 100%;
    overflow: hidden;
    background-color: var(--color-canvas-soft, #f5f5f5);
    position: relative;
  }
  #${wrapperId} .gallery-collage-image img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .gallery-collage-caption {
    position: absolute;
    bottom: 0.5rem;
    left: 0;
    right: 0;
    text-align: center;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media (min-width: 640px) {
    #${wrapperId} .gallery-collage-caption {
      bottom: 0.75rem;
    }
  }
  @media (min-width: 768px) {
    #${wrapperId} .gallery-collage-caption {
      bottom: 1rem;
    }
  }
  #${wrapperId} .gallery-collage-caption span {
    font-family: monospace;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-ink, #171717);
    opacity: 0.8;
    letter-spacing: -0.02em;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* nth-child rules for repeating collage pattern */
  #${wrapperId} .gallery-collage-item:nth-child(6n+1) { width: 60%; transform: translateY(0.5rem) rotate(-3deg); z-index: 10; }
  #${wrapperId} .gallery-collage-item:nth-child(6n+1) .gallery-collage-image { aspect-ratio: 1 / 1; }

  #${wrapperId} .gallery-collage-item:nth-child(6n+2) { width: 50%; transform: translateY(-1rem) rotate(2deg); z-index: 20; }
  #${wrapperId} .gallery-collage-item:nth-child(6n+2) .gallery-collage-image { aspect-ratio: 3 / 4; }

  #${wrapperId} .gallery-collage-item:nth-child(6n+3) { width: 70%; transform: translateY(1rem) rotate(-2deg); z-index: 10; }
  #${wrapperId} .gallery-collage-item:nth-child(6n+3) .gallery-collage-image { aspect-ratio: 4 / 3; }

  #${wrapperId} .gallery-collage-item:nth-child(6n+4) { width: 55%; transform: translateY(-0.5rem) rotate(3deg); z-index: 30; }
  #${wrapperId} .gallery-collage-item:nth-child(6n+4) .gallery-collage-image { aspect-ratio: 16 / 9; }

  #${wrapperId} .gallery-collage-item:nth-child(6n+5) { width: 65%; transform: translateY(0) rotate(-1deg); z-index: 20; }
  #${wrapperId} .gallery-collage-item:nth-child(6n+5) .gallery-collage-image { aspect-ratio: 4 / 5; }

  #${wrapperId} .gallery-collage-item:nth-child(6n+6) { width: 45%; transform: translateY(-0.75rem) rotate(1deg); z-index: 10; }
  #${wrapperId} .gallery-collage-item:nth-child(6n+6) .gallery-collage-image { aspect-ratio: 3 / 2; }

  /* Responsive Widths for nth-child */
  @media (min-width: 640px) {
    #${wrapperId} .gallery-collage-item:nth-child(6n+1) { width: 40%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+2) { width: 35%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+3) { width: 45%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+4) { width: 35%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+5) { width: 40%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+6) { width: 30%; }
  }
  @media (min-width: 768px) {
    #${wrapperId} .gallery-collage-item:nth-child(6n+1) { width: 35%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+2) { width: 25%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+3) { width: 40%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+4) { width: 30%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+5) { width: 35%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+6) { width: 25%; }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .gallery-collage-item:nth-child(6n+1) { width: 30%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+2) { width: 20%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+3) { width: 35%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+4) { width: 25%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+5) { width: 30%; }
    #${wrapperId} .gallery-collage-item:nth-child(6n+6) { width: 20%; }
  }

</style>
<div id="${wrapperId}" class="gallery-section ${styles.backgroundType === "mesh" ? "mesh-glow" : ""}">
  <div class="gallery-inner">
    ${headingHtml}
    ${contentMarkup}
  </div>
</div>`;
};