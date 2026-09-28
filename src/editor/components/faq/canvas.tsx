import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { FAQProps, FAQItem, defaultProps } from "./schema";
import { getBackgroundStyle } from "../shared/background";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { useEditorStore } from "@/store/editorStore";
import { isDarkColor } from "../heading/schema";

export const CanvasElement = ({ block }: { block: BuilderBlock }) => {
  const canvasDark = useCanvasDarkMode();
  const { deviceMode } = useEditorStore();
  const isMobile = deviceMode === 'mobile';
  const p = { ...defaultProps, ...block.props } as FAQProps;
  const general = p.general;
  const items = p.items || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};

  const sectionBg = styles?.backgroundColor || appearance?.backgroundColor;
  const isSectionDark = sectionBg ? isDarkColor(sectionBg) : false;
  const isDark = canvasDark || isSectionDark;

  const effectiveHeadingColor = isDark && appearance?.headingColor && isDarkColor(appearance.headingColor)
    ? "var(--color-ink, #ffffff)"
    : (appearance?.headingColor || (isDark ? "var(--color-ink, #ffffff)" : "var(--color-ink)"));
  const effectiveSubheadingColor = isDark && appearance?.subheadingColor && isDarkColor(appearance.subheadingColor)
    ? "var(--color-mute, #a1a1a1)"
    : (appearance?.subheadingColor || (isDark ? "var(--color-mute, #a1a1a1)" : "var(--color-mute)"));

  const isDefaultItemBg =
    !appearance?.itemBgColor ||
    appearance.itemBgColor === "#f8fafc" ||
    appearance.itemBgColor === "#fafafa" ||
    appearance.itemBgColor === "#ffffff" ||
    appearance.itemBgColor === "var(--color-canvas-soft, #f8fafc)" ||
    appearance.itemBgColor === "var(--color-canvas-soft)";

  const effectiveItemBg = isDark
    ? (isDefaultItemBg || !isDarkColor(appearance?.itemBgColor)
        ? "var(--color-canvas-soft, #18181b)"
        : appearance.itemBgColor)
    : (appearance?.itemBgColor || "var(--color-canvas-soft, #f8fafc)");

  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(items.length > 0 ? [items[0].id] : []));

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = general.allowMultipleOpen ? new Set(prev) : new Set<string>();
      if (prev.has(id) && !general.allowMultipleOpen) {
        next.clear();
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const bgStyle = getBackgroundStyle(styles, appearance);
  const cornerClass = (general.itemCornerStyle || "rounded") === "rectangle" ? "rounded-none" : "rounded-xl";

  const renderFaqItem = (item: FAQItem) => {
    const isOpen = openIds.has(item.id);
    return (
      <div
        key={item.id}
        className={`w-full min-w-full p-3.5 sm:p-5 md:p-6 mb-3 sm:mb-4 border ${isDark ? "border-white/10" : "border-black/5"} shadow-xs transition-all duration-200 ${cornerClass}`}
        style={{ backgroundColor: effectiveItemBg }}
      >
        <dt className="w-full min-w-full">
          <button
            type="button"
            className="flex w-full min-w-full items-center justify-between text-left gap-3 group cursor-pointer focus:outline-none"
            style={{ color: effectiveHeadingColor }}
            aria-controls={`faq-${block.id}-${item.id}`}
            aria-expanded={isOpen}
            onClick={() => toggle(item.id)}
          >
            <span
              className="text-sm sm:text-base md:text-lg font-bold leading-snug flex-1 min-w-0 break-words"
              style={{ color: effectiveHeadingColor }}
            >
              {item.question}
            </span>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full shrink-0 transition-colors ${
              isDark ? "bg-white/10 group-hover:bg-white/20" : "bg-black/5 group-hover:bg-black/10"
            }`}>
              <svg
                className={`h-4 w-4 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </button>
        </dt>
        <dd
          className={`grid transition-all duration-300 ease-in-out w-full min-w-full ${
            isOpen
              ? `grid-rows-[1fr] opacity-100 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${isDark ? "border-white/10" : "border-black/5"}`
              : 'grid-rows-[0fr] opacity-0 mt-0 pt-0 border-t-0'
          }`}
          id={`faq-${block.id}-${item.id}`}
        >
          <div className="overflow-hidden">
            <p
              className="text-xs sm:text-sm md:text-base leading-relaxed break-words w-full"
              style={{ color: effectiveSubheadingColor }}
            >
              {item.answer}
            </p>
          </div>
        </dd>
      </div>
    );
  };

  const renderContent = () => {
    if (general.layoutStyle === "two-column") {
      const mid = Math.ceil(items.length / 2);
      const col1 = items.slice(0, mid);
      const col2 = items.slice(mid);
      return (
        <div className={`w-full min-w-full mx-auto mt-6 sm:mt-12 max-w-7xl grid grid-cols-1 gap-x-8 gap-y-0 ${isMobile ? '' : 'lg:grid-cols-2'}`}>
          <dl className="w-full min-w-full">
            {col1.map(renderFaqItem)}
          </dl>
          <dl className="w-full min-w-full">
            {col2.map(renderFaqItem)}
          </dl>
        </div>
      );
    } else if (general.layoutStyle === "categorized") {
      const categories = Array.from(new Set(items.map(i => i.category || "General")));
      return (
        <div className="w-full min-w-full mx-auto mt-6 sm:mt-12 max-w-3xl">
          {categories.map((cat, idx) => (
            <div key={idx} className="mb-8 sm:mb-10 w-full min-w-full">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-3 sm:mb-4 w-full" style={{ color: effectiveHeadingColor }}>{cat}</h3>
              <dl className="w-full min-w-full">
                {items.filter(i => (i.category || "General") === cat).map(renderFaqItem)}
              </dl>
            </div>
          ))}
        </div>
      );
    }
    
    // Default: accordion (single column centered)
    return (
      <div className="w-full min-w-full mx-auto mt-6 sm:mt-12 max-w-3xl">
        <dl className="w-full min-w-full">
          {items.map(renderFaqItem)}
        </dl>
      </div>
    );
  };

  return (
    <div className={`relative w-full min-w-full ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}`} style={{ ...bgStyle, paddingTop: isMobile ? "2.5rem" : (spacing.paddingTop || "4rem"), paddingBottom: isMobile ? "2.5rem" : (spacing.paddingBottom || "4rem") }}>
      <div className="w-full min-w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(general.heading || general.subheading) && (
          <div className="w-full min-w-full mx-auto max-w-4xl text-center mb-8">
            {general.heading && (
              <h2 className="w-full text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: effectiveHeadingColor }}>
                {general.heading}
              </h2>
            )}
            {general.subheading && (
              <p className="w-full mt-4 text-base leading-7" style={{ color: effectiveSubheadingColor }}>
                {general.subheading}
              </p>
            )}
          </div>
        )}
        
        {renderContent()}
      </div>
    </div>
  );
};
