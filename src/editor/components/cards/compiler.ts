import { BuilderBlock } from "@/types/theme";
import { resolveCardsProps, CardItem } from "./schema";
import { getBackgroundCSS } from "../shared/background";
import { escapeHtml, escapeUrl } from "../shared/escape";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveCardsProps(block.props);
  const items: CardItem[] = p.items || [];
  const columns = Math.min(Math.max(2, p.columns || 3), 4);
  const cardStyle = p.cardStyle || "bordered";
  const wrapperId = `cards-${block.id}`;
  const styles = block.styles || {};
  const bgCss = getBackgroundCSS(styles);

  const headerHtml = p.heading || p.subheading ? `
  <div class="cards-header">
    ${p.heading ? `<h2 class="cards-title">${escapeHtml(p.heading)}</h2>` : ""}
    ${p.subheading ? `<p class="cards-subtitle">${escapeHtml(p.subheading)}</p>` : ""}
  </div>` : "";

  const renderCard = (card: CardItem) => {
    const tagHtml = card.tag ? `<span class="card-tag">${escapeHtml(card.tag)}</span>` : "";
    const imageHtml = card.imageUrl ? `
      <div class="card-image-wrap">
        <img src="${escapeUrl(card.imageUrl)}" alt="${escapeHtml(card.title)}" class="card-image" loading="lazy" />
      </div>` : "";
    const linkHtml = card.linkText ? `
      <a href="${card.linkUrl ? escapeUrl(card.linkUrl) : "#"}" class="card-link">
        ${escapeHtml(card.linkText)} &rarr;
      </a>` : "";

    return `
      <div class="card-item card-${cardStyle}">
        ${imageHtml}
        <div class="card-body">
          ${tagHtml}
          <h4 class="card-title">${escapeHtml(card.title)}</h4>
          <p class="card-desc">${escapeHtml(card.description)}</p>
          ${linkHtml}
        </div>
      </div>
    `;
  };

  const cardsHtml = items.map(renderCard).join("\n");

  return `<style>
  #${wrapperId} {
    ${bgCss}
    padding-top: ${(styles.paddingTop as string) || "4rem"};
    padding-bottom: ${(styles.paddingBottom as string) || "4rem"};
    width: 100%;
    box-sizing: border-box;
  }
  #${wrapperId} .cards-inner {
    max-width: var(--container-width, 1200px);
    margin: 0 auto;
    padding: 0 1.5rem;
    box-sizing: border-box;
  }
  #${wrapperId} .cards-header {
    text-align: center;
    max-width: 48rem;
    margin: 0 auto 3rem auto;
  }
  #${wrapperId} .cards-title {
    font-family: var(--gh-font-heading, inherit);
    font-size: 2.25rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: var(--color-ink, #171717);
    margin: 0;
  }
  #${wrapperId} .cards-subtitle {
    margin-top: 0.75rem;
    font-family: var(--gh-font-body, inherit);
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-mute, #666666);
    margin-bottom: 0;
  }
  #${wrapperId} .cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 640px) {
    #${wrapperId} .cards-grid {
      grid-template-columns: repeat(${Math.min(columns, 2)}, 1fr);
    }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .cards-grid {
      grid-template-columns: repeat(${columns}, 1fr);
    }
  }
  #${wrapperId} .card-item {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-sizing: border-box;
  }
  #${wrapperId} .card-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
  #${wrapperId} .card-bordered {
    background-color: var(--color-bg, #ffffff);
    border: 1px solid var(--color-hairline, #ebebeb);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  }
  #${wrapperId} .card-soft {
    background-color: var(--color-canvas-soft, #fafafa);
    border: 1px solid var(--color-hairline, #ebebeb);
  }
  #${wrapperId} .card-elevated {
    background-color: var(--color-bg, #ffffff);
    border: 1px solid var(--color-hairline, #f0f0f0);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
  #${wrapperId} .card-minimal {
    background-color: transparent;
    border: 1px solid var(--color-hairline, #ebebeb);
  }
  #${wrapperId} .card-image-wrap {
    width: 100%;
    height: 180px;
    overflow: hidden;
    background-color: var(--color-canvas-soft, #fafafa);
  }
  #${wrapperId} .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }
  #${wrapperId} .card-item:hover .card-image {
    transform: scale(1.03);
  }
  #${wrapperId} .card-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  #${wrapperId} .card-tag {
    display: inline-block;
    font-size: 0.6875rem;
    font-family: var(--font-mono, monospace);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-primary, #171717);
    margin-bottom: 0.5rem;
  }
  #${wrapperId} .card-title {
    font-family: var(--gh-font-heading, inherit);
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.015em;
    color: var(--color-ink, #171717);
    margin: 0 0 0.5rem 0;
  }
  #${wrapperId} .card-desc {
    font-family: var(--gh-font-body, inherit);
    font-size: 0.875rem;
    line-height: 1.55;
    color: var(--color-mute, #666666);
    margin: 0 0 1rem 0;
    flex: 1;
  }
  #${wrapperId} .card-link {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary, #171717);
    text-decoration: none;
    transition: opacity 0.15s;
    margin-top: auto;
  }
  #${wrapperId} .card-link:hover {
    opacity: 0.75;
  }
  html.dark #${wrapperId} .cards-title {
    color: var(--color-fg, #ffffff);
  }
  html.dark #${wrapperId} .cards-subtitle {
    color: var(--color-muted, #a3a3a3);
  }
  html.dark #${wrapperId} .card-bordered,
  html.dark #${wrapperId} .card-soft,
  html.dark #${wrapperId} .card-elevated {
    background-color: var(--color-bg, #141414);
    border-color: var(--color-hairline, #262626);
  }
  html.dark #${wrapperId} .card-title {
    color: var(--color-fg, #ffffff);
  }
  html.dark #${wrapperId} .card-desc {
    color: var(--color-muted, #a3a3a3);
  }
  html.dark #${wrapperId} .card-link {
    color: var(--color-primary, #ffffff);
  }
</style>
<div id="${wrapperId}" class="cards-section ${styles.backgroundType === "mesh" ? "mesh-glow" : ""}">
  <div class="cards-inner">
    ${headerHtml}
    <div class="cards-grid">
      ${cardsHtml}
    </div>
  </div>
</div>`;
};
