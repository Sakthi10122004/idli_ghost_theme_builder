import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ renderChildren }: {
  block?: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  return (
    <div className="flex flex-wrap gap-6 w-full [&>*]:flex-1 [&>*]:min-w-[250px]">
      {renderChildren ? renderChildren() : null}
    </div>
  );
};