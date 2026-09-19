import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveAuthorProfileProps, AuthorProfileProps } from "./schema";
import { Sparkles, MapPin, Globe } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveAuthorProfileProps(block.props);

  const updateProp = <K extends keyof AuthorProfileProps>(key: K, value: AuthorProfileProps[K]) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Sparkles size={13} className="text-blue-600 shrink-0" />
          <span>Author Profile Block</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Use &quot;End-of-Article Card&quot; on post pages, or &quot;Author Page Banner&quot; on author archive templates.
        </p>
      </div>

      {/* Layout Style */}
      <div className="flex flex-col gap-1.5 border-b border-brand-hairline pb-4">
        <label className="text-[11px] font-semibold text-brand-body">Layout Style</label>
        <select
          value={p.layoutStyle || "card"}
          onChange={(e) => updateProp("layoutStyle", e.target.value as AuthorProfileProps["layoutStyle"])}
          className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="card">End-of-Article Card (post.hbs)</option>
          <option value="banner">Author Page Banner (author.hbs)</option>
        </select>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Author Name</label>
        <input
          type="text"
          value={p.name}
          onChange={(e) => updateProp("name", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Author Bio</label>
        <textarea
          rows={3}
          value={p.bio}
          onChange={(e) => updateProp("bio", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
        />
      </div>

      {/* Avatar URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Avatar Image URL</label>
        <input
          type="text"
          value={p.avatarUrl}
          onChange={(e) => updateProp("avatarUrl", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body flex items-center gap-1">
          <MapPin size={11} className="text-brand-mute" />
          <span>Location</span>
        </label>
        <input
          type="text"
          value={p.location}
          onChange={(e) => updateProp("location", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Website */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body flex items-center gap-1">
          <Globe size={11} className="text-brand-mute" />
          <span>Website URL</span>
        </label>
        <input
          type="text"
          value={p.website}
          onChange={(e) => updateProp("website", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      {/* Twitter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">Twitter Handle</label>
        <input
          type="text"
          value={p.twitter}
          onChange={(e) => updateProp("twitter", e.target.value)}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
    </div>
  );
};