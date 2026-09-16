import { BuilderBlock } from "@/types/theme";
import { TextProps, resolveTextProps, isDarkColor } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p: TextProps = resolveTextProps(block.props);
  const styles = block.styles || {};

  const textColor = (styles.textColor as string) || p.textColor || "";
  const fontSize = (styles.fontSize as string) || p.fontSize || "";
  const fontWeight = (styles.fontWeight as string) || p.fontWeight || "";
  const lineHeight = p.lineHeight || "";
  const textAlign = (styles.textAlign as string) || p.textAlign || "";
  const marginBottom = (styles.marginBottom as string) || "";
  const maxWidth = p.maxWidth || "";

  // Build inline styles
  const styleList: string[] = [];
  if (textColor) styleList.push(`color: ${textColor}`);
  if (fontSize) styleList.push(`font-size: ${fontSize}`);
  if (fontWeight) styleList.push(`font-weight: ${fontWeight}`);
  if (lineHeight) styleList.push(`line-height: ${lineHeight}`);
  if (textAlign) styleList.push(`text-align: ${textAlign}`);
  if (maxWidth) styleList.push(`max-width: ${maxWidth}`);
  if (marginBottom) styleList.push(`margin-bottom: ${marginBottom}`);

  const styleAttr = styleList.length > 0 ? ` style="${styleList.join("; ")}"` : "";

  // Variant classes
  const getVariantClasses = (): string => {
    switch (p.variant) {
      case "lead":
        return "text-lg sm:text-xl font-normal leading-relaxed";
      case "caption":
        return "text-xs tracking-wider uppercase font-mono opacity-80";
      case "quote":
        return "text-lg sm:text-xl italic border-l-2 border-current pl-4 py-1";
      case "body":
      default:
        return "text-base leading-relaxed";
    }
  };

  const isDarkText = isDarkColor(textColor);
  const darkAdaptiveClass = isDarkText ? " text-dark-adaptive" : "";
  const variantClass = getVariantClasses();
  const baseClasses = `text-content font-body ${variantClass}${darkAdaptiveClass}${maxWidth ? " mx-auto" : ""}`.trim();

  // 1. Dynamic Sources
  if (p.sourceType === "dynamic") {
    switch (p.dynamicSource) {
      case "post_content":
        return `<section class="gh-content gh-canvas ${baseClasses}"${styleAttr}>\n  {{content}}\n</section>`;
      case "post_excerpt":
        return `{{#if excerpt}}\n  <p class="${baseClasses}"${styleAttr}>{{excerpt}}</p>\n{{/if}}`;
      case "site_description":
        return `{{#if @site.description}}\n  <p class="${baseClasses}"${styleAttr}>{{@site.description}}</p>\n{{/if}}`;
      case "author_bio":
        return `{{#if author.bio}}\n  <p class="${baseClasses}"${styleAttr}>{{author.bio}}</p>\n{{/if}}`;
      case "tag_description":
        return `{{#if tag.description}}\n  <p class="${baseClasses}"${styleAttr}>{{tag.description}}</p>\n{{/if}}`;
      case "post_reading_time":
        return `<span class="${baseClasses}"${styleAttr}>{{reading_time}}</span>`;
      default:
        return `<section class="gh-content gh-canvas ${baseClasses}"${styleAttr}>\n  {{content}}\n</section>`;
    }
  }

  // 2. Custom text
  const rawText = p.text || "";
  const paragraphs = rawText.split(/\n\n+/).filter((item) => item.trim().length > 0);

  if (paragraphs.length <= 1) {
    const content = paragraphs[0] || rawText || "Add your text content here.";
    if (p.variant === "quote") {
      return `<blockquote class="${baseClasses}"${styleAttr}><p>${content}</p></blockquote>`;
    }
    return `<p class="${baseClasses}"${styleAttr}>${content}</p>`;
  }

  // Multi-paragraph custom text
  const pTags = paragraphs
    .map((para) => `  <p class="${variantClass}${darkAdaptiveClass}">${para}</p>`)
    .join("\n");

  const wrapperClasses = `text-content font-body space-y-4${darkAdaptiveClass}${maxWidth ? " mx-auto" : ""}`.trim();
  return `<div class="${wrapperClasses}"${styleAttr}>\n${pTags}\n</div>`;
};