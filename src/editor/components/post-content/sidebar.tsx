import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolvePostContentProps, PostContentProps } from "./schema";
import { Sparkles, Layout } from "lucide-react";

export const SidebarElement = ({
  block,
  onChangeProps,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolvePostContentProps(block.props);

  const updateProp = <K extends keyof PostContentProps>(key: K, value: PostContentProps[K]) => {
    onChangeProps({ [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Header info badge */}
      <div className="bg-blue-50 border border-blue-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-semibold text-xs">
          <Sparkles size={13} className="text-blue-600 shrink-0" />
          <span>Post Article Header & Body</span>
        </div>
        <p className="text-[11px] text-blue-800/90 mt-1 leading-relaxed">
          Configures the Casper-standard post header including tag badge, title, excerpt, byline meta, feature image, and content.
        </p>
      </div>

      {/* Header elements visibility */}
      <div className="flex flex-col gap-2 border-b border-brand-hairline pb-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          Header Elements
        </span>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Primary Tag Badge</span>
          <input
            type="checkbox"
            checked={p.showPrimaryTag}
            onChange={(e) => updateProp("showPrimaryTag", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Featured Flag Badge</span>
          <input
            type="checkbox"
            checked={p.showFeaturedBadge}
            onChange={(e) => updateProp("showFeaturedBadge", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Custom Excerpt Subtitle</span>
          <input
            type="checkbox"
            checked={p.showExcerpt}
            onChange={(e) => updateProp("showExcerpt", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Feature Image</span>
          <input
            type="checkbox"
            checked={p.showFeatureImage}
            onChange={(e) => updateProp("showFeatureImage", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>
      </div>

      {/* Byline meta settings */}
      <div className="flex flex-col gap-2 border-b border-brand-hairline pb-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
          Author & Byline Meta
        </span>

        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-[11px] font-medium text-brand-body">Show Byline Row</span>
          <input
            type="checkbox"
            checked={p.showByline}
            onChange={(e) => updateProp("showByline", e.target.checked)}
            className="rounded border-brand-hairline"
          />
        </label>

        {p.showByline && (
          <div className="pl-3 border-l-2 border-brand-hairline flex flex-col gap-2 mt-1">
            <label className="flex items-center justify-between cursor-pointer py-0.5">
              <span className="text-[11px] text-brand-body">Author Avatar</span>
              <input
                type="checkbox"
                checked={p.showAuthorAvatar}
                onChange={(e) => updateProp("showAuthorAvatar", e.target.checked)}
                className="rounded border-brand-hairline"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-0.5">
              <span className="text-[11px] text-brand-body">Publish Date</span>
              <input
                type="checkbox"
                checked={p.showPublishDate}
                onChange={(e) => updateProp("showPublishDate", e.target.checked)}
                className="rounded border-brand-hairline"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer py-0.5">
              <span className="text-[11px] text-brand-body">Reading Time</span>
              <input
                type="checkbox"
                checked={p.showReadingTime}
                onChange={(e) => updateProp("showReadingTime", e.target.checked)}
                className="rounded border-brand-hairline"
              />
            </label>
          </div>
        )}
      </div>

      {/* Layout Width */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body flex items-center gap-1.5">
          <Layout size={12} className="text-brand-mute" />
          <span>Content Width</span>
        </label>
        <select
          value={p.contentWidth || "regular"}
          onChange={(e) => updateProp("contentWidth", e.target.value as PostContentProps["contentWidth"])}
          className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="narrow">Narrow (640px)</option>
          <option value="regular">Standard Casper (720px)</option>
          <option value="wide">Wide Editorial (840px)</option>
        </select>
      </div>
    </div>
  );
};