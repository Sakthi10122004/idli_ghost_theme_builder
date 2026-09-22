import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { ShareProps, resolveShareProps } from "./schema";
import { Share2, Share, Send, Sparkles } from "lucide-react";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

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
  useCanvasDarkMode();
  const p: ShareProps = resolveShareProps(block.props);
  const deviceMode = useEditorStore((state) => state.deviceMode);
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
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-xs px-4 py-2 gap-2",
    lg: "text-sm px-5 py-2.5 gap-2.5",
  }[p.size];

  // Variant styling for the trigger button
  const getVariantButtonClass = () => {
    switch (p.variant) {
      case "outline":
        return "border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:border-neutral-500 shadow-xs";
      case "ghost":
        return "bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800";
      case "icon-only":
        return "p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white hover:border-neutral-400 shadow-xs";
      case "pill":
      default:
        return "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 shadow-xs rounded-full";
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowNotice(true);
    setTimeout(() => setShowNotice(false), 3200);
  };

  const customBgStyle =
    p.customColor && p.variant === "pill"
      ? { backgroundColor: p.customColor, color: "#ffffff" }
      : undefined;

  return (
    <div
      className={`relative w-full group select-none transition-all ${
        isSelected ? "ring-2 ring-purple-500/80 ring-offset-2" : ""
      }`}
      style={{
        marginBottom: customMarginBottom || undefined,
      }}
    >
      <div className={`flex items-center w-full ${alignmentClass}`}>
        <button
          type="button"
          onClick={handleShareClick}
          style={customBgStyle}
          className={`inline-flex items-center font-medium transition-all cursor-pointer ${
            p.variant !== "pill" ? "rounded-md" : "rounded-full"
          } ${sizeClasses} ${getVariantButtonClass()}`}
          title={p.buttonText || "Share"}
        >
          {p.showIcon && renderShareIcon(iconSize)}
          {p.variant !== "icon-only" && <span>{p.buttonText || "Share"}</span>}
        </button>
      </div>

      {/* Editor Simulation Toast */}
      {showNotice && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-neutral-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-neutral-800 animate-in fade-in slide-in-from-top-1 duration-150">
          <Sparkles size={13} className="text-purple-400 shrink-0" />
          <span>
            Triggers Ghost&apos;s native share modal (<code className="text-purple-300 font-mono">#/share</code>) on your live publication.
          </span>
        </div>
      )}
    </div>
  );
};
