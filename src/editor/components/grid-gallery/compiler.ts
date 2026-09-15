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

  const renderManualItem = (item: GalleryItem) => {
    const src = resolveHbsSrc(item.url);
    const altText = item.alt || item.caption || "Gallery Image";
    const captionHtml = item.caption
      ? `<div class="gallery-caption-overlay"><span class="gallery-caption-title">${item.caption}</span></div>`
      : "";

    return `
      <div class="gallery-item">
        <div class="gallery-item-inner">
          <img src="${src}" alt="${altText}" loading="lazy" class="gallery-img" />
          ${captionHtml}
        </div>
      </div>
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

  const ghostItemLoop = `
    {{#foreach posts}}
      {{#if feature_image}}
        <div class="gallery-item">
          <a href="{{url}}" class="gallery-item-inner gallery-item-link" title="{{title}}">
            <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" class="gallery-img" />
            <div class="gallery-caption-overlay">
              <span class="gallery-caption-title">{{title}}</span>
            </div>
          </a>
        </div>
      {{/if}}
    {{/foreach}}
  `;

  let contentMarkup = "";

  if (layoutStyle === "carousel") {
    if (useDynamicData) {
      contentMarkup = `{{#get "posts" filter="tag:${dynamicTag}" limit="100"}}
        <div class="gallery-carousel-wrapper">
          <div class="gallery-carousel-track gallery-layout-carousel">
            ${ghostItemLoop}
            ${ghostItemLoop}
          </div>
        </div>
      {{/get}}`;
    } else {
      const baseList =
        items.length > 0
          ? items.length < 6
            ? [...items, ...items, ...items]
            : items
          : [];
      const carouselItems = [...baseList, ...baseList];
      contentMarkup = `
        <div class="gallery-carousel-wrapper">
          <div class="gallery-carousel-track gallery-layout-carousel">
            ${carouselItems.map(renderManualItem).join("\n")}
          </div>
        </div>
      `;
    }
  } else {
    // Grid or Masonry
    if (useDynamicData) {
      contentMarkup = `{{#get "posts" filter="tag:${dynamicTag}" limit="100"}}
        <div class="gallery-items gallery-layout-${layoutStyle}">
          ${ghostItemLoop}
        </div>
      {{/get}}`;
    } else {
      contentMarkup = `
        <div class="gallery-items gallery-layout-${layoutStyle}">
          ${items.map(renderManualItem).join("\n")}
        </div>
      `;
    }
  }

  let hoverCss = "";
  if (hoverEffect === "zoom") {
    hoverCss = `
      #${wrapperId} .gallery-img {
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #${wrapperId} .gallery-item:hover .gallery-img {
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
      #${wrapperId} .gallery-item:hover .gallery-caption-overlay {
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
      #${wrapperId} .gallery-item:hover .gallery-img {
        opacity: 0.8;
      }
    `;
  }

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

  /* Shared Item Box Styling */
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

  ${hoverCss}

  /* Grid Layout CSS */
  #${wrapperId} .gallery-layout-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: ${gapCss};
  }
  #${wrapperId} .gallery-layout-grid .gallery-item {
    aspect-ratio: 4 / 3;
    width: 100%;
  }

  /* Masonry Layout CSS */
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

  /* Carousel Auto-Scrolling Marquee CSS */
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
  #${wrapperId} .gallery-layout-carousel .gallery-item {
    flex: 0 0 280px;
    aspect-ratio: 4 / 3;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    #${wrapperId} .gallery-layout-carousel .gallery-item {
      flex: 0 0 320px;
    }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .gallery-layout-carousel .gallery-item {
      flex: 0 0 360px;
    }
  }

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
</style>
<div id="${wrapperId}" class="gallery-section ${styles.backgroundType === "mesh" ? "mesh-glow" : ""}">
  <div class="gallery-inner">
    ${headingHtml}
    ${contentMarkup}
  </div>
</div>`;
};