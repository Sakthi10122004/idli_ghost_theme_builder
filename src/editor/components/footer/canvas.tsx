import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const p = block.props;
  
  const getBackgroundStyle = (styles: any, appearance: any): React.CSSProperties => {
    const bgType = styles?.backgroundType || "solid";
    const defaultBg = appearance?.backgroundColor || "var(--color-canvas)";

    switch (bgType) {
      case "solid":
        return { backgroundColor: appearance?.backgroundColor || "var(--color-canvas)" };
      case "linear": {
        const c1 = styles?.gradientColor1 || "#000000";
        const c2 = styles?.gradientColor2 || "#333333";
        const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
        return { backgroundImage: `linear-gradient(${angle}deg, ${c1}, ${c2})` };
      }
      case "radial": {
        const c1 = styles?.gradientColor1 || "#000000";
        const c2 = styles?.gradientColor2 || "#333333";
        const pos = styles?.gradientPosition || "center";
        return { backgroundImage: `radial-gradient(circle at ${pos}, ${c1}, ${c2})` };
      }
      case "mesh": {
        const m1 = styles?.meshColor1 || "#ff0080";
        const m2 = styles?.meshColor2 || "#7928ca";
        const m3 = styles?.meshColor3 || "#0070f3";
        return {
          backgroundColor: defaultBg,
          backgroundImage: `
            radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
            radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
            radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%)
          `
        };
      }
      case "pattern": {
        const pType = styles?.patternType || "dots";
        const pColor = styles?.patternColor || "#000000";
        if (pType === "dots") {
          return {
            backgroundColor: defaultBg,
            backgroundImage: `radial-gradient(${pColor} 1px, transparent 1px)`,
            backgroundSize: "20px 20px"
          };
        } else if (pType === "lines") {
          return {
            backgroundColor: defaultBg,
            backgroundImage: `repeating-linear-gradient(45deg, ${pColor}20 0, ${pColor}20 1px, transparent 1px, transparent 10px)`
          };
        } else if (pType === "noise") {
          return {
            backgroundColor: pColor,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`
          };
        }
        return { backgroundColor: defaultBg };
      }
      case "image": {
        const url = styles?.bgImageUrl || "";
        const overlayColor = styles?.bgOverlayColor || "#000000";
        const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
        
        let r = 0, g = 0, b = 0;
        if (overlayColor.length === 7) {
          r = parseInt(overlayColor.slice(1, 3), 16);
          g = parseInt(overlayColor.slice(3, 5), 16);
          b = parseInt(overlayColor.slice(5, 7), 16);
        }
        
        const overlay = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        return {
          backgroundColor: defaultBg,
          backgroundImage: `linear-gradient(${overlay}, ${overlay})${url ? `, url('${url}')` : ""}`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        };
      }
      default:
        return { backgroundColor: appearance?.backgroundColor || "var(--color-canvas)" };
    }
  };
  
  const document = useEditorStore(state => state.document);
  const headerBlock = Object.values(document.blocks).find(b => b.type === "header");
  const headerAppearance = headerBlock?.props?.appearance || {};
  
  const isSync = p.colors?.syncWithHeader;
  const activeStyles = isSync ? (headerBlock?.styles || {}) : (block.styles || {});
  const activeAppearance = isSync ? headerAppearance : (p.colors || {});
  
  const bgStyleObj = getBackgroundStyle(activeStyles, activeAppearance);
  const bgFallbackColor = activeAppearance.backgroundColor || "var(--color-canvas)";
  const text = isSync ? (headerAppearance.textColor || "var(--color-ink)") : (p.colors?.textColor || "var(--color-ink)");

  const layoutStyle = p.general?.layoutStyle || "Simple Minimal";
  const showSecondaryNav = p.general?.showSecondaryNav !== false;
  const showSocialIcons = p.general?.showSocialIcons !== false;
  const showCopyright = p.general?.showCopyright !== false;
  const showSubscribeBox = p.general?.showSubscribeBox !== false;
  
  const copyrightText = p.general?.customCopyrightText || "© 2026 Ghost Theme Builder. Published with Ghost.";
  
  const socialIcons = (
    <div className="flex gap-4 items-center opacity-80">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.954 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.898 10.124-5.864 10.124-11.853z"/></svg>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </div>
  );

  return (
    <footer 
      className={`site-footer w-full py-10 px-6 transition-all ${activeStyles.backgroundType === "mesh" ? 'mesh-glow' : ''}`}
      style={{ ...bgStyleObj, color: text }}
      onClick={onClick}
    >
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8">
        
        {layoutStyle === "Multi-Column" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div className="flex flex-col gap-4">
              <h4 className="text-xl font-bold">Your Publication</h4>
              <p className="opacity-80 leading-relaxed">Thoughts, stories and ideas about building modern software and design.</p>
              {showSocialIcons && socialIcons}
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">Navigation</h4>
              <nav className="flex flex-col gap-3 opacity-80">
                <span>Home</span>
                <span>About</span>
                <span>Collection</span>
              </nav>
            </div>
            {showSecondaryNav && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">More</h4>
                <nav className="flex flex-col gap-3 opacity-80">
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                  <span>Contact</span>
                </nav>
              </div>
            )}
          </div>
        )}

        {layoutStyle === "Newsletter Integrated" && showSubscribeBox && (
          <div className="text-center max-w-[600px] mx-auto mb-10 p-12 rounded-xl" style={{ backgroundColor: 'currentColor', color: bgFallbackColor }}>
            <h3 className="text-2xl font-bold mb-3">Subscribe to our newsletter</h3>
            <p className="opacity-80 mb-6">Get the latest posts delivered right to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-[400px] mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-md outline-none text-black" readOnly />
              <button className="footer-subscribe-btn px-6 py-3 font-bold rounded-md" style={{ backgroundColor: p.colors?.buttonBgColor || 'var(--ghost-accent-color, var(--color-primary))', color: p.colors?.buttonTextColor || '#ffffff' }}>Subscribe</button>
            </div>
          </div>
        )}

        {/* Footer Bottom Row */}
        <div className={`flex flex-col md:flex-row items-center gap-6 text-sm ${layoutStyle !== "Simple Minimal" ? 'pt-6 border-t opacity-90 border-current border-opacity-20 md:justify-between' : 'justify-between'}`}>
          {showCopyright && <span className="opacity-70">{copyrightText}</span>}
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            {showSecondaryNav && layoutStyle !== "Multi-Column" && (
              <nav className="flex gap-4 opacity-80">
                <span>Privacy</span>
                <span>Terms</span>
              </nav>
            )}
            {showSocialIcons && layoutStyle !== "Multi-Column" && socialIcons}
          </div>
        </div>

      </div>
    </footer>
  );
};