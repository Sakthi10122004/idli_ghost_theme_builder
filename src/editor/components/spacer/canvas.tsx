import React from "react";
import { useEditorStore } from "@/store/editorStore";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  const { isPreviewMode } = useEditorStore();
  const height = block.props.height || "40px";
  return (
    <div 
      style={{ height }} 
      className={`w-full transition-all ${
        isPreviewMode ? "bg-transparent" : "bg-brand-canvas-soft-2 dark:bg-white/5 border border-dashed border-brand-hairline dark:border-white/10 flex items-center justify-center text-[9px] font-mono text-brand-mute uppercase"
      }`}
    >
      {!isPreviewMode && `Spacer: ${height}`}
    </div>
  );
};