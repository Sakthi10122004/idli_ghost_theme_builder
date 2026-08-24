import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  return (
    <article className="post-full-content py-12 max-w-2xl mx-auto px-6 w-full bg-white border border-brand-hairline rounded-sm shadow-level-1">
      <header className="post-header mb-8">
        <h1 className="text-3xl font-bold leading-tight">Article Details Title</h1>
        <div className="post-meta text-xs text-brand-mute mt-2">August 20, 2026 • 4 min read</div>
      </header>
      <div className="post-body text-sm leading-relaxed text-brand-body">
        This is a visual preview placeholder showing how the Ghost post page content compiles and displays theme layouts.
      </div>
    </article>
  );
};