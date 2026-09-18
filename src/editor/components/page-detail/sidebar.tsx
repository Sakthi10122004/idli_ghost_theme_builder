import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
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
    <div className="flex flex-col gap-3 text-xs font-sans text-brand-ink">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-brand-body">
          Show Title in Content Block
        </label>
        <input
          type="checkbox"
          checked={showTitle}
          onChange={(e) => onChangeProps({ showTitle: e.target.checked })}
          className="rounded border-brand-hairline cursor-pointer"
        />
      </div>
      {hasHeadingBlock && showTitle && (
        <p className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
          Note: A Heading block is already on this page. Uncheck this if you prefer using your custom Heading block to avoid duplicate titles.
        </p>
      )}
    </div>
  );
};