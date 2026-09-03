import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { LogoCloudProps, defaultProps, GENERIC_SVG_PLACEHOLDER } from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
import { BackgroundControls } from "../shared/BackgroundControls";

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
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
  const p = { ...defaultProps, ...block.props } as LogoCloudProps;
  const general = p.general;
  const logos = p.logos || [];
  const addAsset = useEditorStore(s => s.addAsset);

  const updateGeneral = (patch: Partial<LogoCloudProps['general']>) => {
    onChangeProps({ general: { ...general, ...patch } });
  };

  const renderLogoItem = (item: any, update: (patch: any) => void) => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500">Image URL</label>
        <input 
          type="text" 
          value={item.imageUrl} 
          onChange={(e) => update({ imageUrl: e.target.value })}
          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
          placeholder="https://example.com/logo.svg"
        />
        <div className="mt-1">
          <input
            type="file"
            accept="image/*"
            className="text-[10px] w-full"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const dataUri = ev.target?.result as string;
                if (!dataUri) return;
                const ext = file.name.split('.').pop() || "png";
                const id = Math.random().toString(36).substring(7);
                const assetPath = `assets/images/logo-cloud/${id}.${ext}`;
                addAsset(assetPath, dataUri);
                update({ imageUrl: `asset://${assetPath.replace("assets/", "")}` });
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] font-semibold text-gray-500">Name (Alt Text)</label>
          <input 
            type="text" 
            value={item.name} 
            onChange={(e) => update({ name: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-[10px] font-semibold text-gray-500">Link URL (Optional)</label>
          <input 
            type="text" 
            value={item.linkUrl || ""} 
            onChange={(e) => update({ linkUrl: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">General</span>
        
        <div className="flex flex-col gap-1.5 mb-2 border-b border-brand-hairline pb-3">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Data Source</label>
          <SegmentedControl
            options={[
              { label: "Static Assets", value: "static" },
              { label: "Ghost Data", value: "dynamic" }
            ]}
            value={general.dataSource || "static"}
            onChange={(v: any) => updateGeneral({ dataSource: v })}
          />
        </div>

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
          <SegmentedControl
            options={[
              { label: "Row", value: "row" },
              { label: "Grid", value: "grid" },
              { label: "Marquee", value: "marquee" }
            ]}
            value={general.layoutStyle}
            onChange={(v: any) => updateGeneral({ layoutStyle: v })}
          />
        </div>

        {general.layoutStyle === "grid" && (
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Columns</label>
            <SegmentedControl
              options={[
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" },
                { label: "6", value: "6" }
              ]}
              value={String(general.columns)}
              onChange={(v: any) => updateGeneral({ columns: parseInt(v) as any })}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Grayscale Logos</label>
          <Switch checked={general.grayscale} onChange={(c) => updateGeneral({ grayscale: c })} />
        </div>
      </div>

      {/* Logos List or Dynamic Settings */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Logos</span>
        {general.dataSource === "dynamic" ? (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Internal Tag Slug</label>
              <input
                type="text"
                value={general.dynamicTag || "hash-partner-logo"}
                onChange={(e) => updateGeneral({ dynamicTag: e.target.value })}
                className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                placeholder="e.g. hash-partner-logo"
              />
              <p className="text-[10px] text-brand-mute leading-tight">Must match a tag in Ghost. Use 'hash-' prefix for internal tags.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Max Logos (Limit)</label>
              <input
                type="text"
                value={general.dynamicLimit || 10}
                onChange={(e) => updateGeneral({ dynamicLimit: e.target.value === 'all' ? 'all' : (parseInt(e.target.value) || 10) })}
                className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                placeholder="e.g. 10 or all"
              />
            </div>
          </div>
        ) : (
          <RepeatableList
            items={logos}
            onChange={(newLogos) => onChangeProps({ logos: newLogos })}
            renderItem={renderLogoItem}
            newItem={() => ({ id: Math.random().toString(36).substring(7), name: "New Logo", imageUrl: GENERIC_SVG_PLACEHOLDER })}
            addLabel="Add Logo"
          />
        )}
      </div>

      {/* Background Controls */}
      <BackgroundControls 
        styles={block.styles || {}} 
        appearance={p.appearance || {}} 
        onChangeStyles={onChangeStyles || (() => {})} 
        updateAppearance={(key, val) => onChangeProps({ appearance: { ...p.appearance, [key]: val } })}
      />

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
            placeholder="e.g. partners"
          />
        </div>
      </div>
    </div>
  );
};
