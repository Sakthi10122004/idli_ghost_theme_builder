import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const p = block.props || {};
  const general = p.general || {};
  const postCard = p.postCard || {};
  const button = p.button || {};
  const appearance = p.appearance || {};
  const styles = block.styles || {};
  const advanced = p.advanced || {};

  const spacing = p.spacing || {};

  const limit = general.limit || 3;
  const columns = general.columns || 3;
  const layoutStyle = general.layoutStyle || "grid";

  const getBackgroundCSS = (styles: any, appearance: any): string => {
    const bgType = styles?.backgroundType || "solid";
    const defaultBg = appearance?.backgroundColor || "#ffffff";

    switch (bgType) {
      case "solid":
        return `background-color: ${defaultBg};`;
      case "linear": {
        const c1 = styles?.gradientColor1 || "#000000";
        const c2 = styles?.gradientColor2 || "#333333";
        const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
        return `background-image: linear-gradient(${angle}deg, ${c1}, ${c2}); background-color: ${defaultBg};`;
      }
      case "radial": {
        const c1 = styles?.gradientColor1 || "#000000";
        const c2 = styles?.gradientColor2 || "#333333";
        const pos = styles?.gradientPosition || "center";
        return `background-image: radial-gradient(circle at ${pos}, ${c1}, ${c2}); background-color: ${defaultBg};`;
      }
      case "mesh": {
        const m1 = styles?.meshColor1 || "#ff0080";
        const m2 = styles?.meshColor2 || "#7928ca";
        const m3 = styles?.meshColor3 || "#0070f3";
        return `
          background-color: ${defaultBg};
          background-image: 
            radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
            radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
            radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%);
        `;
      }
      case "pattern": {
        const pType = styles?.patternType || "dots";
        const pColor = styles?.patternColor || "#000000";
        if (pType === "dots") {
          return `
            background-color: ${defaultBg};
            background-image: radial-gradient(${pColor} 1px, transparent 1px);
            background-size: 20px 20px;
          `;
        } else if (pType === "lines") {
          return `
            background-color: ${defaultBg};
            background-image: repeating-linear-gradient(45deg, ${pColor} 0, ${pColor} 1px, transparent 1px, transparent 10px);
          `;
        } else if (pType === "noise") {
          return `
            background-color: ${defaultBg};
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          `;
        }
        return `background-color: ${defaultBg};`;
      }
      case "image": {
        const url = styles?.bgImageUrl || "";
        const overlay = styles?.bgOverlayColor || "#000000";
        const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
        const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
        return url 
          ? `background-color: ${defaultBg}; background-image: linear-gradient(to right, ${overlay}${hexOpacity}, ${overlay}${hexOpacity}), url('${url}'); background-size: cover; background-position: center;`
          : `background-color: ${defaultBg};`;
      }
      default:
        return `background-color: ${defaultBg};`;
    }
  };

  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = advanced.htmlAnchor || `post-grid-${block.id}`;

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
  #${wrapperId} .post-grid-title {
    font-size: 2rem;
    font-family: var(--font-heading);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-fg);
    margin: 0 0 2rem 0;
    text-align: center;
  }
  #${wrapperId} .post-feed {
    display: grid;
    ${gridTemplate}
    gap: 2rem;
  }
  #${wrapperId} .magazine-layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  @media (min-width: 992px) {
    #${wrapperId} .magazine-layout {
      grid-template-columns: 7fr 5fr;
      gap: 3rem;
    }
  }
  #${wrapperId} .magazine-list-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  #${wrapperId} .gh-post-card {
    display: flex;
    flex-direction: column;
    background: ${appearance.backgroundColor || "var(--color-bg)"};
    color: ${appearance.textColor || "var(--color-fg)"};
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.2s;
  }
  #${wrapperId} .magazine-list-item {
    flex-direction: row;
    gap: 1rem;
    background: ${appearance.backgroundColor || "var(--color-bg)"};
    color: ${appearance.textColor || "var(--color-fg)"};
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.2s;
  }
  #${wrapperId} .magazine-list-item .gh-post-card-link {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  #${wrapperId} .gh-post-card:hover, #${wrapperId} .magazine-list-item:hover {
    transform: translateY(-4px);
  }
  #${wrapperId} .gh-post-card-link {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: inherit;
    text-decoration: none;
  }
  #${wrapperId} .gh-post-card-image {
    width: 100%;
    overflow: hidden;
  }
  #${wrapperId} .gh-post-card-image-feature {
    aspect-ratio: 16 / 9;
  }
  #${wrapperId} .gh-post-card-image-list {
    width: 120px;
    height: 120px;
    min-width: 120px;
    flex-shrink: 0;
  }
  #${wrapperId} .gh-post-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .gh-post-card-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1.5rem;
    justify-content: center;
  }
  #${wrapperId} .magazine-list-item .gh-post-card-content {
    padding: 1rem;
    padding-left: 0;
  }
  #${wrapperId} .gh-post-card-tag {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    color: ${appearance.accentColor || "var(--color-primary)"};
    margin-bottom: 0.5rem;
  }
  #${wrapperId} .gh-post-card-title {
    font-family: var(--font-heading);
    margin: 0 0 0.5rem 0;
  }
  #${wrapperId} .gh-post-card-title-feature {
    font-size: 1.75rem;
    line-height: 1.2;
  }
  #${wrapperId} .gh-post-card-title-list {
    font-size: 1.125rem;
    line-height: 1.3;
  }
  #${wrapperId} .gh-post-card-excerpt {
    font-size: 0.95rem;
    opacity: 0.8;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
    flex-grow: 1;
  }
  #${wrapperId} .gh-post-card-excerpt-list {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 0;
  }
  #${wrapperId} .post-grid-button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }
  #${wrapperId} .post-grid-button {
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
  #${wrapperId}:hover .post-grid-button {
    opacity: 0.9;
  }
</style>
<div id="${wrapperId}" class="post-feed-wrapper outer ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}" style="${bgCss} padding-top: ${spacing.paddingTop || '4rem'}; padding-bottom: ${spacing.paddingBottom || '4rem'};">
  <div class="inner" style="max-width: ${appearance.sectionWidth === 'wide' ? '1200px' : appearance.sectionWidth === 'narrow' ? '800px' : '100%'}">
    ${p.title ? `<h2 class="post-grid-title">${p.title}</h2>` : ''}
    ${getHelperStart}
    <div class="post-grid-inner-container">
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