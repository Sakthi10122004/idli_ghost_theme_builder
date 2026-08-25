import React from "react";
import { BuilderBlock } from "@/types/theme";

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-4.5 flex items-center shrink-0 rounded-full p-0.5 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
  >
    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-3.5' : 'translate-x-0'}`} />
  </button>
);

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

const getPalettePreview = (id: string, isDark: boolean) => {
  if (isDark) {
    switch (id) {
      case 'default': return { bg: '#18181b', main: '#ef4444', accent: '#27272a' };
      case 'classic': return { bg: '#111827', main: '#3b82f6', accent: '#1f2937' };
      case 'dynamic': return { bg: '#b91c1c', main: '#ffffff', accent: '#7f1d1d' };
      case 'sand': return { bg: '#292524', main: '#ef4444', accent: '#44403c' };
      case 'zinc': return { bg: '#27272a', main: '#ef4444', accent: '#3f3f46' };
      case 'graphite': return { bg: '#18181b', main: '#ef4444', accent: '#27272a' };
      case 'stone': return { bg: '#1c1917', main: '#ef4444', accent: '#292524' };
      case 'ocean': return { bg: '#0c4a6e', main: '#38bdf8', accent: '#0284c7' };
      case 'indigo': return { bg: '#312e81', main: '#818cf8', accent: '#3730a3' };
      case 'violet': return { bg: '#4c1d95', main: '#a78bfa', accent: '#5b21b6' };
      case 'rose': return { bg: '#4c0519', main: '#fb7185', accent: '#881337' };
      case 'amber': return { bg: '#451a03', main: '#fbbf24', accent: '#78350f' };
      case 'sage': return { bg: '#064e3b', main: '#34d399', accent: '#065f46' };
      default: return { bg: '#18181b', main: '#ef4444', accent: '#27272a' };
    }
  } else {
    switch (id) {
      case 'default': return { bg: '#ffffff', main: '#ef4444', accent: '#f3f4f6' };
      case 'classic': return { bg: '#f3f4f6', main: '#ef4444', accent: '#e5e7eb' };
      case 'dynamic': return { bg: '#fee2e2', main: '#ef4444', accent: '#fecaca' };
      case 'sand': return { bg: '#f5f5f4', main: '#ef4444', accent: '#e7e5e4' };
      case 'zinc': return { bg: '#f4f4f5', main: '#ef4444', accent: '#e4e4e7' };
      case 'graphite': return { bg: '#e4e4e7', main: '#ef4444', accent: '#d4d4d8' };
      case 'stone': return { bg: '#e7e5e4', main: '#ef4444', accent: '#d6d3d1' };
      case 'ocean': return { bg: '#e0f2fe', main: '#0ea5e9', accent: '#bae6fd' };
      case 'indigo': return { bg: '#e0e7ff', main: '#6366f1', accent: '#c7d2fe' };
      case 'violet': return { bg: '#ede9fe', main: '#8b5cf6', accent: '#ddd6fe' };
      case 'rose': return { bg: '#ffe4e6', main: '#f43f5e', accent: '#fecdd3' };
      case 'amber': return { bg: '#fef3c7', main: '#d97706', accent: '#fde68a' };
      case 'sage': return { bg: '#d1fae5', main: '#10b981', accent: '#a7f3d0' };
      default: return { bg: '#ffffff', main: '#ef4444', accent: '#f3f4f6' };
    }
  }
};

const PaletteButton = ({ id, label, active, isDark, onClick }: { id: string, label: string, active: boolean, isDark: boolean, onClick: () => void }) => {
  const { bg, main, accent } = getPalettePreview(id, isDark);
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
        <div className="w-5 h-2.5 rounded-full" style={{ backgroundColor: main }} />
        <div className="w-3.5 h-2.5 rounded-full" style={{ backgroundColor: accent }} />
      </div>
    </button>
  );
};

