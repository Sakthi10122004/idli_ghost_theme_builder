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
        
        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <ColorPicker 
            label="Background Color" 
            value={a.backgroundColor || "#ffffff"} 
            onChange={(v) => updateCategory("appearance", "backgroundColor", v)} 
          />
          <ColorPicker 
            label="Text Color" 
            value={a.textColor || "#000000"} 
            onChange={(v) => updateCategory("appearance", "textColor", v)} 
          />
          <ColorPicker 
            label="Button Background" 
            value={a.buttonBgColor || "#000000"} 
            onChange={(v) => updateCategory("appearance", "buttonBgColor", v)} 
          />
          <ColorPicker 
            label="Button Text" 
            value={a.buttonTextColor || "#ffffff"} 
            onChange={(v) => updateCategory("appearance", "buttonTextColor", v)} 
          />
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