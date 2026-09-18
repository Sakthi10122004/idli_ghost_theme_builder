import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePostNavigationProps } from "./schema";
import { useEditorStore } from "@/store/editorStore";
import { Sparkles, AlertTriangle } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolvePostNavigationProps(block.props);
  const { activePage } = useEditorStore();

  const isPostPage = activePage === "post";

  const updateProp = <K extends keyof ReturnType<typeof resolvePostNavigationProps>>(
    key: K,
    value: ReturnType<typeof resolvePostNavigationProps>[K]
  ) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Context Warning if placed on non-post template */}
      {!isPostPage && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md p-2.5 flex items-start gap-2">
          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-snug">
            <strong className="font-semibold block mb-0.5">Post Context Required</strong>
            Post Navigation relies on Ghost&apos;s <code className="font-mono text-[10px] bg-amber-100 px-1 py-0.5 rounded">{"{{#prev_post}}"}</code> and <code className="font-mono text-[10px] bg-amber-100 px-1 py-0.5 rounded">{"{{#next_post}}"}</code> helpers. On <strong>{activePage || "this page"}</strong>, Ghost has no chronological post context.
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Sparkles size={13} className="text-blue-600 shrink-0" />
          <span>Post Navigation</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Provides Previous and Next post links using Ghost&apos;s native navigation helpers.
        </p>
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
          <span className="text-[11px] font-medium text-brand-body">Show feature image thumbnail</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showExcerpt}
            onChange={(e) => updateProp("showExcerpt", e.target.checked)}
            className="rounded border-brand-hairline"
          />
          <span className="text-[11px] font-medium text-brand-body">Show post excerpt</span>
        </label>
      </div>
    </div>
  );
};
