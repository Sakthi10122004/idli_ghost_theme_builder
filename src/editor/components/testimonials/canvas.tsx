import React from "react";
import { BuilderBlock } from "@/types/theme";
import { TestimonialItem } from "./schema";
import { useEditorStore } from "@/store/editorStore";
import { 
  Star, 
  Tag, 
  ExternalLink, 
  Globe, 
  Sparkles, 
  Zap
} from "lucide-react";

import { getBackgroundStyle } from "@/editor/components/shared/background";

export const CanvasElement = ({
  block,
  isSelected,
  onClick,
  onDelete,
  renderChildren,
}: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const deviceMode = useEditorStore((state) => state.deviceMode);
  const props = block.props || {};
  const items: TestimonialItem[] = props.items || [];
  const useDynamicData = props.useDynamicData !== false;
  const dynamicTag = props.dynamicTag || "testimonial";
  const dynamicLimit = props.dynamicLimit ? Math.max(1, Number(props.dynamicLimit)) : 100;
  const configuredLayout = props.layout || "grid-3";
  const cardStyle = props.cardStyle || "bordered";
  const showSectionHeader = props.showSectionHeader !== false;
  const textColor = props.textColor || "";

  const showStars = props.showStars !== false;
  const showPhotos = props.showPhotos !== false;
  const showRoleCompany = props.showRoleCompany !== false;
  const showDate = props.showDate !== false;
  const showLocation = props.showLocation !== false;
  const showProductUsed = props.showProductUsed !== false;
  const showSocialLink = props.showSocialLink !== false;

  // Responsive device mode layout handling
  const effectiveLayout =
    deviceMode === "mobile"
      ? "grid-1"
      : deviceMode === "tablet" && configuredLayout === "grid-3"
      ? "grid-2"
      : configuredLayout;

  // Dynamic posts mockup preview for builder canvas
  const dynamicItems: TestimonialItem[] = [
    {
      id: "dynamic-1",
      author: "Sarah Jenkins",
      role: "Lead Product Designer",
      company: "",
      quote: "This theme builder transformed our publication workflow completely. We launched 4 custom Ghost newsletters with zero friction.",
      rating: 5,
      date: "March 2026",
      location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      socialUrl: "https://linkedin.com",
      socialPlatform: "linkedin",
      featured: true,
    },
    {
      id: "dynamic-2",
      author: "Alex Rivera",
      role: "Founder & Journalist",
      company: "",
      quote: "The speed and typographic elegance are unmatched. Our subscriber engagement and conversion rates jumped by 42% after switching.",
      rating: 5,
      date: "February 2026",
      location: "Austin, TX",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      socialUrl: "https://twitter.com",
      socialPlatform: "twitter",
      featured: false,
    },
    {
      id: "dynamic-3",
      author: "Elena Rostova",
      role: "Design Director",
      company: "",
      quote: "As a designer, I am extremely particular about typography and grid alignments. This tool respects the design system down to the pixel.",
      rating: 5,
      date: "January 2026",
      location: "London, UK",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      socialUrl: "https://example.com",
      socialPlatform: "website",
      featured: false,
    },
  ];

  const displayItems = useDynamicData ? dynamicItems : items;

  // Flexible Auto-Centering Layout
  const getContainerStyle = (): React.CSSProperties => {
    return {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "stretch",
      gap: "1.25rem",
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      boxSizing: "border-box",
    };
  };

  const getCardItemStyle = (itemCount: number): React.CSSProperties => {
    if (effectiveLayout === "grid-1" || itemCount === 1 || deviceMode === "mobile") {
      return {
        flex: "0 1 680px",
        maxWidth: "680px",
        width: "100%",
        boxSizing: "border-box",
      };
    }
    if (effectiveLayout === "grid-2" || itemCount === 2) {
      return {
        flex: "1 1 420px",
        maxWidth: "460px",
        minWidth: "280px",
        boxSizing: "border-box",
      };
    }
    return {
      flex: "1 1 320px",
      maxWidth: "380px",
      minWidth: "280px",
      boxSizing: "border-box",
    };
  };

  const getCardHoverClass = () => {
    const effect = block.styles?.hoverEffect;
    if (effect === "glow") {
      return "hover:shadow-[0_0_30px_rgba(0,0,0,0.14),0_12px_28px_-4px_rgba(0,0,0,0.16)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.16),0_12px_28px_rgba(0,0,0,0.6)] hover:-translate-y-1";
    }
    if (effect === "scale") {
      return "hover:scale-[1.02] hover:shadow-md";
    }
    if (effect === "float") {
      return "hover:-translate-y-1.5 hover:shadow-md";
    }
    return "hover:-translate-y-1 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700";
  };

  // Card style variants
  const getCardStyleClass = (featured?: boolean) => {
    const base = `relative flex flex-col justify-between transition-all duration-200 rounded-xl text-left ${getCardHoverClass()}`;
    const padding = effectiveLayout === "grid-1" ? "p-6 sm:p-8" : "p-4 sm:p-5";

    let styleClass = "";
    switch (cardStyle) {
      case "soft":
        styleClass = "bg-neutral-100/90 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs";
        break;
      case "minimal":
        styleClass = "bg-transparent border border-neutral-200/70 dark:border-neutral-800/80 shadow-none hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40";
        break;
      case "elevated":
        styleClass = "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-lg shadow-neutral-200/50 dark:shadow-black/50";
        break;
      case "bordered":
      default:
        styleClass = "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs";
        break;
    }

    const featuredClass = featured
      ? "ring-2 ring-neutral-900 dark:ring-white/90 border-neutral-900 dark:border-white shadow-md"
      : "";

    return `${base} ${padding} ${styleClass} ${featuredClass}`;
  };

  const renderSocialIcon = (platform?: string) => {
    switch (platform) {
      case "linkedin":
        return (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6c0-.88-.72-1.6-1.6-1.6Z" />
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "website":
      default:
        return <Globe className="w-3.5 h-3.5" />;
    }
  };

  const bgStyle = getBackgroundStyle(block.styles);
  const paddingTop = (block.styles?.paddingTop as string) || "3rem";
  const paddingBottom = (block.styles?.paddingBottom as string) || "4rem";

  return (
    <div
      className={`w-full relative transition-colors ${block.styles?.backgroundType === "mesh" ? "mesh-glow" : ""}`}
      style={{
        ...bgStyle,
        ...(textColor ? { color: textColor } : {}),
        paddingTop,
        paddingBottom,
        width: "100%",
        minWidth: "100%",
        display: "block",
      }}
    >
      <div
        className="w-full max-w-6xl mx-auto px-4 sm:px-6"
        style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", display: "block" }}
      >
        {/* Section Header */}
        {showSectionHeader && (
          <div
            className="w-full text-center max-w-3xl mx-auto mb-8"
            style={{ width: "100%", maxWidth: "700px", margin: "0 auto 2rem auto", display: "block", textAlign: "center" }}
          >
            {props.sectionBadge && (
              <div className="mb-2.5 flex justify-center" style={{ display: "flex", justifyContent: "center" }}>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 whitespace-nowrap"
                  style={textColor ? { color: textColor, borderColor: `${textColor}40` } : {}}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  {props.sectionBadge}
                </span>
              </div>
            )}
            {props.sectionTitle && (
              <h2
                className="w-full text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2 leading-tight"
                style={{
                  width: "100%",
                  display: "block",
                  textAlign: "center",
                  ...(textColor ? { color: textColor } : {}),
                }}
              >
                {props.sectionTitle}
              </h2>
            )}
            {props.sectionSubtitle && (
              <p
                className="w-full text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto"
                style={{
                  width: "100%",
                  maxWidth: "640px",
                  margin: "0 auto",
                  display: "block",
                  textAlign: "center",
                  ...(textColor ? { color: textColor, opacity: 0.85 } : {}),
                }}
              >
                {props.sectionSubtitle}
              </p>
            )}
          </div>
        )}



        {/* Testimonials Container (Auto-Centering & Balanced Grid) */}
        <div style={getContainerStyle()}>
          {displayItems.map((item, idx) => {
            const initials = item.author
              ? item.author
                  .replace(/[\(\{\}].*?[\)\}]/g, "")
                  .trim()
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "U";

            return (
              <div
                key={item.id || idx}
                className={getCardStyleClass(item.featured)}
                style={getCardItemStyle(displayItems.length)}
              >
                {/* Featured Badge */}
                {item.featured && (
                  <div className="absolute -top-3 right-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-20">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    Featured
                  </div>
                )}

                <div className="w-full min-w-0">
                  {/* Top Row: Stars Rating */}
                  {showStars && (
                    <div className="w-full flex items-center mb-2.5 min-w-0">
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, sIdx) => {
                          const rating = item.rating || 5;
                          const isFilled = sIdx < rating;
                          return (
                            <Star
                              key={sIdx}
                              className={`w-3.5 h-3.5 ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-neutral-200 dark:text-neutral-700"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quote Body */}
                  <div className="w-full my-1.5 mb-3.5">
                    <p
                      className={`w-full ${
                        effectiveLayout === "grid-1" || displayItems.length === 1
                          ? "text-base sm:text-lg font-normal leading-relaxed text-neutral-900 dark:text-neutral-100"
                          : "text-xs leading-relaxed text-neutral-800 dark:text-neutral-200"
                      }`}
                      style={{ width: "100%", display: "block" }}
                    >
                      "{item.quote || "Add your testimonial quote here..."}"
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Author details, metadata & social links */}
                <div className="w-full pt-3 mt-auto border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2.5 min-w-0 text-left">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                    {/* Photo / Avatar */}
                    {showPhotos && (
                      <div className="shrink-0">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.author || "Author"}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-[11px] flex items-center justify-center border border-neutral-300 dark:border-neutral-700 shrink-0">
                            {initials}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Author & Role info */}
                    <div className="flex flex-col min-w-0 flex-1 text-left justify-center">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight truncate text-left">
                        {item.author || "Anonymous"}
                      </span>
                      {showRoleCompany && (item.role || item.company) && (
                        <span className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 truncate leading-tight mt-0.5 text-left">
                          {item.role || item.company}
                        </span>
                      )}
                      {/* Date & Location */}
                      {(showDate || showLocation) && (item.date || item.location) && (
                        <div className="flex items-center gap-1.5 mt-1 min-w-0 text-left flex-wrap">
                          {showLocation && item.location && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] text-neutral-500 dark:text-neutral-400 font-normal">
                              <svg className="w-2.5 h-2.5 text-neutral-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{item.location}</span>
                            </span>
                          )}
                          {showLocation && item.location && showDate && item.date && (
                            <span className="text-neutral-300 dark:text-neutral-600 text-[9px]">•</span>
                          )}
                          {showDate && item.date && (
                            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">
                              {item.date}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Profile Link */}
                  {showSocialLink && item.socialUrl && (
                    <div className="shrink-0 flex items-center">
                      <a
                        href={item.socialUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100/90 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
                        title="View Profile / Website"
                      >
                        {renderSocialIcon(item.socialPlatform)}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};