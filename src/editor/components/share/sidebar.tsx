import React from "react";
import { BuilderBlock } from "@/types/theme";
import {
  ShareProps,
  ShareDesignLayout,
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
  LayoutGrid,
  CreditCard,
  Layers,
  Link,
  Sliders,
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
      <div className="bg-purple-50 border border-purple-200/80 rounded-md p-3">
        <div className="flex items-center gap-1.5 text-purple-900 font-semibold text-xs">
          <Sparkles size={13} className="text-purple-600 shrink-0" />
          <span>Ghost Native Share Modal (#/share)</span>
        </div>
        <p className="text-[11px] text-purple-800/90 mt-1 leading-relaxed">
          Clicking any share button linked to{" "}
          <code className="bg-purple-100 text-purple-950 font-semibold px-1.5 py-0.5 rounded font-mono text-[10px] border border-purple-200">
            #/share
          </code>{" "}
          triggers Ghost's official share sheet automatically.
        </p>
      </div>

      {/* 1. DESIGN LAYOUT SELECTOR */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body uppercase tracking-wider font-mono">
          Share Design Style
        </label>
        <div className="grid grid-cols-2 gap-1.5 bg-brand-canvas-soft p-1 rounded-md border border-brand-hairline">
          {(
            [
              { id: "pill-bar", label: "Compact Pill", icon: Sliders },
              { id: "editorial-card", label: "Editorial Card", icon: CreditCard },
              { id: "floating-dock", label: "Floating Dock", icon: Layers },
              { id: "social-grid", label: "Social Grid", icon: LayoutGrid },
              { id: "inline-minimal", label: "Inline Minimal", icon: Link, spanFull: true },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = p.layout === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateProp("layout", item.id as ShareDesignLayout)}
                className={`flex items-center gap-2 p-2 rounded text-left transition-all cursor-pointer ${
                  "spanFull" in item && item.spanFull ? "col-span-2" : ""
                } ${
                  isSelected
                    ? "bg-white text-brand-ink font-semibold shadow-xs border border-brand-hairline"
                    : "text-brand-mute hover:text-brand-ink hover:bg-white/50"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-purple-600" : "text-brand-mute"} />
                <span className="text-[11px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CARD CONTENT (if editorial-card is selected) */}
      {p.layout === "editorial-card" && (
        <div className="flex flex-col gap-2.5 p-3 bg-brand-canvas-soft rounded-md border border-brand-hairline">
          <span className="text-[11px] font-semibold text-brand-body uppercase tracking-wider font-mono">
            Card Content
          </span>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-brand-body">Card Heading</label>
            <input
              type="text"
              value={p.cardTitle}
              onChange={(e) => updateProp("cardTitle", e.target.value)}
              placeholder="Share this article"
              className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-white text-brand-ink placeholder:text-brand-mute shadow-2xs"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-medium text-brand-body">Card Subtitle</label>
            <textarea
              rows={2}
              value={p.cardSubtitle}
              onChange={(e) => updateProp("cardSubtitle", e.target.value)}
              placeholder="If you found this insightful, pass it along..."
              className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-white text-brand-ink placeholder:text-brand-mute resize-none shadow-2xs leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* 3. BUTTON LABEL & APPEARANCE */}
      {p.layout !== "inline-minimal" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Ghost Share Button Label
          </label>
          <input
            type="text"
            value={p.buttonText}
            onChange={(e) => updateProp("buttonText", e.target.value)}
            placeholder="Share, Share via Ghost..."
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none focus:border-brand-hairline-strong bg-white text-brand-ink placeholder:text-brand-mute shadow-2xs"
          />
        </div>
      )}

      {/* 4. BUTTON VARIANT */}
      {(p.layout === "pill-bar" || p.layout === "editorial-card" || p.layout === "floating-dock") && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-brand-body">
            Button Style
          </label>
          <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft p-0.5 rounded-sm border border-brand-hairline text-center">
            {(
              [
                { id: "pill", label: "Filled" },
                { id: "outline", label: "Outline" },
                { id: "ghost", label: "Ghost" },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => updateProp("variant", v.id as ShareStyleVariant)}
                className={`py-1.5 text-[11px] font-medium rounded-xs transition-all ${
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
      )}

      {/* 5. ALIGNMENT */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-brand-body">
          Alignment
        </label>
        <div className="grid grid-cols-3 gap-1 bg-brand-canvas-soft p-0.5 rounded-sm border border-brand-hairline">
          {(
            [
              { id: "left", icon: AlignLeft, title: "Left" },
              { id: "center", icon: CenterIcon, title: "Center" },
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

      {/* 6. PLATFORM TOGGLES */}
      <div className="flex flex-col gap-2 pt-2 border-t border-brand-hairline">
        <span className="text-[11px] font-semibold text-brand-body uppercase tracking-wider font-mono">
          Social Channels & Actions
        </span>

        {/* Direct Social Links (X, LinkedIn, FB) */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-brand-body">Direct Platform Links (X, LinkedIn, FB)</span>
          <button
            type="button"
            onClick={() => updateProp("showDirectLinks", !p.showDirectLinks)}
            className={`w-8 h-4.5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
              p.showDirectLinks ? "bg-brand-primary" : "bg-brand-hairline-strong"
            }`}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                p.showDirectLinks ? "translate-x-3.5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* WhatsApp */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-brand-body">WhatsApp Share</span>
          <button
            type="button"
            onClick={() => updateProp("showWhatsapp", !p.showWhatsapp)}
            className={`w-8 h-4.5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
              p.showWhatsapp ? "bg-[#25d366]" : "bg-brand-hairline-strong"
            }`}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                p.showWhatsapp ? "translate-x-3.5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Copy Link Button */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-brand-body">1-Click Copy Link</span>
          <button
            type="button"
            onClick={() => updateProp("showCopyLink", !p.showCopyLink)}
            className={`w-8 h-4.5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
              p.showCopyLink ? "bg-brand-primary" : "bg-brand-hairline-strong"
            }`}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full shadow transform transition-transform ${
                p.showCopyLink ? "translate-x-3.5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 7. ACCENT COLOR */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-brand-hairline">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-semibold text-brand-body">
            Custom Accent Color
          </label>
          {p.customColor && (
            <button
              type="button"
              onClick={() => {
                updateProp("customColor", "");
                updateStyle("customColor", "");
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
            value={p.customColor || "#171717"}
            onChange={(e) => {
              updateProp("customColor", e.target.value);
              updateStyle("customColor", e.target.value);
            }}
            className="w-8 h-8 rounded border border-brand-hairline p-0.5 cursor-pointer shrink-0 bg-transparent"
          />
          <input
            type="text"
            placeholder="Default (#171717)"
            value={p.customColor || ""}
            onChange={(e) => {
              updateProp("customColor", e.target.value);
              updateStyle("customColor", e.target.value);
            }}
            className="w-full px-2.5 py-1.5 border border-brand-hairline rounded-sm text-xs font-mono focus:outline-none focus:border-brand-hairline-strong bg-white text-brand-ink placeholder:text-brand-mute shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};

function CenterIcon(props: { size?: number }) {
  return <AlignCenter size={props.size || 13} />;
}
