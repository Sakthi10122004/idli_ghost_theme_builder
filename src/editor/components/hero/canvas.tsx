import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { title, subtitle, buttonLabel } = block.props;
  return (
    <div className="w-full text-center py-16 mesh-glow relative rounded-md overflow-hidden border border-brand-hairline">
      <div className="max-w-[700px] mx-auto px-6 flex flex-col items-center gap-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-link font-semibold bg-brand-link-bg-soft px-2 py-0.5 rounded-full">Introducing Builder V2</span>
        <h1 className="text-4xl md:text-5xl font-sans font-bold leading-tight text-brand-ink tracking-tighter">
          {title || "Build beautiful templates."}
        </h1>
        <p className="text-base text-brand-body leading-relaxed max-w-[500px]">
          {subtitle || "A visual workspace built directly on layout AST compilation logic, adhering strictly to Geist presets."}
        </p>
        <div className="mt-4 flex gap-3">
          <button className="bg-brand-primary text-white hover:bg-black px-6 py-2.5 rounded-pill text-xs font-semibold shadow-level-3">{buttonLabel || "Start Free"}</button>
          <button className="bg-white border border-brand-hairline text-brand-ink px-6 py-2.5 rounded-pill text-xs font-semibold shadow-level-2">Documentation</button>
        </div>
      </div>
    </div>
  );
};