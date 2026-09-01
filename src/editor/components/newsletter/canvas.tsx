import React from "react";
import { BuilderBlock } from "@/types/theme";

const getBackgroundStyle = (styles: any): React.CSSProperties => {
  const bgType = styles?.backgroundType || "solid";
  const defaultBg = "#fafafa";

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
          // A simple CSS trick for noise without external SVG if possible, 
          // or we just fall back to a generic noise pattern SVG.
          // Using a tiny data URI for grain:
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`
        };
      }
      return { backgroundColor: defaultBg };
    }
    case "image": {
      const url = styles?.bgImageUrl || "";
      const overlayColor = styles?.bgOverlayColor || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
      
      // Convert hex to rgb for rgba
      let r = 0, g = 0, b = 0;
      if (overlayColor.length === 7) {
        r = parseInt(overlayColor.slice(1, 3), 16);
        g = parseInt(overlayColor.slice(3, 5), 16);
        b = parseInt(overlayColor.slice(5, 7), 16);
      }
      
      const overlay = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      return {
        backgroundColor: defaultBg,
        backgroundImage: `linear-gradient(${overlay}, ${overlay})${url ? `, url(${url})` : ""}`,
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
  const { title, buttonLabel, placeholder } = block.props;
  const bgStyle = getBackgroundStyle(block.styles);
  const layout = block.styles?.layout || "right";
  
  let wrapperClasses = "w-full py-12 px-8 border border-brand-hairline rounded-md flex gap-6 relative overflow-hidden ";
  let textClasses = "flex flex-col gap-1.5 relative z-10 ";
  let formContainerClasses = "flex flex-col gap-2 w-full relative z-10 ";
  
  switch (layout) {
    case "right":
      wrapperClasses += "flex-col md:flex-row justify-between items-center";
      textClasses += "max-w-[400px] text-left";
      formContainerClasses += "max-w-[320px]";
      break;
    case "left":
      wrapperClasses += "flex-col md:flex-row-reverse justify-between items-center";
      textClasses += "max-w-[400px] text-left";
      formContainerClasses += "max-w-[320px]";
      break;
    case "below":
      wrapperClasses += "flex-col items-start";
      textClasses += "w-full text-left";
      formContainerClasses += "max-w-full";
      break;
    case "above":
      wrapperClasses += "flex-col-reverse items-start";
      textClasses += "w-full text-left";
      formContainerClasses += "max-w-full";
      break;
    case "center":
      wrapperClasses += "flex-col items-center text-center";
      textClasses += "w-full max-w-[600px]";
      formContainerClasses += "max-w-[400px] items-center";
      break;
  }
  
  return (
    <div className={wrapperClasses} style={bgStyle}>
      <div className={textClasses}>
        <h3 className="text-lg font-bold text-brand-ink tracking-tight">{title || "Join our technical newsletter"}</h3>
        <p className="text-xs text-brand-body leading-relaxed">
          Stay up to date with new features, theme validation presets, and visual editor architecture tutorials.
        </p>
      </div>
      <div className={formContainerClasses}>
        <div className="flex gap-2 w-full">
          <input 
            type="email" 
            placeholder={placeholder || "you@domain.com"} 
            disabled
            className="flex-1 px-3 py-2 border border-brand-hairline rounded-sm text-xs font-sans bg-white focus:outline-none cursor-not-allowed"
          />
          <button className="bg-brand-primary text-brand-on-primary hover:opacity-90 px-4 rounded-sm text-xs font-semibold shrink-0 cursor-pointer shadow-level-3">
            {buttonLabel || "Subscribe"}
          </button>
        </div>
        <span className="text-[10px] font-mono text-brand-mute">No spam. Unsubscribe anytime.</span>
      </div>
    </div>
  );
};