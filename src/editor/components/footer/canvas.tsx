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
    <footer className="site-footer py-8 border-t border-brand-hairline w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-mute px-6 bg-white">
      <span>{block.props.copyright || "© 2026 Ghost Theme Builder"}</span>
      <nav className="flex gap-4">
        <span>Privacy</span>
        <span>Terms</span>
      </nav>
    </footer>
  );
};