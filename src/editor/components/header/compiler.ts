import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const { logoText = "THE BLOG", logoImageUrl, showCta = false, ctaLabel = "Subscribe", ctaHref = "#" } = block.props;
  return `<div class="site-header-wrapper">
  <header class="site-header flex items-center justify-between py-2 px-6">
    <div class="site-title font-sans font-bold">
      ${logoImageUrl ? `
        <a href="{{@site.url}}"><img src="${logoImageUrl}" alt="${logoText}" style="height: 24px; width: auto; object-fit: contain;" /></a>
      ` : `
        <a href="{{@site.url}}" style="text-decoration: none; color: inherit; text-transform: uppercase;">${logoText}</a>
      `}
    </div>
    <div class="flex items-center gap-6">
      <nav class="site-nav flex gap-5 text-xs font-medium">
        {{navigation}}
      </nav>
      ${showCta ? `
      <a href="${ctaHref}" class="btn btn-primary" style="padding: 0.35rem 1rem; border-radius: 4px; font-size: 11px;">${ctaLabel}</a>
      ` : ""}
    </div>
  </header>
</div>`;
};