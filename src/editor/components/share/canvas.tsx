import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { ShareProps, resolveShareProps } from "./schema";
import {
  Share2,
  Share,
  Send,
  Link2,
  Sparkles,
  Check,
  Copy,
} from "lucide-react";

export const CanvasElement = ({
  block,
  isSelected,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const p: ShareProps = resolveShareProps(block.props);
  const deviceMode = useEditorStore((state) => state.deviceMode);
  const [copied, setCopied] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  const resolveStyleLocal = (val: unknown): string | undefined => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    if (typeof val === "object" && val !== null) {
      const rec = val as Record<string, string>;
      return rec[deviceMode] || rec.desktop || undefined;
    }
    return String(val);
  };

  const styles = block.styles || {};
  const customMarginBottom = resolveStyleLocal(styles.marginBottom);

  // Icon component
  const renderShareIcon = (sizePx: number) => {
    switch (p.iconType) {
      case "share":
        return <Share size={sizePx} />;
      case "send":
        return <Send size={sizePx} />;
      case "share-2":
      default:
        return <Share2 size={sizePx} />;
    }
  };

  const iconSize = p.size === "sm" ? 12 : p.size === "lg" ? 16 : 14;

  // Alignment classes
  const alignmentClass = {
    left: "justify-start text-left",
    center: "justify-center text-center",
    right: "justify-end text-right",
  }[p.alignment];

  // Sizing tokens
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-xs px-3.5 py-1.5 gap-2",
    lg: "text-sm px-4 py-2 gap-2.5",
  }[p.size];

  // Variant styling for the primary trigger
  const getVariantButtonClass = () => {
    switch (p.variant) {
      case "outline":
        return "border border-brand-hairline-strong bg-white dark:bg-neutral-900 text-brand-ink dark:text-white hover:border-brand-ink/50 hover:shadow-xs shadow-2xs";
      case "ghost":
        return "bg-transparent text-brand-body dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10";
      case "icon-only":
        return "p-2 rounded-full border border-brand-hairline-strong bg-white dark:bg-neutral-900 text-brand-ink dark:text-white hover:border-brand-ink/40 shadow-xs";
      case "pill":
      default:
        return "bg-brand-ink text-white dark:bg-white dark:text-brand-ink hover:opacity-90 shadow-xs";
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 3200);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative group/share w-full flex py-2 ${alignmentClass}`}
      style={{ marginBottom: customMarginBottom || undefined }}
    >
      {/* Selected Helper Pill */}
      {isSelected && (
        <div className="absolute -top-7 left-0 flex items-center gap-1.5 text-[10px] font-mono text-purple-600 bg-purple-50 dark:bg-purple-950/80 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200/70 dark:border-purple-800/60 shadow-xs z-10 select-none">
          <Sparkles size={11} />
          <span>Ghost Share Layout: {p.layout} (href="#/share")</span>
        </div>
      )}

      {/* Simulated Ghost modal trigger notice */}
      {showNotice && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-sans px-3 py-1.5 rounded-md shadow-xl flex items-center gap-1.5 z-30 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150">
          <Sparkles size={11} className="text-amber-400" />
          <span>Ghost Native Share Modal opens on published post (#/share)</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* DESIGN 1: PILL BAR (Classic Compact Capsule)              */}
      {/* ========================================================= */}
      {p.layout === "pill-bar" && (
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareClick}
            className={`inline-flex items-center font-medium transition-all cursor-pointer ${p.variant !== "icon-only" ? sizeClasses : ""} ${getVariantButtonClass()} ${p.borderRadius || "rounded-full"}`}
            style={{ backgroundColor: p.customColor && p.variant === "pill" ? p.customColor : undefined }}
            title="Trigger Ghost native share modal (#/share)"
          >
            {p.showIcon && renderShareIcon(iconSize)}
            {p.variant !== "icon-only" && <span>{p.buttonText || "Share"}</span>}
          </button>

          {p.showDirectLinks && (
            <div className="flex items-center gap-1 text-brand-mute dark:text-neutral-400 pl-1 border-l border-brand-hairline dark:border-neutral-800">
              <SocialIconButtons onClick={handleShareClick} onCopy={handleCopyLink} copied={copied} showWhatsapp={p.showWhatsapp} showCopyLink={p.showCopyLink} />
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DESIGN 2: EDITORIAL CARD (End of Post Box)               */}
      {/* ========================================================= */}
      {p.layout === "editorial-card" && (
        <div className="w-full max-w-xl border border-brand-hairline dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-xs transition-all">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-brand-mute dark:text-neutral-400 mb-1.5">
            <Sparkles size={11} className="text-purple-600 dark:text-purple-400" />
            <span>Pass it forward</span>
          </div>
          <h4 className="text-base font-semibold text-brand-ink dark:text-white mb-1.5 tracking-tight">
            {p.cardTitle || "Share this article"}
          </h4>
          <p className="text-xs text-brand-body dark:text-neutral-300 mb-4 leading-relaxed">
            {p.cardSubtitle || "If you found this piece insightful, pass it along to your network."}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-brand-hairline dark:border-neutral-800">
            {/* Primary Ghost Native trigger */}
            <button
              type="button"
              onClick={handleShareClick}
              className={`inline-flex items-center font-medium cursor-pointer ${sizeClasses} ${getVariantButtonClass()} ${p.borderRadius || "rounded-full"}`}
              style={{ backgroundColor: p.customColor && p.variant === "pill" ? p.customColor : undefined }}
            >
              {p.showIcon && renderShareIcon(iconSize)}
              <span>{p.buttonText || "Share via Ghost"}</span>
            </button>

            {/* Direct Platform links */}
            {p.showDirectLinks && (
              <div className="flex items-center gap-1.5">
                <SocialIconButtons onClick={handleShareClick} onCopy={handleCopyLink} copied={copied} showWhatsapp={p.showWhatsapp} showCopyLink={p.showCopyLink} />
              </div>
            )}
          </div>

          {/* Quick copy URL box */}
          {p.showCopyLink && (
            <div className="mt-3.5 flex items-center bg-brand-canvas-soft dark:bg-neutral-800/80 border border-brand-hairline dark:border-neutral-700 rounded-lg p-1.5 pl-3 text-[11px] font-mono text-brand-body dark:text-neutral-300">
              <span className="truncate flex-1">https://yourpublication.com/article-slug</span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="ml-2 px-2.5 py-1 bg-white dark:bg-neutral-700 hover:bg-brand-canvas-soft dark:hover:bg-neutral-600 border border-brand-hairline dark:border-neutral-600 text-brand-ink dark:text-white rounded text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              >
                {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DESIGN 3: FLOATING DOCK (Glassmorphic Elevated Pill)       */}
      {/* ========================================================= */}
      {p.layout === "floating-dock" && (
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-brand-hairline dark:border-neutral-700/80 shadow-lg shadow-black/5 dark:shadow-black/30">
          <button
            type="button"
            onClick={handleShareClick}
            className={`inline-flex items-center font-medium cursor-pointer ${sizeClasses} ${getVariantButtonClass()} rounded-full`}
            style={{ backgroundColor: p.customColor && p.variant === "pill" ? p.customColor : undefined }}
          >
            {p.showIcon && renderShareIcon(iconSize)}
            <span>{p.buttonText || "Share"}</span>
          </button>

          {p.showDirectLinks && (
            <div className="flex items-center gap-1 px-1 text-brand-body dark:text-neutral-300">
              <SocialIconButtons onClick={handleShareClick} onCopy={handleCopyLink} copied={copied} showWhatsapp={p.showWhatsapp} showCopyLink={p.showCopyLink} />
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DESIGN 4: SOCIAL GRID (Tile Buttons with Badges)          */}
      {/* ========================================================= */}
      {p.layout === "social-grid" && (
        <div className="flex flex-wrap gap-2 items-center">
          {/* Ghost Native Share Tile */}
          <button
            type="button"
            onClick={handleShareClick}
            className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/60 rounded-xl text-purple-700 dark:text-purple-300 hover:scale-[1.02] transition-all cursor-pointer shadow-2xs font-medium text-xs"
          >
            <Sparkles size={13} className="text-purple-600 dark:text-purple-400" />
            <span>{p.buttonText || "Ghost Share (#/share)"}</span>
          </button>

          {/* X / Twitter Tile */}
          <button
            type="button"
            onClick={handleShareClick}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl hover:scale-[1.02] transition-all cursor-pointer shadow-2xs text-xs font-medium"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Post</span>
          </button>

          {/* LinkedIn Tile */}
          <button
            type="button"
            onClick={handleShareClick}
            className="flex items-center gap-2 px-3 py-2 bg-[#0077b5] text-white rounded-xl hover:scale-[1.02] transition-all cursor-pointer shadow-2xs text-xs font-medium"
          >
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
            </svg>
            <span>LinkedIn</span>
          </button>

          {/* WhatsApp Tile */}
          {p.showWhatsapp && (
            <button
              type="button"
              onClick={handleShareClick}
              className="flex items-center gap-2 px-3 py-2 bg-[#25d366] text-white rounded-xl hover:scale-[1.02] transition-all cursor-pointer shadow-2xs text-xs font-medium"
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
              </svg>
              <span>WhatsApp</span>
            </button>
          )}

          {/* Copy Link Tile */}
          {p.showCopyLink && (
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-800 border border-brand-hairline dark:border-neutral-700 text-brand-ink dark:text-white rounded-xl hover:scale-[1.02] transition-all cursor-pointer shadow-2xs text-xs font-medium"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Link2 size={13} />}
              <span>{copied ? "Link Copied!" : "Copy Link"}</span>
            </button>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* DESIGN 5: INLINE MINIMAL (Editorial Text Bar)             */}
      {/* ========================================================= */}
      {p.layout === "inline-minimal" && (
        <div className="inline-flex items-center gap-2 text-xs text-brand-mute dark:text-neutral-400 font-sans">
          <span className="font-semibold text-brand-ink dark:text-white">Share:</span>
          <button
            type="button"
            onClick={handleShareClick}
            className="hover:text-brand-primary underline underline-offset-4 cursor-pointer"
          >
            X (Twitter)
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={handleShareClick}
            className="hover:text-brand-primary underline underline-offset-4 cursor-pointer"
          >
            LinkedIn
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={handleShareClick}
            className="hover:text-brand-primary underline underline-offset-4 cursor-pointer"
          >
            Facebook
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={handleShareClick}
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline underline-offset-4 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={11} />
            <span>More Options (#/share)</span>
          </button>
        </div>
      )}
    </div>
  );
};

function SocialIconButtons({
  onClick,
  onCopy,
  copied,
  showWhatsapp,
  showCopyLink,
}: {
  onClick: (e: React.MouseEvent) => void;
  onCopy: (e: React.MouseEvent) => void;
  copied: boolean;
  showWhatsapp: boolean;
  showCopyLink: boolean;
}) {
  return (
    <>
      {/* X / Twitter */}
      <button
        type="button"
        onClick={onClick}
        title="Share on X"
        className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-ink dark:hover:text-white transition-colors cursor-pointer"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        type="button"
        onClick={onClick}
        title="Share on LinkedIn"
        className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-ink dark:hover:text-white transition-colors cursor-pointer"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
        </svg>
      </button>

      {/* WhatsApp */}
      {showWhatsapp && (
        <button
          type="button"
          onClick={onClick}
          title="Share on WhatsApp"
          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#25d366] transition-colors cursor-pointer"
        >
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z" />
          </svg>
        </button>
      )}

      {/* Copy Link */}
      {showCopyLink && (
        <button
          type="button"
          onClick={onCopy}
          title={copied ? "Copied!" : "Copy post link"}
          className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-ink dark:hover:text-white transition-colors cursor-pointer"
        >
          {copied ? <Check size={12} className="text-emerald-500" /> : <Link2 size={12} />}
        </button>
      )}
    </>
  );
}
