import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveRelatedPostsProps } from "./schema";
import { Sparkles, AlertTriangle } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveRelatedPostsProps(block.props);

  const updateProp = <K extends keyof ReturnType<typeof resolveRelatedPostsProps>>(
    key: K,
    value: ReturnType<typeof resolveRelatedPostsProps>[K]
  ) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Post Context Badge */}
      <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md p-2.5 flex items-start gap-2">
        <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-snug">
          <strong className="font-semibold block mb-0.5">Template Context</strong>
          Only works on Post or Page templates (requires ambient Ghost post context).
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Sparkles size={13} className="text-blue-600 shrink-0" />
          <span>Ghost Related Posts</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Queries posts sharing the current post&apos;s primary tag via Ghost&apos;s{" "}
          <code className="bg-blue-100 text-blue-950 font-semibold px-1.5 py-0.5 rounded font-mono text-[10px] border border-blue-200">
            {"{{#get \"posts\"}}"}
          </code>{" "}
          helper.
        </p>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Heading</label>
        <input
          type="text"
          value={p.heading}
          onChange={(e) => updateProp("heading", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Count */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Number of Posts</label>
        <input
          type="number"
          min={1}
          max={12}
          value={p.count}
          onChange={(e) => updateProp("count", Math.max(1, Math.min(12, Number(e.target.value))))}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2.5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showImage}
            onChange={(e) => updateProp("showImage", e.target.checked)}
            className="rounded border-brand-hairline"
          />
          <span className="text-[11px] font-medium text-brand-body">Show feature image</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showExcerpt}
            onChange={(e) => updateProp("showExcerpt", e.target.checked)}
            className="rounded border-brand-hairline"
          />
          <span className="text-[11px] font-medium text-brand-body">Show excerpt</span>
        </label>
      </div>
    </div>
  );
};
