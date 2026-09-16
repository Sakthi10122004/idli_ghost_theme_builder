import { BuilderBlock } from "@/types/theme";
import { ShareProps, resolveShareProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p: ShareProps = resolveShareProps(block.props);
  const styles = block.styles || {};

  const marginBottom = (styles.marginBottom as string) || "";
  const styleAttr = marginBottom ? ` style="margin-bottom: ${marginBottom};"` : "";

  // Semantic Alignment Class
  const alignClass = `gh-share-align-${p.alignment || "left"}`;

  // Sizing Class
  const sizeClass = `gh-share-${p.size || "md"}`;

  // Variant Class
  const variantClass = `gh-share-${p.variant || "pill"}`;

  const customBgStyle =
    p.customColor && p.variant === "pill"
      ? ` style="background-color: ${p.customColor} !important; color: #ffffff !important;"`
      : "";

  // Share Icon SVG (explicit dimensions & vector attributes)
  const shareIconSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`;

  // Platform icons SVGs
  const xIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
  const linkedInIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/></svg>`;
  const facebookIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
  const whatsappIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2z"/></svg>`;
  const copyLinkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
  const sparkleIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;

  // Primary Ghost Share Button linking to #/share
  const primaryButton = `<a href="#/share" class="gh-share-btn ${sizeClass} ${variantClass}"${customBgStyle} title="Share via Ghost">
  ${p.showIcon ? shareIconSvg : ""}
  <span>${p.buttonText || "Share"}</span>
</a>`;

  // Social direct links block
  const directLinks = `
  <div class="gh-share-direct-links">
    <a href="https://twitter.com/intent/tweet?text={{encode title}}&url={{url absolute="true"}}" target="_blank" rel="noopener noreferrer" class="gh-share-direct-btn" title="Share on X">
      ${xIcon}
    </a>
    <a href="https://www.linkedin.com/sharing/share-offsite/?url={{url absolute="true"}}" target="_blank" rel="noopener noreferrer" class="gh-share-direct-btn" title="Share on LinkedIn">
      ${linkedInIcon}
    </a>
    <a href="https://www.facebook.com/sharer/sharer.php?u={{url absolute="true"}}" target="_blank" rel="noopener noreferrer" class="gh-share-direct-btn" title="Share on Facebook">
      ${facebookIcon}
    </a>
    ${p.showWhatsapp ? `<a href="https://api.whatsapp.com/send?text={{encode title}}%20{{url absolute="true"}}" target="_blank" rel="noopener noreferrer" class="gh-share-direct-btn" title="Share on WhatsApp">${whatsappIcon}</a>` : ""}
    ${p.showCopyLink ? `<a href="#/share" class="gh-share-direct-btn" title="Copy Link">${copyLinkIcon}</a>` : ""}
  </div>`.trim();

  // 1. INLINE MINIMAL
  if (p.layout === "inline-minimal") {
    return `<div class="gh-share-inline ${alignClass}"${styleAttr}>
  <span class="gh-share-label">Share:</span>
  <a href="https://twitter.com/intent/tweet?text={{encode title}}&url={{url absolute="true"}}" target="_blank" rel="noopener noreferrer">X</a>
  <span>·</span>
  <a href="https://www.linkedin.com/sharing/share-offsite/?url={{url absolute="true"}}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  <span>·</span>
  <a href="https://www.facebook.com/sharer/sharer.php?u={{url absolute="true"}}" target="_blank" rel="noopener noreferrer">Facebook</a>
  ${p.showWhatsapp ? `<span>·</span>\n  <a href="https://api.whatsapp.com/send?text={{encode title}}%20{{url absolute="true"}}" target="_blank" rel="noopener noreferrer">WhatsApp</a>` : ""}
  <span>·</span>
  <a href="#/share" class="gh-share-more-btn">${shareIconSvg} <span>More (#/share)</span></a>
</div>`;
  }

  // 2. SOCIAL GRID
  if (p.layout === "social-grid") {
    return `<div class="gh-share-grid ${alignClass}"${styleAttr}>
  <a href="#/share" class="gh-share-grid-tile gh-share-grid-ghost">
    ${shareIconSvg}
    <span>${p.buttonText || "Ghost Share"}</span>
  </a>
  <a href="https://twitter.com/intent/tweet?text={{encode title}}&url={{url absolute="true"}}" target="_blank" rel="noopener noreferrer" class="gh-share-grid-tile gh-share-grid-x">
    ${xIcon}
    <span>Post</span>
  </a>
  <a href="https://www.linkedin.com/sharing/share-offsite/?url={{url absolute="true"}}" target="_blank" rel="noopener noreferrer" class="gh-share-grid-tile gh-share-grid-linkedin">
    ${linkedInIcon}
    <span>LinkedIn</span>
  </a>
  ${p.showWhatsapp ? `<a href="https://api.whatsapp.com/send?text={{encode title}}%20{{url absolute="true"}}" target="_blank" rel="noopener noreferrer" class="gh-share-grid-tile gh-share-grid-whatsapp">${whatsappIcon} <span>WhatsApp</span></a>` : ""}
  ${p.showCopyLink ? `<a href="#/share" class="gh-share-grid-tile gh-share-grid-copy">${copyLinkIcon} <span>Copy Link</span></a>` : ""}
</div>`;
  }

  // 3. EDITORIAL CARD
  if (p.layout === "editorial-card") {
    return `<div class="gh-share-card ${alignClass}"${styleAttr}>
  <div class="gh-share-card-eyebrow">
    ${sparkleIcon}
    <span>Pass it forward</span>
  </div>
  <h4 class="gh-share-card-title">${p.cardTitle || "Share this article"}</h4>
  <p class="gh-share-card-subtitle">${p.cardSubtitle || "If you found this piece insightful, pass it along to your network."}</p>
  <div class="gh-share-card-actions">
    ${primaryButton}
    ${p.showDirectLinks ? directLinks : ""}
  </div>
  ${p.showCopyLink ? `
  <div class="gh-share-card-copybox">
    <span>{{url absolute="true"}}</span>
    <a href="#/share">${copyLinkIcon} <span>Copy Link</span></a>
  </div>` : ""}
</div>`;
  }

  // 4. FLOATING DOCK
  if (p.layout === "floating-dock") {
    return `<div class="gh-share-dock-wrapper ${alignClass}"${styleAttr}>
  <div class="gh-share-dock">
    ${primaryButton}
    ${p.showDirectLinks ? directLinks : ""}
  </div>
</div>`;
  }

  // 5. PILL BAR (Default)
  return `<div class="gh-share-wrapper ${alignClass}"${styleAttr}>
  ${primaryButton}
  ${p.showDirectLinks ? directLinks : ""}
</div>`;
};
