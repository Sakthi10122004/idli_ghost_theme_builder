import { BuilderBlock } from "@/types/theme";
import { ShareProps, resolveShareProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p: ShareProps = resolveShareProps(block.props);
  const styles = block.styles || {};

  const marginBottom = (styles.marginBottom as string) || "";
  const styleAttr = marginBottom ? ` style="margin-bottom: ${marginBottom};"` : "";

  // Alignment Class
  const alignClass = `gh-share-align-${p.alignment || "left"}`;

  // Sizing Class
  const sizeClass = `gh-share-${p.size || "md"}`;

  // Variant Class
  const variantClass = `gh-share-${p.variant || "pill"}`;

  const customBgStyle =
    p.customColor && p.variant === "pill"
      ? ` style="background-color: ${p.customColor} !important; color: #ffffff !important;"`
      : "";

  // Share Icon SVG based on iconType
  let iconSvg = "";
  if (p.showIcon) {
    if (p.iconType === "share") {
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>`;
    } else if (p.iconType === "send") {
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
    } else {
      iconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;
    }
  }

  const labelHtml =
    p.variant === "icon-only"
      ? `<span class="sr-only">${p.buttonText || "Share"}</span>`
      : `<span>${p.buttonText || "Share"}</span>`;

  return `<div class="gh-share-wrapper ${alignClass}"${styleAttr}>
  <a href="#/share" class="gh-share-btn ${sizeClass} ${variantClass}"${customBgStyle} title="${p.buttonText || "Share"}">
    ${iconSvg}
    ${labelHtml}
  </a>
</div>`;
};
