/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
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
  const blocks = useEditorStore((state) => state.document.blocks);
  const deviceMode = useEditorStore((state) => state.deviceMode);
  const isMobile = deviceMode === "mobile";

  const hasHeadingBlock = Object.values(blocks).some(
    (b) => b.type === "heading" && b.id !== block.id
  );
  const showTitle =
    block.props?.showTitle !== undefined
      ? Boolean(block.props.showTitle)
      : !hasHeadingBlock;

  return (
    <article className={`post-full-content w-full max-w-2xl mx-auto ${isMobile ? "py-6 px-4" : "py-12 px-6"}`}>
      {showTitle && (
        <header className="post-header mb-8">
          <h1 className={`${isMobile ? "text-2xl" : "text-4xl"} font-bold tracking-tight text-brand-ink leading-tight`}>
            About Our Publication
          </h1>
        </header>
      )}

      <figure className="my-6 overflow-hidden rounded-md border border-brand-hairline shadow-xs bg-brand-canvas-soft">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&h=630&q=80"
          alt="Page feature preview"
          className="w-full h-auto object-cover max-h-[380px] aspect-[16/9]"
          loading="lazy"
        />
        <figcaption className="p-2 text-center text-[11px] font-mono text-brand-mute bg-brand-canvas-soft border-t border-brand-hairline">
          Static page layout template with dynamic Ghost Handlebars context.
        </figcaption>
      </figure>

      <div className={`post-body space-y-4 text-brand-body leading-relaxed ${isMobile ? "text-sm" : "text-base"}`}>
        <p className="text-base sm:text-lg leading-relaxed text-brand-ink font-medium">
          Welcome to our publication. This template is designed for static pages such as About, Editorial Standards, Contact, or custom resources.
        </p>
        <p>
          Ghost Handlebars templates seamlessly combine native editorial content with visual builder blocks. When you publish a page in Ghost Admin, your formatted content and featured images will render here automatically.
        </p>
        <p>
          Every component in this template—including social sharing, discussion comments, and newsletter signup—can be customized or reordered directly in the visual editor.
        </p>
      </div>
    </article>
  );
};