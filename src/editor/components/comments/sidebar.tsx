import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveCommentsProps } from "./schema";
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
  const p = resolveCommentsProps(block.props);
  const { activePage } = useEditorStore();

  const isPostOrPage =
    activePage === "post" || activePage === "page" || activePage?.startsWith("custom-");

  const updateProp = <K extends keyof ReturnType<typeof resolveCommentsProps>>(
    key: K,
    value: ReturnType<typeof resolveCommentsProps>[K]
  ) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Warning on non-post context pages */}
      {!isPostOrPage && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md p-2.5 flex items-start gap-2">
          <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-snug">
            <strong className="font-semibold block mb-0.5">Post / Page Context Required</strong>
            Ghost comments only render inside a post or page template (within a{" "}
            <code className="font-mono text-[10px] bg-amber-100 px-1 py-0.5 rounded">{"{{#post}}"}</code>{" "}
            block). On <strong>{activePage || "this page"}</strong>, Ghost will not display comments.
          </div>
        </div>
      )}

      {/* Ghost Info Box */}
      <div className="bg-purple-50 border border-purple-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-purple-900 font-semibold text-xs">
          <Sparkles size={13} className="text-purple-600 shrink-0" />
          <span>Ghost Native Comments</span>
        </div>
        <p className="text-[11px] text-purple-800/90 mt-1 leading-relaxed">
          Uses Ghost&apos;s built-in{" "}
          <code className="bg-purple-100 text-purple-950 font-semibold px-1.5 py-0.5 rounded font-mono text-[10px] border border-purple-200">
            {"{{comments}}"}
          </code>{" "}
          helper. Members can sign in and comment directly on your posts.
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

      {/* Show Count */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={p.showCount}
          onChange={(e) => updateProp("showCount", e.target.checked)}
          className="rounded border-brand-hairline"
        />
        <span className="text-[11px] font-medium text-brand-body">
          Show comment count in heading
        </span>
      </label>
    </div>
  );
};
