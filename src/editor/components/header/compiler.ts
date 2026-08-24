import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const { logoText = "THE BLOG", logoImageUrl, showCta = false, ctaLabel = "Subscribe", ctaHref = "#" } = block.props;
  return `<header id="gh-head" class="gh-head outer">
  <div class="gh-head-inner inner">
    <div class="gh-head-brand">
      <a class="gh-head-logo${logoImageUrl ? "" : " no-image"}" href="{{@site.url}}">
        ${logoImageUrl ? `<img src="${logoImageUrl}" alt="${logoText}">` : logoText}
      </a>
      <button class="gh-burger"></button>
    </div>
    <nav class="gh-head-menu">
      {{navigation}}
    </nav>
    <div class="gh-head-actions">
      <div class="gh-head-members">
        ${showCta ? `<a class="gh-head-button" href="${ctaHref}">${ctaLabel}</a>` : ""}
      </div>
    </div>
  </div>
</header>`;
};