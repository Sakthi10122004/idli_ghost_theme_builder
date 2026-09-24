import React from "react";
import { useEditorStore } from "@/store/editorStore";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

export const CanvasElement = ({
  block,
  isSelected,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  const { isPreviewMode } = useEditorStore();
  const height = (block.props?.height as string) || "40px";

  return (
    <div
      style={{ height }}
      className={`w-full transition-all flex items-center justify-center ${
        isPreviewMode
          ? "bg-transparent"
          : isSelected
          ? "bg-brand-primary/5 border border-dashed border-brand-primary"
          : "bg-brand-canvas-soft-2 dark:bg-white/5 border border-dashed border-brand-hairline dark:border-white/10 hover:border-brand-hairline-strong"
      }`}
    >
      {!isPreviewMode && (
        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute px-2 py-0.5 rounded bg-white/80 dark:bg-zinc-800/80 shadow-xs border border-brand-hairline/50">
          Spacer: {height}
        </span>
      )}
    </div>
  );
};