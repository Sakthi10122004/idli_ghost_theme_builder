import React from "react";
import { BuilderBlock } from "@/types/theme";

const Switch = ({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) => (
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
  onChange: (v: string) => void;
}) => (
  <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200/50">
    {options.map(opt => (
      <button
        key={opt.value}
        type="button"
        disabled={opt.disabled}
        onClick={() => onChange(opt.value)}
        className={`flex-1 flex justify-center items-center py-1 px-3 text-[11px] font-medium rounded-sm transition-all ${
          opt.disabled ? 'text-gray-300 cursor-not-allowed'
          : value === opt.value ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// NOTE: this block intentionally uses a raw, open color picker rather than the
// closed palette set used elsewhere (Header, Hero). That's a deliberate exception
// made for Post Grid specifically — worth knowing this creates a real inconsistency
// with the rest of the app's design-token system, not a neutral styling choice.
const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
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
        className="w-16 text-[10px] font-mono text-gray-600 bg-transparent outline-none uppercase"
      />
    </div>
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12px] font-bold text-gray-900 tracking-tight">{children}</span>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-sans font-semibold text-brand-body">{children}</label>
);

const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
  />
);

interface FilterRule { field: "tag" | "author" | "featured"; value: string; }

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles?: (styles: Record<string, any>) => void;
}) => {
  const p = block.props || {};
  const general = p.general || {};
  const filter = p.filter || { rules: [] as FilterRule[], combinator: "all" };
  const postCard = p.postCard || {};
  const button = p.button || {};
  const appearance = p.appearance || {};
  const spacing = p.spacing || {};
  const advanced = p.advanced || {};

  const updateCategory = (category: string, key: string, value: any) => {
    onChangeProps({
      ...p,
      [category]: {
        ...(p[category] || {}),
        [key]: value,
      },
    });
  };

  const updateFilterRules = (rules: FilterRule[]) => updateCategory("filter", "rules", rules);
  const addRule = () => updateFilterRules([...(filter.rules || []), { field: "tag", value: "" }]);
  const updateRule = (idx: number, patch: Partial<FilterRule>) => {
    const next = [...(filter.rules || [])];
    next[idx] = { ...next[idx], ...patch };
    updateFilterRules(next);
  };
  const removeRule = (idx: number) =>
    updateFilterRules((filter.rules || []).filter((_: FilterRule, i: number) => i !== idx));

  const source = general.source || "routes";

  return (
    <div className="flex flex-col gap-6">

      {/* GENERAL */}
      <div className="flex flex-col gap-3">
        <SectionLabel>General</SectionLabel>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Section Title</FieldLabel>
          <TextInput
            value={p.title || ""}
            onChange={(e) => onChangeProps({ ...p, title: e.target.value })}
            placeholder="Posts"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Source</FieldLabel>
          <select
            value={source}
            onChange={(e) => updateCategory("general", "source", e.target.value)}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="routes">Routes (uses page routing)</option>
            <option value="featured">Featured</option>
            <option value="tag">Tag</option>
            <option value="related">Related (post pages only)</option>
            <option value="custom">Custom</option>
          </select>
          {source === "routes" && (
            <span className="text-[10px] text-brand-mute">
              Shows whatever this page's routing shows. Count is controlled by
              Theme Settings → Posts Per Page, not by this block.
            </span>
          )}
          {source === "related" && (
            <span className="text-[10px] text-brand-mute">
              Only applies on Post templates — shows posts related by tag or author
              to the current post.
            </span>
          )}
        </div>

        {source === "tag" && (
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Tag</FieldLabel>
            <TextInput
              value={general.tag || ""}
              onChange={(e) => updateCategory("general", "tag", e.target.value)}
              placeholder="e.g. design"
            />
            <span className="text-[10px] text-brand-mute">
              Enter the tag's slug exactly as it appears in Ghost Admin (lowercase,
              hyphenated) — only posts with this tag will show here.
            </span>
          </div>
        )}

        {(source === "featured" || source === "tag" || source === "related" || source === "custom") && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <FieldLabel>Limit</FieldLabel>
              <span className="text-[9px] font-mono text-brand-mute">Max posts to display</span>
            </div>
            <input
              type="number"
              min={1}
              max={24}
              value={general.limit ?? 3}
              onChange={(e) => updateCategory("general", "limit", parseInt(e.target.value, 10) || 1)}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
        )}

        {(source === "featured" || source === "tag" || source === "custom") && (
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Order</FieldLabel>
            <select
              value={general.order || "newest"}
              onChange={(e) => updateCategory("general", "order", e.target.value)}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        )}

        {source === "custom" && (
          <div className="flex flex-col gap-2 border border-gray-100 rounded-lg p-3 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-gray-800">Filter rules</span>
              <SegmentedControl
                value={filter.combinator || "all"}
                onChange={(v) => updateCategory("filter", "combinator", v)}
                options={[{ label: "All", value: "all" }, { label: "Any", value: "any" }]}
              />
            </div>

            {(filter.rules || []).map((rule: FilterRule, idx: number) => (
              <div key={idx} className="flex gap-2 items-center">
                <select
                  value={rule.field}
                  onChange={(e) => updateRule(idx, { field: e.target.value as FilterRule["field"] })}
                  className="flex-shrink-0 px-2 py-1 border border-gray-200 rounded text-[11px]"
                >
                  <option value="tag">Tag</option>
                  <option value="author">Author</option>
                  <option value="featured">Featured</option>
                </select>
                <input
                  type="text"
                  value={rule.value}
                  onChange={(e) => updateRule(idx, { value: e.target.value })}
                  placeholder={rule.field === "featured" ? "true" : "slug"}
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-[11px]"
                />
                <button
                  type="button"
                  onClick={() => removeRule(idx)}
                  className="text-gray-400 hover:text-red-500 text-[13px] px-1"
                  aria-label="Remove rule"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addRule}
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 text-left mt-1"
            >
              + Add rule
            </button>

            <div className="border-t border-gray-100 pt-2 mt-1">
              <FieldLabel>Manual filter (advanced)</FieldLabel>
              <input
                type="text"
                value={p.manualFilter || ""}
                onChange={(e) => onChangeProps({ ...p, manualFilter: e.target.value })}
                placeholder="tag:design+featured:true"
                className="w-full mt-1 px-2 py-1 border border-gray-200 rounded text-[11px] font-mono"
              />
              <span className="text-[10px] text-brand-mute block mt-1">
                If set, this raw filter string is used instead of the rules above.
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Layout Style</FieldLabel>
          <select
            value={general.layoutStyle || "grid"}
            onChange={(e) => updateCategory("general", "layoutStyle", e.target.value)}
            className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="grid">Grid</option>
            <option value="list">Classic List</option>
            <option value="magazine">Magazine (feature + list)</option>
          </select>
        </div>

        {general.layoutStyle === "grid" && (
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Columns</FieldLabel>
            <SegmentedControl
              value={String(general.columns ?? 3)}
              onChange={(v) => updateCategory("general", "columns", parseInt(v, 10))}
              options={[
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
              ]}
            />
          </div>
        )}
      </div>

      {/* POST CARD */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-5">
        <SectionLabel>Post Card</SectionLabel>
        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          {([
            ["showFeatureImage", "Feature Image", true],
            ["showPrimaryTag", "Primary Tag", true],
            ["showAuthorName", "Author Name", false],
            ["showAuthorImage", "Author Image", false],
            ["showPublishDate", "Publish Date", false],
            ["showExcerpt", "Excerpt", true],
          ] as [string, string, boolean][]).map(([key, label, def]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-white border-b border-gray-100 last:border-b-0">
              <span className="text-[12px] font-medium text-gray-800">{label}</span>
              <Switch
                checked={postCard[key] ?? def}
                onChange={(c) => updateCategory("postCard", key, c)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-5">
        <SectionLabel>Button</SectionLabel>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Label</FieldLabel>
          <TextInput
            value={button.label || ""}
            onChange={(e) => updateCategory("button", "label", e.target.value)}
            placeholder="View All"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Link URL</FieldLabel>
          <TextInput
            value={button.url || ""}
            onChange={(e) => updateCategory("button", "url", e.target.value)}
            placeholder="/"
          />
        </div>
      </div>

      {/* BACKGROUND */}
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5">
        <SectionLabel>Background</SectionLabel>
        
        <FieldLabel>Background Type</FieldLabel>
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
          <option value="image">Image URL</option>
        </select>
      </div>

      {(block.styles?.backgroundType || "solid") === "solid" && (
        <div className="flex flex-col gap-1.5 mt-2">
          <FieldLabel>Background Color</FieldLabel>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={appearance.backgroundColor || "#ffffff"}
              onChange={(e) => updateCategory("appearance", "backgroundColor", e.target.value)}
              className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="text"
              value={appearance.backgroundColor || "#ffffff"}
              onChange={(e) => updateCategory("appearance", "backgroundColor", e.target.value)}
              className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
        </div>
      )}

      {block.styles?.backgroundType === "linear" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Gradient Colors</FieldLabel>
            <div className="flex gap-2">
              <input type="color" value={block.styles?.gradientColor1 || "#000000"} onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor1: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="color" value={block.styles?.gradientColor2 || "#333333"} onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor2: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <FieldLabel>Angle (deg)</FieldLabel>
              <span className="text-[10px] text-brand-muted">{block.styles?.gradientAngle || 90}°</span>
            </div>
            <input type="range" min="0" max="360" value={block.styles?.gradientAngle || 90} onChange={(e) => onChangeStyles && onChangeStyles({ gradientAngle: parseInt(e.target.value) })} className="w-full accent-brand-primary" />
          </div>
        </div>
      )}

      {block.styles?.backgroundType === "radial" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Gradient Colors</FieldLabel>
            <div className="flex gap-2">
              <input type="color" value={block.styles?.gradientColor1 || "#000000"} onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor1: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="color" value={block.styles?.gradientColor2 || "#333333"} onChange={(e) => onChangeStyles && onChangeStyles({ gradientColor2: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Position</FieldLabel>
            <select value={block.styles?.gradientPosition || "center"} onChange={(e) => onChangeStyles && onChangeStyles({ gradientPosition: e.target.value })} className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft">
              <option value="center">Center</option>
              <option value="top left">Top Left</option>
              <option value="top right">Top Right</option>
              <option value="bottom left">Bottom Left</option>
              <option value="bottom right">Bottom Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
      )}

      {block.styles?.backgroundType === "mesh" && (
        <div className="flex flex-col gap-1.5 mt-2">
          <FieldLabel>Mesh Colors</FieldLabel>
          <div className="flex gap-2">
            <input type="color" value={block.styles?.meshColor1 || "#ff0080"} onChange={(e) => onChangeStyles && onChangeStyles({ meshColor1: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            <input type="color" value={block.styles?.meshColor2 || "#7928ca"} onChange={(e) => onChangeStyles && onChangeStyles({ meshColor2: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            <input type="color" value={block.styles?.meshColor3 || "#0070f3"} onChange={(e) => onChangeStyles && onChangeStyles({ meshColor3: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
          </div>
        </div>
      )}

      {block.styles?.backgroundType === "pattern" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Pattern Type</FieldLabel>
            <select value={block.styles?.patternType || "dots"} onChange={(e) => onChangeStyles && onChangeStyles({ patternType: e.target.value })} className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft">
              <option value="dots">Dots</option>
              <option value="lines">Diagonal Lines</option>
              <option value="noise">Noise / Grain</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Pattern Base Color</FieldLabel>
            <div className="flex gap-2 items-center">
              <input type="color" value={block.styles?.patternColor || "#000000"} onChange={(e) => onChangeStyles && onChangeStyles({ patternColor: e.target.value })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={block.styles?.patternColor || "#000000"} onChange={(e) => onChangeStyles && onChangeStyles({ patternColor: e.target.value })} className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft" />
            </div>
          </div>
        </div>
      )}

      {block.styles?.backgroundType === "image" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Image URL</FieldLabel>
            <TextInput value={block.styles?.bgImageUrl || ""} onChange={(e) => onChangeStyles && onChangeStyles({ bgImageUrl: e.target.value })} placeholder="https://example.com/image.jpg" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Overlay Color</FieldLabel>
            <input type="color" value={block.styles?.bgOverlayColor || "#000000"} onChange={(e) => onChangeStyles && onChangeStyles({ bgOverlayColor: e.target.value })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <FieldLabel>Overlay Opacity</FieldLabel>
              <span className="text-[10px] text-brand-muted">{Math.round((block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5) * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5} onChange={(e) => onChangeStyles && onChangeStyles({ bgOverlayOpacity: parseFloat(e.target.value) })} className="w-full accent-brand-primary" />
          </div>
        </div>
      )}

      {/* COLORS — open picker (intentional exception, see note above the
          ColorPicker component definition) */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
        <SectionLabel>Colors</SectionLabel>
        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shadow-sm mt-1">
          <ColorPicker
            label="Text Color"
            value={appearance.textColor || "#111827"}
            onChange={(v) => updateCategory("appearance", "textColor", v)}
          />
          <ColorPicker
            label="Tag/Accent Color"
            value={appearance.accentColor || "#ef4444"}
            onChange={(v) => updateCategory("appearance", "accentColor", v)}
          />
        </div>
      </div>

      {/* LAYOUT (width) */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
        <SectionLabel>Layout</SectionLabel>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Section Width</FieldLabel>
          <SegmentedControl
            value={appearance.sectionWidth || "full"}
            onChange={(v) => updateCategory("appearance", "sectionWidth", v)}
            options={[
              { label: "Full", value: "full" },
              { label: "Wide", value: "wide" },
              { label: "Standard", value: "standard" },
              { label: "Narrow", value: "narrow" },
            ]}
          />
        </div>
      </div>

      {/* SPACING */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
        <SectionLabel>Spacing</SectionLabel>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <FieldLabel>Top Padding</FieldLabel>
            <span className="text-[9px] font-mono text-brand-mute">{spacing.paddingTop || "4rem"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.5"
            value={parseFloat(spacing.paddingTop || "4")}
            onChange={(e) => updateCategory("spacing", "paddingTop", `${e.target.value}rem`)}
            className="w-full accent-brand-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <FieldLabel>Bottom Padding</FieldLabel>
            <span className="text-[9px] font-mono text-brand-mute">{spacing.paddingBottom || "4rem"}</span>
          </div>
          <input
            type="range"
            min="0"
            max="8"
            step="0.5"
            value={parseFloat(spacing.paddingBottom || "4")}
            onChange={(e) => updateCategory("spacing", "paddingBottom", `${e.target.value}rem`)}
            className="w-full accent-brand-primary"
          />
        </div>
      </div>

      {/* ADVANCED */}
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5">
        <SectionLabel>Advanced</SectionLabel>
        <FieldLabel>HTML Anchor</FieldLabel>
        <TextInput
          value={advanced.htmlAnchor || ""}
          onChange={(e) => updateCategory("advanced", "htmlAnchor", e.target.value)}
          placeholder="section-id"
        />
        <span className="text-[10px] text-brand-mute">
          Enter 1-2 words, no spaces — link directly to this section with #section-id.
        </span>
      </div>
    </div>
  );
};