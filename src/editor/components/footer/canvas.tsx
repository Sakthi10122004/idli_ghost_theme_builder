import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { DEFAULT_SECONDARY_NAV, FooterNavItem, WIDTH_VALUES } from "./schema";
import { ALL_SOCIAL_PLATFORMS, DEFAULT_SOCIAL_PLATFORMS, SocialPlatform } from "./socialIcons";
import { getBackgroundStyle } from "../shared/background";

export function CanvasElement({ block, onClick }: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) {
  const p = block.props;
  
  const document = useEditorStore(state => state.document);
  const headerBlock = Object.values(document.blocks).find(b => b.type === "header");
  const headerAppearance = headerBlock?.props?.appearance || {};
  
  const isSync = p.colors?.syncWithHeader;
  const activeStyles = isSync ? (headerBlock?.styles || {}) : (block.styles || {});
  const activeAppearance = isSync ? headerAppearance : (p.colors || {});
  
  const bgStyleObj = getBackgroundStyle(activeStyles, activeAppearance);
  const bgFallbackColor = activeAppearance.backgroundColor || "var(--color-canvas)";
  const text = isSync ? (headerAppearance.textColor || "var(--color-ink)") : (p.colors?.textColor || "var(--color-ink)");

  const primaryNavItems = Array.isArray(headerBlock?.props?.navItems) && headerBlock.props.navItems.length > 0
    ? headerBlock.props.navItems
    : [
        { label: "Home", url: "/" },
        { label: "About", url: "/about" },
        { label: "Collection", url: "/collection" }
      ];

  const layoutStyle = p.general?.layoutStyle || "Simple Minimal";
  const showSecondaryNav = p.general?.showSecondaryNav !== false;
  const secondaryNavTitle = p.general?.secondaryNavTitle || "More";
  const secondaryNavItems: FooterNavItem[] = DEFAULT_SECONDARY_NAV;
  const showSocialIcons = p.general?.showSocialIcons !== false;
  const showCopyright = p.general?.showCopyright !== false;
  const showSubscribeBox = p.general?.showSubscribeBox !== false;
  
  const copyrightText = p.general?.customCopyrightText || "© 2026 Ghost Theme Builder. Published with Ghost.";

  const paddingTop = 
    p.spacing?.paddingTop !== undefined ? (typeof p.spacing.paddingTop === 'number' ? `${p.spacing.paddingTop}px` : p.spacing.paddingTop) :
    block.styles?.paddingTop ||
    (p.spacing?.padding?.topBottom !== undefined ? `${p.spacing.padding.topBottom}px` : "40px");

  const paddingBottom = 
    p.spacing?.paddingBottom !== undefined ? (typeof p.spacing.paddingBottom === 'number' ? `${p.spacing.paddingBottom}px` : p.spacing.paddingBottom) :
    block.styles?.paddingBottom ||
    (p.spacing?.padding?.topBottom !== undefined ? `${p.spacing.padding.topBottom}px` : "40px");

  const sectionWidth = p.layout?.sectionWidth || "full";
  const sectionMaxWidth = WIDTH_VALUES[sectionWidth] || "100%";
  const isSectionFull = sectionWidth === "full";
  
  const activePlatforms: SocialPlatform[] = p.general?.socialPlatforms || DEFAULT_SOCIAL_PLATFORMS;
  const platformMap = React.useMemo(() => {
    return new Map(ALL_SOCIAL_PLATFORMS.map(item => [item.id, item]));
  }, []);

  const socialIcons = (
    <div className="flex gap-4 items-center opacity-80">
      {activePlatforms.map((platformId) => {
        const item = platformMap.get(platformId);
        if (!item) return null;
        return (
          <span 
            key={platformId} 
            title={item.label}
            className="hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            {item.renderIcon({ size: 20 })}
          </span>
        );
      })}
    </div>
  );

  return (
    <footer 
      className={`site-footer w-full px-6 transition-all section-width-${sectionWidth} ${activeStyles.backgroundType === "mesh" ? 'mesh-glow' : ''}`}
      style={{ 
        ...bgStyleObj, 
        color: text, 
        paddingTop, 
        paddingBottom,
        maxWidth: sectionMaxWidth,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: isSectionFull ? "0" : "12px",
        marginTop: isSectionFull ? "0" : "24px",
        marginBottom: isSectionFull ? "0" : "24px",
      }}
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
                {primaryNavItems.map((item: { label: string; url?: string }, idx: number) => (
                  <a key={idx} href={item.url || "#"} onClick={(e) => e.preventDefault()} className="hover:opacity-100 transition-opacity">
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            {showSecondaryNav && (
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider opacity-60">{secondaryNavTitle}</h4>
                <nav className="flex flex-col gap-3 opacity-80">
                  {secondaryNavItems.map((item, idx) => (
                    <a key={idx} href={item.url || "#"} onClick={(e) => e.preventDefault()} className="hover:opacity-100 transition-opacity">
                      {item.label}
                    </a>
                  ))}
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
              <nav className="flex flex-wrap items-center gap-5 opacity-80">
                {secondaryNavItems.map((item, idx) => (
                  <a key={idx} href={item.url || "#"} onClick={(e) => e.preventDefault()} className="hover:opacity-100 transition-opacity">
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
            {showSocialIcons && layoutStyle !== "Multi-Column" && socialIcons}
          </div>
        </div>

      </div>
    </footer>
  );
};