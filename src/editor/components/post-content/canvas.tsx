/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePostContentProps } from "./schema";
import { useEditorStore } from "@/store/editorStore";
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
  const p = resolvePostContentProps(block.props);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";

  const maxContentWidth =
    p.contentWidth === "narrow"
      ? "max-w-[640px]"
      : p.contentWidth === "wide"
      ? "max-w-[840px]"
      : "max-w-[720px]";

  return (
    <article className={`post-full-content w-full mx-auto ${isMobile ? "py-6 px-4" : "py-12 px-6"}`}>
      {/* Header Container */}
      <header className={`post-header ${maxContentWidth} mx-auto text-center mb-8`}>
        {/* Primary Tag & Featured Flag */}
        {(p.showTag || p.showFeaturedFlag) && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {p.showFeaturedFlag && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-primary text-white">
                Featured
              </span>
            )}
            {p.showTag && (
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 hover:underline cursor-pointer">
                Design Systems
              </span>
            )}
          </div>
        )}

        {/* Article Title */}
        <h1
          className={`${
            isMobile ? "text-2xl leading-tight" : "text-4xl sm:text-5xl leading-tight"
          } font-bold tracking-tight text-brand-ink mb-4`}
        >
          Designing modern publication themes with Ghost
        </h1>

        {/* Custom Excerpt */}
        {p.showExcerpt && (
          <p
            className={`${
              isMobile ? "text-sm" : "text-lg"
            } leading-relaxed text-brand-body/90 max-w-xl mx-auto mb-6`}
          >
            A deep dive into crafting fluid typography, responsive layout containers, and production-ready Handlebars templates.
          </p>
        )}

        {/* Byline Meta */}
        {p.showByline && (
          <div className="flex items-center justify-center gap-3 text-xs text-brand-mute border-y border-brand-hairline py-3.5 mt-6">
            {p.showAuthorAvatar && (
              <div className="w-9 h-9 rounded-full overflow-hidden border border-brand-hairline shrink-0 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Alex Rivera"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center flex-wrap justify-center gap-x-2 gap-y-1">
              <span className="font-semibold text-brand-ink">Alex Rivera</span>
              {p.showPublishDate && (
                <>
                  <span className="text-brand-hairline-strong">•</span>
                  <span>August 20, 2026</span>
                </>
              )}
              {p.showReadingTime && (
                <>
                  <span className="text-brand-hairline-strong">•</span>
                  <span>4 min read</span>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Feature Image */}
      {p.showFeatureImage && (
        <figure className="max-w-4xl mx-auto mb-10 overflow-hidden rounded-md border border-brand-hairline shadow-level-1">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&h=630&q=80"
            alt="Feature hero banner"
            className="w-full h-auto object-cover max-h-[500px]"
          />
          <figcaption className="p-2 text-center text-[11px] font-mono text-brand-mute bg-brand-canvas-soft border-t border-brand-hairline">
            Architecture and layout modeling for production publication ecosystems.
          </figcaption>
        </figure>
      )}

      {/* Article Body */}
      <div className={`post-body ${maxContentWidth} mx-auto text-brand-body leading-relaxed space-y-5 ${isMobile ? "text-sm" : "text-base"}`}>
        <p className="text-base sm:text-lg leading-relaxed text-brand-ink font-medium">
          Editorial websites are experiencing a renaissance. By decoupling presentation from backend storage and embracing clean AST compilation, publications achieve instant loads, beautiful typography, and zero layout shift.
        </p>

        <p>
          Ghost Handlebars templates provide a declarative contract between content creators and theme developers. Through helpers like <code className="font-mono text-xs bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded text-brand-ink">{"{{#foreach}}"}</code>, <code className="font-mono text-xs bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded text-brand-ink">{"{{content}}"}</code>, and <code className="font-mono text-xs bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded text-brand-ink">{"{{#get}}"}</code>, the browser renders pristine semantic markup without client-side hydration delays.
        </p>

        <blockquote className="border-l-4 border-brand-primary pl-4 py-1 italic text-brand-ink my-6 font-serif text-base sm:text-lg">
          &ldquo;Typography is the foundation of readability. A great reading experience disappears into the background, letting ideas shine through.&rdquo;
        </blockquote>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-ink pt-4">
          Fluid Grid Architecture
        </h2>

        <p>
          Every block in this layout can be customized, reordered, or deleted directly in the builder. When exported, the theme packages clean Handlebars code that runs natively on Ghost 4.x and 5.x.
        </p>
      </div>
    </article>
  );
};