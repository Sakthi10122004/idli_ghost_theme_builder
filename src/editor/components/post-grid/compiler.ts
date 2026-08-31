import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const p = block.props || {};
  const general = p.general || {};
  const postCard = p.postCard || {};
  const button = p.button || {};
  const appearance = p.appearance || {};
  const advanced = p.advanced || {};

  const spacing = p.spacing || {};

  const limit = general.limit || 3;
  const columns = general.columns || 3;
  const layoutStyle = general.layoutStyle || "grid";

  const showFeatureImage = postCard.showFeatureImage ?? true;
  const showPrimaryTag = postCard.showPrimaryTag ?? true;
  const showExcerpt = postCard.showExcerpt ?? true;

  const source = general.source || "routes";
  let getHelperStart = "";
  let getHelperEnd = "";

  if (source === "featured") {
    getHelperStart = `{{#get "posts" filter="featured:true" limit="${limit}" include="tags,authors"}}`;
    getHelperEnd = `{{/get}}`;
  } else if (source === "tag" && general.tag) {
    getHelperStart = `{{#get "posts" filter="tag:${general.tag}" limit="${limit}" include="tags,authors"}}`;
    getHelperEnd = `{{/get}}`;
  } else if (source === "custom") {
    const filterString = p.manualFilter || "all";
    getHelperStart = `{{#get "posts" filter="${filterString}" limit="${limit}" include="tags,authors"}}`;
    getHelperEnd = `{{/get}}`;
  } else if (source === "related") {
    getHelperStart = `{{#get "posts" filter="tags:[{{post.tags[*].slug}}]+id:-{{post.id}}" limit="${limit}" include="tags,authors"}}`;
    getHelperEnd = `{{/get}}`;
  }

  const gridTemplate = layoutStyle === "list" 
    ? "grid-template-columns: 1fr;" 
    : `grid-template-columns: repeat(auto-fit, minmax(calc(100% / ${columns} - 2rem), 1fr));`;

  const isMagazine = layoutStyle === "magazine";

  const getPostCardInner = (isFeature: boolean) => `
    <a class="gh-post-card-link" href="{{url}}">
      ${showFeatureImage ? `
      {{#if feature_image}}
      <div class="gh-post-card-image ${isFeature ? 'gh-post-card-image-feature' : 'gh-post-card-image-list'}">
        <img srcset="{{img_url feature_image size="s"}} 300w,
                     {{img_url feature_image size="m"}} 600w,
                     {{img_url feature_image size="l"}} 1000w,
                     {{img_url feature_image size="xl"}} 2000w"
             sizes="(max-width: 1000px) 400px, 800px"
             src="{{img_url feature_image size="m"}}"
             alt="{{title}}"
             loading="lazy"
        />
      </div>
      {{/if}}
      ` : ''}
      <div class="gh-post-card-content">
        ${showPrimaryTag ? `
        {{#if primary_tag}}
          <span class="gh-post-card-tag">{{primary_tag.name}}</span>
        {{/if}}
        ` : ''}
        <h3 class="gh-post-card-title ${isFeature ? 'gh-post-card-title-feature' : 'gh-post-card-title-list'}">{{title}}</h3>
        ${showExcerpt ? `
        <p class="gh-post-card-excerpt ${!isFeature ? 'gh-post-card-excerpt-list' : ''}">{{excerpt words="${isFeature ? '40' : '20'}"}}</p>
        ` : ''}
      </div>
    </a>
  `;

  return `<style>
  #post-grid-${block.id} .post-grid-title {
    font-size: 2rem;
    font-family: var(--font-heading);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-ink);
    margin: 0 0 2rem 0;
    text-align: center;
  }
  #post-grid-${block.id} .post-feed {
    display: grid;
    ${gridTemplate}
    gap: 2rem;
  }
  #post-grid-${block.id} .magazine-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  @media (min-width: 992px) {
    #post-grid-${block.id} .magazine-layout {
      grid-template-columns: 7fr 5fr;
      gap: 3rem;
    }
  }
  #post-grid-${block.id} .magazine-list-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  #post-grid-${block.id} .gh-post-card {
    display: flex;
    flex-direction: column;
    background: ${appearance.backgroundColor || "var(--color-bg)"};
    color: ${appearance.textColor || "var(--color-ink)"};
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.2s;
  }
  #post-grid-${block.id} .magazine-list-item {
    flex-direction: row;
    gap: 1rem;
    background: ${appearance.backgroundColor || "var(--color-bg)"};
    color: ${appearance.textColor || "var(--color-ink)"};
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.2s;
  }
  #post-grid-${block.id} .magazine-list-item .gh-post-card-link {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  #post-grid-${block.id} .gh-post-card:hover, #post-grid-${block.id} .magazine-list-item:hover {
    transform: translateY(-4px);
  }
  #post-grid-${block.id} .gh-post-card-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }
  #post-grid-${block.id} .gh-post-card-image {
    width: 100%;
    overflow: hidden;
  }
  #post-grid-${block.id} .gh-post-card-image-feature {
    aspect-ratio: 16 / 9;
  }
  #post-grid-${block.id} .gh-post-card-image-list {
    width: 120px;
    height: 120px;
    min-width: 120px;
    flex-shrink: 0;
  }
  #post-grid-${block.id} .gh-post-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #post-grid-${block.id} .gh-post-card-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1.5rem;
    justify-content: center;
  }
  #post-grid-${block.id} .magazine-list-item .gh-post-card-content {
    padding: 1rem;
    padding-left: 0;
  }
  #post-grid-${block.id} .gh-post-card-tag {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    color: ${appearance.accentColor || "var(--color-primary)"};
    margin-bottom: 0.5rem;
  }
  #post-grid-${block.id} .gh-post-card-title {
    font-family: var(--font-heading);
    margin: 0 0 0.5rem 0;
  }
  #post-grid-${block.id} .gh-post-card-title-feature {
    font-size: 1.75rem;
    line-height: 1.2;
  }
  #post-grid-${block.id} .gh-post-card-title-list {
    font-size: 1.125rem;
    line-height: 1.3;
  }
  #post-grid-${block.id} .gh-post-card-excerpt {
    font-size: 0.95rem;
    opacity: 0.8;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
    flex-grow: 1;
  }
  #post-grid-${block.id} .gh-post-card-excerpt-list {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0;
  }
  #post-grid-${block.id} .post-grid-button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }
  #post-grid-${block.id} .post-grid-button {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: opacity 0.2s;
    background: ${appearance.accentColor || "var(--color-primary)"};
    color: #ffffff;
  }
  #post-grid-${block.id} .post-grid-button:hover {
    opacity: 0.9;
  }
</style>
<div id="${advanced.htmlAnchor ? advanced.htmlAnchor : `post-grid-${block.id}`}" class="post-feed-wrapper outer" style="padding-top: ${spacing.paddingTop || '4rem'}; padding-bottom: ${spacing.paddingBottom || '4rem'};">
  <div class="inner" style="max-width: ${appearance.sectionWidth === 'wide' ? '1200px' : appearance.sectionWidth === 'narrow' ? '800px' : '100%'}">
    ${p.title ? `<h2 class="post-grid-title">${p.title}</h2>` : ''}
    ${getHelperStart}
    <div id="post-grid-${block.id}">
      ${isMagazine ? `
      <div class="magazine-layout">
        <div class="magazine-feature-col">
          {{#foreach posts limit="1"}}
          <article class="gh-post-card {{post_class}}">
            ${getPostCardInner(true)}
          </article>
          {{/foreach}}
        </div>
        <div class="magazine-list-col">
          {{#foreach posts from="2"}}
          <article class="magazine-list-item {{post_class}}">
            ${getPostCardInner(false)}
          </article>
          {{/foreach}}
        </div>
      </div>
      ` : `
      <div class="post-feed">
        {{#foreach posts}}
        <article class="gh-post-card {{post_class}}">
          ${getPostCardInner(false)}
        </article>
        {{/foreach}}
      </div>
      `}
    </div>
    ${getHelperEnd}
    ${button.label ? `
    <div class="post-grid-button-wrapper">
      <a href="${button.url || "#"}" class="post-grid-button">${button.label}</a>
    </div>
    ` : ''}
  </div>
</div>`;
};