import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveEmbedProps } from "./schema";
import { Code, Sparkles } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveEmbedProps(block.props);

  const updateProp = <K extends keyof ReturnType<typeof resolveEmbedProps>>(
    key: K,
    value: ReturnType<typeof resolveEmbedProps>[K]
  ) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-xs">
          <Sparkles size={13} className="text-amber-600 shrink-0" />
          <span>Raw HTML &amp; Embed</span>
        </div>
        <p className="text-[11px] text-amber-800/90 mt-1 leading-relaxed">
          Paste arbitrary HTML, iframe, YouTube, CodePen, or Twitter widgets. Output is rendered verbatim in your Ghost theme.
        </p>
      </div>

      {/* HTML / Embed code */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-brand-body">Embed HTML / iframe</label>
          <Code size={13} className="text-brand-mute" />
        </div>
        <textarea
          rows={6}
          value={p.html}
          onChange={(e) => updateProp("html", e.target.value)}
          placeholder="<iframe src='...' />"
          className="w-full px-3 py-2 border border-brand-hairline rounded-sm font-mono text-[11px] focus:outline-none bg-brand-canvas-soft resize-y leading-relaxed"
        />
      </div>

      {/* Max Width */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Max Width</label>
        <input
          type="text"
          value={p.maxWidth}
          onChange={(e) => updateProp("maxWidth", e.target.value)}
          placeholder="100% or 640px"
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Aspect Ratio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Aspect Ratio</label>
        <input
          type="text"
          value={p.aspectRatio}
          onChange={(e) => updateProp("aspectRatio", e.target.value)}
          placeholder="16/9 or auto"
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
    </div>
  );
};
