import { BuilderBlock } from "@/types/theme";
import { resolvePostContentProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolvePostContentProps(block.props);

  const tagSection = p.showPrimaryTag
    ? `    {{#if primary_tag}}
    <section class="article-tag">
      ${p.showFeaturedBadge ? '{{#if featured}}<span class="article-featured-badge">Featured</span>{{/if}}' : ""}
      <a href="{{primary_tag.url}}">{{primary_tag.name}}</a>
    </section>
    {{else}}
      ${p.showFeaturedBadge ? '{{#if featured}}<section class="article-tag"><span class="article-featured-badge">Featured</span></section>{{/if}}' : ""}
    {{/if}}`
    : p.showFeaturedBadge
    ? `    {{#if featured}}<section class="article-tag"><span class="article-featured-badge">Featured</span></section>{{/if}}`
    : "";

  const excerptSection = p.showExcerpt
    ? `    {{#if custom_excerpt}}
    <p class="article-excerpt">{{custom_excerpt}}</p>
    {{/if}}`
    : "";

  const authorAvatarMarkup = p.showAuthorAvatar
    ? `          <ul class="author-list">
            {{#foreach authors}}
            <li class="author-list-item">
              {{#if profile_image}}
              <a href="{{url}}" class="author-avatar" aria-label="{{name}}">
                <img class="author-profile-image" src="{{img_url profile_image size="xs"}}" alt="{{name}}" />
              </a>
              {{else}}
              <a href="{{url}}" class="author-avatar author-profile-image" aria-label="{{name}}">
                <span class="author-initial">{{name}}</span>
              </a>
              {{/if}}
            </li>
            {{/foreach}}
          </ul>`
    : "";

  const dateMarkup = p.showPublishDate
    ? `<time class="byline-meta-date" datetime="{{date format="YYYY-MM-DD"}}">{{date}}</time>`
    : "";

  const readingTimeMarkup = p.showReadingTime
    ? `<span class="byline-reading-time"><span class="bull">&bull;</span> {{reading_time}}</span>`
    : "";

  const bylineSection = p.showByline
    ? `    <div class="article-byline">
      <section class="article-byline-content">
${authorAvatarMarkup}
        <div class="article-byline-meta">
          <h4 class="author-name">{{authors}}</h4>
          <div class="byline-meta-content">
            ${dateMarkup}
            ${readingTimeMarkup}
          </div>
        </div>
      </section>
    </div>`
    : "";

  const featureImageSection = p.showFeatureImage
    ? `    {{#if feature_image}}
    <figure class="article-image">
      <img
        srcset="{{img_url feature_image size="s"}} 300w,
                {{img_url feature_image size="m"}} 600w,
                {{img_url feature_image size="l"}} 1000w,
                {{img_url feature_image size="xl"}} 2000w"
        sizes="(min-width: 1400px) 1400px, 92vw"
        src="{{img_url feature_image size="xl"}}"
        alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}"
      />
      {{#if feature_image_caption}}
        <figcaption>{{feature_image_caption}}</figcaption>
      {{/if}}
    </figure>
    {{/if}}`
    : "";

  const widthClass =
    p.contentWidth === "narrow"
      ? "gh-content-narrow"
      : p.contentWidth === "wide"
      ? "gh-content-wide"
      : "";

  return `<article class="article {{post_class}}">
  <header class="article-header gh-canvas">
${tagSection ? tagSection + "\n" : ""}    <h1 class="article-title">{{title}}</h1>
${excerptSection ? excerptSection + "\n" : ""}${bylineSection ? bylineSection + "\n" : ""}${featureImageSection ? featureImageSection + "\n" : ""}  </header>

  <section class="gh-content gh-canvas ${widthClass}">
    {{content}}
  </section>
</article>`;
};