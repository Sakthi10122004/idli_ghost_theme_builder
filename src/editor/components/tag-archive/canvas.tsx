import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const mockTags = [
    { name: "Engineering", count: 18, color: "text-brand-link" },
    { name: "Product Design", count: 12, color: "text-brand-warning-deep" },
    { name: "Architecture", count: 7, color: "text-brand-ink" },
  ];
  return (
    <div className="w-full">
      <h3 className="text-xs font-mono uppercase tracking-wider text-brand-mute mb-4">{block.props.title || "Browse Topics"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockTags.map(tag => (
          <div key={tag.name} className="p-4 border border-brand-hairline rounded-md bg-white hover:border-brand-hairline-strong shadow-level-2 flex justify-between items-center transition-all cursor-pointer">
            <span className="text-xs font-bold text-brand-ink">{tag.name}</span>
            <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-brand-body font-semibold">
              {tag.count} posts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};