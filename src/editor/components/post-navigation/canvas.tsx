import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePostNavigationProps } from "./schema";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const p = resolvePostNavigationProps(block.props);

  return (
    <nav className="w-full py-8 border-t border-brand-hairline">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prev Post */}
        <div className="flex gap-4 items-center p-4 bg-white border border-brand-hairline rounded-md shadow-level-1 hover:border-brand-hairline-strong transition-all cursor-pointer group">
          {p.showImage && (
            <div className="w-14 h-14 bg-brand-canvas-soft-2 border border-brand-hairline rounded-sm overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80"
                alt="Previous post thumbnail"
                className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-brand-mute group-hover:text-brand-ink transition-colors">
              <ArrowLeft size={11} /> Previous Post
            </span>
            <h4 className="text-xs font-semibold text-brand-ink leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors">
              Designing modern UI systems with Tailwind CSS
            </h4>
            {p.showExcerpt && (
              <p className="text-[11px] text-brand-body truncate mt-0.5">
                A practical guide to tokenization and layout architectures.
              </p>
            )}
          </div>
        </div>

        {/* Next Post */}
        <div className="flex flex-row-reverse gap-4 items-center p-4 bg-white border border-brand-hairline rounded-md shadow-level-1 hover:border-brand-hairline-strong transition-all cursor-pointer group text-right">
          {p.showImage && (
            <div className="w-14 h-14 bg-brand-canvas-soft-2 border border-brand-hairline rounded-sm overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=200&q=80"
                alt="Next post thumbnail"
                className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-brand-mute group-hover:text-brand-ink transition-colors">
              Next Post <ArrowRight size={11} />
            </span>
            <h4 className="text-xs font-semibold text-brand-ink leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors">
              Optimizing Ghost themes for 100/100 Lighthouse
            </h4>
            {p.showExcerpt && (
              <p className="text-[11px] text-brand-body truncate mt-0.5">
                Essential techniques for asset minification and responsive images.
              </p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
