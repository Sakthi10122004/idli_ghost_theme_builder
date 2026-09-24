import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const lineStyle = (block.props?.style as string) || "solid";
  const thickness = (block.props?.thickness as string) || "1px";
  const width = (block.props?.width as string) || "100%";
  const alignment = (block.props?.alignment as string) || "center";
  const margin = (block.props?.margin as string) || "32px";
  const color = (block.props?.color as string) || "#ebebeb";

  const styleOptions = [
    { label: "Solid", value: "solid" },
    { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" },
  ];

  const thicknessOptions = ["1px", "2px", "3px", "4px"];

  const widthOptions = [
    { label: "100%", value: "100%" },
    { label: "80%", value: "80%" },
    { label: "60%", value: "60%" },
    { label: "40%", value: "40%" },
  ];

  const marginOptions = [
    { label: "16px", value: "16px" },
    { label: "24px", value: "24px" },
    { label: "32px", value: "32px" },
    { label: "48px", value: "48px" },
    { label: "64px", value: "64px" },
  ];

  const colorPresets = [
    { label: "Hairline", value: "#ebebeb" },
    { label: "Muted", value: "#999999" },
    { label: "Dark", value: "#171717" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Line Style */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Line Style
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {styleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeProps({ style: opt.value })}
              className={`px-2 py-1.5 rounded-sm text-xs font-sans font-medium border text-center transition-all ${
                lineStyle === opt.value
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thickness */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Thickness
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {thicknessOptions.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChangeProps({ thickness: t })}
              className={`px-2 py-1.5 rounded-sm text-xs font-mono font-medium border text-center transition-all ${
                thickness === t
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Width */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Divider Width
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {widthOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeProps({ width: opt.value })}
              className={`px-2 py-1.5 rounded-sm text-xs font-mono font-medium border text-center transition-all ${
                width === opt.value
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Alignment
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => onChangeProps({ alignment: align })}
              className={`px-2 py-1.5 rounded-sm text-xs font-sans font-medium border text-center capitalize transition-all ${
                alignment === align
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Margin / Spacing */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Vertical Spacing (Margin)
        </label>
        <div className="grid grid-cols-5 gap-1">
          {marginOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeProps({ margin: opt.value })}
              className={`px-1 py-1.5 rounded-sm text-[10px] font-mono border text-center transition-all ${
                margin === opt.value
                  ? "bg-brand-primary text-white border-brand-primary font-bold shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Color
        </label>
        <div className="flex items-center gap-2">
          {colorPresets.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onChangeProps({ color: c.value })}
              className={`px-2.5 py-1 rounded-sm text-xs font-sans border transition-all flex items-center gap-1.5 ${
                color === c.value
                  ? "border-brand-primary ring-1 ring-brand-primary font-semibold text-brand-ink"
                  : "border-brand-hairline text-brand-body hover:border-brand-hairline-strong"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full border border-black/10 inline-block shrink-0"
                style={{ backgroundColor: c.value }}
              />
              <span>{c.label}</span>
            </button>
          ))}
          <input
            type="color"
            value={color.startsWith("#") ? color : "#ebebeb"}
            onChange={(e) => onChangeProps({ color: e.target.value })}
            className="w-7 h-7 rounded border border-brand-hairline cursor-pointer p-0 shrink-0"
            title="Custom Color"
          />
        </div>
      </div>
    </div>
  );
};