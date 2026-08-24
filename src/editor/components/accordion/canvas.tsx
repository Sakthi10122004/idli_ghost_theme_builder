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
    <div className="accordion-wrapper py-6 flex flex-col gap-3">
      {items.map((item: any, idx: number) => (
        <div key={idx} className="accordion-item border border-brand-hairline rounded-sm p-4 bg-white">
          <h4 className="text-xs font-bold text-brand-ink mb-2 flex justify-between items-center cursor-pointer">
            <span>{item.question || "FAQ Question"}</span>
            <span className="text-[10px] text-muted">▼</span>
          </h4>
          <p className="text-xs text-muted leading-relaxed">{item.answer || "Answer content."}</p>
        </div>
      ))}
    </div>
  );
};