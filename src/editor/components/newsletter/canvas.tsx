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