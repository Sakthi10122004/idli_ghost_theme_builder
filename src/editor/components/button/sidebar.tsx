import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({ block, onChangeProps }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Button Label</label>
        <input
          type="text"
          value={block.props.label || ""}
          onChange={(e) => onChangeProps({ label: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Link URL</label>
        <input
          type="text"
          value={block.props.href || ""}
          onChange={(e) => onChangeProps({ href: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Variant</label>
        <select
          value={block.props.variant || "primary"}
          onChange={(e) => onChangeProps({ variant: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="primary">Primary (Black)</option>
          <option value="secondary">Secondary (White)</option>
          <option value="accent">Accent (Ghost Brand Color)</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Shape</label>
        <select
          value={block.props.shape || "pill"}
          onChange={(e) => onChangeProps({ shape: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="pill">Pill (Default)</option>
          <option value="rounded">Rounded</option>
          <option value="square">Square</option>
          <option value="circle">Circle</option>
        </select>
      </div>
    </>
  );
};