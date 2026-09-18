import React from "react";
import { BuilderBlock } from "@/types/theme";

const SegmentedControl = ({ options, value, onChange }: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-md border border-gray-200/50">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex justify-center items-center py-1.5 px-1 text-[10px] font-medium rounded-sm transition-all text-center leading-tight ${
          value === opt.value
            ? "bg-white text-gray-900 shadow-sm font-semibold"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between gap-3 bg-white p-2 border-b border-gray-100 last:border-b-0">
    <span className="text-[11px] font-medium text-gray-800">{label}</span>
    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-1.5 py-1">
      <input
        type="color"
        value={value || "#171717"}
        onChange={(e) => onChange(e.target.value)}
        className="w-4 h-4 rounded cursor-pointer border-none p-0 bg-transparent"
      />
      <input
        type="text"
        value={value || "#171717"}
        onChange={(e) => onChange(e.target.value)}
        className="w-16 text-[10px] font-mono text-gray-600 bg-transparent outline-none uppercase"
      />
    </div>
  </div>
);

export const SidebarElement = ({ block, onChangeProps }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const layout = block.props.layout || "split";
  const heading = block.props.heading !== undefined ? block.props.heading : (block.props.title || "Featured Articles");
  const description = block.props.description !== undefined ? block.props.description : "Hand-picked stories and top editorial selections from our writers.";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Section Heading</label>
        <input
          type="text"
          value={heading}
          onChange={(e) => onChangeProps({ heading: e.target.value, title: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="e.g. Featured Articles"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Section Description / Subtext</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => onChangeProps({ description: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
          placeholder="Subtext / summary under the main heading..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Layout</label>
        <SegmentedControl
          options={[
            { label: "Split", value: "split" },
            { label: "Grid", value: "grid" },
            { label: "List", value: "list" },
            { label: "Carousel", value: "carousel" },
            { label: "Bento Grid", value: "bento" },
            { label: "Editorial", value: "editorial" },
            { label: "Masonry", value: "masonry" },
          ]}
          value={layout}
          onChange={(v) => onChangeProps({ layout: v })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Number of Posts</label>
        <input
          type="number"
          min={1}
          max={20}
          value={block.props.limit !== undefined ? block.props.limit : 3}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
              onChangeProps({ limit: Math.min(Math.max(val, 1), 20) });
            }
          }}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {(layout === "carousel" || layout === "masonry") && (
        <div className="flex items-center justify-between py-1.5 border-t border-brand-hairline mt-1">
          <label className="text-[11px] font-sans font-semibold text-brand-body cursor-pointer">Auto Scroll</label>
          <button
            type="button"
            role="switch"
            aria-checked={block.props.autoScroll || false}
            onClick={() => onChangeProps({ autoScroll: !block.props.autoScroll })}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              block.props.autoScroll ? "bg-brand-ink" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                block.props.autoScroll ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {/* Text Color Controls */}
      <div className="flex flex-col gap-1 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Text Colors</span>
        <div className="rounded-md border border-brand-hairline overflow-hidden divide-y divide-gray-100">
          <ColorPicker
            label="Section Heading Color"
            value={block.props.headingColor || "#171717"}
            onChange={(c) => onChangeProps({ headingColor: c })}
          />
          <ColorPicker
            label="Section Subtext Color"
            value={block.props.descriptionColor || "#666666"}
            onChange={(c) => onChangeProps({ descriptionColor: c })}
          />
          <ColorPicker
            label="Card Title Color"
            value={block.props.cardTitleColor || "#171717"}
            onChange={(c) => onChangeProps({ cardTitleColor: c })}
          />
          <ColorPicker
            label="Card Text / Excerpt Color"
            value={block.props.cardTextColor || "#4d4d4d"}
            onChange={(c) => onChangeProps({ cardTextColor: c })}
          />
        </div>
      </div>
    </div>
  );
};