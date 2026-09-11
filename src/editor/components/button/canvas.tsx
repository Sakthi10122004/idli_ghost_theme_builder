import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block }: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const { label, variant } = block.props;
  const isSecondary = variant === "secondary";
  const customShadow = block.styles?.boxShadow;
  const hasCustomShadow = customShadow !== undefined;
  const shadowClass = hasCustomShadow
    ? ""
    : (isSecondary ? "shadow-level-2" : "shadow-level-3");

  const buttonStyles = isSecondary
    ? `bg-brand-canvas text-brand-ink ${shadowClass} border border-brand-hairline hover:bg-brand-canvas-soft`
    : `bg-brand-primary text-brand-on-primary hover:opacity-90 ${shadowClass}`;

  return (
    <button
      className={`${buttonStyles} px-5 py-2 text-xs font-semibold tracking-tight select-none cursor-pointer rounded-pill transition-colors`}
      style={customShadow && customShadow !== "none" ? { boxShadow: customShadow } : undefined}
    >
      {label}
    </button>
  );
};