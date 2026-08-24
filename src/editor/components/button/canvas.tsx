import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { label, variant } = block.props;
  const buttonStyles = 
    variant === "secondary"
      ? "bg-white text-brand-ink shadow-level-2 border border-brand-hairline hover:bg-brand-canvas-soft"
      : "bg-brand-primary text-white hover:bg-black shadow-level-3";
  return (
    <button className={`${buttonStyles} px-5 py-2 text-xs font-semibold tracking-tight select-none cursor-pointer rounded-pill`}>
      {label}
    </button>
  );
};