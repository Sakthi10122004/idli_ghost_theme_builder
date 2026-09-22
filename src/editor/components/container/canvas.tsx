import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

export const CanvasElement = ({ renderChildren }: {
  block?: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  return (
    <div className="w-full max-w-[var(--container-width,1200px)] mx-auto px-6 box-border text-brand-ink dark:text-brand-ink">
      {renderChildren ? renderChildren() : null}
    </div>
  );
};