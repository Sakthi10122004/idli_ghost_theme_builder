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
    <div className="social-links-row py-4 flex justify-center gap-6 text-xs font-mono text-brand-body">
      {block.props.github && <a href={block.props.github} target="_blank" rel="noreferrer">GitHub</a>}
      {block.props.twitter && <a href={block.props.twitter} target="_blank" rel="noreferrer">Twitter</a>}
      {block.props.website && <a href={block.props.website} target="_blank" rel="noreferrer">Website</a>}
    </div>
  );
};