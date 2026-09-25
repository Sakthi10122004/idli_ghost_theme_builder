import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { Ungroup, Columns, BoxSelect } from "lucide-react";
import { SpacingControl } from "../shared/SpacingControl";

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const { unwrapBlock, wrapBlock, makeAdjacent } = useEditorStore();

  const maxWidth = (block.props?.maxWidth as string) || (block.styles?.width as string) || "1200px";
  const alignment = (block.props?.alignment as string) || "center";
  const paddingX = (block.props?.paddingX as string) || "24px";
  const paddingY = (block.props?.paddingY as string) || "0px";
  const direction = (block.props?.direction as string) || "column";
  const gap = (block.props?.gap as string) || "16px";
  const currentBg = (block.styles?.backgroundColor as string) || (block.props?.backgroundColor as string) || "";

  const widthPresets = [
    { label: "Card (380px)", value: "380px" },
    { label: "Compact (540px)", value: "540px" },
    { label: "Medium (768px)", value: "768px" },
    { label: "Standard (1024px)", value: "1024px" },
    { label: "Wide (1200px)", value: "1200px" },
    { label: "Full (100%)", value: "100%" },
  ];

  const padOptions = [
    { label: "0px", value: "0px" },
    { label: "16px", value: "16px" },
    { label: "24px", value: "24px" },
    { label: "32px", value: "32px" },
    { label: "48px", value: "48px" },
  ];

  const bgPresets = [
    { label: "Transparent", value: "transparent" },
    { label: "White", value: "#ffffff" },
    { label: "Soft", value: "#fafafa" },
    { label: "Muted", value: "#f4f4f5" },
    { label: "Dark", value: "#171717" },
  ];

  const handleBgChange = (color: string) => {
    onChangeStyles?.({ backgroundColor: color });
    onChangeProps({ backgroundColor: color });
  };

  const handleWidthChange = (val: string) => {
    onChangeProps({ maxWidth: val });
    onChangeStyles?.({ width: val });
  };

  const handleAlignChange = (align: "left" | "center" | "right") => {
    onChangeProps({ alignment: align });
    onChangeStyles?.({ textAlign: align });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Layout Actions */}
      <div className="flex flex-col gap-1.5 p-2 bg-brand-canvas-soft rounded-sm border border-brand-hairline">
        <label className="text-[10px] font-mono uppercase font-bold text-brand-body tracking-wider">
          Container Actions
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => unwrapBlock(block.id)}
            className="px-2 py-1.5 rounded-sm text-[11px] font-sans font-medium border border-brand-hairline bg-white hover:border-brand-hairline-strong text-brand-body hover:text-brand-ink flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Extract inner blocks and delete this container"
          >
            <Ungroup size={12} className="text-brand-primary" />
            <span>Unwrap Container</span>
          </button>
          <button
            type="button"
            onClick={() => makeAdjacent(block.id)}
            className="px-2 py-1.5 rounded-sm text-[11px] font-sans font-medium border border-brand-hairline bg-white hover:border-brand-hairline-strong text-brand-body hover:text-brand-ink flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Create an adjacent container side-by-side"
          >
            <Columns size={12} className="text-brand-primary" />
            <span>Duplicate Beside</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => wrapBlock(block.id, "section")}
          className="w-full px-2 py-1 rounded-sm text-[10px] font-sans border border-brand-hairline bg-white hover:bg-brand-canvas-soft text-brand-mute hover:text-brand-ink flex items-center justify-center gap-1 transition-all cursor-pointer"
          title="Wrap this container inside a Section"
        >
          <BoxSelect size={11} />
          <span>Wrap inside a Section</span>
        </button>
      </div>

      {/* Container Width */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">
            Container Width
          </label>
          <span className="text-[10px] font-mono text-brand-mute">{maxWidth}</span>
        </div>
        <select
          value={widthPresets.some((w) => w.value === maxWidth) ? maxWidth : "custom"}
          onChange={(e) => {
            if (e.target.value !== "custom") {
              handleWidthChange(e.target.value);
            }
          }}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          {widthPresets.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {!widthPresets.some((w) => w.value === maxWidth) && (
            <option value="custom">Custom ({maxWidth})</option>
          )}
        </select>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={maxWidth}
            onChange={(e) => handleWidthChange(e.target.value)}
            placeholder="e.g. 380px or 100%"
            className="w-full px-2.5 py-1 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
          />
        </div>
      </div>

      {/* Alignment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Horizontal Alignment
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => handleAlignChange(align)}
              className={`px-2 py-1.5 rounded-sm text-[11px] font-sans font-medium border text-center capitalize transition-all cursor-pointer ${
                alignment === align
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs font-semibold"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Child Layout Direction */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Inside Layout Direction
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onChangeProps({ direction: "column" })}
            className={`px-2 py-1.5 rounded-sm text-[11px] font-sans font-medium border text-center transition-all cursor-pointer ${
              direction !== "row"
                ? "bg-brand-primary text-white border-brand-primary shadow-xs font-semibold"
                : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
            }`}
          >
            Stack (Vertical)
          </button>
          <button
            type="button"
            onClick={() => onChangeProps({ direction: "row" })}
            className={`px-2 py-1.5 rounded-sm text-[11px] font-sans font-medium border text-center transition-all cursor-pointer ${
              direction === "row"
                ? "bg-brand-primary text-white border-brand-primary shadow-xs font-semibold"
                : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
            }`}
          >
            Row (Side-by-Side)
          </button>
        </div>
      </div>

      {/* Spacing Sliders */}
      <div className="border-t border-brand-hairline pt-3">
        <SpacingControl
          title="Spacing"
          topValue={(block.styles?.paddingTop as string) || (block.props?.paddingY as string) || "0px"}
          bottomValue={(block.styles?.paddingBottom as string) || (block.props?.paddingY as string) || "0px"}
          horizontalValue={(block.styles?.paddingLeft as string) || (block.props?.paddingX as string) || "24px"}
          onChangeTop={(val) => {
            onChangeStyles?.({ paddingTop: val });
            onChangeProps({ paddingY: val });
          }}
          onChangeBottom={(val) => {
            onChangeStyles?.({ paddingBottom: val });
            onChangeProps({ paddingY: val });
          }}
          onChangeHorizontal={(val) => {
            onChangeStyles?.({ paddingLeft: val, paddingRight: val });
            onChangeProps({ paddingX: val });
          }}
          showHorizontal={true}
        />
      </div>

      {/* Background Color */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">
            Background Color
          </label>
          {currentBg && (
            <button
              type="button"
              onClick={() => handleBgChange("")}
              className="text-[10px] font-sans text-brand-mute hover:text-brand-error cursor-pointer"
            >
              Clear / Transparent
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {bgPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleBgChange(preset.value)}
              className={`px-2 py-1 rounded-sm text-[10px] font-sans border transition-all flex items-center gap-1 cursor-pointer ${
                currentBg === preset.value
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
              typeof currentBg === "string" && currentBg.startsWith("#")
                ? currentBg
                : "#ffffff"
            }
            onChange={(e) => handleBgChange(e.target.value)}
            className="w-7 h-7 rounded border border-brand-hairline cursor-pointer p-0 shrink-0"
            title="Custom Background Color"
          />
        </div>
      </div>

      <div className="p-2.5 bg-brand-canvas-soft rounded-sm border border-brand-hairline/80 text-[11px] text-brand-mute leading-relaxed">
        Container centers and constrains inner content with custom widths and backgrounds.
      </div>
    </div>
  );
};