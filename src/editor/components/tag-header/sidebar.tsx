import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveTagHeaderProps } from "./schema";
import { Tag } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveTagHeaderProps(block.props);

  const updateProp = <K extends keyof ReturnType<typeof resolveTagHeaderProps>>(
    key: K,
    value: ReturnType<typeof resolveTagHeaderProps>[K]
  ) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Context Badge */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Tag size={13} className="text-blue-600 shrink-0" />
          <span>Tag Archive Banner</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Displays the title, description, count, and feature image for the active tag route.
        </p>
      </div>

      {/* Toggles */}
      <div className="flex flex-col gap-2.5">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Feature Image</span>
          <input
            type="checkbox"
            checked={p.showFeatureImage}
            onChange={(e) => updateProp("showFeatureImage", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Tag Description</span>
          <input
            type="checkbox"
            checked={p.showDescription}
            onChange={(e) => updateProp("showDescription", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Post Count Badge</span>
          <input
            type="checkbox"
            checked={p.showCount}
            onChange={(e) => updateProp("showCount", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>
      </div>
    </div>
  );
};
