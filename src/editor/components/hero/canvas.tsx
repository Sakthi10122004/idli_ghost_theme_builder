import React from "react";
import { BuilderBlock } from "@/types/theme";

const getBackgroundStyle = (styles: any): React.CSSProperties => {
  const bgType = styles?.backgroundType || "solid";
  const defaultBg = "transparent";

  switch (bgType) {
    case "solid":
      return { backgroundColor: styles?.backgroundColor || defaultBg };
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
      return { backgroundColor: defaultBg };
  }
};

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { eyebrowText, title, subtitle, buttonLabel, showSecondaryButton, secondaryButtonLabel, useSiteData } = block.props;
  
  const bgStyle = getBackgroundStyle(block.styles);
  // If useSiteData is true, we should probably preview what that might look like, or just keep it simple.
  // We'll apply bgStyle unless useSiteData overrides it.
  const dynamicStyle = useSiteData ? { backgroundColor: '#111', color: '#fff' } : bgStyle;

  return (
    <div
      className={`w-full text-center relative overflow-hidden ${!useSiteData && block.styles?.backgroundType === "mesh" ? 'mesh-glow' : ''}`}
      style={{
        ...dynamicStyle,
        paddingTop: (block.styles?.paddingTop as string) || '3rem',
        paddingBottom: (block.styles?.paddingBottom as string) || '5rem'
      }}
    >
      <div 
        className="mx-auto px-6 flex flex-col items-center gap-5 relative z-10"
        style={{ maxWidth: block.styles?.contentWidth || '800px' }}
      >
        {eyebrowText && (
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-link font-semibold bg-brand-link-bg-soft px-3 py-1 rounded-full mb-2">
            {eyebrowText}
          </span>
        )}
        <h1 className="text-[2.75rem] md:text-[3.5rem] font-sans font-bold leading-[1.1] tracking-[-0.02em] break-words max-w-full text-[var(--color-ink)]">
          {useSiteData ? "{{@site.title}}" : (title || "Build beautiful templates.")}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-[600px] break-words text-[var(--color-body)]">
          {useSiteData ? "{{@site.description}}" : (subtitle || "A visual workspace built directly on layout AST compilation logic, adhering strictly to Geist presets.")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button 
            className="hover:opacity-90 px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all shadow-sm flex items-center justify-center"
            style={{ 
              backgroundColor: block.props.buttonBgColor || 'var(--color-primary)', 
              color: block.props.buttonTextColor || 'var(--color-on-primary)' 
            }}
          >
            {buttonLabel || "Start Free"}
          </button>
          {(showSecondaryButton ?? true) && (
            <button className="border-2 px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all flex items-center justify-center border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:border-[var(--color-primary)]">
              {secondaryButtonLabel || "Documentation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};