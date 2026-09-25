import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { Ungroup } from "lucide-react";
import { SpacingControl } from "../shared/SpacingControl";

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

  const paddingOptions = [
    { label: "None", value: "0px" },
    { label: "Compact", value: "32px" },
    { label: "Normal", value: "64px" },
    { label: "Spacious", value: "96px" },
    { label: "Hero", value: "128px" },
  ];

  const currentPadding = (block.styles?.paddingTop as string) || "64px";

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

      {/* Background Color */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">
            Background Color
          </label>
          {block.styles?.backgroundColor && (
            <button
              type="button"
              onClick={() => onChangeStyles({ backgroundColor: "" })}
              className="text-[10px] font-sans text-brand-mute hover:text-brand-error cursor-pointer"
            >
              Clear / Transparent
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { label: "Transparent", value: "transparent" },
            { label: "White", value: "#ffffff" },
            { label: "Soft", value: "#fafafa" },
            { label: "Muted", value: "#f4f4f5" },
            { label: "Dark", value: "#171717" },
          ].map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChangeStyles({ backgroundColor: preset.value })}
              className={`px-2 py-1 rounded-sm text-[10px] font-sans border transition-all flex items-center gap-1 cursor-pointer ${
                block.styles?.backgroundColor === preset.value
                  ? "border-brand-primary ring-1 ring-brand-primary font-semibold text-brand-ink"
                  : "border-brand-hairline text-brand-body hover:border-brand-hairline-strong bg-white dark:bg-zinc-800"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shrink-0"
                style={{ backgroundColor: preset.value === "transparent" ? "transparent" : preset.value }}
              />
              <span>{preset.label}</span>
            </button>
          ))}
          <input
            type="color"
            value={
              typeof block.styles?.backgroundColor === "string" && block.styles.backgroundColor.startsWith("#")
                ? block.styles.backgroundColor
                : "#ffffff"
            }
            onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
            className="w-7 h-7 rounded border border-brand-hairline cursor-pointer p-0 shrink-0"
            title="Custom Background Color"
          />
        </div>
      </div>

      <div className="p-2.5 bg-brand-canvas-soft rounded-sm border border-brand-hairline/80 text-[11px] text-brand-mute leading-relaxed">
        Section serves as a top-level container with custom background and padding.
      </div>
    </div>
  );
};