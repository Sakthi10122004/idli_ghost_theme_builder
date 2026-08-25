import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";

const WIDTH_ORDER = ["narrow", "standard", "wide", "full"] as const;

const widthRank = (w: string | undefined) => {
  const i = WIDTH_ORDER.indexOf((w as typeof WIDTH_ORDER[number]) ?? "full");
  return i === -1 ? WIDTH_ORDER.length - 1 : i;
};

export const CanvasElement = ({ block }: {
  block: BuilderBlock;
}) => {
  const p = block.props || {};
  const general = p.general || {};
  const appearance = p.appearance || {};
  const styles = p.styles || {};

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const items = Array.isArray(p.navItems) && p.navItems.length > 0 ? p.navItems : [
    { label: "Lifestyle", url: "#" },
    { label: "Travel", url: "#" },
    { label: "About", url: "#" },
    { label: "Resources", url: "#" }
  ];

  const layout = general.layoutStyle || "Logo on Left";
  const isLogoCenter = layout === "Logo in Center";
  const isStacked = layout === "Stacked";
  const isDarkForce = appearance.colorMode === "dark";

  const effectiveContentWidth =
    widthRank(appearance.contentWidth) > widthRank(appearance.sectionWidth)
      ? appearance.sectionWidth
      : appearance.contentWidth;

  // Palette background and text colors
  const getPaletteClass = (palette: string) => {
    if (isDarkForce) {
      switch (palette) {
        case "dark": return "bg-[#18181b] text-white";
        case "classic": return "bg-[#111827] text-white";
        case "dynamic": return "bg-[#b91c1c] text-white";
        case "sand": return "bg-[#292524] text-white";
        case "zinc": return "bg-[#27272a] text-white";
        case "graphite": return "bg-[#18181b] text-white";
        case "stone": return "bg-[#1c1917] text-white";
        case "ocean": return "bg-[#0c4a6e] text-[#e0f2fe]";
        case "indigo": return "bg-[#1e1b4b] text-[#e0e7ff]";
        case "violet": return "bg-[#2e1065] text-[#ede9fe]";
        case "rose": return "bg-[#4c0519] text-[#ffe4e6]";
        case "amber": return "bg-[#451a03] text-[#fef3c7]";
        case "sage": return "bg-[#064e3b] text-[#d1fae5]";
        case "default": return "bg-[#18181b] text-white";
        default: return "bg-[#18181b] text-white";
      }
    } else {
      switch (palette) {
        case "dark": return "bg-gray-900 text-white";
        case "classic": return "bg-[#f3f4f6] text-gray-900";
        case "dynamic": return "bg-[#fee2e2] text-red-900";
        case "sand": return "bg-[#f5f5f4] text-[#44403c]";
        case "zinc": return "bg-[#f4f4f5] text-[#27272a]";
        case "graphite": return "bg-[#e4e4e7] text-[#18181b]";
        case "stone": return "bg-[#e7e5e4] text-[#1c1917]";
        case "ocean": return "bg-[#e0f2fe] text-[#0c4a6e]";
        case "indigo": return "bg-[#1e1b4b] text-[#e0e7ff]";
        case "violet": return "bg-[#ede9fe] text-[#4c1d95]";
        case "rose": return "bg-[#ffe4e6] text-[#881337]";
        case "amber": return "bg-[#fef3c7] text-[#78350f]";
        case "sage": return "bg-[#d1fae5] text-[#064e3b]";
        case "default": return "bg-white text-gray-900";
        default: return "bg-[#1e1b4b] text-[#e0e7ff]";
      }
    }
  };

  // Section Width: Constrains the actual header bar on the canvas
  const getSectionWidthClass = (width: string) => {
    switch (width) {
      case "narrow": return "max-w-4xl mx-auto rounded-xl my-2";
      case "standard": return "max-w-6xl mx-auto rounded-xl my-2";
      case "wide": return "max-w-7xl mx-auto";
      default: return "w-full"; // Full width spans edge-to-edge
    }
  };
  
  // Content Width: Constrains the inner items within the header
  const getContentWidthClass = (width: string) => {
    switch (width) {
      case "narrow": return "max-w-3xl";
      case "standard": return "max-w-5xl";
      case "wide": return "max-w-6xl";
      default: return "w-full";
    }
  };

  const renderActions = () => (
    <div className="flex items-center gap-4 shrink-0">
      {general.showSearch !== false && (
        <button 
          type="button"
          onClick={() => setActiveModal("Ghost SodoSearch simulation active.")} 
          className="p-1.5 opacity-80 hover:opacity-100 rounded-full hover:bg-white/10 shrink-0 transition-opacity" 
          title="Test Ghost Search"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      )}

      {general.showThemeSwitcher !== false && (
        <button 
          type="button"
          onClick={() => setActiveModal("Theme Switcher toggled.")} 
          className="p-1.5 opacity-80 hover:opacity-100 rounded-full hover:bg-white/10 shrink-0 transition-opacity" 
          title="Toggle Theme"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      )}

      {general.showSignIn !== false && (
        <button 
          type="button"
          onClick={() => setActiveModal("Ghost Portal Sign In simulation active.")} 
          className="text-sm font-medium opacity-90 hover:opacity-100 hover:underline whitespace-nowrap px-1"
        >
          {general.signInText || "Sign in"}
        </button>
      )}

      {general.showSubscribe !== false && (
        <button 
          type="button"
          onClick={() => setActiveModal("Ghost Portal Subscribe simulation active.")} 
          className="bg-[#6366f1] text-white hover:bg-[#4f46e5] px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-all whitespace-nowrap"
        >
          {general.subscribeText || "Subscribe"}
        </button>
      )}
    </div>
  );

  return (
    <div className="w-full bg-transparent p-0">
      {/* Header receives Section Width & Colors */}
      <header 
        className={`relative transition-all duration-150 ${getPaletteClass(appearance.colorPalette)} ${getSectionWidthClass(appearance.sectionWidth)}`}
        style={{
          marginBottom: styles.marginBottom || "0px",
          boxShadow: styles.boxShadow === "dark-glow" ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : styles.boxShadow !== "none" ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
          opacity: styles.opacity ?? 1,
          backdropFilter: styles.backdropBlur !== "none" ? "blur(12px)" : "none",
        }}
      >
        {/* Inner container receives Content Width */}
        <div className={`w-full mx-auto px-6 py-4 ${getContentWidthClass(effectiveContentWidth)}`}>
          
          {isStacked ? (
            <div className="flex flex-col items-center gap-4 text-center w-full">
              {general.showLogo !== false && (
                <div className="flex items-center gap-2 font-bold tracking-tight text-lg">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span>Publication</span>
                </div>
              )}
              <nav className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium opacity-90">
                {items.map((item: any, idx: number) => (
                  <span key={idx} className="cursor-pointer hover:opacity-100 hover:text-white transition-opacity whitespace-nowrap">
                    {item.label}
                  </span>
                ))}
              </nav>
              {renderActions()}
            </div>
          ) : isLogoCenter ? (
            <div className="flex items-center justify-between w-full gap-6">
              <div className="flex-1 flex items-center justify-start min-w-0">
                <nav className="flex items-center gap-8 text-sm font-medium opacity-90 overflow-hidden">
                  {items.map((item: any, idx: number) => (
                    <span key={idx} className="cursor-pointer hover:opacity-100 hover:text-white transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                  ))}
                </nav>
              </div>

              <div className="shrink-0 flex items-center justify-center font-bold tracking-tight px-4 whitespace-nowrap">
                {general.showLogo !== false && (
                  <div className="flex items-center gap-2 text-lg">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 flex items-center justify-end min-w-0">
                {renderActions()}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full gap-8">
              <div className="flex items-center gap-8 min-w-0">
                {general.showLogo !== false && (
                  <div className="flex items-center gap-2 font-bold tracking-tight text-xl shrink-0">
                    <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                      <path d="M3.5 18.5l8.5-15 8.5 15h-17zm8.5-11.5l-4.5 8h9l-4.5-8z"/>
                    </svg>
                  </div>
                )}
                
                <nav className="flex items-center gap-7 text-sm font-medium opacity-90 overflow-hidden">
                  {items.map((item: any, idx: number) => (
                    <span key={idx} className="cursor-pointer hover:opacity-100 hover:text-white transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                  ))}
                </nav>
              </div>

              <div className="shrink-0">
                {renderActions()}
              </div>
            </div>
          )}

        </div>

        {/* Modal feedback */}
        {activeModal && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black text-white text-xs rounded shadow-lg z-50 flex items-center gap-2">
            <span>{activeModal}</span>
            <button onClick={() => setActiveModal(null)} className="font-bold ml-2">×</button>
          </div>
        )}
      </header>
    </div>
  );
};