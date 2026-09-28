import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePostNavigationProps } from "./schema";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const isDark = useCanvasDarkMode();
  const p = resolvePostNavigationProps(block.props);

  return (
    <nav className={`w-full py-8 border-t ${isDark ? "border-white/10" : "border-brand-hairline"}`}>
      <div className={
        p.layoutStyle === "stacked"
          ? "flex flex-col gap-4 max-w-2xl mx-auto w-full"
          : p.layoutStyle === "minimal"
          ? "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
          : p.layoutStyle === "centered-arrows"
          ? "flex flex-col sm:flex-row justify-between items-stretch gap-4"
          : p.layoutStyle === "image-background"
          ? "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          : p.layoutStyle === "large-typography"
          ? "flex flex-col md:flex-row gap-12 md:gap-8 justify-between"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      }>
        {/* Prev Post */}
        {p.layoutStyle === "minimal" ? (
          <div className="flex-1 text-left cursor-pointer group">
            <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
              <ArrowLeft size={11} /> Previous Post
            </span>
            <h4 className={`text-sm font-semibold leading-snug mt-1 ${isDark ? "text-white" : "text-brand-ink"} group-hover:text-brand-link transition-colors`}>
              Designing modern UI systems with Tailwind CSS
            </h4>
          </div>
        ) : p.layoutStyle === "centered-arrows" ? (
          <div className={`flex-1 flex gap-4 items-center group cursor-pointer ${isDark ? "hover:bg-neutral-800/50 text-white" : "hover:bg-brand-canvas-soft text-brand-ink"} p-4 rounded-lg transition-colors`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? "bg-neutral-900 border-white/10 text-neutral-400 group-hover:text-white" : "bg-brand-canvas border-brand-hairline text-brand-mute group-hover:text-brand-ink group-hover:border-brand-hairline-strong"} border transition-all shrink-0`}>
              <ArrowLeft size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`block text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-brand-mute"}`}>Previous</span>
              <h4 className="text-sm font-semibold leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors">Designing modern UI systems</h4>
            </div>
          </div>
        ) : p.layoutStyle === "image-background" ? (
          <div
            className="flex-1 flex flex-col justify-end p-6 md:p-8 rounded-xl overflow-hidden relative group cursor-pointer min-h-[240px] text-left"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors z-0"></div>
            <div className="relative z-10 w-full">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2 group-hover:text-white transition-colors">
                <ArrowLeft size={12} /> Previous Post
              </span>
              <h4 className="text-xl md:text-2xl font-semibold text-white leading-tight group-hover:underline decoration-white/50 underline-offset-4">
                Designing modern UI systems with Tailwind CSS
              </h4>
              {p.showExcerpt && (
                <p className="text-sm text-white/80 mt-2 line-clamp-2">
                  A practical guide to tokenization and layout architectures.
                </p>
              )}
            </div>
          </div>
        ) : p.layoutStyle === "large-typography" ? (
          <div className="flex-1 text-left cursor-pointer group py-4">
            <span className={`block text-sm font-semibold ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors mb-3`}>
              &larr; Previous Article
            </span>
            <h4 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-brand-ink"} leading-tight tracking-tight group-hover:text-brand-link transition-colors`}>
              Designing modern UI systems with Tailwind CSS
            </h4>
            {p.showExcerpt && (
              <p className={`text-base ${isDark ? "text-neutral-400" : "text-brand-body"} mt-4 line-clamp-2 max-w-lg`}>
                A practical guide to tokenization and layout architectures.
              </p>
            )}
          </div>
        ) : (
          <div className={`flex gap-4 items-center p-4 ${isDark ? "bg-neutral-900 text-white border-white/10" : "bg-brand-canvas text-brand-ink border-brand-hairline"} border rounded-md shadow-level-1 hover:border-brand-hairline-strong transition-all cursor-pointer group`}>
            {p.showImage && (
              <div className={`w-14 h-14 ${isDark ? "bg-neutral-800 border-white/10" : "bg-brand-canvas-soft-2 border-brand-hairline"} border rounded-sm overflow-hidden shrink-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=200&q=80"
                  alt="Previous post thumbnail"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
                <ArrowLeft size={11} /> Previous Post
              </span>
              <h4 className={`text-xs font-semibold ${isDark ? "text-white" : "text-brand-ink"} leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors`}>
                Designing modern UI systems with Tailwind CSS
              </h4>
              {p.showExcerpt && (
                <p className={`text-[11px] ${isDark ? "text-neutral-400" : "text-brand-body"} truncate mt-0.5`}>
                  A practical guide to tokenization and layout architectures.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Next Post */}
        {p.layoutStyle === "minimal" ? (
          <div className="flex-1 text-right cursor-pointer group">
            <span className={`inline-flex items-center justify-end gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
              Next Post <ArrowRight size={11} />
            </span>
            <h4 className={`text-sm font-semibold leading-snug mt-1 ${isDark ? "text-white" : "text-brand-ink"} group-hover:text-brand-link transition-colors`}>
              Optimizing Ghost themes for 100/100 Lighthouse
            </h4>
          </div>
        ) : p.layoutStyle === "centered-arrows" ? (
          <div className={`flex-1 flex gap-4 flex-row-reverse items-center group cursor-pointer ${isDark ? "hover:bg-neutral-800/50 text-white" : "hover:bg-brand-canvas-soft text-brand-ink"} p-4 rounded-lg transition-colors text-right`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isDark ? "bg-neutral-900 border-white/10 text-neutral-400 group-hover:text-white" : "bg-brand-canvas border-brand-hairline text-brand-mute group-hover:text-brand-ink group-hover:border-brand-hairline-strong"} border transition-all shrink-0`}>
              <ArrowRight size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <span className={`block text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400" : "text-brand-mute"}`}>Next</span>
              <h4 className="text-sm font-semibold leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors">Optimizing Ghost themes</h4>
            </div>
          </div>
        ) : p.layoutStyle === "image-background" ? (
          <div
            className="flex-1 flex flex-col justify-end p-6 md:p-8 rounded-xl overflow-hidden relative group cursor-pointer min-h-[240px] text-right"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors z-0"></div>
            <div className="relative z-10 w-full flex flex-col items-end">
              <span className="inline-flex items-center justify-end gap-1 text-[11px] font-mono uppercase tracking-wider text-white/80 mb-2 group-hover:text-white transition-colors">
                Next Post <ArrowRight size={12} />
              </span>
              <h4 className="text-xl md:text-2xl font-semibold text-white leading-tight group-hover:underline decoration-white/50 underline-offset-4 text-right">
                Optimizing Ghost themes for 100/100 Lighthouse
              </h4>
              {p.showExcerpt && (
                <p className="text-sm text-white/80 mt-2 line-clamp-2 text-right">
                  Essential techniques for asset minification and responsive images.
                </p>
              )}
            </div>
          </div>
        ) : p.layoutStyle === "large-typography" ? (
          <div className="flex-1 text-right cursor-pointer group py-4 flex flex-col items-end">
            <span className={`block text-sm font-semibold ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors mb-3`}>
              Next Article &rarr;
            </span>
            <h4 className={`text-2xl md:text-3xl lg:text-4xl font-bold ${isDark ? "text-white" : "text-brand-ink"} leading-tight tracking-tight group-hover:text-brand-link transition-colors text-right`}>
              Optimizing Ghost themes for 100/100 Lighthouse
            </h4>
            {p.showExcerpt && (
              <p className={`text-base ${isDark ? "text-neutral-400" : "text-brand-body"} mt-4 line-clamp-2 max-w-lg text-right`}>
                Essential techniques for asset minification and responsive images.
              </p>
            )}
          </div>
        ) : (
          <div className={`flex flex-row-reverse gap-4 items-center p-4 ${isDark ? "bg-neutral-900 text-white border-white/10" : "bg-brand-canvas text-brand-ink border-brand-hairline"} border rounded-md shadow-level-1 hover:border-brand-hairline-strong transition-all cursor-pointer group text-right`}>
            {p.showImage && (
              <div className={`w-14 h-14 ${isDark ? "bg-neutral-800 border-white/10" : "bg-brand-canvas-soft-2 border-brand-hairline"} border rounded-sm overflow-hidden shrink-0`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=200&q=80"
                  alt="Next post thumbnail"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider ${isDark ? "text-neutral-400 group-hover:text-white" : "text-brand-mute group-hover:text-brand-ink"} transition-colors`}>
                Next Post <ArrowRight size={11} />
              </span>
              <h4 className={`text-xs font-semibold ${isDark ? "text-white" : "text-brand-ink"} leading-snug truncate mt-0.5 group-hover:text-brand-link transition-colors`}>
                Optimizing Ghost themes for 100/100 Lighthouse
              </h4>
              {p.showExcerpt && (
                <p className={`text-[11px] ${isDark ? "text-neutral-400" : "text-brand-body"} truncate mt-0.5`}>
                  Essential techniques for asset minification and responsive images.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
