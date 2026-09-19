import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ renderChildren }: {
  block?: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  return (
    <div className="w-full max-w-[var(--container-width,1200px)] mx-auto px-6 box-border">
      {renderChildren ? renderChildren() : null}
    </div>
  );
};