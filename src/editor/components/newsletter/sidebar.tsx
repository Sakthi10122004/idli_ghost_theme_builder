import React from "react";
import { BuilderBlock } from "@/types/theme";
import { BackgroundControls } from "../shared/BackgroundControls";

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles: (styles: Record<string, unknown>) => void;
}) => {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Newsletter Title</label>
        <input
          type="text"
          value={block.props.title || ""}
          onChange={(e) => onChangeProps({ title: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Newsletter Subtitle</label>
        <textarea
          rows={2}
          value={block.props.subtitle || ""}
          onChange={(e) => onChangeProps({ subtitle: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Button Label</label>
        <input
          type="text"
          value={block.props.buttonLabel || ""}
          onChange={(e) => onChangeProps({ buttonLabel: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Input Placeholder</label>
        <input
          type="text"
          value={block.props.placeholder || ""}
          onChange={(e) => onChangeProps({ placeholder: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      <div className="my-2 border-t border-brand-hairline"></div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Layout</label>
        <select
          value={block.styles?.layout || "right"}
          onChange={(e) => onChangeStyles({ layout: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="right">Form on Right</option>
          <option value="left">Form on Left</option>
          <option value="below">Form Below</option>
          <option value="above">Form Above</option>
          <option value="center">Stacked Centered</option>
        </select>
      </div>

      <BackgroundControls
        styles={block.styles}
        appearance={{ backgroundColor: (block.styles?.backgroundColor as string) || "#fafafa" }}
        onChangeStyles={(s) => onChangeStyles(s)}
        updateAppearance={(_, v) => onChangeStyles({ backgroundColor: v })}
      />
    </>
  );
};