import React from "react";
import { BuilderBlock } from "@/types/theme";
import { getBackgroundStyle } from "../shared/background";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { eyebrowText, title, subtitle, buttonLabel, showSecondaryButton, secondaryButtonLabel, useSiteData, imageUrl, imageAlt, useCoverImageAsBackground = true, textColor } = block.props;
  
  const bgStyle = getBackgroundStyle(block.styles);
  const showCover = useSiteData && useCoverImageAsBackground;
  
  let r = 0, g = 0, b = 0;
  const overlayColor = block.styles?.bgOverlayColor || "#000000";
  if (overlayColor.length === 7) {
    r = parseInt(overlayColor.slice(1, 3), 16);
    g = parseInt(overlayColor.slice(3, 5), 16);
    b = parseInt(overlayColor.slice(5, 7), 16);
  }
  const opacity = block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.6;
  const overlay = `rgba(${r}, ${g}, ${b}, ${opacity})`;

  const dynamicStyle = showCover 
    ? { backgroundColor: '#111', backgroundImage: `linear-gradient(${overlay}, ${overlay})` }
    : bgStyle;
    
  const layout = block.styles?.layout || "center";

  let wrapperClasses = `hero-block w-full relative overflow-hidden transition-colors ${!showCover && block.styles?.backgroundType === "mesh" ? 'mesh-glow' : ''}`;
  let contentClasses = "mx-auto px-6 flex relative z-10 w-full";
  let textContainerClasses = "flex flex-col gap-5";
  let buttonGroupClasses = "mt-6 flex flex-wrap gap-4";
  
  switch(layout) {
    case "left":
      wrapperClasses += " text-left";
      contentClasses += " flex-col items-start";
      textContainerClasses += " items-start";
      buttonGroupClasses += " justify-start";
      break;
    case "bottom":
      wrapperClasses += " text-center flex flex-col justify-end";
      contentClasses += " flex-col items-center mt-auto";
      textContainerClasses += " items-center";
      buttonGroupClasses += " justify-center";
      break;
    case "split-left":
      wrapperClasses += " text-left";
      contentClasses += " flex-col md:flex-row items-center gap-10";
      textContainerClasses += " items-start md:w-1/2 flex-shrink-0";
      buttonGroupClasses += " justify-start";
      break;
    case "split-right":
      wrapperClasses += " text-left";
      contentClasses += " flex-col md:flex-row-reverse items-center gap-10";
      textContainerClasses += " items-start md:w-1/2 flex-shrink-0";
      buttonGroupClasses += " justify-start";
      break;
    case "center":
    default:
      wrapperClasses += " text-center";
      contentClasses += " flex-col items-center";
      textContainerClasses += " items-center";
      buttonGroupClasses += " justify-center";
      break;
  }

  const applyCustomColor = showCover || !!textColor;
  const textColorClass = applyCustomColor ? "text-inherit" : "text-[var(--color-ink)]";
  const subtitleColorClass = applyCustomColor ? "text-inherit opacity-80" : "text-[var(--color-body)]";

  return (
    <div
      className={wrapperClasses}
      style={{
        ...dynamicStyle,
        ...(textColor ? { color: textColor } : (showCover ? { color: '#ffffff' } : {})),
        paddingTop: (block.styles?.paddingTop as string) || '3rem',
        paddingBottom: (block.styles?.paddingBottom as string) || '5rem'
      }}
    >
      <div 
        className={contentClasses}
        style={{ maxWidth: block.styles?.contentWidth || (layout.startsWith('split') ? '1200px' : '800px') }}
      >
        <div className={textContainerClasses}>
          {eyebrowText && (
            <span 
              className={`text-[11px] font-mono uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-2 ${
                applyCustomColor 
                  ? 'bg-white/10 text-white' 
                  : 'bg-brand-link-bg-soft text-brand-link dark:bg-white/10 dark:text-brand-ink'
              }`}
              style={applyCustomColor ? { color: textColor || '#ffffff' } : {}}
            >
              {eyebrowText}
            </span>
          )}
          <h1 className={`text-[2.75rem] md:text-[3.5rem] font-sans font-bold leading-[1.1] tracking-[-0.02em] break-words max-w-full ${textColorClass}`}>
            {useSiteData ? "{{@site.title}}" : (title || "Build beautiful templates.")}
          </h1>
          <p className={`text-lg md:text-xl leading-relaxed max-w-[600px] break-words ${subtitleColorClass}`}>
            {useSiteData ? "{{@site.description}}" : (subtitle || "A visual workspace built directly on layout AST compilation logic, adhering strictly to Geist presets.")}
          </p>
          <div className={buttonGroupClasses}>
            <button 
              className="hover:opacity-90 px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all shadow-sm flex items-center justify-center cursor-pointer"
              style={{ 
                backgroundColor: block.props.buttonBgColor && block.props.buttonBgColor !== '#171717'
                  ? block.props.buttonBgColor 
                  : 'var(--color-primary)', 
                color: block.props.buttonTextColor && block.props.buttonTextColor !== '#ffffff'
                  ? block.props.buttonTextColor 
                  : 'var(--color-on-primary)' 
              }}
            >
              {buttonLabel || "Start Free"}
            </button>
            {(showSecondaryButton ?? true) && (
              <button className={`border-2 px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all flex items-center justify-center cursor-pointer ${
                applyCustomColor 
                  ? 'border-white/20 text-white hover:border-white' 
                  : 'border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:border-[var(--color-primary)]'
              }`}>
                {secondaryButtonLabel || "Documentation"}
              </button>
            )}
          </div>
        </div>

        {layout.startsWith('split') && (
          <div className="w-full md:w-1/2 flex justify-center">
            {useSiteData ? (
              <div className="w-full aspect-video bg-[#222] rounded-lg border-2 border-dashed border-[#444] flex flex-col gap-2 items-center justify-center text-gray-400 text-sm font-mono shadow-lg">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                {`{{@site.cover_image}}`}
              </div>
            ) : imageUrl ? (
              <img src={imageUrl} alt={imageAlt || "Hero Image"} className="w-full h-auto rounded-lg shadow-lg object-cover max-h-[600px]" />
            ) : (
              <div className="w-full aspect-video bg-gray-100 dark:bg-white/5 rounded-lg border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                Image Placeholder
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};