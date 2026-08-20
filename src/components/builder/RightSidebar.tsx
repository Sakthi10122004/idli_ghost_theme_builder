"use client";

import { useEditorStore } from "@/store/editorStore";
import { Trash2, Settings, Sliders } from "lucide-react";

export default function RightSidebar() {
  const { 
    selectedBlockId, 
    document: themeDoc, 
    updateBlockProps, 
    updateBlockStyles, 
    deleteBlock 
  } = useEditorStore();

  const selectedBlock = selectedBlockId ? themeDoc.blocks[selectedBlockId] : null;

  const getInputValue = (val: any): string => {
    if (!val) return "";
    if (typeof val === "string") return val;
    return val.desktop || "";
  };

  const handlePropChange = (key: string, value: any) => {
    if (selectedBlockId) {
      updateBlockProps(selectedBlockId, { [key]: value });
    }
  };

  const handleStyleChange = (key: string, value: any) => {
    if (selectedBlockId) {
      updateBlockStyles(selectedBlockId, { [key]: value });
    }
  };

  const vercelColors = [
    { label: "Ink (Primary)", value: "#171717" },
    { label: "Body Text", value: "#4d4d4d" },
    { label: "Mute Gray", value: "#888888" },
    { label: "Vercel Blue", value: "#0070f3" },
    { label: "Success Green", value: "#0070f3" },
    { label: "Error Red", value: "#ee0000" },
    { label: "Warning Gold", value: "#f5a623" },
  ];

  return (
    <aside className="w-[300px] border-l border-brand-hairline bg-white flex flex-col shrink-0 select-none shadow-level-1 overflow-y-auto">
      {selectedBlock ? (
        <div className="p-4 flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-brand-hairline pb-3">
            <div className="flex items-center gap-1.5">
              <Sliders size={13} className="text-brand-ink" />
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-brand-ink">
                Inspect: {selectedBlock.type}
              </span>
            </div>
            <button
              onClick={() => deleteBlock(selectedBlock.id)}
              className="p-1 text-brand-mute hover:text-brand-error hover:bg-brand-canvas-soft-2 rounded-sm transition-all"
              title="Delete Block"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Properties Section */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] uppercase tracking-wider text-brand-mute">Properties</span>

            {selectedBlock.type === "heading" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Heading Text</label>
                  <input
                    type="text"
                    value={selectedBlock.props.text || ""}
                    onChange={(e) => handlePropChange("text", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Level</label>
                  <select
                    value={selectedBlock.props.level || 2}
                    onChange={(e) => handlePropChange("level", parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value={1}>H1 (Large)</option>
                    <option value={2}>H2 (Medium)</option>
                    <option value={3}>H3 (Small)</option>
                  </select>
                </div>
              </>
            )}

            {selectedBlock.type === "text" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Body Text</label>
                <textarea
                  rows={4}
                  value={selectedBlock.props.text || ""}
                  onChange={(e) => handlePropChange("text", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-brand-canvas-soft resize-none"
                />
              </div>
            )}

            {selectedBlock.type === "button" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Button Label</label>
                  <input
                    type="text"
                    value={selectedBlock.props.label || ""}
                    onChange={(e) => handlePropChange("label", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Link URL</label>
                  <input
                    type="text"
                    value={selectedBlock.props.href || ""}
                    onChange={(e) => handlePropChange("href", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Variant</label>
                  <select
                    value={selectedBlock.props.variant || "primary"}
                    onChange={(e) => handlePropChange("variant", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="primary">Primary (Black)</option>
                    <option value="secondary">Secondary (White)</option>
                  </select>
                </div>
              </>
            )}

            {selectedBlock.type === "spacer" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Height</label>
                <input
                  type="text"
                  placeholder="e.g. 40px, 4rem"
                  value={selectedBlock.props.height || ""}
                  onChange={(e) => handlePropChange("height", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                />
              </div>
            )}

            {selectedBlock.type === "image" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Image URL</label>
                  <input
                    type="text"
                    placeholder="Enter image link"
                    value={selectedBlock.props.url || ""}
                    onChange={(e) => handlePropChange("url", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Alt Text</label>
                  <input
                    type="text"
                    placeholder="Describe image description"
                    value={selectedBlock.props.alt || ""}
                    onChange={(e) => handlePropChange("alt", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
              </>
            )}

            {selectedBlock.type === "author-profile" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Author Name</label>
                  <input
                    type="text"
                    value={selectedBlock.props.name || ""}
                    onChange={(e) => handlePropChange("name", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Bio</label>
                  <textarea
                    rows={3}
                    value={selectedBlock.props.bio || ""}
                    onChange={(e) => handlePropChange("bio", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
                  />
                </div>
              </>
            )}

            {selectedBlock.type === "header" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Logo Text</label>
                  <input
                    type="text"
                    value={selectedBlock.props.logoText || "THE BLOG"}
                    onChange={(e) => handlePropChange("logoText", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Logo Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={selectedBlock.props.logoImageUrl || ""}
                    onChange={(e) => handlePropChange("logoImageUrl", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Nav Links (Comma-separated)</label>
                  <input
                    type="text"
                    value={selectedBlock.props.navLinks || "Articles, About, Newsletter"}
                    onChange={(e) => handlePropChange("navLinks", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex items-center gap-2 border-t border-brand-hairline pt-3 mt-1">
                  <input
                    type="checkbox"
                    id="showCta"
                    checked={!!selectedBlock.props.showCta}
                    onChange={(e) => handlePropChange("showCta", e.target.checked)}
                    className="rounded-xs border-brand-hairline accent-brand-primary cursor-pointer"
                  />
                  <label htmlFor="showCta" className="text-[11px] font-sans font-semibold text-brand-body cursor-pointer">Show Action Button (CTA)</label>
                </div>
                {!!selectedBlock.props.showCta && (
                  <>
                    <div className="flex flex-col gap-1.5 pl-4 border-l-2 border-brand-hairline">
                      <label className="text-[11px] font-sans font-semibold text-brand-body">Button Label</label>
                      <input
                        type="text"
                        value={selectedBlock.props.ctaLabel || "Subscribe"}
                        onChange={(e) => handlePropChange("ctaLabel", e.target.value)}
                        className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 pl-4 border-l-2 border-brand-hairline">
                      <label className="text-[11px] font-sans font-semibold text-brand-body">Button Link</label>
                      <input
                        type="text"
                        value={selectedBlock.props.ctaHref || "#"}
                        onChange={(e) => handlePropChange("ctaHref", e.target.value)}
                        className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                      />
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-2 border-t border-brand-hairline pt-3 mt-1">
                  <input
                    type="checkbox"
                    id="isSticky"
                    checked={!!selectedBlock.styles.isSticky}
                    onChange={(e) => handleStyleChange("isSticky", e.target.checked)}
                    className="rounded-xs border-brand-hairline accent-brand-primary cursor-pointer"
                  />
                  <label htmlFor="isSticky" className="text-[11px] font-sans font-semibold text-brand-body cursor-pointer">Top Fixed (Sticky Header)</label>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-sans font-semibold text-brand-body">Background Color</label>
                    {selectedBlock.styles.backgroundColor && (
                      <button
                        onClick={() => handleStyleChange("backgroundColor", "")}
                        className="text-[10px] font-sans text-brand-mute hover:text-brand-error cursor-pointer"
                      >
                        Set Transparent
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={getInputValue(selectedBlock.styles.backgroundColor) || "#ffffff"}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="w-12 h-8 border border-brand-hairline rounded-sm focus:outline-none bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Transparent"
                      value={getInputValue(selectedBlock.styles.backgroundColor)}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Corner Radius</label>
                  <select
                    value={getInputValue(selectedBlock.styles.borderRadius)}
                    onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="">Sharp (0px)</option>
                    <option value="4px">Soft (4px)</option>
                    <option value="8px">Round (8px)</option>
                    <option value="16px">Smooth (16px)</option>
                    <option value="9999px">Pill (9999px)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Bottom Border Width</label>
                  <select
                    value={getInputValue(selectedBlock.styles.borderWidth)}
                    onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="0px">None (0px)</option>
                    <option value="1px">Thin (1px)</option>
                    <option value="2px">Medium (2px)</option>
                    <option value="4px">Thick (4px)</option>
                  </select>
                </div>
                {getInputValue(selectedBlock.styles.borderWidth) !== "0px" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-sans font-semibold text-brand-body">Border Color</label>
                    <input
                      type="color"
                      value={getInputValue(selectedBlock.styles.borderColor) || "#e2e8f0"}
                      onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                      className="w-full h-8 border border-brand-hairline rounded-sm focus:outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                )}
              </>
            )}

            {selectedBlock.type === "accordion" && (
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-sans font-semibold text-brand-body">FAQ Items</span>
                {(selectedBlock.props.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="border border-brand-hairline p-2 rounded-sm flex flex-col gap-2 bg-brand-canvas-soft">
                    <input
                      type="text"
                      placeholder="Question"
                      value={item.question || ""}
                      onChange={(e) => {
                        const items = [...(selectedBlock.props.items || [])];
                        items[idx] = { ...items[idx], question: e.target.value };
                        handlePropChange("items", items);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
                    />
                    <textarea
                      placeholder="Answer"
                      rows={2}
                      value={item.answer || ""}
                      onChange={(e) => {
                        const items = [...(selectedBlock.props.items || [])];
                        items[idx] = { ...items[idx], answer: e.target.value };
                        handlePropChange("items", items);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans resize-none"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const items = [...(selectedBlock.props.items || []), { question: "New Question?", answer: "New Answer." }];
                    handlePropChange("items", items);
                  }}
                  className="w-full py-1 text-[11px] font-mono border border-dashed border-brand-hairline hover:bg-brand-canvas-soft"
                >
                  + Add FAQ Item
                </button>
              </div>
            )}

            {selectedBlock.type === "testimonials" && (
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-sans font-semibold text-brand-body">Testimonials</span>
                {(selectedBlock.props.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="border border-brand-hairline p-2 rounded-sm flex flex-col gap-2 bg-brand-canvas-soft">
                    <textarea
                      placeholder="Quote"
                      rows={2}
                      value={item.quote || ""}
                      onChange={(e) => {
                        const items = [...(selectedBlock.props.items || [])];
                        items[idx] = { ...items[idx], quote: e.target.value };
                        handlePropChange("items", items);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Author"
                      value={item.author || ""}
                      onChange={(e) => {
                        const items = [...(selectedBlock.props.items || [])];
                        items[idx] = { ...items[idx], author: e.target.value };
                        handlePropChange("items", items);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Title / Company"
                      value={item.title || ""}
                      onChange={(e) => {
                        const items = [...(selectedBlock.props.items || [])];
                        items[idx] = { ...items[idx], title: e.target.value };
                        handlePropChange("items", items);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const items = [...(selectedBlock.props.items || []), { quote: "Excellent output structures.", author: "Developer", title: "Theme Builder" }];
                    handlePropChange("items", items);
                  }}
                  className="w-full py-1 text-[11px] font-mono border border-dashed border-brand-hairline hover:bg-brand-canvas-soft"
                >
                  + Add Testimonial
                </button>
              </div>
            )}

            {selectedBlock.type === "pricing-table" && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Table Title</label>
                  <input
                    type="text"
                    value={selectedBlock.props.title || ""}
                    onChange={(e) => handlePropChange("title", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <span className="text-[11px] font-sans font-semibold text-brand-body">Pricing Tiers</span>
                {(selectedBlock.props.tiers || []).map((tier: any, idx: number) => (
                  <div key={idx} className="border border-brand-hairline p-2 rounded-sm flex flex-col gap-2 bg-brand-canvas-soft">
                    <input
                      type="text"
                      placeholder="Tier Name"
                      value={tier.name || ""}
                      onChange={(e) => {
                        const tiers = [...(selectedBlock.props.tiers || [])];
                        tiers[idx] = { ...tiers[idx], name: e.target.value };
                        handlePropChange("tiers", tiers);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={tier.price || ""}
                      onChange={(e) => {
                        const tiers = [...(selectedBlock.props.tiers || [])];
                        tiers[idx] = { ...tiers[idx], price: e.target.value };
                        handlePropChange("tiers", tiers);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
                    />
                    <input
                      type="text"
                      placeholder="Features (comma-separated)"
                      value={(tier.features || []).join(", ")}
                      onChange={(e) => {
                        const tiers = [...(selectedBlock.props.tiers || [])];
                        tiers[idx] = { ...tiers[idx], features: e.target.value.split(",").map(s => s.trim()) };
                        handlePropChange("tiers", tiers);
                      }}
                      className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedBlock.type === "grid-gallery" && (
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-sans font-semibold text-brand-body">Gallery Images</span>
                {(selectedBlock.props.urls || []).map((url: string, idx: number) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder="Image Link"
                    value={url}
                    onChange={(e) => {
                      const urls = [...(selectedBlock.props.urls || [])];
                      urls[idx] = e.target.value;
                      handlePropChange("urls", urls);
                    }}
                    className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
                  />
                ))}
                <button
                  onClick={() => {
                    const urls = [...(selectedBlock.props.urls || []), "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80"];
                    handlePropChange("urls", urls);
                  }}
                  className="w-full py-1 text-[11px] font-mono border border-dashed border-brand-hairline hover:bg-brand-canvas-soft"
                >
                  + Add Gallery Image
                </button>
              </div>
            )}

            {selectedBlock.type === "social-links" && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">GitHub URL</label>
                  <input
                    type="text"
                    value={selectedBlock.props.github || ""}
                    onChange={(e) => handlePropChange("github", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Twitter URL</label>
                  <input
                    type="text"
                    value={selectedBlock.props.twitter || ""}
                    onChange={(e) => handlePropChange("twitter", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Website URL</label>
                  <input
                    type="text"
                    value={selectedBlock.props.website || ""}
                    onChange={(e) => handlePropChange("website", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
              </div>
            )}

            {selectedBlock.type === "video-player" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Video Embed Link</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={selectedBlock.props.url || ""}
                  onChange={(e) => handlePropChange("url", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                />
              </div>
            )}

            {selectedBlock.type === "post-grid" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Section Title</label>
                <input
                  type="text"
                  value={selectedBlock.props.title || ""}
                  onChange={(e) => handlePropChange("title", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                />
              </div>
            )}

            {selectedBlock.type === "hero" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Hero Title</label>
                  <input
                    type="text"
                    value={selectedBlock.props.title || ""}
                    onChange={(e) => handlePropChange("title", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Subtitle Text</label>
                  <textarea
                    rows={3}
                    value={selectedBlock.props.subtitle || ""}
                    onChange={(e) => handlePropChange("subtitle", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">CTA Button Label</label>
                  <input
                    type="text"
                    value={selectedBlock.props.buttonLabel || ""}
                    onChange={(e) => handlePropChange("buttonLabel", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
              </>
            )}

            {selectedBlock.type === "newsletter" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Newsletter Title</label>
                  <input
                    type="text"
                    value={selectedBlock.props.title || ""}
                    onChange={(e) => handlePropChange("title", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Button Label</label>
                  <input
                    type="text"
                    value={selectedBlock.props.buttonLabel || ""}
                    onChange={(e) => handlePropChange("buttonLabel", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Input Placeholder</label>
                  <input
                    type="text"
                    value={selectedBlock.props.placeholder || ""}
                    onChange={(e) => handlePropChange("placeholder", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
              </>
            )}

            {selectedBlock.type === "featured-posts" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Section Title</label>
                <input
                  type="text"
                  value={selectedBlock.props.title || ""}
                  onChange={(e) => handlePropChange("title", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                />
              </div>
            )}

            {selectedBlock.type === "tag-archive" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Archive Title</label>
                <input
                  type="text"
                  value={selectedBlock.props.title || ""}
                  onChange={(e) => handlePropChange("title", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                />
              </div>
            )}

            {selectedBlock.type === "footer" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Copyright Info</label>
                <input
                  type="text"
                  value={selectedBlock.props.copyright || ""}
                  onChange={(e) => handlePropChange("copyright", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                />
              </div>
            )}
          </div>

          {/* Styles Section */}
          <div className="flex flex-col gap-4 border-t border-brand-hairline pt-4">
            <span className="font-mono text-[9px] uppercase tracking-wider text-brand-mute">Styles</span>

            {/* Typography Styles */}
            {(selectedBlock.type === "heading" || selectedBlock.type === "text") && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Font Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 16px, 2.5rem"
                    value={getInputValue(selectedBlock.styles.fontSize)}
                    onChange={(e) => handleStyleChange("fontSize", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Font Weight</label>
                  <select
                    value={getInputValue(selectedBlock.styles.fontWeight)}
                    onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="">Default</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semibold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra Bold (800)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Letter Spacing</label>
                  <select
                    value={getInputValue(selectedBlock.styles.letterSpacing)}
                    onChange={(e) => handleStyleChange("letterSpacing", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="">Default</option>
                    <option value="-0.05em">Tight (-0.05em)</option>
                    <option value="-0.02em">Slightly Tight (-0.02em)</option>
                    <option value="0em">Normal (0em)</option>
                    <option value="0.02em">Slightly Wide (0.02em)</option>
                    <option value="0.05em">Wide (0.05em)</option>
                    <option value="0.1em">Widest (0.1em)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Text Color</label>
                  <select
                    value={getInputValue(selectedBlock.styles.textColor)}
                    onChange={(e) => handleStyleChange("textColor", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="">Default Inherit</option>
                    {vercelColors.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Layout Radius Setting */}
            {(selectedBlock.type === "button" || selectedBlock.type === "image") && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Corner Radius</label>
                <select
                  value={getInputValue(selectedBlock.styles.borderRadius)}
                  onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
                  className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                >
                  <option value="">Theme Default</option>
                  <option value="0px">Sharp (0px)</option>
                  <option value="4px">Soft (4px)</option>
                  <option value="8px">Round (8px)</option>
                  <option value="16px">Smooth (16px)</option>
                  <option value="9999px">Pill (9999px)</option>
                </select>
              </div>
            )}

            {/* Layout Alignment */}
            {(selectedBlock.type === "heading" || selectedBlock.type === "text" || selectedBlock.type === "container") && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-sans font-semibold text-brand-body">Alignment</label>
                <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft-2 p-0.5 rounded-sm">
                  {["left", "center", "right"].map((align) => (
                    <button
                      key={align}
                      onClick={() => handleStyleChange("textAlign", align)}
                      className={`py-1 text-[10px] uppercase font-mono rounded-xs transition-all ${
                        getInputValue(selectedBlock.styles.textAlign) === align
                          ? "bg-white text-brand-ink shadow-level-2 font-semibold"
                          : "text-brand-mute hover:text-brand-ink"
                      }`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Margin Settings */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Margin Bottom</label>
              <input
                type="text"
                placeholder="e.g. 16px, 2rem"
                value={getInputValue(selectedBlock.styles.marginBottom)}
                onChange={(e) => handleStyleChange("marginBottom", e.target.value)}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              />
            </div>

            {/* Box Shadow Setting */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Box Shadow</label>
              <select
                value={getInputValue(selectedBlock.styles.boxShadow)}
                onChange={(e) => handleStyleChange("boxShadow", e.target.value)}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              >
                <option value="">None</option>
                <option value="0 2px 8px rgba(0,0,0,0.04)">Soft (Level 1)</option>
                <option value="0 8px 16px rgba(0,0,0,0.06)">Medium (Level 2)</option>
                <option value="0 16px 32px rgba(0,0,0,0.08)">Large (Level 3)</option>
                <option value="0 8px 24px rgba(23,23,23,0.06)">Dark Glow</option>
                <option value="0 8px 24px rgba(0,112,243,0.12)">Accent Blue Glow</option>
              </select>
            </div>

            {/* General Styling Controls */}
            {selectedBlock.type !== "header" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Border Line</label>
                  <select
                    value={getInputValue(selectedBlock.styles.borderWidth)}
                    onChange={(e) => handleStyleChange("borderWidth", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  >
                    <option value="">None</option>
                    <option value="1px">Thin (1px)</option>
                    <option value="2px">Medium (2px)</option>
                  </select>
                </div>
                {getInputValue(selectedBlock.styles.borderWidth) && getInputValue(selectedBlock.styles.borderWidth) !== "0px" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-sans font-semibold text-brand-body">Border Color</label>
                    <input
                      type="color"
                      value={getInputValue(selectedBlock.styles.borderColor) || "#e2e8f0"}
                      onChange={(e) => handleStyleChange("borderColor", e.target.value)}
                      className="w-full h-8 border border-brand-hairline rounded-sm focus:outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                )}
              </>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Backdrop Blur (Glassmorphism)</label>
              <select
                value={getInputValue(selectedBlock.styles.backdropBlur)}
                onChange={(e) => handleStyleChange("backdropBlur", e.target.value)}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              >
                <option value="">None</option>
                <option value="4px">Light (4px)</option>
                <option value="8px">Medium (8px)</option>
                <option value="16px">Heavy (16px)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Opacity</label>
              <select
                value={getInputValue(selectedBlock.styles.opacity)}
                onChange={(e) => handleStyleChange("opacity", e.target.value)}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              >
                <option value="">100% (Solid)</option>
                <option value="0.9">90%</option>
                <option value="0.75">75%</option>
                <option value="0.5">50%</option>
                <option value="0.25">25%</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Hover Effect</label>
              <select
                value={getInputValue(selectedBlock.styles.hoverEffect)}
                onChange={(e) => handleStyleChange("hoverEffect", e.target.value)}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              >
                <option value="">None</option>
                <option value="scale">Scale Up (1.02x)</option>
                <option value="float">Float Up (-4px)</option>
                <option value="glow">Soft Glow Shadow</option>
              </select>
            </div>

            {/* Section/Spacing Styles */}
            {selectedBlock.type === "section" && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Padding Top</label>
                  <input
                    type="text"
                    value={getInputValue(selectedBlock.styles.paddingTop)}
                    onChange={(e) => handleStyleChange("paddingTop", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Padding Bottom</label>
                  <input
                    type="text"
                    value={getInputValue(selectedBlock.styles.paddingBottom)}
                    onChange={(e) => handleStyleChange("paddingBottom", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-sans font-semibold text-brand-body">Background Color</label>
                    {selectedBlock.styles.backgroundColor && (
                      <button
                        onClick={() => handleStyleChange("backgroundColor", "")}
                        className="text-[10px] font-sans text-brand-mute hover:text-brand-error cursor-pointer"
                      >
                        Set Transparent
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={getInputValue(selectedBlock.styles.backgroundColor) || "#ffffff"}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="w-12 h-8 border border-brand-hairline rounded-sm focus:outline-none bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Transparent"
                      value={getInputValue(selectedBlock.styles.backgroundColor)}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Background Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={getInputValue(selectedBlock.styles.backgroundImage)}
                    onChange={(e) => handleStyleChange("backgroundImage", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-sans font-semibold text-brand-body">Background Video URL</label>
                  <input
                    type="text"
                    placeholder="https://...mp4"
                    value={getInputValue(selectedBlock.styles.backgroundVideoUrl)}
                    onChange={(e) => handleStyleChange("backgroundVideoUrl", e.target.value)}
                    className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                  />
                </div>
                {(!!getInputValue(selectedBlock.styles.backgroundImage) || !!getInputValue(selectedBlock.styles.backgroundVideoUrl)) && (
                  <>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="enableParallax"
                        checked={!!selectedBlock.styles.enableParallax}
                        onChange={(e) => handleStyleChange("enableParallax", e.target.checked)}
                        className="rounded-xs border-brand-hairline accent-brand-primary cursor-pointer"
                      />
                      <label htmlFor="enableParallax" className="text-[11px] font-sans font-semibold text-brand-body cursor-pointer">Enable Parallax Effect</label>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-sans font-semibold text-brand-body">Background Size</label>
                      <select
                        value={getInputValue(selectedBlock.styles.backgroundSize) || "cover"}
                        onChange={(e) => handleStyleChange("backgroundSize", e.target.value)}
                        className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                      >
                        <option value="cover">Cover (Fill)</option>
                        <option value="contain">Contain (Fit)</option>
                        <option value="auto">Auto (Original)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-sans font-semibold text-brand-body">Background Repeat</label>
                      <select
                        value={getInputValue(selectedBlock.styles.backgroundRepeat) || "no-repeat"}
                        onChange={(e) => handleStyleChange("backgroundRepeat", e.target.value)}
                        className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                      >
                        <option value="no-repeat">No Repeat</option>
                        <option value="repeat">Repeat (Tile)</option>
                        <option value="repeat-x">Repeat X (Horizontal)</option>
                        <option value="repeat-y">Repeat Y (Vertical)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-sans font-semibold text-brand-body">Background Position</label>
                      <select
                        value={getInputValue(selectedBlock.styles.backgroundPosition) || "center"}
                        onChange={(e) => handleStyleChange("backgroundPosition", e.target.value)}
                        className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
                      >
                        <option value="center">Center</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-6">
          {/* Default state: Theme settings */}
          <div className="flex items-center gap-1.5 border-b border-brand-hairline pb-3">
            <Settings size={13} className="text-brand-ink" />
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-brand-ink">
              Theme Settings
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Theme Name</label>
              <input
                type="text"
                value={themeDoc.metadata.name}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans bg-brand-canvas-soft cursor-not-allowed"
                disabled
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Author</label>
              <input
                type="text"
                value={themeDoc.metadata.author}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans bg-brand-canvas-soft cursor-not-allowed"
                disabled
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Primary Color</label>
              <div className="flex gap-2 items-center">
                <span className="w-5 h-5 rounded-full border border-brand-hairline-strong bg-brand-primary"></span>
                <span className="font-mono text-xs text-brand-body">#171717</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Global Typography</label>
              <span className="text-xs text-brand-body font-mono font-medium">Geist Sans & Geist Mono</span>
            </div>
          </div>

          <div className="border-t border-brand-hairline pt-4 flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-wider text-brand-mute">Help</span>
            <p className="text-xs text-brand-body leading-relaxed">
              Select any component on the visual canvas to edit its properties, typography weights, or section spacing.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
