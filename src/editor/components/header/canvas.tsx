import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { logoText = "THE BLOG", logoImageUrl, showCta = false, ctaLabel = "Subscribe" } = block.props;
  const items = Array.isArray(block.props.navItems) ? block.props.navItems : [
    { label: "Articles", url: "#", subMenu: [] },
    { label: "About", url: "#", subMenu: [] },
    { label: "Newsletter", url: "#", subMenu: [] }
  ];
  return (
    <header className="site-header flex items-center justify-between py-2 px-6 w-full bg-white border-b border-brand-hairline">
      <div className="site-title font-sans font-bold text-sm tracking-tight text-brand-ink uppercase">
        {logoImageUrl ? <img src={logoImageUrl} alt={logoText} style={{ height: "24px" }} /> : logoText}
      </div>
      <div className="flex items-center gap-6">
        <nav className="site-nav flex gap-5 text-xs font-medium text-brand-body">
          {items.map((item: any, idx: number) => <span key={idx}>{item.label}</span>)}
        </nav>
        {showCta && <button className="bg-brand-primary text-white px-3 py-1 rounded-sm text-xs font-semibold">{ctaLabel}</button>}
      </div>
    </header>
  );
};