import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { Ungroup } from "lucide-react";
import { SpacingControl } from "../shared/SpacingControl";
import { BackgroundControls } from "../shared/BackgroundControls";

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles: (styles: Record<string, unknown>) => void;
}) => {
  const { unwrapBlock } = useEditorStore();
  const contentWidth = (block.props?.contentWidth as string) || (block.styles?.contentWidth as string) || "1200px";

  const widthOptions = [
    { label: "Full Width", value: "100%" },
    { label: "Wide (1440px)", value: "1440px" },
    { label: "Standard (1200px)", value: "1200px" },
    { label: "Narrow (800px)", value: "800px" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Layout Actions */}
      <div className="flex flex-col gap-1.5 p-2 bg-brand-canvas-soft rounded-sm border border-brand-hairline">
        <label className="text-[10px] font-mono uppercase font-bold text-brand-body tracking-wider">
          Section Actions
        </label>
        <button
          type="button"
          onClick={() => unwrapBlock(block.id)}
          className="w-full px-2 py-1.5 rounded-sm text-[11px] font-sans font-medium border border-brand-hairline bg-white hover:border-brand-hairline-strong text-brand-body hover:text-brand-ink flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          title="Extract inner blocks and delete this section"
        >
          <Ungroup size={12} className="text-brand-primary" />
          <span>Unwrap Section</span>
        </button>
      </div>
      {/* Content Width */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Content Max Width
        </label>
        <select
          value={contentWidth}
          onChange={(e) => {
            onChangeProps({ contentWidth: e.target.value });
            onChangeStyles({ contentWidth: e.target.value });
          }}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          {widthOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Spacing Sliders */}
      <div className="border-t border-brand-hairline pt-3">
        <SpacingControl
          title="Spacing"
          topValue={(block.styles?.paddingTop as string) || "64px"}
          bottomValue={(block.styles?.paddingBottom as string) || "64px"}
          onChangeTop={(val) => {
            onChangeStyles({ paddingTop: val });
            onChangeProps({ verticalPadding: val });
          }}
          onChangeBottom={(val) => {
            onChangeStyles({ paddingBottom: val });
            onChangeProps({ verticalPadding: val });
          }}
          showHorizontal={false}
        />
      </div>

      <BackgroundControls
        styles={block.styles}
        appearance={{ backgroundColor: (block.styles?.backgroundColor as string) || "transparent" }}
        onChangeStyles={(s) => onChangeStyles(s)}
        updateAppearance={(_, v) => onChangeStyles({ backgroundColor: v })}
      />

      <div className="p-2.5 bg-brand-canvas-soft rounded-sm border border-brand-hairline/80 text-[11px] text-brand-mute leading-relaxed">
        Section serves as a top-level container with custom background and padding.
      </div>
    </div>
  );
};