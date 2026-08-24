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
    <div className="error-view-block py-16 text-center w-full bg-white border border-brand-hairline rounded-sm">
      <h1 className="text-4xl font-bold text-brand-ink">404</h1>
      <p className="text-xs text-brand-mute mt-2">Page not found</p>
    </div>
  );
};