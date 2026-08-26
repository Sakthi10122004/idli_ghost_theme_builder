import React from "react";
import { BuilderBlock } from "@/types/theme";
import { getPaletteConfig } from "./constants";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const p = block.props;
  const isDark = p.colors?.mode === "dark";
  const { bg, text } = getPaletteConfig(p.colors?.palette || "default", isDark);

  return (
    <footer 
      className="site-footer py-8 border-t border-brand-hairline w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs px-6"
      style={{ backgroundColor: bg, color: text }}
    >
      <span>{p.general?.customCopyrightText || "© 2026 Ghost Theme Builder"}</span>
      <nav className="flex gap-4">
        <span>Privacy</span>
        <span>Terms</span>
      </nav>
    </footer>
  );
};