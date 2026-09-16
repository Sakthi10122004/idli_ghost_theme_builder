export type TextSourceType = "custom" | "dynamic";

export type TextDynamicSource =
  | "post_content"
  | "post_excerpt"
  | "site_description"
  | "author_bio"
  | "tag_description"
  | "post_reading_time";

export type TextVariant = "body" | "lead" | "caption" | "quote";

export interface TextProps {
  sourceType: TextSourceType;
  text: string;
  variant: TextVariant;
  dynamicSource: TextDynamicSource;
  fallbackText: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  textAlign?: "left" | "center" | "right" | "justify";
  maxWidth?: string;
}

export const defaultProps: TextProps = {
  sourceType: "custom",
  text: "Add your text content here. Share your story, insights, or updates with your readers.",
  variant: "body",
  dynamicSource: "post_excerpt",
  fallbackText: "Post or page excerpt summary text...",
  textColor: "",
  fontSize: "",
  fontWeight: "",
  lineHeight: "1.7",
  textAlign: "left",
  maxWidth: "",
};

export const defaultStyles = {};

export function resolveTextProps(props?: Record<string, unknown>): TextProps {
  const p = (props || {}) as Partial<TextProps> & { dataSource?: string };

  let sourceType: TextSourceType = p.sourceType || "custom";
  if (p.dataSource && p.dataSource !== "static") {
    sourceType = "dynamic";
  }

  const variant: TextVariant = ["body", "lead", "caption", "quote"].includes(p.variant as string)
    ? (p.variant as TextVariant)
    : "body";

  let dynamicSource: TextDynamicSource = p.dynamicSource || "post_excerpt";
  if (p.dataSource === "post_content" || p.dataSource === "content") dynamicSource = "post_content";
  else if (p.dataSource === "post_excerpt") dynamicSource = "post_excerpt";
  else if (p.dataSource === "site_description") dynamicSource = "site_description";
  else if (p.dataSource === "author_bio") dynamicSource = "author_bio";
  else if (p.dataSource === "tag_description") dynamicSource = "tag_description";
  else if (p.dataSource === "post_reading_time") dynamicSource = "post_reading_time";

  const text = typeof p.text === "string" ? p.text : defaultProps.text;
  const fallbackText = typeof p.fallbackText === "string" ? p.fallbackText : defaultProps.fallbackText;
  const textColor = typeof p.textColor === "string" ? p.textColor : "";
  const fontSize = typeof p.fontSize === "string" ? p.fontSize : "";
  const fontWeight = typeof p.fontWeight === "string" ? p.fontWeight : "";
  const lineHeight = typeof p.lineHeight === "string" ? p.lineHeight : "1.7";
  const textAlign = ["left", "center", "right", "justify"].includes(p.textAlign as string)
    ? p.textAlign
    : "left";
  const maxWidth = typeof p.maxWidth === "string" ? p.maxWidth : "";

  return {
    sourceType,
    text,
    variant,
    dynamicSource,
    fallbackText,
    textColor,
    fontSize,
    fontWeight,
    lineHeight,
    textAlign,
    maxWidth,
  };
}

/**
 * Checks if a color is a dark/black tone (e.g. #000000, #171717, dark gray)
 * that would become invisible on dark backgrounds without contrast adaptation.
 */
export function isDarkColor(color?: string): boolean {
  if (!color) return false;
  const c = color.trim().toLowerCase();
  if (
    c === "#000" ||
    c === "#000000" ||
    c === "#171717" ||
    c === "#111" ||
    c === "#111111" ||
    c === "#0a0a0a" ||
    c === "black"
  ) {
    return true;
  }
  if (c.startsWith("#") && (c.length === 7 || c.length === 4)) {
    const hex = c.length === 4
      ? c.slice(1).split("").map((x) => x + x).join("")
      : c.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance < 0.25;
    }
  }
  return false;
}