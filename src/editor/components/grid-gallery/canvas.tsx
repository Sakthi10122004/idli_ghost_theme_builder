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
  const autoScroll = general.autoScroll ?? false;

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

  const captionColor = appearance?.captionColor || "#ffffff";

  // Shared image box with hover + caption overlay
  const renderItemContent = (item: GalleryItem, idx: number) => {
    const src = resolveUrl(item.url);
    const captionText = item.caption || item.alt || `Gallery Image ${idx + 1}`;

    const hoverImageClass =
      hoverEffect === "zoom" || hoverEffect === "overlay"
        ? "group-hover:scale-105 transition-transform duration-500 ease-out"
        : hoverEffect === "fade"
        ? "group-hover:opacity-80 transition-opacity duration-300"
        : "";

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
        @keyframes gallery-scroll-up-${block.id} {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes gallery-scroll-down-${block.id} {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        #gallery-${block.id} .gallery-masonry-autoscroll:hover .gallery-masonry-autoscroll-track {
          animation-play-state: paused !important;
        }

        /* ---- Grid ---- */
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

        /* ---- Masonry ---- */
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

        /* ---- Carousel auto-scroll ---- */
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

        {/* ===== GRID ===== */}
        {layoutStyle === "grid" && (
          <div className="gallery-grid">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="gallery-grid-item">
                {renderItemContent(item, idx)}
              </div>
            ))}
          </div>
        )}

        {/* ===== MASONRY ===== */}
        {layoutStyle === "masonry" && (
          autoScroll ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 h-[480px] overflow-hidden relative gallery-masonry-autoscroll">
              {[0, 1, 2].map((colIdx) => {
                const colItems = items.filter((_, idx) => idx % 3 === colIdx);
                const doubled = [...colItems, ...colItems];
                const isUp = colIdx % 2 === 0;
                return (
                  <div
                    key={colIdx}
                    className={`flex flex-col gap-4 gallery-masonry-autoscroll-track`}
                    style={{
                      animation: `${isUp ? `gallery-scroll-up-${block.id}` : `gallery-scroll-down-${block.id}`} 30s linear infinite`,
                    }}
                  >
                    {doubled.map((item, idx) => {
                      const heights = ["h-48", "h-60", "h-52", "h-64", "h-44", "h-56"];
                      return (
                        <div key={`${item.id || idx}-${colIdx}-${idx}`} className={`${heights[(idx + colIdx) % heights.length]} shrink-0`}>
                          {renderItemContent(item, idx)}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="gallery-masonry">
              {items.map((item, idx) => {
                const heights = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-76"];
                const randomHeightClass = heights[idx % heights.length];
                return (
                  <div key={item.id || idx} className={`gallery-masonry-item ${randomHeightClass}`}>
                    {renderItemContent(item, idx)}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ===== CAROUSEL ===== */}
        {layoutStyle === "carousel" && (
          autoScroll ? (
            <div className="gallery-carousel-wrapper">
              <div className="gallery-carousel-track">
                {(() => {
                  const baseList = items.length > 0 ? (items.length < 6 ? [...items, ...items, ...items] : items) : [];
                  const doubled = [...baseList, ...baseList];
                  return doubled.map((item, idx) => (
                    <div key={`${item.id || idx}-${idx}`} className="gallery-carousel-item">
                      {renderItemContent(item, idx)}
                    </div>
                  ));
                })()}
              </div>
            </div>
          ) : (
            <div className={`flex gap-6 overflow-x-auto pb-4 snap-x scrollbar-thin ${items.length <= 2 ? "justify-center" : ""}`}>
              {items.map((item, idx) => (
                <div key={item.id || idx} className="gallery-carousel-item snap-start shrink-0">
                  {renderItemContent(item, idx)}
                </div>
              ))}
            </div>
          )
        )}


        {/* ===== LIST ===== */}
        {layoutStyle === "list" && (
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => {
              const src = resolveUrl(item.url);
              const captionText = item.caption || item.alt || `Gallery Image ${idx + 1}`;
              return (
                <div key={item.id || idx} className={`flex flex-col sm:flex-row gap-4 items-start sm:items-center border border-brand-hairline ${roundedClass} p-4 bg-white shadow-level-1 group hover:shadow-level-2 transition-all`}>
                  <div className={`w-full sm:w-40 h-28 overflow-hidden shrink-0 ${roundedClass} bg-brand-canvas-soft-2 border border-brand-hairline`}>
                    <img
                      src={src}
                      alt={captionText}
                      className={`w-full h-full object-cover ${hoverEffect === "zoom" ? "group-hover:scale-105 transition-transform duration-500" : ""}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-brand-ink leading-snug line-clamp-2">{captionText}</span>
                    {item.alt && item.caption && item.alt !== item.caption && (
                      <span className="text-xs text-brand-mute leading-snug line-clamp-2">{item.alt}</span>
                    )}
                    <span className="text-[10px] font-mono text-brand-link font-semibold">View Image →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===== BENTO GRID ===== */}
        {layoutStyle === "bento" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => {
              const isLarge = idx % 3 === 0;
              const src = resolveUrl(item.url);
              const captionText = item.caption || item.alt || `Gallery Image ${idx + 1}`;
              return (
                <div
                  key={item.id || idx}
                  className={`border border-brand-hairline ${roundedClass} overflow-hidden bg-white shadow-level-2 hover:shadow-level-3 transition-all group flex flex-col ${
                    isLarge ? "md:col-span-2 md:flex-row md:items-stretch" : ""
                  }`}
                >
                  <div className={`overflow-hidden bg-brand-canvas-soft-2 shrink-0 ${isLarge ? "w-full md:w-1/2 aspect-video md:aspect-auto" : "w-full aspect-[4/3]"}`}>
                    <img
                      src={src}
                      alt={captionText}
                      className={`w-full h-full object-cover ${hoverEffect === "zoom" ? "group-hover:scale-105 transition-transform duration-500" : ""}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-5 flex-1 justify-center">
                    <span className="text-xs font-semibold text-brand-ink leading-snug line-clamp-3">{captionText}</span>
                    {item.alt && item.caption && item.alt !== item.caption && (
                      <span className="text-[11px] text-brand-mute leading-relaxed line-clamp-3">{item.alt}</span>
                    )}
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      View Full Image →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* ===== COLLAGE ===== */}
        {layoutStyle === "collage" && (
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 py-8 sm:py-12 md:py-16 px-4">
            {items.map((item, idx) => {
              const src = resolveUrl(item.url);
              const captionText = item.caption || item.alt || `Gallery Image ${idx + 1}`;
              
              const rotations = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3", "-rotate-1", "rotate-1"];
              const translates = ["translate-y-2", "-translate-y-4", "translate-y-4", "-translate-y-2", "translate-y-0", "-translate-y-3"];
              const widths = [
                "w-[60%] sm:w-[40%] md:w-[35%] lg:w-[30%]", 
                "w-[50%] sm:w-[35%] md:w-[25%] lg:w-[20%]", 
                "w-[70%] sm:w-[45%] md:w-[40%] lg:w-[35%]", 
                "w-[55%] sm:w-[35%] md:w-[30%] lg:w-[25%]",
                "w-[65%] sm:w-[40%] md:w-[35%] lg:w-[30%]",
                "w-[45%] sm:w-[30%] md:w-[25%] lg:w-[20%]"
              ];
              const aspectRatios = ["aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-video", "aspect-[4/5]", "aspect-[3/2]"];
              const zIndexes = ["z-10", "z-20", "z-10", "z-30", "z-20", "z-10"];

              const rot = rotations[idx % rotations.length];
              const trans = translates[idx % translates.length];
              const w = widths[idx % widths.length];
              const aspect = aspectRatios[idx % aspectRatios.length];
              const zIndex = zIndexes[idx % zIndexes.length];

              return (
                <div 
                  key={item.id || idx} 
                  className={`group relative ${w} ${trans} ${rot} ${zIndex} transition-all duration-300 hover:z-40 hover:scale-[1.03] hover:rotate-0`}
                >
                  <div className={`w-full bg-white p-2.5 sm:p-3 md:p-4 pb-8 sm:pb-10 md:pb-12 shadow-level-2 border border-brand-hairline flex flex-col`}>
                    <div className={`w-full ${aspect} overflow-hidden bg-brand-canvas-soft-2 relative`}>
                      <img
                        src={src}
                        alt={captionText}
                        className={`absolute inset-0 w-full h-full object-cover ${hoverEffect === "zoom" ? "group-hover:scale-105 transition-transform duration-500" : ""}`}
                        loading="lazy"
                      />
                    </div>
                    {item.caption && (
                      <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-0 right-0 text-center px-4 flex items-center justify-center">
                         <span className="font-mono text-[10px] sm:text-xs font-semibold text-brand-ink opacity-80 tracking-tight line-clamp-1">{item.caption}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};