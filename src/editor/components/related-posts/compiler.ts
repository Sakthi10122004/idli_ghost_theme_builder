import { BuilderBlock } from "@/types/theme";
import { resolveRelatedPostsProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveRelatedPostsProps(block.props);
  const styles = block.styles || {};
  const marginBottom = (styles.marginBottom as string) || "";
  const wrapperId = `related-${block.id}`;
  const styleAttr = marginBottom ? ` style="margin-bottom: ${marginBottom};"` : "";
  const limit = Math.min(Math.max(1, p.count), 12);

  const imageMarkup = p.showImage
    ? `\n          {{#if feature_image}}
          <a href="{{url}}" class="gh-related-image">
            <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
          </a>
          {{/if}}`
    : "";

  const excerptMarkup = p.showExcerpt
    ? `\n            <p class="gh-related-excerpt">{{#if custom_excerpt}}{{custom_excerpt}}{{else}}{{excerpt words="18"}}{{/if}}</p>`
    : "";

  return `<style>
  #${wrapperId} {
    width: 100%;
    max-width: var(--container-width, 1200px);
    margin-left: auto;
    margin-right: auto;
    padding: 3rem 1.5rem;
    box-sizing: border-box;
  }
  #${wrapperId} .gh-related-heading {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    margin: 0 0 1.5rem 0;
    letter-spacing: -0.015em;
  }
  #${wrapperId} .gh-related-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  @media (min-width: 640px) {
    #${wrapperId} .gh-related-grid {
      grid-template-columns: repeat(${Math.min(p.count, 2)}, 1fr);
    }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .gh-related-grid {
      grid-template-columns: repeat(${Math.min(p.count, 3)}, 1fr);
    }
  }
  #${wrapperId} .gh-related-card {
    background-color: var(--color-bg, #ffffff);
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
  }
  #${wrapperId} .gh-related-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  #${wrapperId} .gh-related-image {
    aspect-ratio: 16 / 9;
    background-color: var(--color-canvas-soft, #f5f5f5);
    overflow: hidden;
    width: 100%;
    display: block;
  }
  #${wrapperId} .gh-related-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
  #${wrapperId} .gh-related-card:hover .gh-related-image img {
    transform: scale(1.03);
  }
  #${wrapperId} .gh-related-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  #${wrapperId} .gh-related-tag {
    font-size: 0.625rem;
    font-family: var(--font-mono, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    color: var(--color-primary, #0070f3);
    margin-bottom: 0.25rem;
  }
  #${wrapperId} .gh-related-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-fg, #171717);
    margin: 0;
    line-height: 1.35;
  }
  #${wrapperId} .gh-related-title a {
    color: inherit;
    text-decoration: none;
  }
  #${wrapperId} .gh-related-title a:hover {
    color: var(--color-primary, #0070f3);
  }
  #${wrapperId} .gh-related-excerpt {
    font-size: 0.75rem;
    color: var(--color-muted, #737373);
    line-height: 1.5;
    margin: 0.5rem 0 0 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  @media (max-width: 640px) {
    #${wrapperId} {
      padding: 2rem 1rem;
    }
  }
  html.dark #${wrapperId} .gh-related-card,
  html.dark-mode #${wrapperId} .gh-related-card {
    background-color: var(--color-bg, #111111);
    border-color: var(--color-hairline, #333333);
  }
</style>
{{#get "posts" filter="tags:{{primary_tag.slug}}+id:-{{id}}" limit="${limit}" as |related|}}
  {{#if related}}
  <section id="${wrapperId}" class="gh-related-posts"${styleAttr}>
    <h3 class="gh-related-heading">${p.heading}</h3>
    <div class="gh-related-grid">
      {{#foreach related}}
        <article class="gh-related-card">${imageMarkup}
          <div class="gh-related-content">
            {{#if primary_tag}}<span class="gh-related-tag">{{primary_tag.name}}</span>{{/if}}
            <h4 class="gh-related-title"><a href="{{url}}">{{title}}</a></h4>${excerptMarkup}
          </div>
        </article>
      {{/foreach}}
    </div>
  </section>
  {{/if}}
{{/get}}`;

};
