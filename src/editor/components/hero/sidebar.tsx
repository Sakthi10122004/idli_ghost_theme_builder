import React from "react";
import { BuilderBlock } from "@/types/theme";

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
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
              if (e.target.checked) onChange("#000000"); // default to black when enabled
              else onChange(""); // clear when disabled
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
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  const p = block.props || {};
  const bgType = block.styles?.backgroundType || "solid";
  const useSiteData = p.useSiteData ?? false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Use Dynamic Ghost Data</label>
          <Switch
            checked={p.useSiteData ?? false}
            onChange={(c) => onChangeProps({ useSiteData: c })}
          />
        </div>
        <span className="text-[10px] text-brand-mute">
          When enabled, the hero will automatically use your Ghost Site Title, Description, and Cover Image.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Eyebrow Text</label>
        <input
          type="text"
          value={p.eyebrowText || ""}
          onChange={(e) => onChangeProps({ eyebrowText: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="Small label above the title"
        />
      </div>

      <div className={`flex flex-col gap-1.5`}>
        <label className="text-[11px] font-sans font-semibold text-brand-body">Hero Title</label>
        {p.useSiteData ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100 rounded-sm text-[11px] font-medium text-blue-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Bound to Site Title
          </div>
        ) : (
          <input
            type="text"
            value={p.title || ""}
            onChange={(e) => onChangeProps({ title: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          />
        )}
      </div>

      <div className={`flex flex-col gap-1.5`}>
        <label className="text-[11px] font-sans font-semibold text-brand-body">Subtitle Text</label>
        {p.useSiteData ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100 rounded-sm text-[11px] font-medium text-blue-700">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            Bound to Site Description
          </div>
        ) : (
          <textarea
            rows={3}
            value={p.subtitle || ""}
            onChange={(e) => onChangeProps({ subtitle: e.target.value })}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
          />
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Primary Button</label>
        <input
          type="text"
          value={p.buttonLabel || ""}
          onChange={(e) => onChangeProps({ buttonLabel: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="Button label"
        />
        <input
          type="text"
          value={p.buttonUrl || ""}
          onChange={(e) => onChangeProps({ buttonUrl: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft mb-2"
          placeholder="https://example.com"
        />
        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <ColorPicker 
            label="Background Color" 
            value={p.buttonBgColor || ""} 
            onChange={(v) => onChangeProps({ buttonBgColor: v })} 
          />
          <ColorPicker 
            label="Text Color" 
            value={p.buttonTextColor || ""} 
            onChange={(v) => onChangeProps({ buttonTextColor: v })} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Secondary Button</label>
          <Switch
            checked={p.showSecondaryButton ?? true}
            onChange={(c) => onChangeProps({ showSecondaryButton: c })}
          />
        </div>
        {(p.showSecondaryButton ?? true) && (
          <>
            <input
              type="text"
              value={p.secondaryButtonLabel || ""}
              onChange={(e) => onChangeProps({ secondaryButtonLabel: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              placeholder="Button label"
            />
            <input
              type="text"
              value={p.secondaryButtonUrl || ""}
              onChange={(e) => onChangeProps({ secondaryButtonUrl: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              placeholder="https://example.com"
            />
          </>
        )}
      </div>

      {useSiteData ? (
        <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5">
          <span className="text-[12px] font-bold text-gray-900 tracking-tight">Background</span>
          <div className="bg-brand-canvas-soft p-3 rounded-md border border-brand-hairline mt-2">
            <span className="text-[11px] text-brand-body leading-relaxed">
              Background settings are hidden because <strong>Use Dynamic Ghost Data</strong> is enabled. Your Ghost publication's cover image will be used automatically.
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5">
            <span className="text-[12px] font-bold text-gray-900 tracking-tight">Background</span>
            <label className="text-[11px] font-sans font-semibold text-brand-body mt-2">Background Type</label>
            <select
              value={bgType}
              onChange={(e) => onChangeStyles({ backgroundType: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="solid">Solid Color</option>
              <option value="linear">Linear Gradient</option>
              <option value="radial">Radial Gradient</option>
              <option value="mesh">Mesh Gradient</option>
              <option value="pattern">Pattern</option>
              <option value="image">Image URL</option>
            </select>
          </div>

      {bgType === "solid" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Background Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={block.styles?.backgroundColor || "#fafafa"}
              onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
              className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="text"
              value={block.styles?.backgroundColor || "#fafafa"}
              onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
        </div>
      )}

      {bgType === "linear" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.gradientColor1 || "#000000"}
                onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="color"
                value={block.styles?.gradientColor2 || "#333333"}
                onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })}
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
              onChange={(e) => onChangeStyles({ gradientAngle: parseInt(e.target.value) })}
              className="w-full accent-brand-primary"
            />
          </div>
        </>
      )}

      {bgType === "radial" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.gradientColor1 || "#000000"}
                onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="color"
                value={block.styles?.gradientColor2 || "#333333"}
                onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Position</label>
            <select
              value={block.styles?.gradientPosition || "center"}
              onChange={(e) => onChangeStyles({ gradientPosition: e.target.value })}
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

      {bgType === "mesh" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Mesh Colors</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={block.styles?.meshColor1 || "#ff0080"}
              onChange={(e) => onChangeStyles({ meshColor1: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="color"
              value={block.styles?.meshColor2 || "#7928ca"}
              onChange={(e) => onChangeStyles({ meshColor2: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="color"
              value={block.styles?.meshColor3 || "#0070f3"}
              onChange={(e) => onChangeStyles({ meshColor3: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
          </div>
        </div>
      )}

      {bgType === "pattern" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Pattern Type</label>
            <select
              value={block.styles?.patternType || "dots"}
              onChange={(e) => onChangeStyles({ patternType: e.target.value })}
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
                onChange={(e) => onChangeStyles({ patternColor: e.target.value })}
                className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="text"
                value={block.styles?.patternColor || "#000000"}
                onChange={(e) => onChangeStyles({ patternColor: e.target.value })}
                className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              />
            </div>
            <p className="text-[10px] text-brand-muted">Controls the color of dots/lines/noise over the default background.</p>
          </div>
        </>
      )}

      {bgType === "image" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={block.styles?.bgImageUrl || ""}
              onChange={(e) => onChangeStyles({ bgImageUrl: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Overlay Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={block.styles?.bgOverlayColor || "#000000"}
                onChange={(e) => onChangeStyles({ bgOverlayColor: e.target.value })}
                className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Overlay Opacity</label>
              <span className="text-[10px] text-brand-muted">
                {Math.round((block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5}
              onChange={(e) => onChangeStyles({ bgOverlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-brand-primary"
            />
          </div>
        </>
      )}
      
      </>
      )}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
        <span className="text-[12px] font-bold text-gray-900 tracking-tight">Spacing</span>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Top Padding</label>
            <span className="text-[9px] font-mono text-brand-mute">{typeof block.styles?.paddingTop === 'object' ? (block.styles.paddingTop as any).desktop : (block.styles?.paddingTop as string) || "3rem"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={parseFloat((typeof block.styles?.paddingTop === 'object' ? (block.styles.paddingTop as any).desktop : (block.styles?.paddingTop as string)) || "3")}
            onChange={(e) => onChangeStyles({ paddingTop: `${e.target.value}rem` })}
            className="w-full accent-brand-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Bottom Padding</label>
            <span className="text-[9px] font-mono text-brand-mute">{typeof block.styles?.paddingBottom === 'object' ? (block.styles.paddingBottom as any).desktop : (block.styles?.paddingBottom as string) || "5rem"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={parseFloat((typeof block.styles?.paddingBottom === 'object' ? (block.styles.paddingBottom as any).desktop : (block.styles?.paddingBottom as string)) || "5")}
            onChange={(e) => onChangeStyles({ paddingBottom: `${e.target.value}rem` })}
            className="w-full accent-brand-primary"
          />
        </div>
      </div>
    </div>
  );
};