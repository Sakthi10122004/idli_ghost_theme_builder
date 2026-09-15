import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { TestimonialItem } from "./schema";
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Sparkles, 
} from "lucide-react";

const Switch = ({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors ${
      checked ? "bg-blue-500" : "bg-gray-200"
    }`}
  >
    <div
      className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${
        checked ? "translate-x-3.5" : "translate-x-0"
      }`}
    />
  </button>
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
        <span className="text-[12px] font-medium text-gray-800">{label}</span>
        <label className="flex items-center gap-1.5 mt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => {
              if (e.target.checked) onChange("#000000");
              else onChange("");
            }}
            className="rounded-xs border-gray-300 w-3 h-3 accent-brand-primary"
          />
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Custom</span>
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
            className="w-14 text-[10px] font-mono text-gray-600 bg-transparent outline-none uppercase"
          />
        </div>
      ) : (
        <div className="text-[10px] font-mono text-brand-primary bg-brand-primary/10 px-2 py-1 rounded font-semibold tracking-tight">
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
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  const p = block.props || {};
  const items: TestimonialItem[] = p.items || [];
  const useDynamicData = p.useDynamicData !== false;
  const dynamicTag = p.dynamicTag !== undefined ? p.dynamicTag : "testimonial";
  const dynamicLimit = p.dynamicLimit !== undefined ? p.dynamicLimit : 100;
  const bgType = block.styles?.backgroundType || "solid";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const updateItem = (index: number, patch: Partial<TestimonialItem>) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], ...patch };
    onChangeProps({ items: nextItems });
  };

  const addItem = () => {
    const newItem: TestimonialItem = {
      id: "t-" + Date.now(),
      author: "Customer Name",
      role: "Product Designer",
      company: "Innovate Inc",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote: "Amazing experience! The theme builder works like magic and saved our entire team dozens of development hours.",
      rating: 5,
      date: "Recent",
      location: "New York, USA",
      socialUrl: "https://linkedin.com",
      socialPlatform: "linkedin",
      featured: false,
    };
    onChangeProps({ items: [...items, newItem] });
    setOpenIndex(items.length);
  };

  const duplicateItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const cloned = { ...items[index], id: "t-" + Date.now() };
    const nextItems = [...items];
    nextItems.splice(index + 1, 0, cloned);
    onChangeProps({ items: nextItems });
    setOpenIndex(index + 1);
  };

  const deleteItem = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextItems = items.filter((_, i) => i !== index);
    onChangeProps({ items: nextItems });
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex !== null && openIndex > index) setOpenIndex(openIndex - 1);
  };

  const moveItem = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const nextItems = [...items];
    const [moved] = nextItems.splice(index, 1);
    nextItems.splice(targetIndex, 0, moved);
    onChangeProps({ items: nextItems });
    setOpenIndex(targetIndex);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Dynamic Ghost Data Switch - Exact match with Hero Component */}
      <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Use Dynamic Ghost Data</label>
          <Switch
            checked={useDynamicData}
            onChange={(c) => onChangeProps({ useDynamicData: c })}
          />
        </div>
        <span className="text-[10px] text-brand-mute">
          When enabled, testimonials will automatically fetch posts from your Ghost publication matching your tag filter (e.g. tag:testimonial).
        </span>
      </div>

      {/* 2. Layout Section */}
      <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-4">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Layout</label>
        <select
          value={p.layout || "grid-3"}
          onChange={(e) => {
            onChangeProps({ layout: e.target.value });
            onChangeStyles({ layout: e.target.value });
          }}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="grid-3">3 Columns (Grid)</option>
          <option value="grid-2">2 Columns (Grid)</option>
          <option value="grid-1">1 Column (Centered)</option>
        </select>

        <label className="text-[11px] font-sans font-semibold text-brand-body mt-2">Card Design Style</label>
        <select
          value={p.cardStyle || "bordered"}
          onChange={(e) => onChangeProps({ cardStyle: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="bordered">Bordered Card</option>
          <option value="soft">Soft Tinted</option>
          <option value="elevated">Elevated Shadow</option>
          <option value="minimal">Minimal Clean</option>
        </select>

        <label className="text-[11px] font-sans font-semibold text-brand-body mt-2">Card Hover Effect</label>
        <select
          value={block.styles?.hoverEffect || ""}
          onChange={(e) => onChangeStyles({ hoverEffect: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="">Default (Subtle Float)</option>
          <option value="glow">Soft Glow Shadow</option>
          <option value="float">Float Up (-4px)</option>
          <option value="scale">Scale Up (1.02x)</option>
        </select>
      </div>

      {/* 3. Eyebrow, Title & Subtitle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Eyebrow Text</label>
        <input
          type="text"
          value={p.sectionBadge || ""}
          onChange={(e) => onChangeProps({ sectionBadge: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="Small label above the title"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Section Title</label>
        <input
          type="text"
          value={p.sectionTitle || ""}
          onChange={(e) => onChangeProps({ sectionTitle: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="Loved by creators and readers worldwide"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Subtitle Text</label>
        <textarea
          rows={3}
          value={p.sectionSubtitle || ""}
          onChange={(e) => onChangeProps({ sectionSubtitle: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
          placeholder="Discover how thousands of publications build and grow their audience with our themes."
        />
      </div>

      {/* 4. DYNAMIC GHOST POSTS BINDINGS (Exact Hero UI style) OR CUSTOM REVIEWS */}
      {useDynamicData ? (
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Ghost Post Tag Filter</label>
            <input
              type="text"
              value={dynamicTag}
              onChange={(e) => onChangeProps({ dynamicTag: e.target.value })}
              placeholder="testimonial"
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
            <span className="text-[10px] text-brand-mute">
              Ghost posts tagged with <span className="font-mono font-semibold">#{dynamicTag || "testimonial"}</span> will be dynamically fetched.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Max Posts</label>
            <input
              type="text"
              inputMode="numeric"
              value={dynamicLimit}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                onChangeProps({ dynamicLimit: val });
              }}
              onBlur={() => {
                if (!dynamicLimit || Number(dynamicLimit) < 1) {
                  onChangeProps({ dynamicLimit: 100 });
                } else {
                  onChangeProps({ dynamicLimit: Math.min(100, Math.max(1, parseInt(String(dynamicLimit), 10))) });
                }
              }}
              placeholder="100"
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
            <span className="text-[10px] text-brand-mute">
              Specify maximum number of posts to fetch (e.g. 100, 30, 20).
            </span>
          </div>

          {/* Bound Fields - Exact match with Hero Component */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Reviewer / Customer Name</label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100 rounded-sm text-[11px] font-medium text-blue-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Bound to Post Title
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Review / Feedback Quote</label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100 rounded-sm text-[11px] font-medium text-blue-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Bound to Post Body (Editor Content)
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Job Title, Location &amp; Website Link</label>
              <div className="flex flex-col gap-1 p-2 bg-blue-50/50 border border-blue-100 rounded-sm text-[11px] text-blue-800">
                <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  Bound to Post Excerpt (Settings)
                </div>
                <div className="text-[10px] text-blue-600 space-y-0.5 mt-0.5">
                  <div>• Line 1: Job Description / Role</div>
                  <div>• Line 2: Location / Address</div>
                  <div>• Line 3: Website / Social URL</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Customer Profile Avatar</label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100 rounded-sm text-[11px] font-medium text-blue-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Bound to Feature Image
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Star Rating</label>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 border border-blue-100 rounded-sm text-[11px] font-medium text-blue-700">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Bound to Post Tags (5-star, 4-star, etc.)
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-sans font-semibold text-brand-body">
              Customer Reviews ({items.length})
            </label>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-primary text-white text-[11px] font-medium rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3 h-3" /> Add Review
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.id || idx}
                  className="border border-brand-hairline rounded-md overflow-hidden bg-brand-canvas-soft"
                >
                  <div
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-neutral-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover border border-neutral-300"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-neutral-300 flex items-center justify-center text-[10px] font-bold">
                          {item.author?.[0] || "U"}
                        </div>
                      )}
                      <span className="font-medium text-xs truncate max-w-[120px]">
                        {item.author || "Unnamed Reviewer"}
                      </span>
                      {item.featured && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-semibold">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Move Up"
                        disabled={idx === 0}
                        onClick={(e) => moveItem(idx, "up", e)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Move Down"
                        disabled={idx === items.length - 1}
                        onClick={(e) => moveItem(idx, "down", e)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Duplicate"
                        onClick={(e) => duplicateItem(idx, e)}
                        className="p-1 text-neutral-400 hover:text-neutral-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={(e) => deleteItem(idx, e)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-3 border-t border-brand-hairline bg-white flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Customer Name</label>
                          <input
                            type="text"
                            value={item.author || ""}
                            onChange={(e) => updateItem(idx, { author: e.target.value })}
                            placeholder="e.g. Sarah Jenkins"
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Star Rating (1-5)</label>
                          <select
                            value={item.rating || 5}
                            onChange={(e) => updateItem(idx, { rating: Number(e.target.value) })}
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                            <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                            <option value={3}>⭐⭐⭐ (3 Stars)</option>
                            <option value={2}>⭐⭐ (2 Stars)</option>
                            <option value={1}>⭐ (1 Star)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-neutral-500 uppercase">Review / Feedback</label>
                        <textarea
                          rows={3}
                          value={item.quote || ""}
                          onChange={(e) => updateItem(idx, { quote: e.target.value })}
                          placeholder="What did they say about your product or service?"
                          className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none resize-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-neutral-500 uppercase">Profile Photo URL</label>
                        <input
                          type="text"
                          value={item.avatar || ""}
                          onChange={(e) => updateItem(idx, { avatar: e.target.value })}
                          placeholder="https://.../avatar.jpg"
                          className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Job Title</label>
                          <input
                            type="text"
                            value={item.role || ""}
                            onChange={(e) => updateItem(idx, { role: e.target.value })}
                            placeholder="e.g. CEO / Developer"
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Company Name</label>
                          <input
                            type="text"
                            value={item.company || ""}
                            onChange={(e) => updateItem(idx, { company: e.target.value })}
                            placeholder="e.g. Acme Corp"
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Date</label>
                          <input
                            type="text"
                            value={item.date || ""}
                            onChange={(e) => updateItem(idx, { date: e.target.value })}
                            placeholder="e.g. March 2026"
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Location</label>
                          <input
                            type="text"
                            value={item.location || ""}
                            onChange={(e) => updateItem(idx, { location: e.target.value })}
                            placeholder="e.g. San Francisco, CA"
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Social Profile Link</label>
                          <input
                            type="text"
                            value={item.socialUrl || ""}
                            onChange={(e) => updateItem(idx, { socialUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-semibold text-neutral-500 uppercase">Platform Icon</label>
                          <select
                            value={item.socialPlatform || "linkedin"}
                            onChange={(e) => updateItem(idx, { socialPlatform: e.target.value as any })}
                            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm bg-brand-canvas-soft text-xs focus:outline-none"
                          >
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter / X</option>
                            <option value="website">Personal Website</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2 border-t border-brand-hairline">
                        <input
                          type="checkbox"
                          id={`feat-${idx}`}
                          checked={!!item.featured}
                          onChange={(e) => updateItem(idx, { featured: e.target.checked })}
                          className="rounded-xs border-brand-hairline text-brand-primary focus:ring-0"
                        />
                        <label htmlFor={`feat-${idx}`} className="text-xs font-medium cursor-pointer flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Highlight as Featured Testimonial
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TOGGLE VISIBLE ELEMENTS — Matching Post-Grid and Hero Style */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-5">
        <span className="text-[12px] font-bold text-gray-900 tracking-tight">Toggle Visible Elements</span>
        <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          {([
            ["showSectionHeader", "Section Header (Title & Subtitle)", true],
            ["showStars", "Star Ratings ( ⭐⭐⭐⭐⭐ )", true],
            ["showPhotos", "Customer Profile Photo", true],
            ["showRoleCompany", "Job Title & Role", true],
            ["showDate", "Review Date", true],
            ["showLocation", "Customer Location", true],
            ["showSocialLink", "Social / Website Link", true],
          ] as [string, string, boolean][]).map(([key, label, def]) => (
            <div key={key} className="flex justify-between items-center p-3 bg-white border-b border-gray-100 last:border-b-0">
              <span className="text-[12px] font-medium text-gray-800">{label}</span>
              <Switch
                checked={p[key] ?? def}
                onChange={(c) => onChangeProps({ [key]: c })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Text Color - Exact ColorPicker matching Hero Component */}
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5 pb-2">
        <span className="text-[12px] font-bold text-gray-900 tracking-tight">Text Color</span>
        <div className="mt-2 border border-gray-100 rounded-lg overflow-hidden shadow-sm">
          <ColorPicker
            label="Main Text Color"
            value={p.textColor || ""}
            onChange={(v) => onChangeProps({ textColor: v })}
            defaultTokenLabel="Theme Default"
          />
        </div>
      </div>

      {/* 7. Background Controls - Exact Full Palette matching Hero */}
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5">
        <span className="text-[12px] font-bold text-gray-900 tracking-tight">Background</span>
        <label className="text-[11px] font-sans font-semibold text-brand-body mt-1">Background Type</label>
        <select
          value={bgType}
          onChange={(e) => onChangeStyles({ backgroundType: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="solid">Solid Color</option>
          <option value="linear">Linear Gradient</option>
          <option value="radial">Radial Gradient</option>
          <option value="mesh">Mesh Gradient</option>
          <option value="pattern">Pattern</option>
          <option value="image">Image URL</option>
        </select>

        <label className="text-[11px] font-sans font-semibold text-brand-body mt-2">Backdrop Blur (Glassmorphism)</label>
        <select
          value={block.styles?.backdropBlur || ""}
          onChange={(e) => onChangeStyles({ backdropBlur: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="">None</option>
          <option value="4px">Light (4px)</option>
          <option value="8px">Medium (8px)</option>
          <option value="16px">Heavy (16px)</option>
          <option value="24px">Extra Heavy (24px)</option>
        </select>
      </div>

      {bgType === "solid" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Background Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={block.styles?.backgroundColor || "#fafafa"}
              onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
              className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="text"
              value={block.styles?.backgroundColor || "#fafafa"}
              onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
        </div>
      )}

      {bgType === "linear" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.gradientColor1 || "#000000"}
                onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="color"
                value={block.styles?.gradientColor2 || "#333333"}
                onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Angle (deg)</label>
              <span className="text-[10px] text-brand-muted">{block.styles?.gradientAngle || 90}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={block.styles?.gradientAngle || 90}
              onChange={(e) => onChangeStyles({ gradientAngle: parseInt(e.target.value) })}
              className="w-full accent-brand-primary"
            />
          </div>
        </>
      )}

      {bgType === "radial" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.gradientColor1 || "#000000"}
                onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="color"
                value={block.styles?.gradientColor2 || "#333333"}
                onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Position</label>
            <select
              value={block.styles?.gradientPosition || "center"}
              onChange={(e) => onChangeStyles({ gradientPosition: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="center">Center</option>
              <option value="top left">Top Left</option>
              <option value="top right">Top Right</option>
              <option value="bottom left">Bottom Left</option>
              <option value="bottom right">Bottom Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </>
      )}

      {bgType === "mesh" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Mesh Colors</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={block.styles?.meshColor1 || "#ff0080"}
              onChange={(e) => onChangeStyles({ meshColor1: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="color"
              value={block.styles?.meshColor2 || "#7928ca"}
              onChange={(e) => onChangeStyles({ meshColor2: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="color"
              value={block.styles?.meshColor3 || "#0070f3"}
              onChange={(e) => onChangeStyles({ meshColor3: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
          </div>
        </div>
      )}

      {bgType === "pattern" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Pattern Type</label>
            <select
              value={block.styles?.patternType || "dots"}
              onChange={(e) => onChangeStyles({ patternType: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="dots">Dots</option>
              <option value="lines">Diagonal Lines</option>
              <option value="noise">Noise / Grain</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Pattern Base Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={block.styles?.patternColor || "#000000"}
                onChange={(e) => onChangeStyles({ patternColor: e.target.value })}
                className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="text"
                value={block.styles?.patternColor || "#000000"}
                onChange={(e) => onChangeStyles({ patternColor: e.target.value })}
                className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              />
            </div>
          </div>
        </>
      )}

      {bgType === "image" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={block.styles?.bgImageUrl || ""}
              onChange={(e) => onChangeStyles({ bgImageUrl: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Overlay Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={block.styles?.bgOverlayColor || "#000000"}
                onChange={(e) => onChangeStyles({ bgOverlayColor: e.target.value })}
                className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Overlay Opacity</label>
              <span className="text-[10px] text-brand-muted">
                {Math.round((block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5}
              onChange={(e) => onChangeStyles({ bgOverlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-brand-primary"
            />
          </div>
        </>
      )}

      {/* 8. Spacing Controls - Exact Spacing Slider Sliders matching Hero */}
      <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
        <span className="text-[12px] font-bold text-gray-900 tracking-tight">Spacing</span>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Top Padding</label>
            <span className="text-[9px] font-mono text-brand-mute">
              {typeof block.styles?.paddingTop === "object"
                ? (block.styles.paddingTop as any).desktop
                : (block.styles?.paddingTop as string) || "3rem"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={parseFloat(
              (typeof block.styles?.paddingTop === "object"
                ? (block.styles.paddingTop as any).desktop
                : (block.styles?.paddingTop as string)) || "3"
            )}
            onChange={(e) => onChangeStyles({ paddingTop: `${e.target.value}rem` })}
            className="w-full accent-brand-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Bottom Padding</label>
            <span className="text-[9px] font-mono text-brand-mute">
              {typeof block.styles?.paddingBottom === "object"
                ? (block.styles.paddingBottom as any).desktop
                : (block.styles?.paddingBottom as string) || "5rem"}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={parseFloat(
              (typeof block.styles?.paddingBottom === "object"
                ? (block.styles.paddingBottom as any).desktop
                : (block.styles?.paddingBottom as string)) || "5"
            )}
            onChange={(e) => onChangeStyles({ paddingBottom: `${e.target.value}rem` })}
            className="w-full accent-brand-primary"
          />
        </div>
      </div>
    </div>
  );
};