import React from "react";
import { BuilderBlock } from "@/types/theme";
import { StatsProps, defaultProps } from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
import { BackgroundControls } from "../shared/BackgroundControls";

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

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles?: (styles: Record<string, any>) => void;
}) => {
  const p = { ...defaultProps, ...block.props } as StatsProps;
  const general = p.general;
  const stats = p.stats || [];

  const updateGeneral = (patch: Partial<StatsProps['general']>) => {
    onChangeProps({ general: { ...general, ...patch } });
  };

  const renderStatItem = (item: any, update: (patch: any) => void) => (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 w-1/3">
          <label className="text-[10px] font-semibold text-gray-500">Value</label>
          <input 
            type="text" 
            value={item.value} 
            onChange={(e) => update({ value: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            placeholder="10k+"
          />
        </div>
        <div className="flex flex-col gap-1 w-2/3">
          <label className="text-[10px] font-semibold text-gray-500">Label</label>
          <input 
            type="text" 
            value={item.label} 
            onChange={(e) => update({ label: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            placeholder="Active users"
          />
        </div>
      </div>
      {(general.layoutStyle === "cards" || general.layoutStyle === "accent-cards") && (
        <div className="flex flex-col gap-2 mt-1 border-t border-gray-100 pt-2">
          <div className="flex gap-2 items-center justify-between">
            <label className="text-[10px] font-semibold text-gray-500">Icon Type</label>
            <select
              value={item.iconType || 'svg'}
              onChange={(e) => update({ iconType: e.target.value })}
              className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none bg-white"
            >
              <option value="svg">SVG Code</option>
              <option value="image">Image URL</option>
            </select>
          </div>
          {(!item.iconType || item.iconType === 'svg') ? (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-gray-500">SVG Code</label>
              <textarea 
                value={item.icon || ""} 
                onChange={(e) => update({ icon: e.target.value })}
                className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none h-12 font-mono"
                placeholder="<svg>...</svg>"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold text-gray-500">Image URL</label>
              <input 
                type="text"
                value={item.imageUrl || ""} 
                onChange={(e) => update({ imageUrl: e.target.value })}
                className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
                placeholder="https://example.com/icon.png"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">General</span>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
          <input
            type="text"
            value={general.heading || ""}
            onChange={(e) => updateGeneral({ heading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Subheading</label>
          <textarea
            value={general.subheading || ""}
            onChange={(e) => updateGeneral({ subheading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none h-16"
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Layout Style</label>
          <select
            value={general.layoutStyle}
            onChange={(e: any) => updateGeneral({ layoutStyle: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft appearance-none cursor-pointer"
          >
            <option value="row">Row (Minimal)</option>
            <option value="cards">Cards</option>
            <option value="bordered">Bordered</option>
            <option value="split">Split (Left/Right)</option>
            <option value="accent-cards">Accent Cards</option>
            <option value="divider-grid">Divider Grid</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Columns</label>
          <SegmentedControl
            options={[
              { label: "2", value: "2" },
              { label: "3", value: "3" },
              { label: "4", value: "4" }
            ]}
            value={String(general.columns)}
            onChange={(v: any) => updateGeneral({ columns: parseInt(v) as any })}
          />
        </div>
      </div>

      {/* Stats List */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Stats</span>
        <RepeatableList
          items={stats}
          onChange={(newStats) => onChangeProps({ stats: newStats })}
          renderItem={renderStatItem}
          newItem={() => ({ id: Math.random().toString(36).substring(7), value: "0", label: "New Stat" })}
          addLabel="Add Stat"
        />
      </div>

      {/* Background Controls */}
      <BackgroundControls 
        styles={block.styles || {}} 
        appearance={p.appearance || {}} 
        onChangeStyles={onChangeStyles || (() => {})} 
        updateAppearance={(key, val) => onChangeProps({ appearance: { ...p.appearance, [key]: val } })}
      />

      {/* Text Colors */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Text Colors</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={p.appearance?.headingColor || "#171717"} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, headingColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={p.appearance?.headingColor || ""} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, headingColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Subheading</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={p.appearance?.subheadingColor || "#525252"} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, subheadingColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={p.appearance?.subheadingColor || ""} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, subheadingColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Stat Value</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={p.appearance?.valueColor || "#171717"} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, valueColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={p.appearance?.valueColor || ""} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, valueColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Stat Label</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={p.appearance?.labelColor || "#525252"} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, labelColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={p.appearance?.labelColor || ""} onChange={(e) => onChangeProps({ appearance: { ...p.appearance, labelColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
            </div>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Spacing</span>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Top Padding</label>
            <input 
              type="text" 
              value={p.spacing.paddingTop || ""} 
              onChange={(e) => onChangeProps({ spacing: { ...p.spacing, paddingTop: e.target.value } })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Bottom Padding</label>
            <input 
              type="text" 
              value={p.spacing.paddingBottom || ""} 
              onChange={(e) => onChangeProps({ spacing: { ...p.spacing, paddingBottom: e.target.value } })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Advanced</span>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">HTML Anchor</label>
          <input
            type="text"
            value={p.advanced?.htmlAnchor || ""}
            onChange={(e) => onChangeProps({ advanced: { ...p.advanced, htmlAnchor: e.target.value } })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            placeholder="e.g. stats"
          />
        </div>
      </div>
    </div>
  );
};
