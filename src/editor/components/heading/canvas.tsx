import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { HeadingProps, resolveHeadingProps, isDarkColor } from "./schema";
import { Sparkles } from "lucide-react";
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
  const isDark = useCanvasDarkMode();
  const p: HeadingProps = resolveHeadingProps(block.props);
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
  const textAlign = resolveStyleLocal(styles.textAlign) as React.CSSProperties["textAlign"];
  const customFontSize = resolveStyleLocal(styles.fontSize);
  const customFontWeight = resolveStyleLocal(styles.fontWeight);
  const customLetterSpacing = resolveStyleLocal(styles.letterSpacing);
  const customTextColor = resolveStyleLocal(styles.textColor) || p.textColor;
  const customMarginBottom = resolveStyleLocal(styles.marginBottom);

  const level = p.level || 2;
  const HeadingTag = `h${level}` as keyof React.JSX.IntrinsicElements;

  // Level-specific sizing and font weight classes
  const getLevelClasses = (lvl: number): string => {
    switch (lvl) {
      case 1:
        return "text-4xl sm:text-5xl font-extrabold tracking-tight";
      case 2:
        return "text-3xl sm:text-4xl font-bold tracking-tight";
      case 3:
        return "text-2xl sm:text-3xl font-bold tracking-snug";
      case 4:
        return "text-xl sm:text-2xl font-semibold";
      case 5:
        return "text-lg sm:text-xl font-semibold";
      case 6:
        return "text-base sm:text-lg font-semibold text-brand-body";
      default:
        return "text-3xl sm:text-4xl font-bold tracking-tight";
    }
  };

  const isDarkText = isDarkColor(customTextColor);

  const titleStyle: React.CSSProperties = {
    color: isDark && (isDarkText || !customTextColor) ? "var(--color-ink, #ffffff)" : (customTextColor || undefined),
    fontSize: customFontSize || undefined,
    fontWeight: customFontWeight || undefined,
    letterSpacing: customLetterSpacing || undefined,
    marginBottom: customMarginBottom || undefined,
    textAlign: textAlign || undefined,
  };

  const getDynamicTagLabel = () => {
    switch (p.dynamicSource) {
      case "post_title":
        return "{{title}}";
      case "site_title":
        return "{{@site.title}}";
      case "site_description":
        return "{{@site.description}}";
      case "tag_name":
        return "{{tag.name}}";
      case "author_name":
        return "{{author.name}}";
      default:
        return "{{title}}";
    }
  };

  const displayText = p.headingType === "dynamic" 
    ? (p.fallbackText || "Post or Page Title") 
    : (p.text || "Heading Text");


  return (
    <div className="relative group/heading w-full">
      {p.headingType === "dynamic" && isSelected && (
        <div className="mb-1.5 flex items-center gap-1 text-[10px] font-mono text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200/60 w-fit select-none">
          <Sparkles size={11} />
          <span>Dynamic: {getDynamicTagLabel()}</span>
        </div>
      )}
      <HeadingTag
        className={`heading font-heading leading-tight transition-all text-brand-ink dark:text-white ${getLevelClasses(level)} ${isDarkText ? "heading-dark-adaptive" : ""}`}
        style={titleStyle}
      >
        {displayText}
      </HeadingTag>
    </div>
  );
};