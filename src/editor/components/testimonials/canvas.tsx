import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const items = block.props.items || [];
  return (
    <div className="testimonials-wrapper py-6 flex flex-col gap-4">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="testimonial-card border border-brand-hairline rounded-sm p-6 bg-brand-soft">
          <p className="text-xs italic leading-relaxed mb-4">"{item.quote || ""}"</p>
          <div className="flex flex-col">
            <span className="text-xs font-bold">{item.author || "User"}</span>
            <span className="text-[10px] text-muted font-mono">{item.title || ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
};