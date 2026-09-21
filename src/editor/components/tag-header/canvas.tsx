/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveTagHeaderProps } from "./schema";
import { useEditorStore } from "@/store/editorStore";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const p = resolveTagHeaderProps(block.props);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";

  return (
    <header className={`gh-tag-header text-center mx-auto max-w-3xl ${isMobile ? "py-8 px-4" : "py-16 px-6"}`}>
      {p.showFeatureImage && (
        <div className="w-full h-48 sm:h-64 rounded-md overflow-hidden border border-brand-hairline shadow-level-1 mb-6 bg-brand-canvas-soft">
          <img
            src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&h=400&q=80"
            alt="Tag header cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1
        className={`${
          isMobile ? "text-3xl" : "text-5xl"
        } font-bold tracking-tight text-brand-ink mb-3`}
      >
        Technology
      </h1>

      {p.showDescription && (
        <p className={`${isMobile ? "text-sm" : "text-base"} text-brand-muted max-w-xl mx-auto mb-4 leading-relaxed`}>
          A curated collection of architectural patterns, developer workflows, and cutting-edge engineering practices.
        </p>
      )}

      {p.showCount && (
        <span className="inline-block font-mono text-xs font-semibold uppercase tracking-wider text-brand-muted bg-brand-canvas-soft border border-brand-hairline px-3 py-1 rounded-full">
          12 posts
        </span>
      )}
    </header>
  );
};
