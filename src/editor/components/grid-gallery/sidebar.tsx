import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import {
  GridGalleryProps,
  GalleryItem,
  GalleryLayout,
  GalleryCornerStyle,
  GalleryHoverEffect,
  GalleryGap,
  defaultProps,
  DEFAULT_GALLERY_ITEMS,
} from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
import { BackgroundControls } from "../shared/BackgroundControls";
import { Image as ImageIcon, LayoutGrid, Columns3, GalleryHorizontal, List, LayoutDashboard, Layers } from "lucide-react";

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

const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: React.ReactNode; value: T; disabled?: boolean }[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200/50">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        disabled={opt.disabled}
        onClick={() => onChange(opt.value)}
        className={`flex-1 flex justify-center items-center py-1.5 text-[11px] font-medium rounded-sm transition-all ${
          opt.disabled
            ? "text-gray-300 cursor-not-allowed"
            : value === opt.value
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        {opt.label}
      </button>
    ))}
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
  const p = { ...defaultProps, ...block.props } as GridGalleryProps;
  const general = p.general || defaultProps.general;

  // Handle backward compatibility for legacy `urls` array
  const rawItems = p.items || (p.urls ? p.urls.map((url: string, i: number) => ({ id: String(i), url, caption: "", alt: "" })) : DEFAULT_GALLERY_ITEMS);
  const items: GalleryItem[] = Array.isArray(rawItems) ? rawItems : DEFAULT_GALLERY_ITEMS;

  const useDynamicData = general.useDynamicData ?? false;
  const addAsset = useEditorStore((s) => s.addAsset);

  const updateGeneral = (patch: Partial<GridGalleryProps["general"]>) => {
    onChangeProps({ general: { ...general, ...patch } });
  };

  const renderGalleryItem = (item: GalleryItem, update: (patch: Partial<GalleryItem>) => void) => (
    <div className="flex flex-col gap-2.5">
      {/* Image URL & Upload */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500 flex items-center gap-1">
          <ImageIcon size={11} />
          <span>Image URL</span>
        </label>
        <input
          type="text"
          value={item.url || ""}
          onChange={(e) => update({ url: e.target.value })}
          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
          placeholder="https://images.unsplash.com/..."
        />
        <div className="mt-1">
          <input
            type="file"
            accept="image/*"
            className="text-[10px] w-full file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) => {
                const dataUri = ev.target?.result as string;
                if (!dataUri) return;
                const ext = file.name.split(".").pop() || "png";
                const id = Math.random().toString(36).substring(7);
                const assetPath = `assets/images/gallery/${id}.${ext}`;
                addAsset(assetPath, dataUri);
                update({ url: `asset://${assetPath.replace("assets/", "")}` });
              };
              reader.readAsDataURL(file);
            }}
          />
        </div>
      </div>

      {/* Caption & Alt Text */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Caption / Title</label>
          <input
            type="text"
            value={item.caption || ""}
            onChange={(e) => update({ caption: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            placeholder="Image title..."
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Alt Text</label>
          <input
            type="text"
            value={item.alt || ""}
            onChange={(e) => update({ alt: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            placeholder="Alt text..."
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">
          General
        </span>

        {/* Dynamic Data Toggle */}
        <div className="flex flex-col gap-1.5 pb-2 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-sans font-semibold text-brand-body">
              Use Dynamic Ghost Data
            </label>
            <Switch
              checked={useDynamicData}
              onChange={(c) => updateGeneral({ useDynamicData: c })}
            />
          </div>
          <span className="text-[10px] text-brand-mute">
            When enabled, gallery images are automatically pulled from Ghost posts tagged with a specific tag.
          </span>
          {useDynamicData && (
            <div className="flex flex-col gap-1.5 mt-2 bg-blue-50/50 p-2 border border-blue-100 rounded-sm">
              <label className="text-[10px] font-semibold text-blue-900">Ghost Tag Filter</label>
              <div className="flex items-center gap-1 bg-white border border-blue-200 rounded px-2 py-1">
                <span className="text-xs font-mono text-blue-600 font-bold">#</span>
                <input
                  type="text"
                  value={general.dynamicTag || "gallery"}
                  onChange={(e) => updateGeneral({ dynamicTag: e.target.value.trim().toLowerCase() })}
                  className="w-full text-xs font-mono outline-none text-gray-800 bg-transparent"
                  placeholder="gallery"
                />
              </div>
              <p className="text-[9px] text-blue-700 leading-snug">
                Posts tagged with <strong className="font-mono">#{general.dynamicTag || "gallery"}</strong> in Ghost Admin will be rendered as gallery images automatically using their feature image and post title.
              </p>
            </div>
          )}
        </div>

        {/* Section Heading & Subheading */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
          <input
            type="text"
            value={general.heading || ""}
            onChange={(e) => updateGeneral({ heading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            placeholder="e.g. Visual Gallery"
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Subheading</label>
          <textarea
            rows={2}
            value={general.subheading || ""}
            onChange={(e) => updateGeneral({ subheading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
            placeholder="Subheading description..."
          />
        </div>

        {/* Layout Style */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Layout Style</label>
          <div className="grid grid-cols-3 gap-1">
            {([
              { value: "grid", icon: <LayoutGrid size={13} />, label: "Grid" },
              { value: "masonry", icon: <Columns3 size={13} />, label: "Masonry" },
              { value: "carousel", icon: <GalleryHorizontal size={13} />, label: "Carousel" },
              { value: "list", icon: <List size={13} />, label: "List" },
              { value: "bento", icon: <LayoutDashboard size={13} />, label: "Bento" },
              { value: "collage", icon: <Layers size={13} />, label: "Collage" },
            ] as { value: GalleryLayout; icon: React.ReactNode; label: string }[]).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateGeneral({ layoutStyle: opt.value })}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded border text-[9px] font-medium transition-all ${
                  (general.layoutStyle || "grid") === opt.value
                    ? "bg-brand-ink text-white border-brand-ink shadow-sm"
                    : "bg-brand-canvas-soft border-brand-hairline text-brand-body hover:border-gray-400 hover:text-brand-ink"
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Scroll (Carousel / Masonry only) */}
        {(general.layoutStyle === "carousel" || general.layoutStyle === "masonry") && (
          <div className="flex justify-between items-center mt-1.5">
            <div className="flex flex-col gap-0.5">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Auto Scroll</label>
              <span className="text-[10px] text-brand-mute">
                {general.layoutStyle === "carousel" ? "Continuous marquee animation" : "Alternating column scroll"}
              </span>
            </div>
            <Switch
              checked={general.autoScroll ?? false}
              onChange={(c) => updateGeneral({ autoScroll: c })}
            />
          </div>
        )}

        {/* Desktop Columns */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Desktop Columns</label>
          <SegmentedControl<string>
            options={[
              { label: "2 Columns", value: "2" },
              { label: "3 Columns", value: "3" },
              { label: "4 Columns", value: "4" },
            ]}
            value={String(general.columns || 3)}
            onChange={(v) => updateGeneral({ columns: parseInt(v) as 2 | 3 | 4 })}
          />
        </div>

        {/* Spacing / Gap */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Image Spacing (Gap)</label>
          <SegmentedControl<GalleryGap>
            options={[
              { label: "Small", value: "sm" },
              { label: "Medium", value: "md" },
              { label: "Large", value: "lg" },
            ]}
            value={general.gap || "md"}
            onChange={(v) => updateGeneral({ gap: v })}
          />
        </div>

        {/* Corner Style */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Corner Style</label>
          <SegmentedControl<GalleryCornerStyle>
            options={[
              { label: "Rounded", value: "rounded" },
              { label: "Rectangle", value: "rectangle" },
            ]}
            value={general.cornerStyle || "rounded"}
            onChange={(v) => updateGeneral({ cornerStyle: v })}
          />
        </div>

        {/* Hover Effect */}
        <div className="flex flex-col gap-1.5 mt-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Hover Effect</label>
          <SegmentedControl<GalleryHoverEffect>
            options={[
              { label: "Zoom", value: "zoom" },
              { label: "Overlay", value: "overlay" },
              { label: "Fade", value: "fade" },
              { label: "None", value: "none" },
            ]}
            value={general.hoverEffect || "zoom"}
            onChange={(v) => updateGeneral({ hoverEffect: v })}
          />
        </div>
      </div>

      {/* Gallery Items List (Manual Mode) */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        {useDynamicData ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-brand-ink">Gallery Images</span>
              <span className="text-[10px] text-blue-600 font-semibold font-mono">Dynamic Mode</span>
            </div>
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-sm flex flex-col gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-blue-900">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span>Bound to Ghost Posts</span>
              </div>
              <p className="text-[10px] text-blue-700 leading-snug">
                Manual image URL management is paused. Tiles will automatically be compiled from Ghost posts tagged with <strong className="font-mono">#{general.dynamicTag || "gallery"}</strong>.
              </p>
              <div className="border-t border-blue-100/80 pt-1.5 flex flex-col gap-1 text-[10px] text-blue-800 font-sans">
                <span className="font-semibold text-blue-950">Field Mapping:</span>
                <ul className="list-disc list-inside space-y-0.5 text-blue-700 font-mono text-[9.5px]">
                  <li>Feature Image → Tile Image</li>
                  <li>Post Title → Caption / Alt text</li>
                  <li>Post URL → Tile Link</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase font-bold text-brand-ink">Gallery Images</span>
              <span className="text-[10px] text-brand-mute font-mono">{items.length} images</span>
            </div>

            <RepeatableList<GalleryItem>
              items={items}
              onChange={(newItems) => {
                onChangeProps({
                  items: newItems,
                  urls: newItems.map((item) => item.url),
                });
              }}
              renderItem={renderGalleryItem}
              newItem={() => ({
                id: Math.random().toString(36).substring(7),
                url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
                caption: "New Gallery Image",
                alt: "New Gallery Image",
              })}
              addLabel="Add Gallery Image"
            />
          </>
        )}
      </div>

      {/* Section Background Controls */}
      <BackgroundControls
        styles={block.styles || {}}
        appearance={p.appearance || {}}
        onChangeStyles={onChangeStyles || (() => {})}
        updateAppearance={(key, val) =>
          onChangeProps({ appearance: { ...p.appearance, [key]: val } })
        }
      />

      {/* Text Colors */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Text Colors</span>

        {/* Heading Color */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Heading Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={p.appearance?.headingColor || "#171717"}
              onChange={(e) =>
                onChangeProps({ appearance: { ...p.appearance, headingColor: e.target.value } })
              }
              className="w-7 h-7 rounded border border-brand-hairline cursor-pointer p-0.5 bg-transparent shrink-0"
            />
            <input
              type="text"
              value={p.appearance?.headingColor || ""}
              onChange={(e) =>
                onChangeProps({ appearance: { ...p.appearance, headingColor: e.target.value } })
              }
              className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              placeholder="var(--color-ink, #171717)"
            />
          </div>
        </div>

        {/* Subheading Color */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Subheading Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={p.appearance?.subheadingColor || "#4d4d4d"}
              onChange={(e) =>
                onChangeProps({ appearance: { ...p.appearance, subheadingColor: e.target.value } })
              }
              className="w-7 h-7 rounded border border-brand-hairline cursor-pointer p-0.5 bg-transparent shrink-0"
            />
            <input
              type="text"
              value={p.appearance?.subheadingColor || ""}
              onChange={(e) =>
                onChangeProps({ appearance: { ...p.appearance, subheadingColor: e.target.value } })
              }
              className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              placeholder="var(--color-mute, #4d4d4d)"
            />
          </div>
        </div>

        {/* Caption Color */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Caption Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={p.appearance?.captionColor || "#ffffff"}
              onChange={(e) =>
                onChangeProps({ appearance: { ...p.appearance, captionColor: e.target.value } })
              }
              className="w-7 h-7 rounded border border-brand-hairline cursor-pointer p-0.5 bg-transparent shrink-0"
            />
            <input
              type="text"
              value={p.appearance?.captionColor || ""}
              onChange={(e) =>
                onChangeProps({ appearance: { ...p.appearance, captionColor: e.target.value } })
              }
              className="flex-1 px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Spacing</span>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Top Padding</label>
            <input
              type="text"
              value={p.spacing?.paddingTop || "4rem"}
              onChange={(e) => {
                onChangeProps({ spacing: { ...p.spacing, paddingTop: e.target.value } });
                onChangeStyles?.({ paddingTop: e.target.value });
              }}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Bottom Padding</label>
            <input
              type="text"
              value={p.spacing?.paddingBottom || "4rem"}
              onChange={(e) => {
                onChangeProps({ spacing: { ...p.spacing, paddingBottom: e.target.value } });
                onChangeStyles?.({ paddingBottom: e.target.value });
              }}
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
            value={p.advanced?.htmlAnchor || "gallery"}
            onChange={(e) =>
              onChangeProps({ advanced: { ...p.advanced, htmlAnchor: e.target.value } })
            }
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            placeholder="e.g. gallery"
          />
        </div>
      </div>
    </div>
  );
};