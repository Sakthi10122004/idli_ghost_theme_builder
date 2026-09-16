import React, { useRef } from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import {
  ImageProps,
  ImageDynamicSource,
  ImageWidthMode,
  ImageAspectRatio,
  ImageObjectFit,
  resolveImageProps,
} from "./schema";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

const EMPTY_ASSETS: Record<string, string> = {};

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveImageProps(block.props);
  const addAsset = useEditorStore((state) => state.addAsset);
  const assets = useEditorStore((state) => state.document.assets) || EMPTY_ASSETS;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fallbackFileInputRef = useRef<HTMLInputElement>(null);

  const updateProp = <K extends keyof ImageProps>(key: K, value: ImageProps[K]) => {
    onChangeProps({ [key]: value });
  };

  const resolveUrl = (rawUrl?: string): string => {
    if (!rawUrl) return "";
    if (rawUrl.startsWith("asset://")) {
      const path = rawUrl.replace("asset://", "");
      return assets[path] || assets[`assets/${path}`] || rawUrl;
    }
    return rawUrl;
  };

  const handleFileUpload = (file: File, isFallback = false) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUri = ev.target?.result as string;
      if (!dataUri) return;

      const ext = file.name.split(".").pop() || "png";
      const id = Math.random().toString(36).substring(7);
      const assetPath = `assets/images/blocks/${id}.${ext}`;

      addAsset(assetPath, dataUri);
      const assetUrl = `asset://${assetPath.replace("assets/", "")}`;

      if (isFallback) {
        updateProp("fallbackUrl", assetUrl);
      } else {
        updateProp("url", assetUrl);
        if (!p.alt) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
          updateProp("alt", cleanName);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const currentPreviewUrl = resolveUrl(p.sourceType === "dynamic" ? p.fallbackUrl : p.url);

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* 1. Source Mode Switcher: Custom vs Dynamic */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body uppercase tracking-wider font-mono">
          Image Type
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
            <ImageIcon size={12} className="mr-1.5 text-brand-body" />
            <span>Custom</span>
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

      {/* 2. CUSTOM IMAGE CONTROLS */}
      {p.sourceType === "custom" && (
        <div className="flex flex-col gap-3">
          {/* File Upload / Thumbnail Preview */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Upload Image
            </label>

            {p.url ? (
              <div className="relative group rounded-md overflow-hidden border border-brand-hairline bg-brand-canvas-soft p-2">
                <div className="w-full h-32 rounded overflow-hidden bg-white flex items-center justify-center border border-brand-hairline/60">
                  <img
                    src={currentPreviewUrl}
                    alt={p.alt || "Preview"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-brand-hairline/60">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-[11px] font-medium text-brand-ink hover:text-blue-600 cursor-pointer"
                  >
                    <RefreshCw size={11} />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateProp("url", "");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="flex items-center gap-1 text-[11px] font-medium text-brand-mute hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 size={11} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-brand-hairline hover:border-brand-ink/40 rounded-md p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-brand-canvas-soft hover:bg-brand-canvas-soft/80 text-center"
              >
                <div className="p-2 bg-white rounded-full border border-brand-hairline shadow-xs text-brand-body">
                  <Upload size={16} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-brand-ink block">
                    Click to upload image
                  </span>
                  <span className="text-[10px] text-brand-mute">
                    PNG, JPG, WebP or SVG up to 10MB
                  </span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, false);
              }}
            />
          </div>

          {/* Direct URL Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Image URL / External Link
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={p.url}
              onChange={(e) => updateProp("url", e.target.value)}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
            />
          </div>

          {/* Alt Text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Alt Text (Accessibility & SEO)
            </label>
            <input
              type="text"
              placeholder="Describe the image content..."
              value={p.alt}
              onChange={(e) => updateProp("alt", e.target.value)}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>

          {/* Caption */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Caption (Optional)
            </label>
            <input
              type="text"
              placeholder="Photo credit or caption description..."
              value={p.caption || ""}
              onChange={(e) => updateProp("caption", e.target.value)}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>

          {/* Clickable Link */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-brand-hairline">
            <label className="text-[11px] font-semibold text-brand-body">
              Image Click Link (Optional)
            </label>
            <input
              type="text"
              placeholder="https://example.com or /my-page"
              value={p.linkUrl || ""}
              onChange={(e) => updateProp("linkUrl", e.target.value)}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
            {p.linkUrl && (
              <label className="flex items-center gap-2 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.openInNewTab}
                  onChange={(e) => updateProp("openInNewTab", e.target.checked)}
                  className="rounded border-brand-hairline cursor-pointer"
                />
                <span className="text-[11px] text-brand-body flex items-center gap-1">
                  Open link in new tab <ExternalLink size={10} />
                </span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* 3. DYNAMIC GHOST IMAGE CONTROLS */}
      {p.sourceType === "dynamic" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Ghost Data Field
            </label>
            <select
              value={p.dynamicSource}
              onChange={(e) => updateProp("dynamicSource", e.target.value as ImageDynamicSource)}
              className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="feature_image">Post / Page Feature Image ({"{{feature_image}}"})</option>
              <option value="site_cover">Site Cover Image ({"{{@site.cover_image}}"})</option>
              <option value="site_logo">Site Publication Logo ({"{{@site.logo}}"})</option>
              <option value="author_profile">Author Profile Avatar ({"{{author.profile_image}}"})</option>
              <option value="tag_feature">Tag Feature Image ({"{{tag.feature_image}}"})</option>
            </select>
          </div>

          {/* Canvas Preview Fallback Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-brand-body">
              Canvas Editor Preview Image
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Preview image URL..."
                value={p.fallbackUrl || ""}
                onChange={(e) => updateProp("fallbackUrl", e.target.value)}
                className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
              />
              <button
                type="button"
                onClick={() => fallbackFileInputRef.current?.click()}
                className="p-1.5 border border-brand-hairline rounded-sm bg-white hover:bg-brand-canvas-soft text-brand-body hover:text-brand-ink shrink-0"
                title="Upload preview image"
              >
                <Upload size={13} />
              </button>
            </div>
            <input
              ref={fallbackFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, true);
              }}
            />
          </div>

          {/* Ghost Tag Capsule */}
          <div className="bg-blue-50/60 border border-blue-200/50 rounded-md p-2.5 mt-1">
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-[11px]">
              <Sparkles size={12} />
              <span>Ghost Template Helper</span>
            </div>
            <p className="text-[10px] text-blue-800/80 mt-1 font-mono">
              {p.dynamicSource === "feature_image" && "{{#if feature_image}}<img src=\"{{feature_image}}\" alt=\"{{title}}\" />{{/if}}"}
              {p.dynamicSource === "site_cover" && "{{#if @site.cover_image}}<img src=\"{{@site.cover_image}}\" alt=\"{{@site.title}}\" />{{/if}}"}
              {p.dynamicSource === "site_logo" && "{{#if @site.logo}}<img src=\"{{@site.logo}}\" alt=\"{{@site.title}}\" />{{/if}}"}
              {p.dynamicSource === "author_profile" && "{{#if author.profile_image}}<img src=\"{{author.profile_image}}\" alt=\"{{author.name}}\" />{{/if}}"}
              {p.dynamicSource === "tag_feature" && "{{#if tag.feature_image}}<img src=\"{{tag.feature_image}}\" alt=\"{{tag.name}}\" />{{/if}}"}
            </p>
          </div>
        </div>
      )}

      {/* 4. LAYOUT & SIZING */}
      <div className="flex flex-col gap-3 pt-3 border-t border-brand-hairline">
        <label className="text-[11px] font-semibold text-brand-body uppercase tracking-wider font-mono">
          Layout & Sizing
        </label>

        {/* Ghost Card Width Mode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Ghost Card Width
          </label>
          <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft p-0.5 rounded-sm border border-brand-hairline text-center">
            {(["regular", "wide", "full"] as ImageWidthMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateProp("widthMode", mode)}
                className={`py-1 text-[11px] font-medium rounded-xs capitalize transition-all ${
                  p.widthMode === mode
                    ? "bg-white text-brand-ink font-semibold shadow-xs"
                    : "text-brand-mute hover:text-brand-ink"
                }`}
              >
                {mode === "regular" ? "Normal" : mode === "wide" ? "Wide" : "Full Bleed"}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Aspect Ratio
          </label>
          <select
            value={p.aspectRatio}
            onChange={(e) => {
              const newRatio = e.target.value as ImageAspectRatio;
              onChangeProps({
                aspectRatio: newRatio,
                // Clear maxHeight so it doesn't clamp the newly selected aspect ratio
                maxHeight: "",
              });
            }}
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="auto">Auto (Original Dimensions)</option>
            <option value="16/9">16:9 (Widescreen Landscape)</option>
            <option value="4/3">4:3 (Standard Photo)</option>
            <option value="3/2">3:2 (Classic 35mm)</option>
            <option value="1/1">1:1 (Square)</option>
            <option value="21/9">21:9 (Cinematic Banner)</option>
            <option value="4/5">4:5 (Portrait / Social)</option>
            <option value="9/16">9:16 (Vertical Story / Reels)</option>
            <option value="2/3">2:3 (Classic Portrait)</option>
          </select>
        </div>

        {/* Max Height */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-brand-body">
              Max Height
            </label>
            {p.maxHeight && (
              <button
                type="button"
                onClick={() => updateProp("maxHeight", "")}
                className="text-[10px] text-blue-600 hover:underline cursor-pointer"
              >
                Clear limit
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <select
              value={["", "260px", "380px", "500px", "650px", "800px"].includes(p.maxHeight || "") ? (p.maxHeight || "") : "custom"}
              onChange={(e) => {
                if (e.target.value !== "custom") {
                  updateProp("maxHeight", e.target.value);
                }
              }}
              className="flex-1 px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="">None (Full aspect ratio)</option>
              <option value="260px">Compact (260px)</option>
              <option value="380px">Medium (380px)</option>
              <option value="500px">Standard Editorial (500px)</option>
              <option value="650px">Large (650px)</option>
              <option value="800px">Hero (800px)</option>
              <option value="custom">Custom px</option>
            </select>
            {!["", "260px", "380px", "500px", "650px", "800px"].includes(p.maxHeight || "") && (
              <input
                type="text"
                placeholder="e.g. 450px"
                value={p.maxHeight || ""}
                onChange={(e) => updateProp("maxHeight", e.target.value)}
                className="w-24 px-2 py-1 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none bg-brand-canvas-soft"
              />
            )}
          </div>
          {p.maxHeight && p.aspectRatio !== "auto" && (
            <span className="text-[10px] text-amber-600 leading-tight">
              ⚠️ Note: Setting a max height caps this {p.aspectRatio} ratio.
            </span>
          )}
        </div>

        {/* Object Fit */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Fit Mode
          </label>
          <select
            value={p.objectFit}
            onChange={(e) => {
              const newFit = e.target.value as ImageObjectFit;
              if (newFit !== "cover" && p.aspectRatio === "auto" && !p.maxHeight) {
                onChangeProps({
                  objectFit: newFit,
                  maxHeight: "450px",
                });
              } else {
                updateProp("objectFit", newFit);
              }
            }}
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="cover">Cover (Fill & Crop to fit)</option>
            <option value="contain">Contain (Fit entirely without cropping)</option>
            <option value="fill">Fill (Stretch to fit)</option>
          </select>
        </div>

        {/* Corner Radius */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Corner Radius
          </label>
          <select
            value={p.borderRadius}
            onChange={(e) => updateProp("borderRadius", e.target.value)}
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          >
            <option value="rounded-none">Sharp (0px)</option>
            <option value="rounded-sm">Subtle (4px)</option>
            <option value="rounded-md">Medium (8px)</option>
            <option value="rounded-xl">Round (16px)</option>
            <option value="rounded-full">Pill / Circle (9999px)</option>
          </select>
        </div>
      </div>
    </div>
  );
};