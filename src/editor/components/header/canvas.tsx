import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { getPaletteConfig, hexToRgba, WIDTH_VALUES, CONTENT_WIDTH_VALUES } from "./constants";

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

  // FIX (bug 5): local state so "inherit" mode can actually be demoed live in
  // the canvas by clicking the theme switcher, instead of only opening a toast.
  const [previewAmbientDark, setPreviewAmbientDark] = useState(false);

  const items = Array.isArray(p.navItems) && p.navItems.length > 0 ? p.navItems : [
    { label: "Lifestyle", url: "#" },
    { label: "Travel", url: "#" },
    { label: "About", url: "#" },
    { label: "Resources", url: "#" }
  ];

  const layout = general.layoutStyle || "Logo on Left";
  const isLogoCenter = layout === "Logo in Center";
  const isStacked = layout === "Stacked";

  // FIX (bug 5): colorMode now has three real states instead of one boolean.
  // "dark"/"light" force a mode regardless of the site. "inherit" (the
  // default) must respond to the *ambient* theme, so we compute both a
  // light class set and a dark: class set instead of picking one statically.
  const colorMode = appearance.colorMode || "inherit";
  const isForcedDark = colorMode === "dark";
  const isForcedLight = colorMode === "light";
  const isInherit = !isForcedDark && !isForcedLight;
  // Only used for local hover/contrast decisions when a mode is *forced*.
  // In "inherit" mode we can't know the ambient state statically, so hover
  // styles below add a dark: variant instead of relying on this flag.
  const isDarkForce = isForcedDark || (isInherit && previewAmbientDark);

  // FIX (bug 1): logo size now actually read from props and applied.
  const logoSize = general.logoSize || 40;

  const effectiveContentWidth =
    widthRank(appearance.contentWidth) > widthRank(appearance.sectionWidth)
      ? appearance.sectionWidth
      : appearance.contentWidth;

  const palette = getPaletteConfig(appearance.colorPalette || "default", isDarkForce);
  
  const glassEnabled = !!styles.backdropBlur && styles.backdropBlur !== "none";
  const bgStyle = glassEnabled ? hexToRgba(palette.bg, 0.75) : palette.bg;

  // Section Width: Constrains the actual header bar on the canvas
  const sectionMaxWidth = WIDTH_VALUES[appearance.sectionWidth || "full"] || "100%";
  const isSectionFull = sectionMaxWidth === "100%";
  const sectionBaseClass = isSectionFull ? "w-full" : "w-full mx-auto rounded-xl my-2";

  // Content Width: Constrains the inner items within the header
  const contentMaxWidth = CONTENT_WIDTH_VALUES[effectiveContentWidth || "wide"] || "100%";

  // FIX (bug 3): hover states were hardcoded for a dark background
  // (hover:text-white, hover:bg-white/10). On light palettes that's
  // white-on-white — the hover fires, it's just invisible. Nav text now
  // just goes to full opacity of its own (correct) color on hover, and
  // icon buttons pick a hover tint based on the current mode, plus a
  // dark: variant so "inherit" mode adapts to the ambient theme too.
  const iconHoverClass = isDarkForce
    ? "hover:bg-white/10"
    : "hover:bg-black/5 dark:hover:bg-white/10";

  const renderActions = () => (
    <div className="flex items-center gap-4 shrink-0">
      {general.showSearch !== false && (
        <button
          type="button"
          onClick={() => setActiveModal("Ghost SodoSearch simulation active.")}
          className={`p-1.5 opacity-80 hover:opacity-100 rounded-full ${iconHoverClass} shrink-0 transition-opacity`}
          title="Test Ghost Search"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      )}

      {general.showThemeSwitcher !== false && (
        <button
          type="button"
          onClick={() => {
            // Only meaningful to preview when following the ambient theme;
            // forced light/dark shouldn't visually change on click.
            if (isInherit) setPreviewAmbientDark((v) => !v);
            setActiveModal("Theme Switcher toggled.");
          }}
          className={`p-1.5 opacity-80 hover:opacity-100 rounded-full ${iconHoverClass} shrink-0 transition-opacity`}
          title="Toggle Theme"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      )}

      {general.showSignIn !== false && (
        <button
          type="button"
          onClick={() => setActiveModal("Ghost Portal Sign In simulation active.")}
          className="text-[1.0625rem] font-medium opacity-90 hover:opacity-100 hover:underline whitespace-nowrap px-1"
        >
          {general.signInText || "Sign in"}
        </button>
      )}

      {general.showSubscribe !== false && (
        <button
          type="button"
          onClick={() => setActiveModal("Ghost Portal Subscribe simulation active.")}
          className="px-6 py-2.5 rounded-full text-[1.0625rem] font-semibold shadow-sm transition-all whitespace-nowrap opacity-90 hover:opacity-100"
          style={{ backgroundColor: palette.buttonBg, color: palette.buttonText }}
        >
          {general.subscribeText || "Subscribe"}
        </button>
      )}
    </div>
  );

  const logoIcon = (paths: string) => (
    <svg
      className="fill-current shrink-0"
      style={{ width: logoSize, height: logoSize }}
      viewBox="0 0 24 24"
    >
      <path d={paths} />
    </svg>
  );

  return (
    <div className="w-full bg-transparent p-0">
      {/* Header receives Section Width & Colors */}
      <header
        className={`relative transition-all duration-150 ${sectionBaseClass}`}
        style={{
          maxWidth: sectionMaxWidth,
          backgroundColor: bgStyle,
          color: palette.text,
          marginBottom: styles.marginBottom || "0px",
          boxShadow: styles.boxShadow === "dark-glow" ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : styles.boxShadow !== "none" ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
          opacity: styles.opacity ?? 1,
          backdropFilter: glassEnabled ? "blur(12px)" : "none",
          WebkitBackdropFilter: glassEnabled ? "blur(12px)" : "none",
        }}
      >
        {/* Inner container receives Content Width */}
        <div 
          className="w-full mx-auto px-6 py-5"
          style={{ maxWidth: contentMaxWidth }}
        >

          {isStacked ? (
            <div className="flex flex-col items-center gap-4 text-center w-full">
              {general.showLogo !== false && (
                <div className="flex items-center gap-2 font-bold tracking-tight text-2xl">
                  {logoIcon("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5")}
                  <span>Publication</span>
                </div>
              )}
              <nav className="flex flex-wrap justify-center items-center gap-8 text-[1.0625rem] font-medium opacity-90">
                {items.map((item: any, idx: number) => (
                  <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.label}
                  </span>
                ))}
              </nav>
              {renderActions()}
            </div>
          ) : isLogoCenter ? (
            <div className="flex items-center justify-between w-full gap-6">
              <div className="flex-1 flex items-center justify-start min-w-0">
                <nav className="flex items-center gap-8 text-[1.0625rem] font-medium opacity-90 overflow-hidden">
                  {items.map((item: any, idx: number) => (
                    <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.label}
                    </span>
                  ))}
                </nav>
              </div>

              <div className="shrink-0 flex items-center justify-center font-bold tracking-tight px-4 whitespace-nowrap">
                {general.showLogo !== false && (
                  <div className="flex items-center gap-2 text-2xl">
                    {logoIcon("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5")}
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
                  <div className="flex items-center gap-2 font-bold tracking-tight text-2xl shrink-0">
                    {logoIcon("M3.5 18.5l8.5-15 8.5 15h-17zm8.5-11.5l-4.5 8h9l-4.5-8z")}
                  </div>
                )}

                <nav className="flex items-center gap-7 text-[1.0625rem] font-medium opacity-90 overflow-hidden">
                  {items.map((item: any, idx: number) => (
                    <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap">
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