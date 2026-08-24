import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Heading Text</label>
        <input
          type="text"
          value={block.props.text || ""}
          onChange={(e) => onChangeProps({ text: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Level</label>
        <select
          value={block.props.level || 2}
          onChange={(e) => onChangeProps({ level: parseInt(e.target.value) })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value={1}>H1 (Large)</option>
          <option value={2}>H2 (Medium)</option>
          <option value={3}>H3 (Small)</option>
        </select>
      </div>
    </>
  );
};