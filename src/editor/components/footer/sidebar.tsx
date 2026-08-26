import React from "react";
import { BuilderBlock } from "@/types/theme";
import { getPaletteConfig } from "./constants";

const SegmentedControl = ({ options, value, onChange }: { 
  options: { label: React.ReactNode; value: string; disabled?: boolean }[]; 
  value: string; 
  onChange: (v: string) => void 
}) => (
  <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200/50">
    {options.map(opt => (
      <button
        key={opt.value}
        type="button"
        disabled={opt.disabled}
        onClick={() => onChange(opt.value)}
        title={opt.disabled ? "Wider than the current Section Width — increase Section Width first" : undefined}
        className={`flex-1 flex justify-center items-center py-1.5 text-[11px] font-medium rounded-sm transition-all ${
          opt.disabled
            ? 'text-gray-300 cursor-not-allowed'
            : value === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const PaletteButton = ({ id, label, active, isDark, onClick }: { id: string, label: string, active: boolean, isDark: boolean, onClick: () => void }) => {
  const { bg, buttonBg } = getPaletteConfig(id, isDark);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg border transition-all ${
        active 
          ? (isDark ? 'border-blue-400 shadow-sm scale-[1.02]' : 'border-blue-500 shadow-sm scale-[1.02]') 
          : (isDark ? 'border-gray-700/80 hover:border-gray-500' : 'border-gray-200/80 hover:border-gray-300')
      }`}
      style={{ backgroundColor: bg }}
    >
      <span className={`text-[10px] font-medium ${active ? (isDark ? 'text-blue-300' : 'text-blue-700') : (isDark ? 'text-gray-300' : 'text-gray-600')}`}>{label}</span>
      <div className="flex gap-1">
        <div className="w-5 h-2.5 rounded-full" style={{ backgroundColor: buttonBg }} />
        <div className="w-3.5 h-2.5 rounded-full opacity-50" style={{ backgroundColor: buttonBg }} />
      </div>
    </button>
  );
};

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
        
        <span className="text-[12px] font-bold text-gray-900 tracking-tight mt-1">Colors</span>
        
        <SegmentedControl 
          value={p.colors?.mode || "light"}
          onChange={(v) => updateNestedProp("colors", "mode", v)}
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" }
          ]}
        />

        <div className="grid grid-cols-3 gap-2 mt-2">
          <PaletteButton id="default" label="Default" active={(p.colors?.palette || "default") === "default"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "default")} />
        </div>

        <span className="text-[10px] text-gray-400 font-medium mt-1">Neutral (uses your accent)</span>
        <div className="grid grid-cols-3 gap-2">
          <PaletteButton id="classic" label="Classic" active={p.colors?.palette === "classic"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "classic")} />
          <PaletteButton id="dynamic" label="Dynamic" active={p.colors?.palette === "dynamic"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "dynamic")} />
          <PaletteButton id="sand" label="Sand" active={p.colors?.palette === "sand"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "sand")} />
          <PaletteButton id="zinc" label="Zinc" active={p.colors?.palette === "zinc"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "zinc")} />
          <PaletteButton id="graphite" label="Graphite" active={p.colors?.palette === "graphite"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "graphite")} />
          <PaletteButton id="stone" label="Stone" active={p.colors?.palette === "stone"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "stone")} />
        </div>

        <span className="text-[10px] text-gray-400 font-medium mt-1">Themed (curated palettes)</span>
        <div className="grid grid-cols-3 gap-2">
          <PaletteButton id="ocean" label="Ocean" active={p.colors?.palette === "ocean"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "ocean")} />
          <PaletteButton id="indigo" label="Indigo" active={p.colors?.palette === "indigo"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "indigo")} />
          <PaletteButton id="violet" label="Violet" active={p.colors?.palette === "violet"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "violet")} />
          <PaletteButton id="rose" label="Rose" active={p.colors?.palette === "rose"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "rose")} />
          <PaletteButton id="amber" label="Amber" active={p.colors?.palette === "amber"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "amber")} />
          <PaletteButton id="sage" label="Sage" active={p.colors?.palette === "sage"} isDark={p.colors?.mode === "dark"} onClick={() => updateNestedProp("colors", "palette", "sage")} />
        </div>
        
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