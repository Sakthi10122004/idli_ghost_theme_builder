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
const ColorPicker = ({ label, value, onChange, defaultTokenLabel = "Theme Default" }: { label: string, value: string, onChange: (v: string) => void, defaultTokenLabel?: string }) => {
  const isCustom = !!value;
  return (
    <div className="flex items-center justify-between gap-3 bg-white p-2 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col">
        <span className="text-[12px] font-medium text-gray-800">{label}</span>
        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
          <input 
            type="checkbox" 
            checked={isCustom} 
            onChange={(e) => {
              if (e.target.checked) onChange("#000000");
              else onChange("");
            }}
            className="rounded-xs border-gray-300 w-3 h-3 accent-brand-primary"
          />
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Custom</span>
        </label>
      </div>
      {isCustom ? (
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
      ) : (
        <div className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 px-2 py-1 rounded font-semibold tracking-tight">
          {defaultTokenLabel}
        </div>
      )}
    </div>
  );
};

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles?: (styles: Record<string, any>) => void;
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
          <>
            <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5 mt-4">
              <span className="text-[12px] font-bold text-gray-900 tracking-tight">Background</span>
              
              <label className="text-[11px] font-sans font-semibold text-brand-body mt-2">Background Type</label>
              <select
                value={block.styles?.backgroundType || "solid"}
                onChange={(e) => onChangeStyles && onChangeStyles({ backgroundType: e.target.value })}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              >
                <option value="solid">Solid Color</option>
                <option value="linear">Linear Gradient</option>
                <option value="radial">Radial Gradient</option>
                <option value="mesh">Mesh Gradient</option>
                <option value="pattern">Pattern</option>
              </select>
            </div>

            {(block.styles?.backgroundType || "solid") === "solid" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={p.colors?.backgroundColor || "#ffffff"}
                    onChange={(e) => updateNestedProp("colors", "backgroundColor", e.target.value)}
                    className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
                  />
                  <input
                    type="text"
                    value={p.colors?.backgroundColor || "#ffffff"}
                    onChange={(e) => updateNestedProp("colors", "backgroundColor", e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
              </div>
            )}

            {(block.styles?.backgroundType) === "linear" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={block.styles?.gradientColor1 || "#000000"}
                      onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor1: e.target.value })}
                      className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
                    />
                    <input
                      type="color"
                      value={block.styles?.gradientColor2 || "#333333"}
                      onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor2: e.target.value })}
                      className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-sans font-semibold text-brand-body">Angle (deg)</label>
                    <span className="text-[10px] text-brand-muted">{block.styles?.gradientAngle || 90}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={block.styles?.gradientAngle || 90}
                    onChange={(e) => onChangeStyles && onChangeStyles({ gradientAngle: parseInt(e.target.value) })}
                    className="w-full accent-brand-primary"
                  />
                </div>
              </>
            )}

            {(block.styles?.backgroundType) === "radial" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={block.styles?.gradientColor1 || "#000000"}
                      onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor1: e.target.value })}
                      className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
                    />
                    <input
                      type="color"
                      value={block.styles?.gradientColor2 || "#333333"}
                      onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor2: e.target.value })}
                      className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Position</label>
                  <select
                    value={block.styles?.gradientPosition || "center"}
                    onChange={(e) => onChangeStyles && onChangeStyles({ gradientPosition: e.target.value })}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="center">Center</option>
                    <option value="top left">Top Left</option>
                    <option value="top right">Top Right</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="bottom right">Bottom Right</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </>
            )}

            {(block.styles?.backgroundType) === "mesh" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Mesh Colors</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={block.styles?.meshColor1 || "#ff0080"}
                    onChange={(e) => onChangeStyles && onChangeStyles({ meshColor1: e.target.value })}
                    className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
                  />
                  <input
                    type="color"
                    value={block.styles?.meshColor2 || "#7928ca"}
                    onChange={(e) => onChangeStyles && onChangeStyles({ meshColor2: e.target.value })}
                    className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
                  />
                  <input
                    type="color"
                    value={block.styles?.meshColor3 || "#0070f3"}
                    onChange={(e) => onChangeStyles && onChangeStyles({ meshColor3: e.target.value })}
                    className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
                  />
                </div>
              </div>
            )}

            {(block.styles?.backgroundType) === "pattern" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Pattern Type</label>
                  <select
                    value={block.styles?.patternType || "dots"}
                    onChange={(e) => onChangeStyles && onChangeStyles({ patternType: e.target.value })}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="dots">Dots</option>
                    <option value="lines">Diagonal Lines</option>
                    <option value="noise">Noise / Grain</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Pattern Base Color</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={block.styles?.patternColor || "#000000"}
                      onChange={(e) => onChangeStyles && onChangeStyles({ patternColor: e.target.value })}
                      className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
                    />
                    <input
                      type="text"
                      value={block.styles?.patternColor || "#000000"}
                      onChange={(e) => onChangeStyles && onChangeStyles({ patternColor: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                    />
                  </div>
                  <p className="text-[10px] text-brand-muted">Controls the color of dots/lines/noise over the default background.</p>
                </div>
              </>
            )}

            <div className="flex flex-col gap-3 border-t border-gray-100 mt-5 pt-3">
              <span className="text-[12px] font-bold text-gray-900 tracking-tight">Colors</span>
              <div className="flex flex-col rounded-md border border-gray-200 overflow-hidden shadow-sm">
                <ColorPicker label="Text Color" value={p.colors?.textColor || ""} onChange={(v) => updateNestedProp("colors", "textColor", v)} />
                {p.general?.showSubscribeBox && (
                  <>
                    <ColorPicker label="Button Base" value={p.colors?.buttonBgColor || ""} onChange={(v) => updateNestedProp("colors", "buttonBgColor", v)} />
                    <ColorPicker label="Button Text" value={p.colors?.buttonTextColor || ""} onChange={(v) => updateNestedProp("colors", "buttonTextColor", v)} />
                  </>
                )}
              </div>
            </div>
          </>
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