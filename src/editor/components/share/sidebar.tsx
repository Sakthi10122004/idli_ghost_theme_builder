import React from "react";
import { BuilderBlock } from "@/types/theme";
import {
  ShareProps,
  ShareStyleVariant,
  ShareIconType,
  ShareSize,
  ShareAlignment,
  resolveShareProps,
} from "./schema";
import {
  Share2,
  Share,
  Send,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
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
  const p: ShareProps = resolveShareProps(block.props);
  const styles = block.styles || {};

  const updateProp = <K extends keyof ShareProps>(key: K, value: ShareProps[K]) => {
    onChangeProps({ [key]: value });
  };

  const updateStyle = (key: string, value: unknown) => {
    if (onChangeStyles) {
      onChangeStyles({ [key]: value });
    }
  };

  return (
    <div className="flex flex-col gap-4 text-xs font-sans text-brand-ink">
      {/* Ghost Native Share Info Box */}
      <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-purple-900 dark:text-purple-300 font-semibold text-xs">
          <Sparkles size={13} className="text-purple-600 dark:text-purple-400 shrink-0" />
          <span>Ghost Native Share Modal</span>
        </div>
        <p className="text-[11px] text-purple-800/90 dark:text-purple-300/80 mt-1 leading-relaxed">
          In Ghost, clicking any link to{" "}
          <code className="bg-purple-100 dark:bg-purple-900/60 text-purple-950 dark:text-purple-200 font-semibold px-1.5 py-0.5 rounded font-mono text-[10px] border border-purple-200 dark:border-purple-800">
            #/share
          </code>{" "}
          automatically triggers Ghost&apos;s official share popup with direct social networks (X, Facebook, LinkedIn, WhatsApp) and a 1-click copy link.
        </p>
      </div>

      {/* 1. BUTTON TEXT */}
      {p.variant !== "icon-only" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Button Label
          </label>
          <input
            type="text"
            value={p.buttonText}
            onChange={(e) => updateProp("buttonText", e.target.value)}
            placeholder="Share, Share this article..."
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-white dark:bg-neutral-900 text-brand-ink dark:text-white placeholder:text-brand-mute shadow-2xs"
          />
        </div>
      )}

      {/* 2. BUTTON VARIANT */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">
          Button Style
        </label>
        <div className="grid grid-cols-4 gap-1 bg-brand-canvas-soft dark:bg-neutral-800 p-0.5 rounded-sm border border-brand-hairline text-center">
          {(
            [
              { id: "pill", label: "Pill" },
              { id: "outline", label: "Outline" },
              { id: "ghost", label: "Ghost" },
              { id: "icon-only", label: "Icon" },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => updateProp("variant", v.id as ShareStyleVariant)}
              className={`py-1.5 text-[11px] font-medium rounded-xs transition-all cursor-pointer ${
                p.variant === v.id
                  ? "bg-white dark:bg-neutral-700 text-brand-ink dark:text-white font-semibold shadow-xs"
                  : "text-brand-mute hover:text-brand-ink dark:hover:text-neutral-200"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SIZE */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">
          Size
        </label>
        <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft dark:bg-neutral-800 p-0.5 rounded-sm border border-brand-hairline text-center">
          {(
            [
              { id: "sm", label: "Small" },
              { id: "md", label: "Medium" },
              { id: "lg", label: "Large" },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => updateProp("size", s.id as ShareSize)}
              className={`py-1.5 text-[11px] font-medium rounded-xs transition-all cursor-pointer ${
                p.size === s.id
                  ? "bg-white dark:bg-neutral-700 text-brand-ink dark:text-white font-semibold shadow-xs"
                  : "text-brand-mute hover:text-brand-ink dark:hover:text-neutral-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. ALIGNMENT */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">
          Alignment
        </label>
        <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft dark:bg-neutral-800 p-0.5 rounded-sm border border-brand-hairline">
          {(
            [
              { id: "left", icon: AlignLeft, title: "Left" },
              { id: "center", icon: AlignCenter, title: "Center" },
              { id: "right", icon: AlignRight, title: "Right" },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isCurrent = (p.alignment || "left") === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.title}
                onClick={() => updateProp("alignment", item.id as ShareAlignment)}
                className={`py-1.5 flex justify-center items-center rounded-xs transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-white dark:bg-neutral-700 text-brand-ink dark:text-white font-semibold shadow-xs"
                    : "text-brand-mute hover:text-brand-ink dark:hover:text-neutral-200"
                }`}
              >
                <Icon size={13} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. ICON SETTINGS */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-brand-hairline">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-brand-body">
            Show Icon
          </label>
          <input
            type="checkbox"
            checked={p.showIcon}
            onChange={(e) => updateProp("showIcon", e.target.checked)}
            className="rounded border-brand-hairline text-brand-ink cursor-pointer"
          />
        </div>

        {p.showIcon && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-medium text-brand-body">Icon Style</label>
            <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft dark:bg-neutral-800 p-0.5 rounded-sm border border-brand-hairline">
              {(
                [
                  { id: "share-2", icon: Share2, title: "Share 2" },
                  { id: "share", icon: Share, title: "Share" },
                  { id: "send", icon: Send, title: "Send" },
                ] as const
              ).map((item) => {
                const Icon = item.icon;
                const isSelected = p.iconType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.title}
                    onClick={() => updateProp("iconType", item.id as ShareIconType)}
                    className={`py-1.5 flex justify-center items-center rounded-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white dark:bg-neutral-700 text-brand-ink dark:text-white font-semibold shadow-xs"
                        : "text-brand-mute hover:text-brand-ink dark:hover:text-neutral-200"
                    }`}
                  >
                    <Icon size={13} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 6. ACCENT COLOR (for pill variant) */}
      {p.variant === "pill" && (
        <div className="flex flex-col gap-1.5 pt-2 border-t border-brand-hairline">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold text-brand-body">
              Custom Button Color
            </label>
            {p.customColor && (
              <button
                type="button"
                onClick={() => updateProp("customColor", "")}
                className="text-[10px] text-brand-mute hover:text-brand-error cursor-pointer"
              >
                Reset Default
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={p.customColor || "#171717"}
              onChange={(e) => updateProp("customColor", e.target.value)}
              className="w-8 h-8 rounded border border-brand-hairline p-0.5 cursor-pointer shrink-0 bg-transparent"
            />
            <input
              type="text"
              placeholder="Default (#171717)"
              value={p.customColor || ""}
              onChange={(e) => updateProp("customColor", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none focus:border-brand-hairline-strong bg-white dark:bg-neutral-900 text-brand-ink dark:text-white placeholder:text-brand-mute shadow-2xs"
            />
          </div>
        </div>
      )}

      {/* 7. BOTTOM MARGIN */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-brand-hairline">
        <label className="text-[11px] font-semibold text-brand-body">
          Bottom Margin
        </label>
        <input
          type="text"
          value={(styles.marginBottom as string) || ""}
          onChange={(e) => updateStyle("marginBottom", e.target.value)}
          placeholder="e.g. 24px, 2rem"
          className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none focus:border-brand-hairline-strong bg-white dark:bg-neutral-900 text-brand-ink dark:text-white placeholder:text-brand-mute shadow-2xs"
        />
      </div>
    </div>
  );
};
