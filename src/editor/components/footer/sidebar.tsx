import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-4.5 flex items-center shrink-0 rounded-full p-0.5 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
  >
    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-3.5' : 'translate-x-0'}`} />
  </button>
);
const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between gap-3 bg-white p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-[12px] font-medium text-gray-800">{label}</span>
    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-1.5 py-1">
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-4 h-4 rounded cursor-pointer border-none p-0 bg-transparent"
      />
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-14 text-[10px] font-mono text-gray-600 bg-transparent outline-none uppercase"
      />
    </div>
  </div>
);

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
        
        <div className="flex items-center justify-between mt-1">
          <span className="text-[12px] font-bold text-gray-900 tracking-tight">Colors</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-gray-500">Sync with Header</span>
            <Switch 
              checked={p.colors?.syncWithHeader || false} 
              onChange={(v) => updateNestedProp("colors", "syncWithHeader", v)} 
            />
          </div>
        </div>
        
        {!p.colors?.syncWithHeader && (
          <div className="flex flex-col rounded-md border border-gray-200 overflow-hidden mt-1 shadow-sm">
            <ColorPicker label="Background" value={p.colors?.backgroundColor || "#ffffff"} onChange={(v) => updateNestedProp("colors", "backgroundColor", v)} />
            <ColorPicker label="Text Color" value={p.colors?.textColor || "#1a1a1a"} onChange={(v) => updateNestedProp("colors", "textColor", v)} />
            {p.general?.showSubscribeBox && (
              <>
                <ColorPicker label="Button Base" value={p.colors?.buttonBgColor || "#000000"} onChange={(v) => updateNestedProp("colors", "buttonBgColor", v)} />
                <ColorPicker label="Button Text" value={p.colors?.buttonTextColor || "#ffffff"} onChange={(v) => updateNestedProp("colors", "buttonTextColor", v)} />
              </>
            )}
          </div>
        )}
        
        <label className="text-[11px] font-sans font-semibold text-brand-body mt-3">Section Width</label>
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