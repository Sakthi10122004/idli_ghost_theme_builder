import React from "react";
import { BuilderBlock } from "@/types/theme";
import { StatsProps, StatItem, defaultProps } from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
import { BackgroundControls } from "../shared/BackgroundControls";
import { useEditorStore } from "@/store/editorStore";
import { Upload } from "lucide-react";

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
        className={`flex-1 flex justify-center items-center py-1.5 text-[11px] font-medium rounded-sm transition-all ${opt.disabled
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
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const addAsset = useEditorStore((s) => s.addAsset);
  const p = { ...defaultProps, ...block.props } as StatsProps;
  const general = p.general || defaultProps.general || { heading: "Our impact", subheading: "", layoutStyle: "row", columns: 3 };
  const stats = p.stats || defaultProps.stats || [];
  const appearance = p.appearance || defaultProps.appearance || {};
  const spacing = p.spacing || defaultProps.spacing || { paddingTop: "4rem", paddingBottom: "4rem" };

  const updateGeneral = (patch: Partial<StatsProps['general']>) => {
    onChangeProps({ general: { ...general, ...patch } });
  };

  const renderStatItem = (item: StatItem, update: (patch: Partial<StatItem>) => void, index?: number) => {
    const num = (index !== undefined ? index : stats.findIndex((s) => s.id === item.id)) + 1;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pb-0.5">
          <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
            @custom.stat_{num}_value
          </span>
          <span className="text-[10px] text-gray-400 font-sans">Ghost Dynamic Sync</span>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-1/3">
            <label className="text-[10px] font-semibold text-gray-500">Default Value</label>
            <input
              type="text"
              value={item.value || ""}
              onChange={(e) => update({ value: e.target.value })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none bg-brand-canvas-soft"
              placeholder="10k+"
            />
          </div>
          <div className="flex flex-col gap-1 w-2/3">
            <label className="text-[10px] font-semibold text-gray-500">Default Label</label>
            <input
              type="text"
              value={item.label || ""}
              onChange={(e) => update({ label: e.target.value })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none bg-brand-canvas-soft"
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
                onChange={(e) => update({ iconType: e.target.value as 'svg' | 'image' })}
                className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none bg-white"
              >
                <option value="svg">SVG Code</option>
                <option value="image">Image URL / Upload</option>
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
                <label className="text-[10px] font-semibold text-gray-500">Image URL / Upload</label>
                <input
                  type="text"
                  value={item.imageUrl || ""}
                  onChange={(e) => update({ imageUrl: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none font-mono text-[11px]"
                  placeholder="https://... or asset://..."
                />
                <label className="flex items-center justify-center gap-1.5 w-full py-1 px-2 bg-gray-50 border border-dashed border-gray-200 rounded cursor-pointer hover:bg-gray-100 text-[10px] font-medium text-gray-700 mt-0.5">
                  <Upload size={11} />
                  <span>Upload Icon</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUri = ev.target?.result as string;
                        if (!dataUri) return;
                        const ext = file.name.split(".").pop() || "png";
                        const id = Math.random().toString(36).substring(7);
                        const assetPath = `assets/images/stats/${id}.${ext}`;
                        addAsset(assetPath, dataUri);
                        update({ imageUrl: `asset://${assetPath.replace("assets/", "")}` });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Ghost Dynamic Theme Settings Notice */}
      <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-md">
        <div className="flex items-center gap-1.5 text-blue-800 font-semibold text-[11px]">
          <svg className="w-4 h-4 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Fully Dynamic Ghost Admin Sync
        </div>
        <p className="text-[10.5px] text-blue-700/90 mt-1.5 leading-relaxed">
          The values set here serve as <strong>initial theme defaults</strong>. When exported to Ghost, your users can edit the heading, subheading, and all stat values & labels live in <strong>Ghost Admin &rarr; Settings &rarr; Design &rarr; Homepage</strong>!
        </p>
      </div>

      {/* General Settings */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">General</span>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
            <span className="text-[9px] font-mono text-blue-600 bg-blue-50 px-1 rounded border border-blue-200/50">@custom.stats_heading</span>
          </div>
          <input
            type="text"
            value={general.heading || ""}
            onChange={(e) => updateGeneral({ heading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Subheading</label>
            <span className="text-[9px] font-mono text-blue-600 bg-blue-50 px-1 rounded border border-blue-200/50">@custom.stats_subheading</span>
          </div>
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
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateGeneral({ layoutStyle: e.target.value as StatsProps['general']['layoutStyle'] })}
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
            onChange={(v: string) => updateGeneral({ columns: parseInt(v, 10) as 2 | 3 | 4 })}
          />
        </div>
      </div>

      {/* Stats List */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Stats Items (Auto-synced with @custom)</span>
        <RepeatableList
          items={stats}
          onChange={(newStats) => onChangeProps({ stats: newStats })}
          renderItem={(item, update, idx) => renderStatItem(item, update, idx)}
          newItem={() => ({ id: Math.random().toString(36).substring(7), value: "0", label: "New Stat" })}
          addLabel="Add Stat"
        />
      </div>

      {/* Background Controls */}
      <BackgroundControls
        styles={block.styles || {}}
        appearance={appearance}
        onChangeStyles={onChangeStyles || (() => { })}
        updateAppearance={(key, val) => onChangeProps({ appearance: { ...appearance, [key]: val } })}
      />

      {/* Text Colors */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Text Colors</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={appearance.headingColor || "#171717"} onChange={(e) => onChangeProps({ appearance: { ...appearance, headingColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={appearance.headingColor || ""} onChange={(e) => onChangeProps({ appearance: { ...appearance, headingColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Subheading</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={appearance.subheadingColor || "#525252"} onChange={(e) => onChangeProps({ appearance: { ...appearance, subheadingColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={appearance.subheadingColor || ""} onChange={(e) => onChangeProps({ appearance: { ...appearance, subheadingColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Stat Value</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={appearance.valueColor || "#171717"} onChange={(e) => onChangeProps({ appearance: { ...appearance, valueColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={appearance.valueColor || ""} onChange={(e) => onChangeProps({ appearance: { ...appearance, valueColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Stat Label</label>
            <div className="flex gap-2 items-center">
              <input type="color" value={appearance.labelColor || "#525252"} onChange={(e) => onChangeProps({ appearance: { ...appearance, labelColor: e.target.value } })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={appearance.labelColor || ""} onChange={(e) => onChangeProps({ appearance: { ...appearance, labelColor: e.target.value } })} className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft min-w-0" placeholder="Default" />
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
              value={spacing.paddingTop || ""}
              onChange={(e) => onChangeProps({ spacing: { ...spacing, paddingTop: e.target.value } })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Bottom Padding</label>
            <input
              type="text"
              value={spacing.paddingBottom || ""}
              onChange={(e) => onChangeProps({ spacing: { ...spacing, paddingBottom: e.target.value } })}
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
