import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-sans font-semibold text-brand-body">GitHub URL</label>
        <input
          type="text"
          value={block.props.github || ""}
          onChange={(e) => onChangeProps({ github: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Twitter URL</label>
        <input
          type="text"
          value={block.props.twitter || ""}
          onChange={(e) => onChangeProps({ twitter: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Website URL</label>
        <input
          type="text"
          value={block.props.website || ""}
          onChange={(e) => onChangeProps({ website: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
    </div>
  );
};