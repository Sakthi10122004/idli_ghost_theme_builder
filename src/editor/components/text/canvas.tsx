import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { TextProps, resolveTextProps, isDarkColor } from "./schema";
import { Sparkles, Quote } from "lucide-react";

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
  const p: TextProps = resolveTextProps(block.props);
  const deviceMode = useEditorStore((state) => state.deviceMode);

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
  const textAlign = (resolveStyleLocal(styles.textAlign) || p.textAlign || "left") as React.CSSProperties["textAlign"];
  const customFontSize = resolveStyleLocal(styles.fontSize) || p.fontSize;
  const customFontWeight = resolveStyleLocal(styles.fontWeight) || p.fontWeight;
  const customLetterSpacing = resolveStyleLocal(styles.letterSpacing);
  const customTextColor = resolveStyleLocal(styles.textColor) || p.textColor;
  const customMarginBottom = resolveStyleLocal(styles.marginBottom);

  const isDynamic = p.sourceType === "dynamic";
  let fallbackDefault = "Add your text content here.";
  if (isDynamic) {
    if (p.dynamicSource === "post_content") {
      fallbackDefault =
        "This dynamic block renders the full post or page body content ({{content}}) written in Ghost Admin's Koenig editor, including all paragraphs, heading cards, callouts, images, and galleries.\n\nIt dynamically pulls the complete published article or static page body directly into this template section.";
    } else {
      fallbackDefault = "Dynamic excerpt text...";
    }
  }
  const rawText = isDynamic ? p.fallbackText : p.text;
  const displayText = rawText || fallbackDefault;

  const getDynamicTagLabel = () => {
    switch (p.dynamicSource) {
      case "post_content":
        return "{{content}}";
      case "post_excerpt":
        return "{{excerpt}}";
      case "site_description":
        return "{{@site.description}}";
      case "author_bio":
        return "{{author.bio}}";
      case "tag_description":
        return "{{tag.description}}";
      case "post_reading_time":
        return "{{reading_time}}";
      default:
        return "{{content}}";
    }
  };

  // Variant classes
  const getVariantClasses = () => {
    switch (p.variant) {
      case "lead":
        return "text-lg sm:text-xl text-brand-ink/90 font-normal leading-relaxed";
      case "caption":
        return "text-xs text-brand-mute tracking-wider uppercase font-mono";
      case "quote":
        return "text-lg sm:text-xl italic text-brand-ink/85 border-l-2 border-brand-hairline-strong pl-4 py-1";
      case "body":
      default:
        return "text-base text-brand-body leading-relaxed";
    }
  };

  const isDarkText = isDarkColor(customTextColor);
  const darkAdaptiveClass = isDarkText ? " text-dark-adaptive" : "";

  // Split into paragraphs if multi-line
  const paragraphs = displayText.split(/\n\n+/);

  return (
    <div
      className={`relative group/text w-full ${p.maxWidth ? "mx-auto" : ""}`}
      style={{
        maxWidth: p.maxWidth || undefined,
        textAlign,
        marginBottom: customMarginBottom || undefined,
      }}
    >
      {/* Dynamic Source Indicator */}
      {isDynamic && isSelected && (
        <div className="mb-2 flex justify-start">
          <div className="flex items-center gap-1 text-[10px] font-mono text-blue-600 bg-blue-50/90 px-2 py-0.5 rounded border border-blue-200/70 w-fit select-none shadow-xs">
            <Sparkles size={11} />
            <span>Dynamic: {getDynamicTagLabel()}</span>
          </div>
        </div>
      )}

      {/* Quote indicator icon */}
      {p.variant === "quote" && isSelected && (
        <div className="mb-1 flex items-center gap-1 text-[10px] font-mono text-brand-mute">
          <Quote size={11} />
          <span>Pull Quote</span>
        </div>
      )}

      <div
        className={`${getVariantClasses()} ${darkAdaptiveClass} font-body transition-colors`}
        style={{
          fontSize: customFontSize || undefined,
          fontWeight: customFontWeight || undefined,
          letterSpacing: customLetterSpacing || undefined,
          lineHeight: p.lineHeight || undefined,
          color: customTextColor || undefined,
        }}
      >
        {paragraphs.length > 1 ? (
          paragraphs.map((para, idx) => (
            <p key={idx} className={idx < paragraphs.length - 1 ? "mb-4" : "mb-0"}>
              {para}
            </p>
          ))
        ) : (
          <p className="m-0 whitespace-pre-line">{displayText}</p>
        )}
      </div>
    </div>
  );
};