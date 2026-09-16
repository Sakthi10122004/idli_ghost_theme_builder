import React from "react";
import { BuilderBlock } from "@/types/theme";
import {
  HeadingProps,
  HeadingDynamicSource,
  HeadingLevel,
  resolveHeadingProps,
} from "./schema";
import { Sparkles, Edit3 } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveHeadingProps(block.props);

  const updateProp = <K extends keyof HeadingProps>(key: K, value: HeadingProps[K]) => {
    onChangeProps({ [key]: value });
  };

  const handleLevelChange = (lvl: HeadingLevel) => {
    updateProp("level", lvl);
    // If a custom inline fontSize was previously set, clear it so the heading
    // level's native size immediately takes visual effect on the canvas
    if (block.styles?.fontSize && onChangeStyles) {
      onChangeStyles({ fontSize: "" });
    }
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Mode Switcher: Custom vs Dynamic */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body uppercase tracking-wider font-mono">
          Heading Type
        </label>
        <div className="flex bg-brand-canvas-soft p-0.5 rounded-md border border-brand-hairline">
          <button
            type="button"
            onClick={() => updateProp("headingType", "custom")}
            className={`flex-1 flex justify-center items-center py-1.5 rounded-sm transition-all text-xs font-medium ${
              p.headingType === "custom"
                ? "bg-white text-brand-ink shadow-xs font-semibold"
                : "text-brand-mute hover:text-brand-ink"
            }`}
          >
            <Edit3 size={12} className="mr-1.5 text-brand-body" />
            <span>Custom</span>
          </button>
          <button
            type="button"
            onClick={() => updateProp("headingType", "dynamic")}
            className={`flex-1 flex justify-center items-center py-1.5 rounded-sm transition-all text-xs font-medium ${
              p.headingType === "dynamic"
                ? "bg-white text-brand-ink shadow-xs font-semibold"
                : "text-brand-mute hover:text-brand-ink"
            }`}
          >
            <Sparkles size={12} className="mr-1.5 text-blue-500" />
            <span>Dynamic</span>
          </button>
        </div>
      </div>

      {/* Semantic Heading Tag Level */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-sans font-semibold text-brand-body">
            Heading Level
          </label>
          <span className="text-[10px] font-mono text-brand-mute">H{p.level}</span>
        </div>

        {/* Quick Buttons */}
        <div className="grid grid-cols-6 gap-1 bg-brand-canvas-soft p-0.5 rounded-sm border border-brand-hairline">
          {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => handleLevelChange(lvl)}
              className={`py-1 text-center font-mono text-[11px] rounded-xs transition-all ${
                p.level === lvl
                  ? "bg-white text-brand-ink font-semibold shadow-xs"
                  : "text-brand-mute hover:text-brand-ink"
              }`}
            >
              H{lvl}
            </button>
          ))}
        </div>

        {/* Descriptive Select */}
        <select
          value={p.level}
          onChange={(e) => handleLevelChange(Number(e.target.value) as HeadingLevel)}
          className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft mt-1"
        >
          <option value={1}>H1 - Large Display (Hero Title)</option>
          <option value={2}>H2 - Major Section Title</option>
          <option value={3}>H3 - Subsection Title</option>
          <option value={4}>H4 - Component Title</option>
          <option value={5}>H5 - Minor Heading</option>
          <option value={6}>H6 - Eyebrow / Tiny Heading</option>
        </select>
      </div>

      {/* CUSTOM HEADING FIELDS */}
      {p.headingType === "custom" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">
            Heading Text
          </label>
          <textarea
            rows={3}
            value={p.text}
            onChange={(e) => updateProp("text", e.target.value)}
            placeholder="Type your heading..."
            className="w-full px-3 py-2 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-brand-canvas-soft resize-none"
          />
        </div>
      )}

      {/* DYNAMIC HEADING FIELDS */}
      {p.headingType === "dynamic" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">
              Ghost Data Field
            </label>
            <select
              value={p.dynamicSource}
              onChange={(e) => updateProp("dynamicSource", e.target.value as HeadingDynamicSource)}
              className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="post_title">Post / Page Title ({"{{title}}"})</option>
              <option value="site_title">Site Title ({"{{@site.title}}"})</option>
              <option value="site_description">Site Description ({"{{@site.description}}"})</option>
              <option value="tag_name">Tag Archive Name ({"{{tag.name}}"})</option>
              <option value="author_name">Author Profile Name ({"{{author.name}}"})</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">
              Canvas Preview / Fallback Text
            </label>
            <input
              type="text"
              value={p.fallbackText}
              onChange={(e) => updateProp("fallbackText", e.target.value)}
              placeholder="e.g. My Amazing Post Title"
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-brand-canvas-soft"
            />
          </div>

          <div className="bg-blue-50/60 border border-blue-200/50 rounded-md p-2.5 mt-1">
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-[11px]">
              <Sparkles size={12} />
              <span>Ghost Template Tag</span>
            </div>
            <p className="text-[10px] text-blue-800/80 mt-1 font-mono">
              {p.dynamicSource === "post_title" && "{{title}}"}
              {p.dynamicSource === "site_title" && "{{@site.title}}"}
              {p.dynamicSource === "site_description" && "{{@site.description}}"}
              {p.dynamicSource === "tag_name" && "{{tag.name}}"}
              {p.dynamicSource === "author_name" && "{{author.name}}"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};