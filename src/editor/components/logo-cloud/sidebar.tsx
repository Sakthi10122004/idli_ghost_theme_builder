import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { LogoCloudProps, resolveLogoCloudProps, GENERIC_SVG_PLACEHOLDER } from "./schema";
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

const parsePaddingNum = (val: unknown, fallback = 40): number => {
  if (typeof val === "number") return isNaN(val) ? fallback : val;
  if (typeof val === "string") {
    if (val.endsWith("rem")) {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : Math.round(parsed * 16);
    }
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? fallback : parsed;
  }
  if (typeof val === "object" && val !== null) {
    const resp = val as Record<string, unknown>;
    return parsePaddingNum(resp.desktop || resp.mobile || resp.tablet, fallback);
  }
  return fallback;
};

const ColorPicker = ({ 
  label, 
  value, 
  onChange, 
  defaultTokenLabel = "Theme Default" 
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  defaultTokenLabel?: string; 
}) => {
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
              if (e.target.checked) onChange(defaultTokenLabel.toLowerCase().includes("mute") ? "#6b7280" : "#171717");
              else onChange("");
            }}
            className="rounded-xs border-gray-300 w-3 h-3 accent-brand-primary cursor-pointer"
          />
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Custom</span>
        </label>
      </div>
      {isCustom ? (
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-1.5 py-1">
          <input 
            type="color" 
            value={value.startsWith("#") && (value.length === 7 || value.length === 4) ? value : (defaultTokenLabel.toLowerCase().includes("mute") ? "#6b7280" : "#171717")} 
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 rounded cursor-pointer border-none p-0 bg-transparent"
          />
          <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 text-[10px] font-mono text-gray-600 bg-transparent outline-none uppercase"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onChange(defaultTokenLabel.toLowerCase().includes("mute") ? "#6b7280" : "#171717")}
          className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 px-2 py-1 rounded font-semibold tracking-tight hover:bg-brand-primary/20 transition-colors cursor-pointer"
          title="Click to customize color"
        >
          {defaultTokenLabel}
        </button>
      )}
    </div>
  );
};

