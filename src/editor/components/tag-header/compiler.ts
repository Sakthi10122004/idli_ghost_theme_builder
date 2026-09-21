import { BuilderBlock } from "@/types/theme";
import { resolveTagHeaderProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveTagHeaderProps(block.props);
  const styles = block.styles || {};
  const marginBottom = (styles.marginBottom as string) || "";
  const wrapperId = `tag-header-${block.id}`;
  const styleAttr = marginBottom ? ` style="margin-bottom: ${marginBottom};"` : "";

  const imageMarkup = p.showFeatureImage
    ? `  {{#if feature_image}}
  <div class="gh-tag-header-image" style="background-image: url({{img_url feature_image size="xl"}})"></div>
  {{/if}}`
    : "";

  const descMarkup = p.showDescription
    ? `  {{#if description}}<p class="gh-tag-header-description">{{description}}</p>{{/if}}`
    : "";

  const countMarkup = p.showCount
    ? `  <span class="gh-tag-header-count">{{count.posts}} post{{#unless (eq count.posts 1)}}s{{/unless}}</span>`
    : "";

  return `<style>
  #${wrapperId} {
    text-align: center;
    padding: 4rem 1.5rem 2.5rem 1.5rem;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
  }
  #${wrapperId} .gh-tag-header-image {
    width: 100%;
    height: 240px;
    background-size: cover;
    background-position: center;
    border-radius: var(--radius-md, 8px);
    margin-bottom: 2rem;
    border: 1px solid var(--color-hairline, #ebebeb);
  }
  #${wrapperId} .gh-tag-header-title {
    font-family: var(--font-heading);
    font-size: 2.75rem;
    font-weight: 700;
    margin: 0 0 0.75rem 0;
    letter-spacing: -0.025em;
    color: var(--color-fg, #171717);
  }
  #${wrapperId} .gh-tag-header-description {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-muted, #737373);
    max-width: 600px;
    margin: 0 auto 1.25rem auto;
  }
  #${wrapperId} .gh-tag-header-count {
    display: inline-block;
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #737373);
    background: var(--color-canvas-soft, #fafafa);
    border: 1px solid var(--color-hairline, #ebebeb);
    padding: 0.25rem 0.65rem;
    border-radius: 9999px;
  }
  @media (max-width: 640px) {
    #${wrapperId} {
      padding: 2.5rem 1rem 1.5rem 1rem;
    }
    #${wrapperId} .gh-tag-header-title {
      font-size: 2rem;
    }
  }
</style>
{{#tag}}
<header id="${wrapperId}" class="gh-tag-header"${styleAttr}>
${[imageMarkup, `  <h1 class="gh-tag-header-title">{{name}}</h1>`, descMarkup, countMarkup].filter(Boolean).join("\n")}
</header>
{{/tag}}`;
};
