import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { HeroProps, HeroSlide } from "./schema";
import { Sliders, Plus, Trash2, ChevronUp, ChevronDown, Upload, Tag, Layers } from "lucide-react";

const Switch = ({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors cursor-pointer ${checked ? "bg-blue-600" : "bg-gray-200"}`}
  >
    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-xs transform transition-transform ${checked ? "translate-x-3.5" : "translate-x-0"}`} />
  </button>
);

const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: React.ReactNode; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200/50">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`flex-1 flex justify-center items-center py-1.5 text-[11px] font-semibold rounded-sm transition-all cursor-pointer ${
          value === opt.value
            ? "bg-white text-gray-900 shadow-xs border border-gray-200"
            : "text-gray-600 hover:text-gray-900"
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
  defaultTokenLabel = "Theme Default",
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
        <span className="text-[12px] font-semibold text-gray-800">{label}</span>
        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => {
              if (e.target.checked) onChange("#000000");
              else onChange("");
            }}
            className="rounded-xs border-gray-300 w-3 h-3 accent-blue-600"
          />
          <span className="text-[9px] text-gray-600 uppercase font-bold tracking-wider">Custom</span>
        </label>
      </div>
      {isCustom ? (
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
            className="w-14 text-[10px] font-mono text-gray-800 font-bold bg-transparent outline-none uppercase"
          />
        </div>
      ) : (
        <div className="text-[10px] font-mono text-gray-800 bg-gray-100 border border-gray-200 px-2 py-1 rounded font-bold tracking-tight">
          {defaultTokenLabel}
        </div>
      )}
    </div>
  );
};

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Partial<HeroProps>) => void;
  onChangeStyles: (styles: Record<string, unknown>) => void;
}) => {
  const addAsset = useEditorStore((s) => s.addAsset);
  const p = block.props || {};
  const bgType = (block.styles?.backgroundType as string) || "solid";
  const useSiteData = p.useSiteData ?? false;
  const isCarousel = !!p.enableCarousel;
  const layout = (block.styles?.layout as string) || "center";

  const [expandedSlideIndex, setExpandedSlideIndex] = useState<number | null>(0);

  const slides: HeroSlide[] = (p.slides && p.slides.length > 0) ? p.slides : [
    {
      id: "slide-1",
      eyebrowText: "Featured",
      title: "Discover Verve Edition",
      subtitle: "Experience modern publishing with fluid visual storytelling.",
      buttonLabel: "Explore Now",
      buttonUrl: "#",
      imageUrl: "",
      imageAlt: "Slide 1 Image",
    },
    {
      id: "slide-2",
      eyebrowText: "New Release",
      title: "Built For Modern Creators",
      subtitle: "Craft lightning-fast dynamic publication layouts in Ghost CMS.",
      buttonLabel: "Get Started",
      buttonUrl: "#",
      imageUrl: "",
      imageAlt: "Slide 2 Image",
    },
  ];

  const updateSlide = (idx: number, updates: Partial<HeroSlide>) => {
    const updated = [...slides];
    updated[idx] = { ...updated[idx], ...updates };
    onChangeProps({ slides: updated });
  };

  const removeSlide = (idx: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== idx);
    onChangeProps({ slides: updated });
    if (expandedSlideIndex === idx) setExpandedSlideIndex(0);
  };

  const moveSlide = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const updated = [...slides];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChangeProps({ slides: updated });
    setExpandedSlideIndex(targetIdx);
  };

  const addNewSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now().toString(36)}`,
      eyebrowText: "Featured",
      title: `Slide ${slides.length + 1}`,
      subtitle: "Add engaging storytelling copy to capture your audience.",
      buttonLabel: "Learn More",
      buttonUrl: "#",
      imageUrl: "",
      imageAlt: `Slide ${slides.length + 1}`,
    };
    onChangeProps({ slides: [...slides, newSlide] });
    setExpandedSlideIndex(slides.length);
  };

  return (
    <div className="flex flex-col gap-4 text-gray-900">
      {/* ================================================================= */}
      {/* 1. HERO CAROUSEL SETTINGS */}
      {/* ================================================================= */}
      <div className="flex flex-col gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-2xs">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sliders size={13} />
            </div>
            <div>
              <span className="text-[12px] font-semibold text-gray-900 block leading-tight">Hero Carousel</span>
              <span className="text-[10px] text-gray-500">Rotate multiple content slides</span>
            </div>
          </div>
          <Switch
            checked={isCarousel}
            onChange={(c) => {
              if (c && (!p.slides || p.slides.length === 0)) {
                onChangeProps({ enableCarousel: true, slides });
              } else {
                onChangeProps({ enableCarousel: c });
              }
            }}
          />
        </div>

        {isCarousel && (
          <div className="flex flex-col gap-3 pt-2.5 border-t border-gray-100">
            {/* Source Segmented Control */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-gray-700">Carousel Source</label>
              <SegmentedControl
                value={p.carouselMode || "static"}
                onChange={(mode) => onChangeProps({ carouselMode: mode as "static" | "dynamic" })}
                options={[
                  { label: <span className="flex items-center gap-1.5"><Layers size={11} />Static Slides</span>, value: "static" },
                  { label: <span className="flex items-center gap-1.5"><Tag size={11} />Ghost Tag</span>, value: "dynamic" },
                ]}
              />
            </div>

            {/* DYNAMIC GHOST TAG SETTINGS */}
            {p.carouselMode === "dynamic" ? (
              <div className="flex flex-col gap-2.5 bg-gray-50 p-2.5 rounded-md border border-gray-200">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-gray-800 flex items-center gap-1">
                    <Tag size={11} className="text-blue-600" />
                    Ghost Tag
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-2.5 text-xs font-mono font-bold text-gray-500">#</span>
                    <input
                      type="text"
                      value={p.dynamicTag || "hero-carousel"}
                      onChange={(e) => onChangeProps({ dynamicTag: e.target.value.replace(/^#/, "") })}
                      className="w-full pl-6 pr-2.5 py-1.5 bg-white border border-gray-200 text-gray-900 rounded text-xs font-mono font-medium focus:outline-none focus:border-blue-500"
                      placeholder="hero-carousel"
                    />
                  </div>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 rounded p-2 text-[11px] text-gray-700 leading-relaxed flex flex-col gap-1.5">
                  <span className="font-semibold text-blue-900">Supported Workflows:</span>
                  <div>• <strong>Multiple posts:</strong> Tag posts with <code className="bg-blue-100 text-blue-800 px-1 rounded text-[10px]">#{p.dynamicTag || "hero-carousel"}</code> to create rotating slides.</div>
                  <div>• <strong>Gallery post:</strong> Upload multiple images into one tagged post to extract each image into a slide.</div>
                </div>
              </div>
            ) : (
              /* STATIC SLIDES LIST */
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-gray-700">Slides ({slides.length})</span>
                  <button
                    type="button"
                    onClick={addNewSlide}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[340px] overflow-y-auto pr-0.5">
                  {slides.map((slide, idx) => {
                    const isExpanded = expandedSlideIndex === idx;
                    return (
                      <div key={slide.id || idx} className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <div
                          onClick={() => setExpandedSlideIndex(isExpanded ? null : idx)}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="w-4 h-4 rounded-full bg-gray-100 text-[9px] font-mono flex items-center justify-center font-semibold text-gray-700">
                              {idx + 1}
                            </span>
                            <span className="text-[11px] font-medium text-gray-900 truncate max-w-[130px]">
                              {slide.title || "Untitled Slide"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveSlide(idx, "up")}
                              className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === slides.length - 1}
                              onClick={() => moveSlide(idx, "down")}
                              className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown size={12} />
                            </button>
                            {slides.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSlide(idx)}
                                className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                                title="Delete Slide"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-2.5 pt-0 border-t border-gray-100 flex flex-col gap-2 mt-1">
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-medium text-gray-600">Eyebrow</label>
                              <input
                                type="text"
                                value={slide.eyebrowText || ""}
                                onChange={(e) => updateSlide(idx, { eyebrowText: e.target.value })}
                                className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500"
                                placeholder="Featured"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-medium text-gray-600">Title</label>
                              <input
                                type="text"
                                value={slide.title || ""}
                                onChange={(e) => updateSlide(idx, { title: e.target.value })}
                                className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:border-blue-500"
                                placeholder="Slide Title"
                              />
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-medium text-gray-600">Subtitle</label>
                              <textarea
                                rows={2}
                                value={slide.subtitle || ""}
                                onChange={(e) => updateSlide(idx, { subtitle: e.target.value })}
                                className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 resize-none"
                                placeholder="Slide description..."
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-medium text-gray-600">Button Label</label>
                                <input
                                  type="text"
                                  value={slide.buttonLabel || ""}
                                  onChange={(e) => updateSlide(idx, { buttonLabel: e.target.value })}
                                  className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500"
                                  placeholder="Learn More"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] font-medium text-gray-600">Button URL</label>
                                <input
                                  type="text"
                                  value={slide.buttonUrl || ""}
                                  onChange={(e) => updateSlide(idx, { buttonUrl: e.target.value })}
                                  className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500"
                                  placeholder="#"
                                />
                              </div>
                            </div>

                            {/* Slide Image Upload */}
                            <div className="flex flex-col gap-1 pt-1 border-t border-gray-100">
                              <label className="text-[10px] font-medium text-gray-600">Image URL / Upload</label>
                              <input
                                type="text"
                                value={slide.imageUrl || ""}
                                onChange={(e) => updateSlide(idx, { imageUrl: e.target.value })}
                                className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                                placeholder="https://... or asset://..."
                              />
                              <div className="mt-0.5">
                                <label className="flex items-center justify-center gap-1.5 w-full py-1 px-2 bg-gray-50 border border-dashed border-gray-200 rounded cursor-pointer hover:bg-gray-100 text-[10px] font-medium text-gray-700">
                                  <Upload size={11} />
                                  <span>Upload Image</span>
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
                                        const assetPath = `assets/images/hero/${id}.${ext}`;
                                        addAsset(assetPath, dataUri);
                                        updateSlide(idx, { imageUrl: `asset://${assetPath.replace("assets/", "")}` });
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PLAYBACK CONTROLS */}
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <span className="text-[11px] font-semibold text-gray-800">Playback Controls</span>
              
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-gray-700">Autoplay</label>
                <Switch
                  checked={p.autoplay ?? true}
                  onChange={(c) => onChangeProps({ autoplay: c })}
                />
              </div>

              {(p.autoplay ?? true) && (
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] text-gray-600">Interval</label>
                    <span className="text-[10px] font-mono font-bold text-blue-600">
                      {((p.autoplayInterval || 5000) / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2000"
                    max="10000"
                    step="500"
                    value={p.autoplayInterval || 5000}
                    onChange={(e) => onChangeProps({ autoplayInterval: parseInt(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="text-[11px] text-gray-700">Show Arrows</label>
                <Switch
                  checked={p.showArrows ?? true}
                  onChange={(c) => onChangeProps({ showArrows: c })}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-[11px] text-gray-700">Show Pagination Dots</label>
                <Switch
                  checked={p.showDots ?? true}
                  onChange={(c) => onChangeProps({ showDots: c })}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-gray-600">Transition Effect</label>
                <select
                  value={p.transitionEffect || "slide"}
                  onChange={(e) => onChangeProps({ transitionEffect: e.target.value as "slide" | "fade" })}
                  className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="slide">Slide (Horizontal)</option>
                  <option value="fade">Fade (Crossfade)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 2. STANDARD CONTENT SETTINGS (When carousel is off) */}
      {/* ================================================================= */}
      {!isCarousel && (
        <div className="flex flex-col gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-2xs">
          <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-gray-800">Use Dynamic Ghost Data</label>
              <Switch
                checked={p.useSiteData ?? false}
                onChange={(c) => onChangeProps({ useSiteData: c })}
              />
            </div>
            <span className="text-[10px] text-gray-500">
              Automatically use Ghost Site Title, Description, and Cover Image.
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-700">Eyebrow Text</label>
            <input
              type="text"
              value={p.eyebrowText || ""}
              onChange={(e) => onChangeProps({ eyebrowText: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
              placeholder="Featured"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-700">Hero Title</label>
            {p.useSiteData ? (
              <div className="px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded text-[11px] font-medium text-blue-700">
                Bound to Site Title
              </div>
            ) : (
              <input
                type="text"
                value={p.title || ""}
                onChange={(e) => onChangeProps({ title: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs font-semibold focus:outline-none focus:border-blue-500 bg-white"
                placeholder="Title text"
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-700">Subtitle Text</label>
            {p.useSiteData ? (
              <div className="px-2.5 py-1.5 bg-blue-50 border border-blue-100 rounded text-[11px] font-medium text-blue-700">
                Bound to Site Description
              </div>
            ) : (
              <textarea
                rows={3}
                value={p.subtitle || ""}
                onChange={(e) => onChangeProps({ subtitle: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white resize-none"
                placeholder="Description copy..."
              />
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
            <label className="text-[11px] font-semibold text-gray-700">Primary Button</label>
            <input
              type="text"
              value={p.buttonLabel || ""}
              onChange={(e) => onChangeProps({ buttonLabel: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
              placeholder="Button Label"
            />
            <input
              type="text"
              value={p.buttonUrl || ""}
              onChange={(e) => onChangeProps({ buttonUrl: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
              placeholder="https://example.com"
            />
            <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden mt-1">
              <ColorPicker
                label="Button Background"
                value={p.buttonBgColor || ""}
                onChange={(v) => onChangeProps({ buttonBgColor: v })}
              />
              <ColorPicker
                label="Button Text"
                value={p.buttonTextColor || ""}
                onChange={(v) => onChangeProps({ buttonTextColor: v })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-semibold text-gray-700">Secondary Button</label>
              <Switch
                checked={p.showSecondaryButton ?? true}
                onChange={(c) => onChangeProps({ showSecondaryButton: c })}
              />
            </div>
            {(p.showSecondaryButton ?? true) && (
              <>
                <input
                  type="text"
                  value={p.secondaryButtonLabel || ""}
                  onChange={(e) => onChangeProps({ secondaryButtonLabel: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Button Label"
                />
                <input
                  type="text"
                  value={p.secondaryButtonUrl || ""}
                  onChange={(e) => onChangeProps({ secondaryButtonUrl: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="https://example.com"
                />
              </>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. SHARED LAYOUT & STYLING (Identical for Carousel and Standard Hero) */}
      {/* ================================================================= */}
      <div className="flex flex-col gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-2xs">
        {/* Layout Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-700">Layout Alignment</label>
          <select
            value={layout}
            onChange={(e) => onChangeStyles({ layout: e.target.value })}
            className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white text-gray-900 cursor-pointer"
          >
            <option value="center">Centered</option>
            <option value="left">Left Aligned</option>
            <option value="split-left">Split (Text Left, Image Right)</option>
            <option value="split-right">Split (Text Right, Image Left)</option>
            <option value="bottom">Full-Bleed (Pinned Bottom)</option>
          </select>

          {layout.startsWith("split") && !isCarousel && !useSiteData && (
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 mt-1">
              <label className="text-[11px] font-semibold text-gray-700">Split Image URL</label>
              <input
                type="text"
                value={p.imageUrl || ""}
                onChange={(e) => onChangeProps({ imageUrl: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white font-mono text-[11px]"
                placeholder="https://example.com/image.jpg"
              />
              <label className="text-[11px] font-semibold text-gray-700">Image Alt</label>
              <input
                type="text"
                value={p.imageAlt || ""}
                onChange={(e) => onChangeProps({ imageAlt: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
                placeholder="Hero Image"
              />
            </div>
          )}
        </div>

        {/* Text Color */}
        <div className="flex flex-col gap-1 border-t border-gray-100 pt-3">
          <span className="text-[11px] font-semibold text-gray-700">Text Color</span>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <ColorPicker
              label="Main Text Color"
              value={p.textColor || ""}
              onChange={(v) => onChangeProps({ textColor: v })}
              defaultTokenLabel={(useSiteData && (p.useCoverImageAsBackground ?? true)) ? "#FFFFFF" : "Theme Default"}
            />
          </div>
        </div>

        {/* Background Controls */}
        <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-semibold text-gray-700">Background</span>
            {useSiteData && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-600 font-medium">Show Cover Image</label>
                <Switch
                  checked={p.useCoverImageAsBackground ?? true}
                  onChange={(c) => onChangeProps({ useCoverImageAsBackground: c })}
                />
              </div>
            )}
          </div>

          {!(useSiteData && (p.useCoverImageAsBackground ?? true)) && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600">Type</label>
              <select
                value={bgType}
                onChange={(e) => onChangeStyles({ backgroundType: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="solid">Solid Color</option>
                <option value="linear">Linear Gradient</option>
                <option value="radial">Radial Gradient</option>
                <option value="mesh">Mesh Gradient</option>
                <option value="pattern">Pattern</option>
                <option value="image">Image URL</option>
              </select>
            </div>
          )}

          {bgType === "solid" && !(useSiteData && (p.useCoverImageAsBackground ?? true)) && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600">Color</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={(block.styles?.backgroundColor as string) || "#fafafa"}
                  onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0"
                />
                <input
                  type="text"
                  value={(block.styles?.backgroundColor as string) || "#fafafa"}
                  onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
                  className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded text-xs font-mono font-medium focus:outline-none focus:border-blue-500 bg-white uppercase"
                />
              </div>
            </div>
          )}

          {bgType === "linear" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-gray-600">Colors</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={(block.styles?.gradientColor1 as string) || "#000000"}
                    onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0"
                  />
                  <input
                    type="color"
                    value={(block.styles?.gradientColor2 as string) || "#333333"}
                    onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-gray-600">Angle</label>
                  <span className="text-[10px] font-mono font-medium text-blue-600">{(block.styles?.gradientAngle as number) || 90}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={(block.styles?.gradientAngle as number) || 90}
                  onChange={(e) => onChangeStyles({ gradientAngle: parseInt(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </>
          )}

          {bgType === "mesh" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600">Mesh Colors</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={(block.styles?.meshColor1 as string) || "#ff0080"}
                  onChange={(e) => onChangeStyles({ meshColor1: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0"
                />
                <input
                  type="color"
                  value={(block.styles?.meshColor2 as string) || "#7928ca"}
                  onChange={(e) => onChangeStyles({ meshColor2: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0"
                />
                <input
                  type="color"
                  value={(block.styles?.meshColor3 as string) || "#0070f3"}
                  onChange={(e) => onChangeStyles({ meshColor3: e.target.value })}
                  className="w-7 h-7 rounded cursor-pointer border border-gray-200 p-0"
                />
              </div>
            </div>
          )}

          {bgType === "pattern" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600">Pattern Type</label>
              <select
                value={(block.styles?.patternType as string) || "dots"}
                onChange={(e) => onChangeStyles({ patternType: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="dots">Dots</option>
                <option value="lines">Diagonal Lines</option>
                <option value="noise">Noise / Grain</option>
              </select>
            </div>
          )}

          {bgType === "image" && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-600">Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={(block.styles?.bgImageUrl as string) || ""}
                onChange={(e) => onChangeStyles({ bgImageUrl: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          )}
        </div>

        {/* Spacing Controls */}
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-3">
          <span className="text-[11px] font-semibold text-gray-700">Section Spacing</span>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-gray-600">Top Padding</label>
              <span className="text-[10px] font-mono font-medium text-blue-600">
                {typeof block.styles?.paddingTop === "object" ? (block.styles.paddingTop as { desktop?: string })?.desktop : (block.styles?.paddingTop as string) || "3rem"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={parseFloat((typeof block.styles?.paddingTop === "object" ? (block.styles.paddingTop as { desktop?: string })?.desktop : (block.styles?.paddingTop as string)) || "3")}
              onChange={(e) => onChangeStyles({ paddingTop: `${e.target.value}rem` })}
              className="w-full accent-blue-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-gray-600">Bottom Padding</label>
              <span className="text-[10px] font-mono font-medium text-blue-600">
                {typeof block.styles?.paddingBottom === "object" ? (block.styles.paddingBottom as { desktop?: string })?.desktop : (block.styles?.paddingBottom as string) || "5rem"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={parseFloat((typeof block.styles?.paddingBottom === "object" ? (block.styles.paddingBottom as { desktop?: string })?.desktop : (block.styles?.paddingBottom as string)) || "5")}
              onChange={(e) => onChangeStyles({ paddingBottom: `${e.target.value}rem` })}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
