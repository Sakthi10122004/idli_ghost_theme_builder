import { BuilderBlock } from "@/types/theme";
import { HeadingProps, resolveHeadingProps, isDarkColor } from "./schema";

export const compileToHbs = (
  block: BuilderBlock,
  _compiledChildren: string,
  isPageContext: boolean
): string => {
  const p: HeadingProps = resolveHeadingProps(block.props);
  const level = p.level || 2;

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
        return "text-base sm:text-lg font-semibold";
      default:
        return "text-3xl sm:text-4xl font-bold tracking-tight";
    }
  };

  const levelClasses = getLevelClasses(level);
  const textColor = (block.styles?.textColor as string) || p.textColor || "";
  const isDarkText = isDarkColor(textColor);
  const darkAdaptiveClass = isDarkText ? " heading-dark-adaptive" : "";
  const tagClass = `heading heading-h${level} font-heading ${levelClasses} leading-tight${darkAdaptiveClass}`;
  const styleAttr = textColor ? ` style="color: ${textColor};"` : "";

  // 1. Custom Heading
  if (p.headingType === "custom") {
    const textContent = p.text || "Heading Text";
    return `<h${level} class="${tagClass}"${styleAttr}>${textContent}</h${level}>`;
  }

  // 2. Dynamic Heading
  let dynamicTag = "{{title}}";
  if (p.dynamicSource === "site_title") {
    dynamicTag = "{{@site.title}}";
  } else if (p.dynamicSource === "site_description") {
    dynamicTag = "{{@site.description}}";
  } else if (p.dynamicSource === "tag_name") {
    const fallback = p.fallbackText || "Tag Archive";
    return `{{#if tag.name}}<h${level} class="${tagClass}"${styleAttr}>{{tag.name}}</h${level}>{{else}}<h${level} class="${tagClass}"${styleAttr}>${fallback}</h${level}>{{/if}}`;
  } else if (p.dynamicSource === "author_name") {
    const fallback = p.fallbackText || "Author Profile";
    return `{{#if author.name}}<h${level} class="${tagClass}"${styleAttr}>{{author.name}}</h${level}>{{else}}<h${level} class="${tagClass}"${styleAttr}>${fallback}</h${level}>{{/if}}`;
  }

  // For post/page title on page.hbs context, respect Ghost's page title gating rule
  if (p.dynamicSource === "post_title" && isPageContext) {
    return `{{#if @page.show_title_and_feature_image}}\n  <h${level} class="${tagClass}"${styleAttr}>${dynamicTag}</h${level}>\n{{/if}}`;
  }

  return `<h${level} class="${tagClass}"${styleAttr}>${dynamicTag}</h${level}>`;
};