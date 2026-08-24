import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const urls = block.props.urls || [];
  return (
    <div className="gallery-grid-wrapper py-6 w-full">
      <div className="gallery-grid">
        {urls.map((url: string, idx: number) => (
          <div key={idx} className="gallery-image">
            <img src={url} alt="Gallery Image" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};