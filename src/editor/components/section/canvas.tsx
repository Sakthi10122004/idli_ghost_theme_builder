import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { backgroundVideoUrl, enableParallax = false, contentWidth } = block.styles || {};
  
  // Extract background styles from inline styles that the builder applies
  const appearance = block.props?.appearance || {};
  const bgType = block.styles?.backgroundType || "solid";
  let defaultBg = appearance?.backgroundColor || "transparent";
  if (defaultBg === "#ffffff" || defaultBg === "#fff") {
    defaultBg = "var(--color-canvas)";
  }
  
  let bgStyle: React.CSSProperties = { backgroundColor: defaultBg };

  if (bgType === "solid") {
    const rawBg = block.styles?.backgroundColor || appearance?.backgroundColor;
    if (rawBg) {
      const bg = (rawBg === "#ffffff" || rawBg === "#fff") ? "var(--color-canvas)" : rawBg;
      bgStyle = { backgroundColor: bg };
    }
  } else if (bgType === "linear") {
    const c1 = block.styles?.gradientColor1 || "#000000";
    const c2 = block.styles?.gradientColor2 || "#333333";
    const angle = block.styles?.gradientAngle !== undefined ? block.styles.gradientAngle : 90;
    bgStyle = { backgroundImage: `linear-gradient(${angle}deg, ${c1}, ${c2})`, backgroundColor: defaultBg };
  } else if (bgType === "radial") {
    const c1 = block.styles?.gradientColor1 || "#000000";
    const c2 = block.styles?.gradientColor2 || "#333333";
    const pos = block.styles?.gradientPosition || "center";
    bgStyle = { backgroundImage: `radial-gradient(circle at ${pos}, ${c1}, ${c2})`, backgroundColor: defaultBg };
  } else if (bgType === "image" && block.styles?.bgImageUrl) {
    const url = block.styles.bgImageUrl;
    const overlay = block.styles?.bgOverlayColor || "#000000";
    const opacity = block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5;
    let r = 0, g = 0, b = 0;
    if (overlay.length === 7) {
      r = parseInt(overlay.slice(1, 3), 16);
      g = parseInt(overlay.slice(3, 5), 16);
      b = parseInt(overlay.slice(5, 7), 16);
    }
    const overlayRgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    bgStyle = {
      backgroundColor: defaultBg,
      backgroundImage: `linear-gradient(${overlayRgba}, ${overlayRgba}), url('${url}')`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    };
  }
  const getStyleValue = (val: unknown): string | undefined => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    if (typeof val === "object" && val !== null) {
      const resp = val as Record<string, string>;
      return resp.desktop || resp.tablet || resp.mobile;
    }
    return undefined;
  };

  return (
    <section 
      className={`relative w-full ${backgroundVideoUrl ? 'overflow-hidden' : ''} ${block.styles?.backgroundType === 'mesh' ? 'mesh-glow' : ''}`}
      style={{ 
        ...bgStyle, 
        paddingTop: getStyleValue(block.styles?.paddingTop), 
        paddingBottom: getStyleValue(block.styles?.paddingBottom) 
      }}
    >
      {backgroundVideoUrl && (
        <video 
          src={backgroundVideoUrl} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}
      <div 
        className="w-full max-w-7xl mx-auto px-6 relative z-10"
        style={contentWidth ? { maxWidth: contentWidth } : {}}
      >
        {renderChildren()}
      </div>
    </section>
  );
};