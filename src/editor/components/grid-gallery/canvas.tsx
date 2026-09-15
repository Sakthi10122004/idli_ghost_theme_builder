/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import {
  GridGalleryProps,
  GalleryItem,
  defaultProps,
  DEFAULT_GALLERY_ITEMS,
} from "./schema";
import { getBackgroundStyle } from "../shared/background";

export const CanvasElement = ({ block }: { block: BuilderBlock }) => {
  const p = { ...defaultProps, ...block.props } as GridGalleryProps;
  const assets = useEditorStore((s) => s.document.assets) || {};
  const general = p.general || defaultProps.general;
  const appearance = p.appearance || defaultProps.appearance;
  const spacing = p.spacing || defaultProps.spacing;
  const styles = block.styles || {};

  const bgStyle = getBackgroundStyle(styles, appearance);

  const rawItems = p.items || (p.urls ? p.urls.map((url: string, i: number) => ({ id: String(i), url, caption: "", alt: "" })) : DEFAULT_GALLERY_ITEMS);
  const items: GalleryItem[] = Array.isArray(rawItems) ? rawItems : DEFAULT_GALLERY_ITEMS;

  const layoutStyle = general.layoutStyle || "grid";
  const columns = general.columns || 3;
  const gapKey = general.gap || "md";
  const cornerStyle = general.cornerStyle || "rounded";
  const hoverEffect = general.hoverEffect || "zoom";

  const gapValueMap = { sm: "0.75rem", md: "1.25rem", lg: "2rem" };
  const gapCss = gapValueMap[gapKey] || "1.25rem";

  const roundedClass = cornerStyle === "rectangle" ? "rounded-none" : "rounded-xl";

  const resolveUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("asset://")) {
      const path = url.replace("asset://", "");
      return assets[path] || assets[`assets/${path}`] || url;
    }
    return url;
  };

  const renderItemContent = (item: GalleryItem, idx: number) => {
    const src = resolveUrl(item.url);
    const captionText = item.caption || item.alt || `Gallery Image ${idx + 1}`;

    const hoverImageClass =
      hoverEffect === "zoom" || hoverEffect === "overlay"
        ? "group-hover:scale-105 transition-transform duration-500 ease-out"
        : hoverEffect === "fade"
        ? "group-hover:opacity-80 transition-opacity duration-300"
        : "";

    const captionColor = appearance?.captionColor || "#ffffff";

    return (
      <div
        className={`relative w-full h-full overflow-hidden bg-brand-canvas-soft-2 border border-brand-hairline/80 ${roundedClass} group shadow-level-1`}
      >
        <img
          src={src}
          alt={item.alt || item.caption || "Gallery image"}
          className={`w-full h-full object-cover block ${hoverImageClass}`}
          loading="lazy"
        />

        {/* Caption Overlay */}
        {(hoverEffect === "overlay" || item.caption) && (
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-end p-4 transition-opacity duration-300 ${
              hoverEffect === "overlay"
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-90"
            }`}
          >
            <span
              className="text-xs sm:text-sm font-medium tracking-tight line-clamp-2 drop-shadow-sm"
              style={{ color: captionColor }}
            >
              {captionText}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id={`gallery-${block.id}`}
      className={`relative w-full min-w-full ${styles.backgroundType === "mesh" ? "mesh-glow" : ""}`}
      style={{
        ...bgStyle,
        paddingTop: spacing.paddingTop || "4rem",
        paddingBottom: spacing.paddingBottom || "4rem",
      }}
    >
      <style>{`
        /* Dynamic Grid Layout Styles */
        #gallery-${block.id} .gallery-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: ${gapCss};
          width: 100%;
        }
        @media (min-width: 640px) {
          #gallery-${block.id} .gallery-grid {
            grid-template-columns: repeat(${Math.min(2, columns)}, 1fr);
          }
        }
        @media (min-width: 1024px) {
          #gallery-${block.id} .gallery-grid {
            grid-template-columns: repeat(${columns}, 1fr);
          }
        }
        #gallery-${block.id} .gallery-grid-item {
          aspect-ratio: 4 / 3;
          width: 100%;
        }

        /* Dynamic Masonry Layout Styles */
        #gallery-${block.id} .gallery-masonry {
          column-count: 1;
          column-gap: ${gapCss};
          width: 100%;
        }
        @media (min-width: 640px) {
          #gallery-${block.id} .gallery-masonry {
            column-count: ${Math.min(2, columns)};
          }
        }
        @media (min-width: 1024px) {
          #gallery-${block.id} .gallery-masonry {
            column-count: ${columns};
          }
        }
        #gallery-${block.id} .gallery-masonry-item {
          break-inside: avoid;
          margin-bottom: ${gapCss};
          width: 100%;
        }

        /* Dynamic Carousel Auto-Scrolling Marquee Styles */
        #gallery-${block.id} .gallery-carousel-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding-bottom: 0.5rem;
          mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 4%, rgba(0, 0, 0, 1) 96%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 1) 4%, rgba(0, 0, 0, 1) 96%, transparent 100%);
        }
        #gallery-${block.id} .gallery-carousel-track {
          display: flex;
          width: max-content;
          align-items: center;
          gap: ${gapCss};
          padding-right: ${gapCss};
          animation: gallery-carousel-scroll-${block.id} 28s linear infinite;
        }
        #gallery-${block.id} .gallery-carousel-track:hover {
          animation-play-state: paused;
        }
        @keyframes gallery-carousel-scroll-${block.id} {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        #gallery-${block.id} .gallery-carousel-item {
          flex: 0 0 280px;
          aspect-ratio: 4 / 3;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          #gallery-${block.id} .gallery-carousel-item {
            flex: 0 0 320px;
          }
        }
        @media (min-width: 1024px) {
          #gallery-${block.id} .gallery-carousel-item {
            flex: 0 0 360px;
          }
        }
      `}</style>

      <div className="w-full min-w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Dynamic Data Badge */}
        {general.useDynamicData && (
          <div className="mb-8 flex items-center justify-center gap-2 text-xs font-mono font-medium text-blue-700 bg-blue-50/80 border border-blue-200/80 rounded-full px-3.5 py-1 w-fit mx-auto shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span>
              Dynamic Ghost Query: Posts tagged <strong className="font-bold">#{general.dynamicTag || "gallery"}</strong>
            </span>
          </div>
        )}

        {/* Section Header */}
        {(general.heading || general.subheading) && (
          <div className="w-full min-w-full max-w-2xl mx-auto text-center mb-12">
            {general.heading && (
              <h2
                className="w-full text-3xl sm:text-4xl font-semibold tracking-tight text-brand-ink"
                style={{ color: appearance?.headingColor || "var(--color-ink)" }}
              >
                {general.heading}
              </h2>
            )}
            {general.subheading && (
              <p
                className="w-full mt-3 text-base sm:text-lg leading-relaxed text-brand-body"
                style={{ color: appearance?.subheadingColor || "var(--color-mute)" }}
              >
                {general.subheading}
              </p>
            )}
          </div>
        )}

        {/* Layout Renderers */}
        {layoutStyle === "grid" && (
          <div className="gallery-grid">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="gallery-grid-item">
                {renderItemContent(item, idx)}
              </div>
            ))}
          </div>
        )}

        {layoutStyle === "masonry" && (
          <div className="gallery-masonry">
            {items.map((item, idx) => {
              // Simulated staggered aspect ratios for canvas preview in masonry mode
              const heights = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-76"];
              const randomHeightClass = heights[idx % heights.length];
              return (
                <div key={item.id || idx} className={`gallery-masonry-item ${randomHeightClass}`}>
                  {renderItemContent(item, idx)}
                </div>
              );
            })}
          </div>
        )}

        {layoutStyle === "carousel" && (
          <div className="gallery-carousel-wrapper">
            <div className="gallery-carousel-track">
              {(() => {
                const baseList =
                  items.length > 0
                    ? items.length < 6
                      ? [...items, ...items, ...items]
                      : items
                    : [];
                const doubled = [...baseList, ...baseList];
                return doubled.map((item, idx) => (
                  <div key={`${item.id || idx}-${idx}`} className="gallery-carousel-item">
                    {renderItemContent(item, idx)}
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};