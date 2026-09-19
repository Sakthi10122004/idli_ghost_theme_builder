import { BuilderBlock } from "@/types/theme";
import { resolvePostNavigationProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolvePostNavigationProps(block.props);
  const styles = block.styles || {};
  const marginBottom = (styles.marginBottom as string) || "";
  const wrapperId = `post-nav-${block.id}`;
  const styleAttr = marginBottom ? ` style="margin-bottom: ${marginBottom};"` : "";

  const prevImageMarkup = p.showImage
    ? `\n      {{#if feature_image}}
      <div class="gh-post-nav-thumb">
        <img src="{{img_url feature_image size="xs"}}" alt="{{title}}" loading="lazy" />
      </div>
      {{/if}}`
    : "";

  const nextImageMarkup = p.showImage
    ? `\n      {{#if feature_image}}
      <div class="gh-post-nav-thumb">
        <img src="{{img_url feature_image size="xs"}}" alt="{{title}}" loading="lazy" />
      </div>
      {{/if}}`
    : "";

  const prevExcerptMarkup = p.showExcerpt
    ? `\n        <p class="gh-post-nav-excerpt">{{#if custom_excerpt}}{{custom_excerpt}}{{else}}{{excerpt words="12"}}{{/if}}</p>`
    : "";

  const nextExcerptMarkup = p.showExcerpt
    ? `\n        <p class="gh-post-nav-excerpt">{{#if custom_excerpt}}{{custom_excerpt}}{{else}}{{excerpt words="12"}}{{/if}}</p>`
    : "";

  return `<style>
  #${wrapperId} {
    width: 100%;
    max-width: var(--container-width, 1200px);
    margin-left: auto;
    margin-right: auto;
    padding: 2.5rem 1.5rem;
    border-top: 1px solid var(--color-hairline, #ebebeb);
    box-sizing: border-box;
  }
  @media (max-width: 640px) {
    #${wrapperId} {
      padding: 1.5rem 1rem;
    }
  }
  #${wrapperId} .gh-post-nav-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 768px) {
    #${wrapperId} .gh-post-nav-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    #${wrapperId} .gh-post-nav-next:only-child {
      grid-column: 2;
    }
  }
  #${wrapperId} .gh-post-nav-card {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    background-color: var(--color-bg, #ffffff);
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: var(--radius-md, 8px);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    box-sizing: border-box;
  }
  #${wrapperId} .gh-post-nav-card:hover {
    border-color: var(--color-primary, #171717);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  #${wrapperId} .gh-post-nav-next {
    flex-direction: row-reverse;
    text-align: right;
  }
  #${wrapperId} .gh-post-nav-thumb {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: var(--radius-sm, 4px);
    overflow: hidden;
    border: 1px solid var(--color-hairline, #ebebeb);
    flex-shrink: 0;
    background-color: var(--color-canvas-soft, #f5f5f5);
  }
  #${wrapperId} .gh-post-nav-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  #${wrapperId} .gh-post-nav-content {
    flex: 1;
    min-width: 0;
  }
  #${wrapperId} .gh-post-nav-label {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.625rem;
    font-family: var(--font-mono, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #737373);
    font-weight: 600;
  }
  #${wrapperId} .gh-post-nav-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-fg, #171717);
    margin: 0.25rem 0 0 0;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #${wrapperId} .gh-post-nav-excerpt {
    font-size: 0.6875rem;
    color: var(--color-muted, #737373);
    margin: 0.25rem 0 0 0;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  html.dark #${wrapperId} .gh-post-nav-card,
  html.dark-mode #${wrapperId} .gh-post-nav-card {
    background-color: var(--color-bg, #111111);
    border-color: var(--color-hairline, #333333);
  }
  html.dark #${wrapperId},
  html.dark-mode #${wrapperId} {
    border-top-color: var(--color-hairline, #333333);
  }
</style>
<nav id="${wrapperId}" class="gh-post-nav"${styleAttr}>
  <div class="gh-post-nav-grid">
    {{#prev_post}}
    <a href="{{url}}" class="gh-post-nav-card gh-post-nav-prev">${prevImageMarkup}
      <div class="gh-post-nav-content">
        <span class="gh-post-nav-label">&larr; Previous Post</span>
        <h4 class="gh-post-nav-title">{{title}}</h4>${prevExcerptMarkup}
      </div>
    </a>
    {{/prev_post}}
    {{#next_post}}
    <a href="{{url}}" class="gh-post-nav-card gh-post-nav-next">${nextImageMarkup}
      <div class="gh-post-nav-content">
        <span class="gh-post-nav-label">Next Post &rarr;</span>
        <h4 class="gh-post-nav-title">{{title}}</h4>${nextExcerptMarkup}
      </div>
    </a>
    {{/next_post}}
  </div>
</nav>`;
};
