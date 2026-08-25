import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({ block, onChangeProps }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  const p = block.props;

  const updateNestedProp = (category: string, key: string, value: any) => {
    onChangeProps({
      [category]: {
        ...(p[category] || {}),
        [key]: value
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">General</span>
        
        <label className="text-[11px] font-sans font-semibold text-brand-body">Layout Style</label>
        <select
          value={p.general?.layoutStyle || "Logo on Left"}
          onChange={(e) => updateNestedProp("general", "layoutStyle", e.target.value)}
          className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="Logo on Left">Logo on Left</option>
          <option value="Logo in Center">Logo in Center</option>
          <option value="Stacked">Stacked</option>
        </select>

        <label className="text-[11px] font-sans font-semibold text-brand-body mt-2">Logo Size (px)</label>
        <input
          type="number"
          value={p.general?.logoSize || 40}
          onChange={(e) => updateNestedProp("general", "logoSize", parseInt(e.target.value) || 40)}
          className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={p.general?.showLogo ?? true} onChange={(e) => updateNestedProp("general", "showLogo", e.target.checked)} />
          <label className="text-[11px] font-sans text-brand-body">Show Logo/Title</label>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" checked={p.general?.showSearch ?? true} onChange={(e) => updateNestedProp("general", "showSearch", e.target.checked)} />
          <label className="text-[11px] font-sans text-brand-body">Show Search Icon</label>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" checked={p.general?.showSignIn ?? true} onChange={(e) => updateNestedProp("general", "showSignIn", e.target.checked)} />
          <label className="text-[11px] font-sans text-brand-body">Show Sign In</label>
        </div>
      </div>

      {/* Colors & Layout */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">Appearance</span>
        <label className="text-[11px] font-sans font-semibold text-brand-body">Color Palette</label>
        <select
          value={p.colors?.palette || "default"}
          onChange={(e) => updateNestedProp("colors", "palette", e.target.value)}
          className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="default">Default</option>
          <option value="classic">Classic</option>
          <option value="dynamic">Dynamic</option>
          <option value="ocean">Ocean</option>
        </select>
        
        <label className="text-[11px] font-sans font-semibold text-brand-body mt-2">Section Width</label>
        <select
          value={p.layout?.sectionWidth || "full"}
          onChange={(e) => updateNestedProp("layout", "sectionWidth", e.target.value)}
          className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="full">Full Width</option>
          <option value="wide">Wide</option>
          <option value="standard">Standard</option>
        </select>
      </div>
    </div>
  );
};