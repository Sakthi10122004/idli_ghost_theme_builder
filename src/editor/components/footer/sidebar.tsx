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
          value={p.general?.layoutStyle || "Simple Minimal"}
          onChange={(e) => updateNestedProp("general", "layoutStyle", e.target.value)}
          className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="Simple Minimal">Simple Minimal</option>
          <option value="Multi-Column">Multi-Column</option>
          <option value="Newsletter Integrated">Newsletter Integrated</option>
        </select>

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={p.general?.showSecondaryNav ?? true} onChange={(e) => updateNestedProp("general", "showSecondaryNav", e.target.checked)} />
          <label className="text-[11px] font-sans text-brand-body">Show Secondary Nav</label>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" checked={p.general?.showSocialIcons ?? true} onChange={(e) => updateNestedProp("general", "showSocialIcons", e.target.checked)} />
          <label className="text-[11px] font-sans text-brand-body">Show Social Icons</label>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <input type="checkbox" checked={p.general?.showCopyright ?? true} onChange={(e) => updateNestedProp("general", "showCopyright", e.target.checked)} />
          <label className="text-[11px] font-sans text-brand-body">Show Copyright</label>
        </div>

        {p.general?.showCopyright && (
          <div className="mt-2">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Custom Copyright</label>
            <input
              type="text"
              placeholder="Leave blank for default"
              value={p.general?.customCopyrightText || ""}
              onChange={(e) => updateNestedProp("general", "customCopyrightText", e.target.value)}
              className="w-full mt-1 px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
        )}
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
          <option value="stone">Stone</option>
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