export function SidebarElement({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Partial<LogoCloudProps>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) {
  const p = resolveLogoCloudProps(block.props);
  const general = p.general;
  const logos = p.logos || [];
  const addAsset = useEditorStore(s => s.addAsset);

  const topPaddingNum = parsePaddingNum(p.spacing?.paddingTop ?? block.styles?.paddingTop, 40);
  const bottomPaddingNum = parsePaddingNum(p.spacing?.paddingBottom ?? block.styles?.paddingBottom, 40);

  const updateGeneral = (patch: Partial<LogoCloudProps['general']>) => {
    onChangeProps({ general: { ...general, ...patch } });
  };

  type LogoItem = LogoCloudProps['logos'][number];
  const renderLogoItem = (item: LogoItem, update: (patch: Partial<LogoItem>) => void) => (
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
            placeholder="Brand Name"
          />
        </div>
        {general.enableLinks !== false && (
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-gray-500">Hyperlink URL</label>
              {item.linkUrl && (
                <span className="text-[8px] text-blue-600 font-mono font-medium">✓ Linked</span>
              )}
            </div>
            <input 
              type="text" 
              value={item.linkUrl || ""} 
              onChange={(e) => update({ linkUrl: e.target.value })}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val && !/^(https?:[/][/]|[/][/]|mailto:|tel:|#)/i.test(val)) {
                  update({ linkUrl: `https://${val}` });
                }
              }}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none font-mono text-[11px]"
              placeholder="https://example.com"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">General</span>
        
        <div className="flex items-center justify-between mb-2 border-b border-brand-hairline pb-3">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Use Dynamic Ghost Data</label>
          <Switch
            checked={general.dataSource === "dynamic"}
            onChange={(c) => updateGeneral({ dataSource: c ? "dynamic" : "static" })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
            {p.appearance?.headingColor && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-brand-mute">
                <span className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: p.appearance.headingColor }} />
                {p.appearance.headingColor}
              </span>
            )}
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
            {p.appearance?.subheadingColor && (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-brand-mute">
                <span className="w-2 h-2 rounded-full border border-gray-300" style={{ backgroundColor: p.appearance.subheadingColor }} />
                {p.appearance.subheadingColor}
              </span>
            )}
          </div>
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
            onChange={(v) => updateGeneral({ layoutStyle: v as "row" | "grid" | "marquee" })}
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
              onChange={(v) => updateGeneral({ columns: parseInt(v, 10) as 3 | 4 | 5 | 6 })}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Grayscale Logos</label>
          <Switch checked={general.grayscale} onChange={(c) => updateGeneral({ grayscale: c })} />
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Invert in Dark Mode</label>
            <span className="text-[10px] text-brand-mute">Adapts dark logos for dark backgrounds</span>
          </div>
          <Switch checked={general.invertInDark !== false} onChange={(c) => updateGeneral({ invertInDark: c })} />
        </div>

        {/* Logo Size Adjustment */}
        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-brand-hairline">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Logo Size (Height)</label>
            <span className="text-[10px] font-mono text-brand-ink bg-gray-100 px-1.5 py-0.5 rounded font-bold">
              {general.logoHeight || 36}px
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            step="2"
            value={general.logoHeight || 36}
            onChange={(e) => updateGeneral({ logoHeight: parseInt(e.target.value, 10) })}
            className="w-full accent-brand-primary cursor-pointer"
          />
          <div className="flex gap-1 mt-0.5">
            {[
              { label: "S (28px)", size: 28 },
              { label: "M (36px)", size: 36 },
              { label: "L (48px)", size: 48 },
              { label: "XL (64px)", size: 64 }
            ].map(preset => (
              <button
                key={preset.size}
                type="button"
                onClick={() => updateGeneral({ logoHeight: preset.size })}
                className={`flex-1 py-1 text-[9px] rounded-xs border transition-all ${
                  (general.logoHeight || 36) === preset.size
                    ? 'bg-brand-ink text-white border-brand-ink font-semibold shadow-2xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hyperlink Logos Toggle */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-hairline">
          <div className="flex flex-col">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Hyperlink Logos</label>
            <span className="text-[10px] text-brand-mute">Allow clicking logos to open links</span>
          </div>
          <Switch checked={general.enableLinks !== false} onChange={(c) => updateGeneral({ enableLinks: c })} />
        </div>

        {general.enableLinks !== false && (
          <div className="flex flex-col gap-2 pl-3 border-l-2 border-brand-hairline ml-1 my-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-sans text-brand-body">Open in New Tab</label>
              <input
                type="checkbox"
                checked={general.openInNewTab !== false}
                onChange={(e) => updateGeneral({ openInNewTab: e.target.checked })}
                className="rounded-xs border-gray-300 w-3.5 h-3.5 accent-brand-primary cursor-pointer"
              />
            </div>

            {general.dataSource === "dynamic" && (
              <div className="flex flex-col gap-1 mt-1">
                <label className="text-[10px] font-semibold text-gray-600">Dynamic Link Target</label>
                <select
                  value={general.dynamicLinkSource || "excerpt"}
                  onChange={(e) => updateGeneral({ dynamicLinkSource: e.target.value as "post" | "excerpt" })}
                  className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs focus:outline-none bg-brand-canvas-soft"
                >
                  <option value="excerpt">Excerpt URL (External Partner Site)</option>
                  <option value="post">Post URL (Ghost Post / Story)</option>
                </select>
                <p className="text-[9px] text-brand-mute leading-snug">
                  {general.dynamicLinkSource === "post"
                    ? "Links directly to the internal Ghost post / story on your site (e.g. /my-post/)."
                    : "External partner website URL from the post excerpt (e.g. https://www.tech4goodcommunity.com). Automatically prepends https:// if omitted."}
                </p>
              </div>
            )}
          </div>
        )}
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
              <p className="text-[10px] text-brand-mute leading-tight">Must match a tag in Ghost. Use &apos;hash-&apos; prefix for internal tags.</p>
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
            newItem={() => ({ id: Math.random().toString(36).substring(7), name: "New Brand", imageUrl: GENERIC_SVG_PLACEHOLDER })}
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

      {/* Text Colors */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Text Colors</span>
        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shadow-xs">
          <ColorPicker
            label="Heading Color"
            value={p.appearance?.headingColor || ""}
            onChange={(v) => onChangeProps({ appearance: { ...p.appearance, headingColor: v } })}
            defaultTokenLabel="Theme Default"
          />
          <ColorPicker
            label="Subheading Color"
            value={p.appearance?.subheadingColor || ""}
            onChange={(v) => onChangeProps({ appearance: { ...p.appearance, subheadingColor: v } })}
            defaultTokenLabel="Theme Muted"
          />
        </div>
      </div>

      {/* Spacing */}
      <div className="flex flex-col gap-3 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Spacing</span>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Top Padding</label>
            <span className="text-[9px] font-mono text-brand-mute">
              {topPaddingNum}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="160"
            step="4"
            value={topPaddingNum}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChangeProps({ spacing: { ...p.spacing, paddingTop: `${val}px` } });
              if (onChangeStyles) {
                onChangeStyles({ paddingTop: `${val}px` });
              }
            }}
            className="w-full accent-brand-primary cursor-pointer"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Bottom Padding</label>
            <span className="text-[9px] font-mono text-brand-mute">
              {bottomPaddingNum}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="160"
            step="4"
            value={bottomPaddingNum}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              onChangeProps({ spacing: { ...p.spacing, paddingBottom: `${val}px` } });
              if (onChangeStyles) {
                onChangeStyles({ paddingBottom: `${val}px` });
              }
            }}
            className="w-full accent-brand-primary cursor-pointer"
          />
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
