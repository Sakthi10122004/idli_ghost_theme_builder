import { BuilderBlock } from "@/types/theme";
import { ImageProps, resolveImageProps } from "./schema";

export const compileToHbs = (
  block: BuilderBlock,
  _compiledChildren: string,
  isPageContext: boolean
): string => {
  const p: ImageProps = resolveImageProps(block.props);

  const resolveHbsSrc = (src: string) => {
    if (src && src.startsWith("asset://")) {
      const path = src.replace("asset://", "");
      return `{{asset "${path}"}}`;
    }
    return src || "";
  };

  const getWidthClass = (mode: ImageProps["widthMode"]) => {
    switch (mode) {
      case "wide":
        return "kg-width-wide";
      case "full":
        return "kg-width-full";
      case "regular":
      default:
        return "";
    }
  };

  const getRadiusCss = (radius?: string): string => {
    if (!radius) return "8px";
    if (radius === "rounded-none" || radius === "0px" || radius === "0") return "0px";
    if (radius === "rounded-sm" || radius === "4px") return "4px";
    if (radius === "rounded-md" || radius === "8px") return "8px";
    if (radius === "rounded-xl" || radius === "16px") return "16px";
    if (radius === "rounded-full" || radius === "9999px") return "9999px";
    return radius;
  };

  const getRadiusClass = (radius?: string) => {
    switch (radius) {
      case "rounded-none":
      case "0px":
        return "rounded-none";
      case "rounded-sm":
      case "4px":
        return "rounded-sm";
      case "rounded-xl":
      case "16px":
        return "rounded-xl";
      case "rounded-full":
      case "9999px":
        return "rounded-full";
      case "rounded-md":
      case "8px":
      default:
        return "rounded-md";
    }
  };

  const widthClass = getWidthClass(p.widthMode);
  const radiusClass = getRadiusClass(p.borderRadius);
  const radiusCss = getRadiusCss(p.borderRadius);
  const cardClasses = ["kg-card", "kg-image-card", widthClass].filter(Boolean).join(" ");
  const cardStyle = ` style="overflow: hidden; border-radius: ${radiusCss};"`;
  const isFixedAspect = p.aspectRatio && p.aspectRatio !== "auto";
  const resolvedRatio = isFixedAspect ? p.aspectRatio.replace("/", " / ") : "";
  const imgClasses = [
    "w-full",
    "block",
    radiusClass,
    p.objectFit === "contain" ? "object-contain" : p.objectFit === "fill" ? "object-fill" : "object-cover",
  ].filter(Boolean).join(" ");

  const styleParts: string[] = [
    "width: 100%;",
    `border-radius: ${radiusCss};`,
  ];
  if (isFixedAspect) {
    styleParts.push(`aspect-ratio: ${resolvedRatio};`);
    styleParts.push(`height: 100%;`);
    styleParts.push(`object-fit: ${p.objectFit || "cover"};`);
  } else if (p.maxHeight) {
    styleParts.push(`height: ${p.maxHeight};`);
    styleParts.push(`max-height: ${p.maxHeight};`);
    styleParts.push(`object-fit: ${p.objectFit || "cover"};`);
  } else if (p.objectFit === "contain" || p.objectFit === "fill") {
    styleParts.push(`height: 450px;`);
    styleParts.push(`object-fit: ${p.objectFit};`);
  } else {
    styleParts.push("height: auto;");
  }

  if (p.maxHeight && isFixedAspect) {
    styleParts.push(`max-height: ${p.maxHeight};`);
  }
  const imgStyle = styleParts.length > 0 ? ` style="${styleParts.join(" ")}"` : "";

  // 1. DYNAMIC IMAGE SOURCES
  if (p.sourceType === "dynamic") {
    if (p.dynamicSource === "feature_image") {
      const featureMarkup = `{{#if feature_image}}
<figure class="${cardClasses}"${cardStyle}>
  <img src="{{feature_image}}" alt="{{title}}" class="${imgClasses}"${imgStyle} loading="lazy" />
  {{#if feature_image_caption}}
    <figcaption>{{feature_image_caption}}</figcaption>
  {{/if}}
</figure>
{{/if}}`;

      if (isPageContext) {
        return `{{#if @page.show_title_and_feature_image}}\n  ${featureMarkup}\n{{/if}}`;
      }
      return featureMarkup;
    }

    if (p.dynamicSource === "site_cover") {
      return `{{#if @site.cover_image}}
<figure class="${cardClasses}"${cardStyle}>
  <img src="{{@site.cover_image}}" alt="{{@site.title}}" class="${imgClasses}"${imgStyle} loading="lazy" />
</figure>
{{/if}}`;
    }

    if (p.dynamicSource === "site_logo") {
      return `{{#if @site.logo}}
<figure class="${cardClasses}"${cardStyle}>
  <img src="{{@site.logo}}" alt="{{@site.title}}" class="${imgClasses}"${imgStyle} loading="lazy" />
</figure>
{{/if}}`;
    }

    if (p.dynamicSource === "author_profile") {
      return `{{#if author.profile_image}}
<figure class="${cardClasses}"${cardStyle}>
  <img src="{{author.profile_image}}" alt="{{author.name}}" class="${imgClasses}"${imgStyle} loading="lazy" />
</figure>
{{/if}}`;
    }

    if (p.dynamicSource === "tag_feature") {
      return `{{#if tag.feature_image}}
<figure class="${cardClasses}"${cardStyle}>
  <img src="{{tag.feature_image}}" alt="{{tag.name}}" class="${imgClasses}"${imgStyle} loading="lazy" />
</figure>
{{/if}}`;
    }
  }

  // 2. CUSTOM IMAGE SOURCE
  const src = resolveHbsSrc(p.url);
  const altAttr = p.alt ? ` alt="${p.alt.replace(/"/g, "&quot;")}"` : ' alt=""';
  const imgTag = `<img src="${src}"${altAttr} class="${imgClasses}"${imgStyle} loading="lazy" />`;
  const wrappedImg = p.linkUrl
    ? `<a href="${p.linkUrl}"${p.openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : ""}>${imgTag}</a>`
    : imgTag;

  const captionHtml = p.caption
    ? `\n  <figcaption>${p.caption}</figcaption>`
    : "";

  return `<figure class="${cardClasses}"${cardStyle}>
  ${wrappedImg}${captionHtml}
</figure>`;
};