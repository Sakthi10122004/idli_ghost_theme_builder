import React from "react";
import { BuilderBlock } from "@/types/theme";
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
  const blocks = useEditorStore((state) => state.document.blocks);
  const hasHeadingBlock = Object.values(blocks).some(
    (b) => b.type === "heading" && b.id !== block.id
  );
  const showTitle =
    block.props?.showTitle !== undefined
      ? Boolean(block.props.showTitle)
      : !hasHeadingBlock;

  return (
    <article className="post-full-content py-12 max-w-2xl mx-auto px-6 w-full bg-white border border-brand-hairline rounded-sm">
      {showTitle && (
        <header className="post-header mb-8">
          <h1 className="text-3xl font-bold leading-tight">Page Title Preview</h1>
        </header>
      )}
      <div className="post-body text-sm leading-relaxed text-brand-body">
        This is a visual preview placeholder showing how the Ghost page details layout compiles.
      </div>
    </article>
  );
};