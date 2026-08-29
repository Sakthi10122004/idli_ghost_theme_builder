import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { title, buttonLabel, placeholder } = block.props;
  return (
    <div className="w-full py-12 px-8 bg-brand-canvas-soft border border-brand-hairline rounded-md flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex flex-col gap-1.5 max-w-[400px]">
        <h3 className="text-lg font-bold text-brand-ink tracking-tight">{title || "Join our technical newsletter"}</h3>
        <p className="text-xs text-brand-body leading-relaxed">
          Stay up to date with new features, theme validation presets, and visual editor architecture tutorials.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[320px]">
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