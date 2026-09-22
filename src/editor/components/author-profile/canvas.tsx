/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveAuthorProfileProps } from "./schema";
import { MapPin, Globe } from "lucide-react";
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
  const p = resolveAuthorProfileProps(block.props);
  const isBanner = p.layoutStyle === "banner";
  const authorInitial = (p.name || "A").charAt(0);

  if (isBanner) {
    return (
      <header className="author-header w-full text-center py-12 px-4 max-w-2xl mx-auto border-b border-brand-hairline">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-brand-hairline shadow-level-1">
          {p.avatarUrl ? (
            <img src={p.avatarUrl} alt={p.name || "Author"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-brand-canvas-soft-2 flex items-center justify-center font-bold text-2xl text-brand-primary">
              {authorInitial}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-ink mb-2">{p.name || "Author Name"}</h1>
        {p.bio && <p className="text-sm text-brand-body leading-relaxed max-w-lg mx-auto mb-4">{p.bio}</p>}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-brand-mute">
          {p.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {p.location}
            </span>
          )}
          {p.website && (
            <span className="flex items-center gap-1 text-brand-primary">
              <Globe size={12} /> {p.website.replace(/^https?:\/\//, "")}
            </span>
          )}
          {p.twitter && (
            <span className="flex items-center gap-1 text-blue-500 font-mono text-[11px]">
              𝕏 {p.twitter}
            </span>
          )}
          <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm font-semibold text-brand-ink">
            12 posts
          </span>
        </div>
      </header>
    );
  }

  return (
    <section className="author-card w-full max-w-[720px] mx-auto my-8 p-5 border border-brand-hairline rounded-md bg-white dark:bg-neutral-900 shadow-level-1 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full overflow-hidden border border-brand-hairline shrink-0 shadow-xs">
        {p.avatarUrl ? (
          <img src={p.avatarUrl} alt={p.name || "Author"} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-brand-canvas-soft-2 flex items-center justify-center font-bold text-lg text-brand-primary">
            {authorInitial}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          Written by
        </span>
        <h4 className="text-sm font-bold text-brand-ink mt-0.5">{p.name || "Author Name"}</h4>
        {p.bio && <p className="text-xs text-brand-body leading-relaxed mt-1 line-clamp-2">{p.bio}</p>}
      </div>
    </section>
  );
};