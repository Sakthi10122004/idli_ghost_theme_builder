import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveTagArchiveProps, TagArchiveProps } from "./schema";
import { Sparkles } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveTagArchiveProps(block.props);

  const updateProp = <K extends keyof TagArchiveProps>(key: K, value: TagArchiveProps[K]) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Sparkles size={13} className="text-blue-600 shrink-0" />
          <span>Tag Archive Block</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Use &quot;Tag Page Banner&quot; on tag archive templates (tag.hbs), or &quot;Topics Cloud Grid&quot; for all-topics showcase.
        </p>
      </div>

      {/* Layout Style */}
      <div className="flex flex-col gap-1.5 border-b border-brand-hairline pb-4">
        <label className="text-[11px] font-semibold text-brand-body">Layout Style</label>
        <select
          value={p.layoutStyle || "banner"}
          onChange={(e) => updateProp("layoutStyle", e.target.value as TagArchiveProps["layoutStyle"])}
          className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="banner">Tag Page Banner (tag.hbs)</option>
          <option value="cloud">Topics Cloud Grid (all tags)</option>
        </select>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">
          {p.layoutStyle === "banner" ? "Tag Name Preview" : "Section Title"}
        </label>
        <input
          type="text"
          value={p.title}
          onChange={(e) => updateProp("title", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Description */}
      {p.layoutStyle === "banner" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">Tag Description</label>
          <textarea
            rows={3}
            value={p.description}
            onChange={(e) => updateProp("description", e.target.value)}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
          />
        </div>
      )}

      {/* Show Count */}
      <label className="flex items-center justify-between cursor-pointer py-1">
        <span className="text-[11px] font-medium text-brand-body">Show post count</span>
        <input
          type="checkbox"
          checked={p.showCount}
          onChange={(e) => updateProp("showCount", e.target.checked)}
          className="rounded border-brand-hairline"
        />
      </label>
    </div>
  );
};