import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { name, bio } = block.props;
  return (
    <div className="w-full p-6 border border-brand-hairline rounded-md bg-white flex items-center gap-5 shadow-level-2">
      <div className="w-16 h-16 rounded-full bg-brand-canvas-soft-2 border border-brand-hairline shrink-0 overflow-hidden flex items-center justify-center">
        <span className="text-lg font-mono font-bold text-brand-primary">{name ? name.charAt(0) : "A"}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">Author bio</span>
        <h4 className="text-sm font-bold text-brand-ink">{name || "Author Name"}</h4>
        <p className="text-xs text-brand-body leading-relaxed max-w-[500px]">
          {bio || "This is a default biography overview containing details about publishing styles, domain fields, and tags."}
        </p>
      </div>
    </div>
  );
};