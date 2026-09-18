export type HeadingType = "custom" | "dynamic";

export type HeadingDynamicSource = 
  | "post_title" 
  | "site_title" 
  | "site_description" 
  | "tag_name" 
  | "author_name";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  headingType: HeadingType;
  text: string;
  level: HeadingLevel;
  dynamicSource: HeadingDynamicSource;
  fallbackText: string;
  textColor?: string;
}

export const defaultProps: HeadingProps = {
  headingType: "custom",
  text: "Heading Text",
  level: 2,
  dynamicSource: "post_title",
  fallbackText: "Post or Page Title",
  textColor: "",
};

export const defaultStyles = {};

export function resolveHeadingProps(props?: Record<string, unknown>): HeadingProps {
  const p = (props || {}) as Partial<HeadingProps> & { dataSource?: string };

  const parsedLevel = Number(p.level);
  const level = !isNaN(parsedLevel) && parsedLevel >= 1 && parsedLevel <= 6 
    ? (parsedLevel as HeadingLevel) 
    : 2;

  // Support legacy or newly saved props
  let headingType: HeadingType = p.headingType || "custom";
  if (p.dataSource && p.dataSource !== "static") {
    headingType = "dynamic";
  }

  let dynamicSource: HeadingDynamicSource = p.dynamicSource || "post_title";
  if (p.dataSource === "post_page_title") dynamicSource = "post_title";
  else if (p.dataSource === "site_title") dynamicSource = "site_title";
  else if (p.dataSource === "site_description") dynamicSource = "site_description";
  else if (p.dataSource === "tag_name") dynamicSource = "tag_name";
  else if (p.dataSource === "author_name") dynamicSource = "author_name";

  const text = typeof p.text === "string" ? p.text : defaultProps.text;
  const fallbackText = typeof p.fallbackText === "string" ? p.fallbackText : defaultProps.fallbackText;
  const textColor = typeof p.textColor === "string" ? p.textColor : "";

  return {
    headingType,
    text,
    level,
    dynamicSource,
    fallbackText,
    textColor,
  };
}

/**
 * Checks if a color is a dark/black tone (e.g. #000000, #171717, dark gray/navy)
 * that would have poor contrast / become invisible on dark backgrounds.
 */
export function isDarkColor(color?: string): boolean {
  if (!color) return false;
  const c = color.trim().toLowerCase();
  if (c === "black" || c === "#000" || c === "#000000") return true;
  if (
    c === "#171717" ||
    c === "#111111" ||
    c === "#0a0a0a" ||
    c === "#121212" ||
    c === "#18181b" ||
    c === "#1f2937" ||
    c === "#222222" ||
    c === "#262626" ||
    c === "#27272a" ||
    c === "#333333" ||
    c === "#374151"
  ) {
    return true;
  }

  if (c.startsWith("#")) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance < 65;
    }
  }

  if (c.startsWith("rgb")) {
    const matches = c.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0], 10);
      const g = parseInt(matches[1], 10);
      const b = parseInt(matches[2], 10);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance < 65;
    }
  }

  return false;
}