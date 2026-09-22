import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  return (
    <div className="video-player-wrapper py-6 flex justify-center w-full dark:bg-transparent">
      <div className="video-container aspect-video w-full max-w-2xl bg-black rounded-md overflow-hidden">
        {block.props.url ? <iframe src={block.props.url} className="w-full h-full" allowFullScreen></iframe> : null}
      </div>
    </div>
  );
};