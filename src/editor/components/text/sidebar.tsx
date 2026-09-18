import React from "react";
import { BuilderBlock } from "@/types/theme";
import {
  TextProps,
  TextVariant,
  TextDynamicSource,
  resolveTextProps,
  isDarkColor,
} from "./schema";
import {
  FileText,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p: TextProps = resolveTextProps(block.props);

  const updateProp = <K extends keyof TextProps>(key: K, value: TextProps[K]) => {
    onChangeProps({ [key]: value });
  };

  const updateStyle = (key: string, value: unknown) => {
    if (onChangeStyles) {
      onChangeStyles({ [key]: value });
    }
  };

  const currentTextColor = (block.styles?.textColor as string) || p.textColor || "";
  const isDarkText = isDarkColor(currentTextColor);

  const FONT_PRESETS = ["", "13px", "14px", "16px", "18px", "20px", "24px"];
  const [isCustomSize, setIsCustomSize] = React.useState(
    !FONT_PRESETS.includes(p.fontSize || "")
  );

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* 1. Source Mode Switcher: Custom vs Dynamic */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body uppercase tracking-wider font-mono">
          Content Source
        </label>
        <div className="flex bg-brand-canvas-soft p-0.5 rounded-md border border-brand-hairline">
          <button
            type="button"
            onClick={() => updateProp("sourceType", "custom")}
            className={`flex-1 flex justify-center items-center py-1.5 rounded-sm transition-all text-xs font-medium ${
              p.sourceType === "custom"
                ? "bg-white text-brand-ink shadow-xs font-semibold"
                : "text-brand-mute hover:text-brand-ink"
            }`}
          >
            <FileText size={12} className="mr-1.5 text-brand-body" />
            <span>Custom Text</span>
          </button>
          <button
            type="button"
            onClick={() => updateProp("sourceType", "dynamic")}
            className={`flex-1 flex justify-center items-center py-1.5 rounded-sm transition-all text-xs font-medium ${
              p.sourceType === "dynamic"
                ? "bg-white text-brand-ink shadow-xs font-semibold"
                : "text-brand-mute hover:text-brand-ink"
            }`}
          >
            <Sparkles size={12} className="mr-1.5 text-blue-500" />
            <span>Dynamic</span>
          </button>
        </div>
      </div>

      {/* 2. Text Variant / Style */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">
          Text Style Variant
        </label>
        <div className="grid grid-cols-4 gap-1 bg-brand-canvas-soft p-0.5 rounded-sm border border-brand-hairline text-center">
          {(
            [
              { id: "body", label: "Body" },
              { id: "lead", label: "Lead" },
              { id: "caption", label: "Caption" },
              { id: "quote", label: "Quote" },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => updateProp("variant", v.id as TextVariant)}
              className={`py-1 text-[11px] font-medium rounded-xs transition-all ${
                p.variant === v.id
                  ? "bg-white text-brand-ink font-semibold shadow-xs"
                  : "text-brand-mute hover:text-brand-ink"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CUSTOM TEXT CONTROLS */}
      {p.sourceType === "custom" && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold text-brand-body">
              Paragraph Text
            </label>
            <span className="text-[10px] text-brand-mute">
              {(p.text || "").length} chars
            </span>
          </div>
          <textarea
            rows={5}
            value={p.text}
            onChange={(e) => updateProp("text", e.target.value)}
            placeholder="Write your text content here. Double Enter creates new paragraphs..."
            className="w-full px-3 py-2 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-brand-canvas-soft resize-y leading-relaxed"
          />
          <span className="text-[10px] text-brand-mute italic">
            Tip: Press Enter twice to create separate paragraphs.
          </span>
        </div>
      )}

      {/* 4. DYNAMIC GHOST FIELD CONTROLS */}
      {p.sourceType === "dynamic" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Ghost Data Field
            </label>
            <select
              value={p.dynamicSource}
              onChange={(e) => updateProp("dynamicSource", e.target.value as TextDynamicSource)}
              className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="post_content">Full Page / Post Content ({"{{content}}"})</option>
              <option value="post_excerpt">Post / Page Excerpt ({"{{excerpt}}"})</option>
              <option value="site_description">Publication Tagline ({"{{@site.description}}"})</option>
              <option value="author_bio">Author Biography ({"{{author.bio}}"})</option>
              <option value="tag_description">Tag Archive Description ({"{{tag.description}}"})</option>
              <option value="post_reading_time">Estimated Reading Time ({"{{reading_time}}"})</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Canvas Editor Preview / Fallback
            </label>
            <textarea
              rows={3}
              value={p.fallbackText}
              onChange={(e) => updateProp("fallbackText", e.target.value)}
              placeholder="Sample text shown in visual builder..."
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-y"
            />
          </div>

          {/* Ghost Tag Capsule */}
          <div className="bg-blue-50/60 border border-blue-200/50 rounded-md p-2.5">
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-[11px]">
              <Sparkles size={12} />
              <span>Ghost Template Helper</span>
            </div>
            <p className="text-[10px] text-blue-800/80 mt-1 font-mono">
              {p.dynamicSource === "post_content" && "{{content}}"}
              {p.dynamicSource === "post_excerpt" && "{{#if excerpt}}<p>{{excerpt}}</p>{{/if}}"}
              {p.dynamicSource === "site_description" && "{{#if @site.description}}<p>{{@site.description}}</p>{{/if}}"}
              {p.dynamicSource === "author_bio" && "{{#if author.bio}}<p>{{author.bio}}</p>{{/if}}"}
              {p.dynamicSource === "tag_description" && "{{#if tag.description}}<p>{{tag.description}}</p>{{/if}}"}
              {p.dynamicSource === "post_reading_time" && "{{reading_time}}"}
            </p>
          </div>
        </div>
      )}

      {/* 5. TYPOGRAPHY & LAYOUT SETTINGS */}
      <div className="flex flex-col gap-3 pt-3 border-t border-brand-hairline">
        <label className="text-[11px] font-semibold text-brand-body uppercase tracking-wider font-mono">
          Typography & Layout
        </label>

        {/* Text Alignment */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Alignment
          </label>
          <div className="grid grid-cols-4 gap-1 bg-brand-canvas-soft p-0.5 rounded-sm border border-brand-hairline">
            {(
              [
                { id: "left", icon: AlignLeft, title: "Left" },
                { id: "center", icon: AlignCenter, title: "Center" },
                { id: "right", icon: AlignRight, title: "Right" },
                { id: "justify", icon: AlignJustify, title: "Justify" },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const isCurrent = (p.textAlign || "left") === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  title={item.title}
                  onClick={() => {
                    updateProp("textAlign", item.id);
                    updateStyle("textAlign", item.id);
                  }}
                  className={`py-1.5 flex justify-center items-center rounded-xs transition-all ${
                    isCurrent
                      ? "bg-white text-brand-ink font-semibold shadow-xs"
                      : "text-brand-mute hover:text-brand-ink"
                  }`}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size Preset */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Font Size
          </label>
          <div className="flex gap-2">
            <select
              value={isCustomSize ? "custom" : (p.fontSize || "")}
              onChange={(e) => {
                if (e.target.value === "custom") {
                  setIsCustomSize(true);
                  if (!p.fontSize || FONT_PRESETS.includes(p.fontSize)) {
                    updateProp("fontSize", "15px");
                    updateStyle("fontSize", "15px");
                  }
                } else {
                  setIsCustomSize(false);
                  updateProp("fontSize", e.target.value);
                  updateStyle("fontSize", e.target.value);
                }
              }}
              className="flex-1 px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="">Default (16px / 1rem)</option>
              <option value="13px">Extra Small (13px)</option>
              <option value="14px">Small (14px)</option>
              <option value="16px">Base / Standard (16px)</option>
              <option value="18px">Medium (18px)</option>
              <option value="20px">Large (20px)</option>
              <option value="24px">Extra Large (24px)</option>
              <option value="custom">Custom size...</option>
            </select>
            {isCustomSize && (
              <input
                type="text"
                placeholder="e.g. 1.25rem"
                value={p.fontSize || ""}
                onChange={(e) => {
                  updateProp("fontSize", e.target.value);
                  updateStyle("fontSize", e.target.value);
                }}
                className="w-24 px-2 py-1 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
              />
            )}
          </div>
        </div>

        {/* Font Weight */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Font Weight
          </label>
          <select
            value={p.fontWeight || ""}
            onChange={(e) => {
              updateProp("fontWeight", e.target.value);
              updateStyle("fontWeight", e.target.value);
            }}
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="">Default (400)</option>
            <option value="300">Light (300)</option>
            <option value="400">Regular (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi-Bold (600)</option>
            <option value="700">Bold (700)</option>
          </select>
        </div>

        {/* Line Height */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Line Height
          </label>
          <select
            value={p.lineHeight || "1.7"}
            onChange={(e) => updateProp("lineHeight", e.target.value)}
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="1.3">Tight (1.3)</option>
            <option value="1.5">Normal (1.5)</option>
            <option value="1.7">Relaxed Editorial (1.7)</option>
            <option value="2.0">Spacious / Loose (2.0)</option>
          </select>
        </div>

        {/* Reading Width Constraint */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Max Reading Width
          </label>
          <select
            value={p.maxWidth || ""}
            onChange={(e) => updateProp("maxWidth", e.target.value)}
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="">Full Container Width</option>
            <option value="65ch">Optimal Reading Width (65ch / ~680px)</option>
            <option value="48ch">Narrow Column (48ch / ~500px)</option>
            <option value="80ch">Wide Column (80ch / ~850px)</option>
          </select>
        </div>

        {/* Font Color */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold text-brand-body">
              Font Color
            </label>
            {currentTextColor && (
              <button
                type="button"
                onClick={() => {
                  updateProp("textColor", "");
                  updateStyle("textColor", "");
                }}
                className="text-[10px] text-brand-mute hover:text-brand-error cursor-pointer"
              >
                Reset Default
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={currentTextColor || "#171717"}
              onChange={(e) => {
                updateProp("textColor", e.target.value);
                updateStyle("textColor", e.target.value);
              }}
              className="w-8 h-8 rounded border border-brand-hairline p-0.5 cursor-pointer shrink-0 bg-transparent"
            />
            <input
              type="text"
              placeholder="Theme Default (#171717)"
              value={currentTextColor}
              onChange={(e) => {
                updateProp("textColor", e.target.value);
                updateStyle("textColor", e.target.value);
              }}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
            />
          </div>
          {isDarkText && (
            <span className="text-[10px] text-brand-mute leading-tight">
              ⓘ Dark color selected: Automatically adapts to light text in dark mode.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};