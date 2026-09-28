import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

export const CanvasElement = ({ block }: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const isDark = useCanvasDarkMode();
  const { label, variant, shape = "pill" } = block.props;
  const isSecondary = variant === "secondary";
  const customShadow = block.styles?.boxShadow;
  const hasCustomShadow = customShadow !== undefined;
  const shadowClass = hasCustomShadow
    ? ""
    : (isSecondary ? "shadow-level-2" : "shadow-level-3");

  const shapeClass = shape === "square"
    ? "rounded-none"
    : shape === "rounded"
      ? "rounded-md"
      : shape === "circle"
        ? "rounded-full aspect-square min-w-[2.5rem] min-h-[2.5rem] p-2 inline-flex items-center justify-center text-center"
        : "rounded-pill";

  const paddingClass = shape === "circle" ? "" : "px-5 py-2";

  const buttonStyles = isSecondary
    ? isDark
      ? `bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 ${shadowClass}`
      : `bg-brand-canvas text-brand-ink ${shadowClass} border border-brand-hairline hover:bg-brand-canvas-soft`
    : isDark
      ? `bg-white text-neutral-900 hover:bg-neutral-100 ${shadowClass}`
      : `bg-brand-primary text-brand-on-primary hover:opacity-90 ${shadowClass}`;

  return (
    <button
      className={`${buttonStyles} ${shapeClass} ${paddingClass} text-xs font-semibold tracking-tight select-none cursor-pointer transition-colors`}
      style={customShadow && customShadow !== "none" ? { boxShadow: customShadow } : undefined}
    >
      {label}
    </button>
  );
};