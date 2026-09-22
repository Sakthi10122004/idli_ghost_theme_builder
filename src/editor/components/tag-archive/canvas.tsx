import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveTagArchiveProps } from "./schema";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();
  const p = resolveTagArchiveProps(block.props);
  const isBanner = p.layoutStyle === "banner";

  if (isBanner) {
    return (
      <header className="tag-header w-full text-center py-12 px-4 max-w-2xl mx-auto border-b border-brand-hairline">
        <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-bold block mb-2">
          Topic Archive
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink mb-3">
          #{p.title}
        </h1>
        {p.description && (
          <p className="text-sm text-brand-body leading-relaxed max-w-lg mx-auto mb-4">
            {p.description}
          </p>
        )}
        {p.showCount && (
          <span className="font-mono text-[11px] bg-brand-canvas-soft border border-brand-hairline px-2.5 py-1 rounded-sm font-semibold text-brand-ink inline-block">
            18 stories tagged
          </span>
        )}
      </header>
    );
  }

  const mockTags = [
    { name: "Engineering", count: 18, color: "text-brand-link" },
    { name: "Product Design", count: 12, color: "text-brand-warning-deep" },
    { name: "Architecture", count: 7, color: "text-brand-ink" },
  ];

  return (
    <div className="w-full py-8">
      <h3 className="text-xs font-mono uppercase tracking-wider text-brand-mute mb-4">
        {p.title || "Browse Topics"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockTags.map((tag) => (
          <div
            key={tag.name}
            className="p-4 border border-brand-hairline rounded-md bg-white dark:bg-neutral-900 hover:border-brand-hairline-strong shadow-level-2 flex justify-between items-center transition-all cursor-pointer"
          >
            <span className="text-xs font-bold text-brand-ink">{tag.name}</span>
            {p.showCount && (
              <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-brand-body font-semibold">
                {tag.count} posts
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};