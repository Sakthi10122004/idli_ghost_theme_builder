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
  const height = (block.props?.height as string) || "40px";

  const heightPresets = [
    { label: "16px", value: "16px" },
    { label: "24px", value: "24px" },
    { label: "40px", value: "40px" },
    { label: "64px", value: "64px" },
    { label: "96px", value: "96px" },
    { label: "128px", value: "128px" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Height Presets */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Spacer Height Presets
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {heightPresets.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChangeProps({ height: opt.value })}
              className={`px-2 py-1.5 rounded-sm text-xs font-mono font-medium border text-center transition-all ${
                height === opt.value
                  ? "bg-brand-primary text-white border-brand-primary shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:border-brand-hairline-strong hover:text-brand-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Height Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">
          Custom Height
        </label>
        <input
          type="text"
          placeholder="e.g. 40px, 4rem, 5vh"
          value={height}
          onChange={(e) => onChangeProps({ height: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
        />
        <span className="text-[10px] text-brand-mute">
          Accepts any standard CSS length (px, rem, em, vh).
        </span>
      </div>
    </div>
  );
};