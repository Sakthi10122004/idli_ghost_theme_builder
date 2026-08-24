import React from "react";
import { BuilderBlock } from "@/types/theme";
import { Image as ImageIcon } from "lucide-react";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { url, alt } = block.props;
  return (
    <div className="overflow-hidden flex flex-col justify-center items-center select-none w-full">
      {url ? (
        <img src={url} alt={alt || "Image"} className="w-full h-auto object-cover max-h-[300px]" />
      ) : (
        <div className="py-12 flex flex-col items-center gap-2 text-brand-mute">
          <ImageIcon size={24} />
          <span className="text-xs">No image URL configured</span>
        </div>
      )}
    </div>
  );
};