export const SidebarElement = ({ block, onChangeProps }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles?: (styles: Record<string, any>) => void;
}) => {
  const p = block.props || {};
  const g = p.general || {};
  const a = p.appearance || {};

  const updateCategory = (category: string, key: string, value: any) => {
    onChangeProps({
      ...p,
      [category]: {
        ...(p[category] || {}),
        [key]: value
      }
    });
  };

  const isDarkPreview = a.colorMode === "dark";

  const WIDTH_ORDER = ["narrow", "standard", "wide", "full"];
  const sectionRank = WIDTH_ORDER.indexOf(a.sectionWidth || "full");

  return (
    <div className="flex flex-col gap-6">
      
      {/* Brand & Toggles */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Layout Style</label>
          <select
            value={g.layoutStyle || "Logo on Left"}
            onChange={(e) => updateCategory("general", "layoutStyle", e.target.value)}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="Logo on Left">Logo on Left</option>
            <option value="Logo in Center">Logo in Center</option>
            <option value="Stacked">Stacked</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Logo Size</label>
            <span className="text-[9px] font-mono text-brand-mute">{g.logoSize || 40}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={g.logoSize || 40}
            onChange={(e) => updateCategory("general", "logoSize", parseInt(e.target.value, 10))}
            className="w-full accent-brand-primary cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-0 border border-gray-100 rounded-lg overflow-hidden mt-1 shadow-sm">
          
          <div className="flex justify-between items-center p-3 bg-white border-b border-gray-100">
            <span className="text-[12px] font-medium text-gray-800">Show Logo / Title</span>
            <Switch checked={g.showLogo ?? true} onChange={(c) => updateCategory("general", "showLogo", c)} />
          </div>

          <div className="flex justify-between items-center p-3 bg-white border-b border-gray-100">
            <span className="text-[12px] font-medium text-gray-800">Show Search Icon</span>
            <Switch checked={g.showSearch ?? true} onChange={(c) => updateCategory("general", "showSearch", c)} />
          </div>
          
          <div className="flex justify-between items-center p-3 bg-white border-b border-gray-100">
            <span className="text-[12px] font-medium text-gray-800">Show Theme Switcher</span>
            <Switch checked={g.showThemeSwitcher ?? true} onChange={(c) => updateCategory("general", "showThemeSwitcher", c)} />
          </div>

          <div className="flex flex-col bg-white border-b border-gray-100">
            <div className="flex justify-between items-center p-3">
              <span className="text-[12px] font-medium text-gray-800">Sign In Button</span>
              <Switch checked={g.showSignIn ?? true} onChange={(c) => updateCategory("general", "showSignIn", c)} />
            </div>
            {(g.showSignIn ?? true) && (
              <div className="px-3 pb-3 pt-0">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Sign In Text</label>
                <input 
                  type="text" 
                  value={g.signInText || "Sign in"}
                  onChange={(e) => updateCategory("general", "signInText", e.target.value)}
                  className="w-full px-2 py-1.5 text-[12px] border border-gray-200 rounded focus:border-blue-400 focus:outline-none"
                  placeholder="Button Text"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col bg-white">
            <div className="flex justify-between items-center p-3">
              <span className="text-[12px] font-medium text-gray-800">Subscribe Button</span>
              <Switch checked={g.showSubscribe ?? true} onChange={(c) => updateCategory("general", "showSubscribe", c)} />
            </div>
            {(g.showSubscribe ?? true) && (
              <div className="px-3 pb-3 pt-0">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Subscribe Text</label>
                <input 
                  type="text" 
                  value={g.subscribeText || "Subscribe"}
                  onChange={(e) => updateCategory("general", "subscribeText", e.target.value)}
                  className="w-full px-2 py-1.5 text-[12px] border border-gray-200 rounded focus:border-blue-400 focus:outline-none"
                  placeholder="Button Text"
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* COLORS */}
      <div className="flex flex-col gap-3">
        <span className="text-[12px] font-bold text-gray-900 tracking-tight">Colors</span>
        
        <SegmentedControl 
          value={a.colorMode || "light"}
          onChange={(v) => updateCategory("appearance", "colorMode", v)}
          options={[
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" }
          ]}
        />

        <div className="grid grid-cols-3 gap-2 mt-2">
          <PaletteButton id="default" label="Default" active={(a.colorPalette || "default") === "default"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "default")} />
        </div>

        <span className="text-[10px] text-gray-400 font-medium mt-1">Neutral (uses your accent)</span>
        <div className="grid grid-cols-3 gap-2">
          <PaletteButton id="classic" label="Classic" active={a.colorPalette === "classic"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "classic")} />
          <PaletteButton id="dynamic" label="Dynamic" active={a.colorPalette === "dynamic"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "dynamic")} />
          <PaletteButton id="sand" label="Sand" active={a.colorPalette === "sand"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "sand")} />
          <PaletteButton id="zinc" label="Zinc" active={a.colorPalette === "zinc"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "zinc")} />
          <PaletteButton id="graphite" label="Graphite" active={a.colorPalette === "graphite"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "graphite")} />
          <PaletteButton id="stone" label="Stone" active={a.colorPalette === "stone"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "stone")} />
        </div>

        <span className="text-[10px] text-gray-400 font-medium mt-1">Themed (curated palettes)</span>
        <div className="grid grid-cols-3 gap-2">
          <PaletteButton id="ocean" label="Ocean" active={a.colorPalette === "ocean"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "ocean")} />
          <PaletteButton id="indigo" label="Indigo" active={a.colorPalette === "indigo"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "indigo")} />
          <PaletteButton id="violet" label="Violet" active={a.colorPalette === "violet"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "violet")} />
          <PaletteButton id="rose" label="Rose" active={a.colorPalette === "rose"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "rose")} />
          <PaletteButton id="amber" label="Amber" active={a.colorPalette === "amber"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "amber")} />
          <PaletteButton id="sage" label="Sage" active={a.colorPalette === "sage"} isDark={isDarkPreview} onClick={() => updateCategory("appearance", "colorPalette", "sage")} />
        </div>
      </div>

      {/* LAYOUT */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
        <span className="text-[12px] font-bold text-gray-900 tracking-tight">Layout</span>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-gray-600">Section Width</label>
          <SegmentedControl 
            value={a.sectionWidth || "full"}
            onChange={(v) => updateCategory("appearance", "sectionWidth", v)}
            options={[
              { label: "Full", value: "full" },
              { label: "Wide", value: "wide" },
              { label: "Standard", value: "standard" },
              { label: "Narrow", value: "narrow" }
            ]}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-gray-600">Content Width</label>
          <SegmentedControl 
            value={a.contentWidth || "wide"}
            onChange={(v) => updateCategory("appearance", "contentWidth", v)}
            options={[
              { label: "Full", value: "full", disabled: WIDTH_ORDER.indexOf("full") > sectionRank },
              { label: "Wide", value: "wide", disabled: WIDTH_ORDER.indexOf("wide") > sectionRank },
              { label: "Standard", value: "standard", disabled: WIDTH_ORDER.indexOf("standard") > sectionRank },
              { label: "Narrow", value: "narrow", disabled: WIDTH_ORDER.indexOf("narrow") > sectionRank }
            ]}
          />
        </div>

      </div>

    </div>
  );
};