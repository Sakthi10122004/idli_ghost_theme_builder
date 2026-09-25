import React from "react";
import { BuilderBlock } from "@/types/theme";
import { SpacingControl } from "../shared/SpacingControl";
import { BackgroundControls } from "../shared/BackgroundControls";

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const columnsCount = Number(block.props?.columnsCount) || 2;
  const layoutPreset = (block.props?.layoutPreset as string) || "equal";
  const gap = (block.props?.gap as string) || "24px";
  const alignItems = (block.props?.alignItems as string) || "stretch";
  const stackOnMobile = block.props?.stackOnMobile !== false;

  const countOptions = [
    { label: "2 Columns", value: 2 },
    { label: "3 Columns", value: 3 },
    { label: "4 Columns", value: 4 },
  ];

  const presetOptions = [
    { label: "Equal (1:1)", value: "equal" },
    { label: "Left Heavy (2:1)", value: "left-heavy" },
    { label: "Right Heavy (1:2)", value: "right-heavy" },
    { label: "Golden (1.6:1)", value: "golden" },
  ];

  const gapOptions = [
    { label: "12px", value: "12px" },
    { label: "16px", value: "16px" },
    { label: "24px", value: "24px" },
    { label: "32px", value: "32px" },
    { label: "48px", value: "48px" },
  ];

  const alignOptions = [
    { label: "Stretch", value: "stretch" },
    { label: "Top", value: "start" },
    { label: "Center", value: "center" },
    { label: "Bottom", value: "end" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Column Count */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Number of Columns
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {countOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeProps({ columnsCount: opt.value })}
              className={`px-2 py-1.5 rounded-sm text-xs font-sans font-medium border text-center transition-all ${
                columnsCount === opt.value
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ratios (for 2 columns) */}
      {columnsCount === 2 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">
            Column Proportions
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {presetOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChangeProps({ layoutPreset: opt.value })}
                className={`px-2 py-1.5 rounded-sm text-[11px] font-sans font-medium border text-center transition-all ${
                  layoutPreset === opt.value
                    ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                    : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Column Gap */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Column Gap (Spacing)
        </label>
        <div className="grid grid-cols-5 gap-1">
          {gapOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeProps({ gap: opt.value })}
              className={`px-1 py-1.5 rounded-sm text-[10px] font-mono border text-center transition-all ${
                gap === opt.value
                  ? "bg-brand-primary text-white border-brand-primary font-bold shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Alignment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Vertical Alignment
        </label>
        <div className="grid grid-cols-4 gap-1">
          {alignOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeProps({ alignItems: opt.value })}
              className={`px-1.5 py-1.5 rounded-sm text-[10px] font-sans font-medium border text-center transition-all ${
                alignItems === opt.value
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Stack Switch */}
      <div className="flex items-center justify-between p-2.5 bg-brand-canvas-soft rounded-sm border border-brand-hairline/80">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-sans font-medium text-brand-ink">Stack on Mobile</span>
          <span className="text-[10px] text-brand-mute">Collapses columns to 1 full-width column on mobile phones</span>
        </div>
        <input
          type="checkbox"
          checked={stackOnMobile}
          onChange={(e) => onChangeProps({ stackOnMobile: e.target.checked })}
          className="rounded border-brand-hairline text-brand-primary focus:ring-0 w-4 h-4 cursor-pointer"
        />
      </div>

      {/* Spacing Sliders */}
      <div className="border-t border-brand-hairline pt-3">
        <SpacingControl
          title="Spacing"
          topValue={(block.styles?.paddingTop as string) || (block.props?.padding as string) || "0px"}
          bottomValue={(block.styles?.paddingBottom as string) || (block.props?.padding as string) || "0px"}
          horizontalValue={(block.styles?.paddingLeft as string) || (block.props?.padding as string) || "0px"}
          onChangeTop={(val) => {
            onChangeStyles?.({ paddingTop: val });
            onChangeProps({ padding: val });
          }}
          onChangeBottom={(val) => {
            onChangeStyles?.({ paddingBottom: val });
            onChangeProps({ padding: val });
          }}
          onChangeHorizontal={(val) => {
            onChangeStyles?.({ paddingLeft: val, paddingRight: val });
            onChangeProps({ padding: val });
          }}
          showHorizontal={true}
        />
      </div>

      <BackgroundControls
        styles={block.styles}
        appearance={{ backgroundColor: (block.styles?.backgroundColor as string) || (block.props?.backgroundColor as string) || "transparent" }}
        onChangeStyles={(s) => {
          onChangeStyles?.(s);
          if (s.backgroundColor !== undefined) {
            onChangeProps({ backgroundColor: s.backgroundColor });
          }
        }}
        updateAppearance={(_, v) => {
          onChangeStyles?.({ backgroundColor: v });
          onChangeProps({ backgroundColor: v });
        }}
      />
    </div>
  );
};