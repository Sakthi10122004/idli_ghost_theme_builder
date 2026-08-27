import React, { useState } from "react";
import { createPortal } from "react-dom";
import { BuilderBlock } from "@/types/theme";
import { hexToRgba, WIDTH_VALUES, CONTENT_WIDTH_VALUES } from "./constants";
import { useEditorStore } from "@/store/editorStore";

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
  const advanced = p.advanced || {};

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { deviceMode } = useEditorStore();

  const items = Array.isArray(p.navItems) && p.navItems.length > 0 ? p.navItems : [
    { label: "Lifestyle", url: "#" },
    { label: "Travel", url: "#" },
    { label: "About", url: "#" },
    { label: "Resources", url: "#" }
  ];

  const layout = general.layoutStyle || "Logo on Left";
  const isLogoCenter = layout === "Logo in Center";
  const isStacked = layout === "Stacked";

  const palette = {
    bg: appearance.backgroundColor || "#ffffff",
    text: appearance.textColor || "#000000",
    buttonBg: appearance.buttonBgColor || "#000000",
    buttonText: appearance.buttonTextColor || "#ffffff",
  };

  const logoSize = general.logoSize || 40;

  const effectiveContentWidth =
    widthRank(appearance.contentWidth) > widthRank(appearance.sectionWidth)
      ? appearance.sectionWidth
      : appearance.contentWidth;

  const glassEnabled = !!styles.backdropBlur && styles.backdropBlur !== "none";
  const bgStyle = glassEnabled ? hexToRgba(palette.bg, 0.75) : palette.bg;

  const sectionMaxWidth = WIDTH_VALUES[appearance.sectionWidth || "full"] || "100%";
  const isSectionFull = sectionMaxWidth === "100%";
  const sectionBaseClass = isSectionFull ? "w-full" : "w-full mx-auto rounded-xl my-2";

  const contentMaxWidth = CONTENT_WIDTH_VALUES[effectiveContentWidth || "wide"] || "100%";

  const marginBottomValue = styles.marginBottom || "0px";
  const shadowValue =
    styles.boxShadow === "dark-glow"
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
      : styles.boxShadow && styles.boxShadow !== "none"
        ? "0 4px 6px -1px rgba(0,0,0,0.1)"
        : "none";
  const opacityValue = styles.opacity ?? 1;

  const iconHoverClass = "hover:bg-black/5 dark:hover:bg-white/10";

  const isMobile = deviceMode === 'mobile';

  /**
   * Renders action buttons (search, theme toggle, sign in, subscribe).
   * FIX (bug 1): previously `vertical` forced every single action into one
   * flex-col stack, so the two small icon buttons each took a full-width
   * row of their own instead of sitting side by side. Icons are now grouped
   * into their own horizontal row regardless of orientation; only the
   * overall arrangement (icons row -> sign in -> subscribe) stacks
   * vertically on mobile.
   */
  const renderActions = (vertical = false) => {
    const searchButton = general.showSearch !== false && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal("Ghost SodoSearch simulation active.");
        }}
        className={`p-1.5 opacity-80 hover:opacity-100 rounded-full ${iconHoverClass} shrink-0 transition-opacity`}
        title="Test Ghost Search"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    );

    const themeButton = general.showThemeSwitcher !== false && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal("Theme Switcher toggled.");
        }}
        className={`p-1.5 opacity-80 hover:opacity-100 rounded-full ${iconHoverClass} shrink-0 transition-opacity`}
        title="Toggle Theme"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    );

    const signInButton = general.showSignIn !== false && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal("Ghost Portal Sign In simulation active.");
        }}
        className="text-[1.0625rem] font-medium opacity-90 hover:opacity-100 hover:underline whitespace-nowrap px-1"
      >
        {general.signInText || "Sign in"}
      </button>
    );

    const subscribeButton = general.showSubscribe !== false && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setActiveModal("Ghost Portal Subscribe simulation active.");
        }}
        className={vertical
          ? "w-full max-w-[280px] py-2.5 rounded-full text-[1.0625rem] font-semibold shadow-sm transition-all whitespace-nowrap opacity-90 hover:opacity-100"
          : "px-6 py-2.5 rounded-full text-[1.0625rem] font-semibold shadow-sm transition-all whitespace-nowrap opacity-90 hover:opacity-100"
        }
        style={{ backgroundColor: palette.buttonBg, color: palette.buttonText }}
      >
        {general.subscribeText || "Subscribe"}
      </button>
    );

    if (!vertical) {
      return (
        <div className="flex items-center gap-4 shrink-0">
          {searchButton}
          {themeButton}
          {signInButton}
          {subscribeButton}
        </div>
      );
    }

    const hasIcons = !!(searchButton || themeButton);

    return (
      <div className="flex flex-col items-center gap-5 w-full">
        {hasIcons && (
          <div className="flex items-center gap-6">
            {searchButton}
            {themeButton}
          </div>
        )}
        {signInButton}
        {subscribeButton}
      </div>
    );
  };

  const logoIcon = (paths: string) => (
    <svg
      className="fill-current shrink-0"
      style={{ width: logoSize, height: logoSize }}
      viewBox="0 0 24 24"
    >
      <path d={paths} />
    </svg>
  );

  /**
   * Renders the hamburger / close toggle button for mobile view.
   */
  const renderBurgerButton = () => (
    <button 
      className="p-2 opacity-80 hover:opacity-100 transition-opacity relative z-50" 
      aria-label="Menu"
      onClick={(e) => {
        e.stopPropagation();
        setIsMobileMenuOpen(!isMobileMenuOpen);
      }}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {isMobileMenuOpen ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </>
        ) : (
          <>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </>
        )}
      </svg>
    </button>
  );

  /**
   * Renders the full-screen mobile menu overlay.
   * FIX (bug 2): was `position: absolute` with `bottom: 0` on a wrapper that
   * has no defined height of its own, so the browser fell back to
   * `minHeight: 100vh` — the FULL page/browser-window height, not the
   * mobile preview frame. That's what pushed Subscribe far down with a big
   * empty gap beneath it. `position: fixed` binds to the nearest viewport
   * (the preview frame's own, if this renders inside one) and needs no
   * height fallback at all.
   */
  const renderMobileOverlay = () => {
    if (!isMobile) return null;

    // Always render but control visibility via CSS
    const overlayContent = (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: bgStyle,
          color: palette.text,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          backdropFilter: glassEnabled ? "blur(12px)" : "none",
          WebkitBackdropFilter: glassEnabled ? "blur(12px)" : "none",
          opacity: isMobileMenuOpen ? 1 : 0,
          visibility: isMobileMenuOpen ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
      >
        {/* Top bar: logo + close button */}
        <div
          className="flex items-center justify-between w-full px-6"
          style={{ height: "64px", flexShrink: 0 }}
        >
          {renderLogo("M3.5 18.5l8.5-15 8.5 15h-17zm8.5-11.5l-4.5 8h9l-4.5-8z")}
          <button
            className="p-2 opacity-80 hover:opacity-100 transition-opacity"
            aria-label="Close Menu"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Nav items with staggered animation */}
        <div className="flex flex-col items-center justify-start gap-5 px-6 pt-10 pb-8">
          <nav className="flex flex-col items-center gap-5 w-full">
            {items.map((item: any, idx: number) => (
              <span
                key={idx}
                className="cursor-pointer hover:opacity-100 transition-opacity text-[2.15rem] leading-[1.3] font-semibold"
                style={{
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-12px)',
                  transition: `opacity 0.3s ease ${idx * 0.05}s, transform 0.3s ease ${idx * 0.05}s`,
                }}
              >
                {item.label}
              </span>
            ))}
          </nav>
        </div>

        {/* Actions: sticky at the bottom */}
        <div
          className="flex flex-col items-center gap-3 px-6 py-6 mt-auto"
          style={{
            flexShrink: 0,
            backgroundColor: bgStyle,
            opacity: isMobileMenuOpen ? 1 : 0,
            transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s`,
          }}
        >
          {renderActions(true)}
        </div>
      </div>
    );

    // Use portal to render at the root level
    if (typeof document !== "undefined") {
      const portalTarget = document.getElementById("canvas-preview-frame") || document.body;
      return createPortal(overlayContent, portalTarget);
    }

    return overlayContent;
  };

  /**
   * Renders the logo section.
   */
  const renderLogo = (iconPath: string, showLabel = false) => {
    if (general.showLogo === false && general.layoutStyle !== 'Logo in Center') {
      return (
        <div className="flex items-center gap-2 font-bold tracking-tight text-2xl shrink-0">
          <span>Publication</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 font-bold tracking-tight text-2xl shrink-0">
        {general.showLogo !== false && logoIcon(iconPath)}
        {showLabel && <span>Publication</span>}
      </div>
    );
  };

  /**
   * Renders the desktop navigation links.
   */
  const renderDesktopNav = (justify: string = "center") => (
    <nav className={`flex items-center gap-7 text-[1.15rem] font-medium opacity-90 overflow-hidden ${
      justify === "center" ? "justify-center" : "justify-start"
    }`}>
      {items.map((item: any, idx: number) => (
        <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap px-4 py-2">
          {item.label}
        </span>
      ))}
    </nav>
  );

  return (
    <div
      className="w-full bg-transparent p-0"
      style={{
        position: "relative",
      }}
    >
      {/* Header receives Section Width & Colors */}
      <header
        id={advanced.htmlAnchor || "gh-head"}
        className={`relative transition-all duration-150 gh-head section-width-${appearance.sectionWidth || 'full'} ${sectionBaseClass}`}
        style={{
          backgroundColor: bgStyle,
          color: palette.text,
          maxWidth: sectionMaxWidth,
          marginBottom: marginBottomValue,
          boxShadow: shadowValue,
          opacity: opacityValue,
          backdropFilter: glassEnabled ? "blur(12px)" : "none",
          WebkitBackdropFilter: glassEnabled ? "blur(12px)" : "none",
          transition: "all 0.15s ease-in-out",
        }}
      >
        {/* Inner container receives Content Width */}
        <div
          className={`mx-auto px-6 gh-head-inner content-width-${appearance.contentWidth || 'wide'}`}
          style={{
            maxWidth: contentMaxWidth,
            width: "100%",
            height: isMobile ? "64px" : "auto",
            padding: isMobile ? "0 16px" : "20px 24px",
            display: "flex",
            alignItems: "center",
          }}
        >

          {isMobile ? (
            /* ============ MOBILE LAYOUT ============ */
            <div className="flex items-center justify-between w-full" style={{ height: "64px" }}>
              {renderLogo("M3.5 18.5l8.5-15 8.5 15h-17zm8.5-11.5l-4.5 8h9l-4.5-8z")}
              {renderBurgerButton()}
            </div>
          ) : isStacked ? (
            /* ============ STACKED DESKTOP ============ */
            <div className="flex flex-col items-center gap-4 text-center w-full">
              {renderLogo("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", true)}
              <nav className="flex flex-wrap justify-center items-center gap-8 text-[1.15rem] font-medium opacity-90">
                {items.map((item: any, idx: number) => (
                  <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap px-4 py-2">
                    {item.label}
                  </span>
                ))}
              </nav>
              {renderActions()}
            </div>
          ) : isLogoCenter ? (
            /* ============ LOGO CENTER DESKTOP ============ */
            <div className="flex items-center justify-between w-full gap-6">
              <div className="flex-1 flex items-center justify-start min-w-0">
                {renderDesktopNav("start")}
              </div>

              <div className="shrink-0 flex items-center justify-center font-bold tracking-tight px-4 whitespace-nowrap">
                {renderLogo("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5")}
              </div>

              <div className="flex-1 flex items-center justify-end min-w-0">
                {renderActions()}
              </div>
            </div>
          ) : (
            /* ============ LOGO LEFT DESKTOP (default) ============ */
            <div className="flex items-center justify-between w-full gap-8">
              <div className="flex items-center gap-8 min-w-0">
                {renderLogo("M3.5 18.5l8.5-15 8.5 15h-17zm8.5-11.5l-4.5 8h9l-4.5-8z")}
                {renderDesktopNav()}
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

      {/* Mobile Menu Full-Screen Overlay — rendered outside header to avoid clipping */}
      {renderMobileOverlay()}
    </div>
  );
};