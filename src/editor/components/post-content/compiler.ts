import { BuilderBlock } from "@/types/theme";
import { resolvePostContentProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolvePostContentProps(block.props);

  const tagMarkup = p.showTag
    ? `  {{#if primary_tag}}
  <a href="{{primary_tag.url}}" class="article-tag">{{primary_tag.name}}</a>
  {{/if}}`
    : "";

  const featuredFlagMarkup = p.showFeaturedFlag
    ? `  {{#if featured}}
  <span class="article-featured-flag">Featured</span>
  {{/if}}`
    : "";

  const excerptMarkup = p.showExcerpt
    ? `  {{#if custom_excerpt}}
  <p class="article-excerpt">{{custom_excerpt}}</p>
  {{/if}}`
    : "";

  const bylineMarkup = p.showByline
    ? `  <div class="article-byline">
    {{#foreach authors}}
      <img src="{{profile_image}}" alt="{{name}}" class="author-avatar-sm author-avatar" />
      <span class="author-name">{{name}}</span>{{#unless @last}}, {{/unless}}
    {{/foreach}}
    <time class="article-date" datetime="{{date format="YYYY-MM-DD"}}">{{date format="D MMMM, YYYY"}}</time>
    <span class="article-reading-time">{{reading_time}}</span>
  </div>`
    : "";

  const featureImageMarkup = p.showFeatureImage
    ? `  {{#if feature_image}}
    <figure class="article-image">
      <img src="{{img_url feature_image size="xl"}}" alt="{{title}}" />
    </figure>
  {{/if}}`
    : "";

  const widthClass =
    p.contentWidth === "narrow"
      ? "gh-content-narrow"
      : p.contentWidth === "wide"
      ? "gh-content-wide"
      : "";

  const headerParts = [
    tagMarkup,
    featuredFlagMarkup,
    `  <h1 class="article-title">{{title}}</h1>`,
    excerptMarkup,
    bylineMarkup,
    featureImageMarkup,
  ].filter(Boolean).join("\n");

  return `<article class="article {{post_class}}">
<header class="article-header gh-canvas">
${headerParts}
</header>
<section class="gh-content gh-canvas${widthClass ? ` ${widthClass}` : ""}">
  {{content}}
</section>
</article>`;
};