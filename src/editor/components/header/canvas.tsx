import React, { useState } from "react";
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

  // FIX (bug: width computed but discarded): these values now actually get
  // applied as inline maxWidth below, instead of only toggling a Tailwind
  // rounding/margin class that never constrained the width itself.
  const sectionMaxWidth = WIDTH_VALUES[appearance.sectionWidth || "full"] || "100%";
  const isSectionFull = sectionMaxWidth === "100%";
  const sectionBaseClass = isSectionFull ? "w-full" : "w-full mx-auto rounded-xl my-2";

  const contentMaxWidth = CONTENT_WIDTH_VALUES[effectiveContentWidth || "wide"] || "100%";

  // FIX (bug: shadow/opacity/backdrop-blur/margin never applied): previously
  // only set as unused --mb/--shadow/--opacity/--backdrop-blur custom
  // properties with nothing consuming them via var(...). Compute the real
  // values directly instead.
  const marginBottomValue = styles.marginBottom || "0px";
  const shadowValue =
    styles.boxShadow === "dark-glow"
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
      : styles.boxShadow && styles.boxShadow !== "none"
        ? "0 4px 6px -1px rgba(0,0,0,0.1)"
        : "none";
  const opacityValue = styles.opacity ?? 1;

  const iconHoverClass = "hover:bg-black/5 dark:hover:bg-white/10";

  const renderActions = () => (
    <div className="flex items-center gap-4 shrink-0">
      {general.showSearch !== false && (
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
      )}

      {general.showThemeSwitcher !== false && (
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
      )}

      {general.showSignIn !== false && (
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
      )}

      {general.showSubscribe !== false && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveModal("Ghost Portal Subscribe simulation active.");
          }}
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

  const renderMobileMenu = () => (
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

  return (
    <div className="w-full bg-transparent p-0">
      {/* Header receives Section Width & Colors */}
      <header
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
          className={`mx-auto px-6 py-5 gh-head-inner content-width-${appearance.contentWidth || 'wide'}`}
          style={{ maxWidth: contentMaxWidth, width: "100%" }}
        >

          {isStacked ? (
            <div className="flex flex-col items-center gap-4 text-center w-full">
              {general.showLogo !== false && (
                <div className="flex items-center gap-2 font-bold tracking-tight text-2xl">
                  {logoIcon("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5")}
                  <span>Publication</span>
                </div>
              )}
              {deviceMode === 'mobile' ? (
                renderMobileMenu()
              ) : (
                <>
                  <nav className="flex flex-wrap justify-center items-center gap-8 text-[1.15rem] font-medium opacity-90">
                    {items.map((item: any, idx: number) => (
                      <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap px-4 py-2">
                        {item.label}
                      </span>
                    ))}
                  </nav>
                  {renderActions()}
                </>
              )}
            </div>
          ) : isLogoCenter ? (
            <div className="flex items-center justify-between w-full gap-6">
              <div className="flex-1 flex items-center justify-start min-w-0">
                {deviceMode !== 'mobile' && (
                  <nav className="flex items-center gap-8 text-[1.15rem] font-medium opacity-90 overflow-hidden">
                    {items.map((item: any, idx: number) => (
                      <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap px-4 py-2">
                        {item.label}
                      </span>
                    ))}
                  </nav>
                )}
              </div>

              <div className="shrink-0 flex items-center justify-center font-bold tracking-tight px-4 whitespace-nowrap">
                {general.showLogo !== false && (
                  <div className="flex items-center gap-2 text-2xl">
                    {logoIcon("M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5")}
                  </div>
                )}
              </div>

              <div className="flex-1 flex items-center justify-end min-w-0">
                {deviceMode === 'mobile' ? renderMobileMenu() : renderActions()}
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

                {deviceMode !== 'mobile' && (
                  <nav className="flex items-center gap-7 text-[1.15rem] font-medium opacity-90 overflow-hidden">
                    {items.map((item: any, idx: number) => (
                      <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity whitespace-nowrap px-4 py-2">
                        {item.label}
                      </span>
                    ))}
                  </nav>
                )}
              </div>

              <div className="shrink-0">
                {deviceMode === 'mobile' ? renderMobileMenu() : renderActions()}
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

        {/* Mobile Menu Dropdown */}
        {deviceMode === 'mobile' && isMobileMenuOpen && (
          <div 
            className="absolute top-full left-0 w-full p-6 flex flex-col items-center gap-6 shadow-xl z-40 border-t border-black/5 dark:border-white/5"
            style={{
              backgroundColor: bgStyle,
              backdropFilter: glassEnabled ? "blur(12px)" : "none",
              WebkitBackdropFilter: glassEnabled ? "blur(12px)" : "none",
            }}
          >
            <nav className="flex flex-col items-center gap-4 text-lg font-medium opacity-90 w-full">
              {items.map((item: any, idx: number) => (
                <span key={idx} className="cursor-pointer hover:opacity-100 transition-opacity px-4 py-2 w-full text-center border-b border-black/5 dark:border-white/5 last:border-0">
                  {item.label}
                </span>
              ))}
            </nav>
            <div className="w-full flex justify-center pt-2">
              {renderActions()}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};