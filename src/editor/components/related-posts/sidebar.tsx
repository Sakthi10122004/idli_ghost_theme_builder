import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveRelatedPostsProps, RelatedPostsLayout } from "./schema";
import { Sparkles, AlertTriangle } from "lucide-react";
import { BackgroundControls } from "../shared/BackgroundControls";

const SegmentedControl = ({
  options,
  value,
  onChange,
}: {
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

const ColorPicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
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

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveRelatedPostsProps(block.props);

  const updateProp = <K extends keyof ReturnType<typeof resolveRelatedPostsProps>>(
    key: K,
    value: ReturnType<typeof resolveRelatedPostsProps>[K]
  ) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Post Context Badge */}
      <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md p-2.5 flex items-start gap-2">
        <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-snug">
          <strong className="font-semibold block mb-0.5">Template Context</strong>
          Only works on Post or Page templates (requires ambient Ghost post context).
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Sparkles size={13} className="text-blue-600 shrink-0" />
          <span>Ghost Related Posts</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Queries posts sharing the current post&apos;s primary tag via Ghost&apos;s{" "}
          <code className="bg-blue-100 text-blue-950 font-semibold px-1.5 py-0.5 rounded font-mono text-[10px] border border-blue-200">
            {"{{#get \"posts\"}}"}
          </code>{" "}
          helper.
        </p>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Section Heading</label>
        <input
          type="text"
          value={p.heading}
          onChange={(e) => updateProp("heading", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="e.g. You might also like"
        />
      </div>

      {/* Description / Subtext */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Section Description / Subtext</label>
        <textarea
          rows={2}
          value={p.description || ""}
          onChange={(e) => updateProp("description", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
          placeholder="Optional subtext under heading..."
        />
      </div>

      {/* Layout Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Layout</label>
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
          value={p.layout}
          onChange={(v) => updateProp("layout", v as RelatedPostsLayout)}
        />
      </div>

      {/* Count */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Number of Posts</label>
        <input
          type="number"
          min={1}
          max={12}
          value={p.count}
          onChange={(e) => updateProp("count", Math.max(1, Math.min(12, Number(e.target.value))))}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Auto Scroll toggle for carousel / masonry */}
      {(p.layout === "carousel" || p.layout === "masonry") && (
        <div className="flex items-center justify-between py-1.5 border-t border-brand-hairline mt-1">
          <label className="text-[11px] font-sans font-semibold text-brand-body cursor-pointer">Auto Scroll</label>
          <button
            type="button"
            role="switch"
            aria-checked={p.autoScroll || false}
            onClick={() => updateProp("autoScroll", !p.autoScroll)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              p.autoScroll ? "bg-brand-ink" : "bg-gray-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                p.autoScroll ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      )}

      {/* Content Display Toggles */}
      <div className="flex flex-col gap-2.5 border-t border-brand-hairline pt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showImage}
            onChange={(e) => updateProp("showImage", e.target.checked)}
            className="rounded border-brand-hairline"
          />
          <span className="text-[11px] font-medium text-brand-body">Show feature image</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={p.showExcerpt}
            onChange={(e) => updateProp("showExcerpt", e.target.checked)}
            className="rounded border-brand-hairline"
          />
          <span className="text-[11px] font-medium text-brand-body">Show excerpt</span>
        </label>
      </div>

      {/* Text Colors */}
      <div className="flex flex-col gap-1 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Text Colors</span>
        <div className="rounded-md border border-brand-hairline overflow-hidden divide-y divide-gray-100">
          <ColorPicker
            label="Section Heading Color"
            value={p.headingColor || "#171717"}
            onChange={(c) => updateProp("headingColor", c)}
          />
          <ColorPicker
            label="Section Subtext Color"
            value={p.descriptionColor || "#666666"}
            onChange={(c) => updateProp("descriptionColor", c)}
          />
          <ColorPicker
            label="Post Title Color"
            value={p.cardTitleColor || "#171717"}
            onChange={(c) => updateProp("cardTitleColor", c)}
          />
          <ColorPicker
            label="Post Excerpt / Text Color"
            value={p.cardTextColor || "#4d4d4d"}
            onChange={(c) => updateProp("cardTextColor", c)}
          />
        </div>
      </div>

      {/* Background Controls */}
      <BackgroundControls
        styles={block.styles || {}}
        appearance={p.appearance || {}}
        onChangeStyles={onChangeStyles || (() => {})}
        updateAppearance={(key, val) =>
          onChangeProps({ appearance: { ...(p.appearance || {}), [key]: val } })
        }
      />
    </div>
  );
};
