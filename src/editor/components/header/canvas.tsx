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
        document.documentElement.classList.toggle('dark');
      }}
      className={`p-1.5 opacity-80 hover:opacity-100 rounded-full ${iconHoverClass} shrink-0 transition-opacity`}
      title="Toggle Theme"
    >
      <svg className="icon-moon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <svg className="icon-sun" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'none' }}>
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  );

  /**
   * Renders action buttons (sign in, subscribe).
   * Search and theme toggle are now handled separately for mobile placement.
   */
  const renderActions = (vertical = false) => {
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
          ? "gh-head-btn gh-btn w-full max-w-[280px] py-2.5 rounded-full text-[1.0625rem] font-semibold shadow-sm transition-all whitespace-nowrap opacity-90 hover:opacity-100"
          : "gh-head-btn gh-btn px-6 py-2.5 rounded-full text-[1.0625rem] font-semibold shadow-sm transition-all whitespace-nowrap opacity-90 hover:opacity-100"
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

    return (
      <div className="flex flex-col items-center gap-5 w-full">
        {subscribeButton}
        {signInButton}
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
            <line x1="3" y1="8" x2="21" y2="8"></line>
            <line x1="3" y1="16" x2="21" y2="16"></line>
          </>
        )}
      </svg>
    </button>
  );

  const renderMobileTopBarActions = () => (
    <div className="flex items-center gap-2">
      {searchButton}
      {themeButton}
      {renderBurgerButton()}
    </div>
  );

  /**
   * Renders the full-screen mobile menu overlay.
   */
  const renderMobileOverlay = () => {
    if (!isMobile) return null;

    // Always render but control visibility via CSS
    const overlayContent = (
      <div
        className="gh-head"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          maxHeight: "850px",
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
          className="flex items-center justify-between w-full px-4"
          style={{ height: "64px", flexShrink: 0 }}
        >
          {renderLogo("M3.5 18.5l8.5-15 8.5 15h-17zm8.5-11.5l-4.5 8h9l-4.5-8z")}
          {renderMobileTopBarActions()}
        </div>

        {/* Nav items with staggered animation */}
        <div className="flex flex-col items-center justify-start gap-5 px-6 pt-10 pb-8">
          <nav className="flex flex-col items-center gap-5 w-full">
            {items.map((item: any, idx: number) => (
              <span
                key={idx}
                className="cursor-pointer hover:opacity-100 transition-opacity text-[1.5rem] leading-[1.3] font-semibold"
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
          className="flex flex-col items-center gap-3 px-6 py-6 mt-auto gh-head-actions"
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
              {renderMobileTopBarActions()}
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