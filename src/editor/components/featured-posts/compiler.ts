import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const p = block.props || {};
  const layout = p.layout || "split";
  const limit = p.limit !== undefined ? p.limit : 3;
  const autoScroll = Boolean(p.autoScroll);
  const heading = p.heading !== undefined ? p.heading : (p.title || "Featured Articles");
  const description = p.description !== undefined ? p.description : "Hand-picked stories and top editorial selections from our writers.";
  const headingColor = p.headingColor || "var(--color-fg, #171717)";
  const descriptionColor = p.descriptionColor || "var(--color-muted, #666666)";
  const cardTitleColor = p.cardTitleColor || "var(--color-fg, #171717)";
  const cardTextColor = p.cardTextColor || "var(--color-muted, #4d4d4d)";
  const wrapperId = p.advanced?.htmlAnchor || `featured-posts-${block.id}`;

  let layoutMarkup = "";

  if (layout === "split") {
    layoutMarkup = `
    <div class="featured-posts-split">
      {{#get "posts" filter="featured:true" limit="${limit}"}}
      {{#foreach posts}}
        {{#if @first}}
          <article class="featured-post-main">
            <a class="featured-post-card-link" href="{{url}}">
              {{#if feature_image}}
                <div class="featured-post-image-main">
                  <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                </div>
              {{/if}}
              <div class="featured-post-content-main">
                {{#if primary_tag}}
                  <span class="featured-post-tag">{{primary_tag.name}}</span>
                {{/if}}
                <h3 class="featured-post-title-main">{{title}}</h3>
                {{#if excerpt}}
                  <p class="featured-post-excerpt-main">{{excerpt words="30"}}</p>
                {{/if}}
              </div>
            </a>
          </article>
          <div class="featured-posts-secondary-list">
        {{else}}
          <article class="featured-post-secondary">
            <a class="featured-post-secondary-link" href="{{url}}">
              {{#if feature_image}}
                <div class="featured-post-image-secondary">
                  <img src="{{img_url feature_image size="s"}}" alt="{{title}}" loading="lazy" />
                </div>
              {{/if}}
              <div class="featured-post-content-secondary">
                {{#if primary_tag}}
                  <span class="featured-post-tag">{{primary_tag.name}}</span>
                {{/if}}
                <h4 class="featured-post-title-secondary">{{title}}</h4>
              </div>
            </a>
          </article>
        {{/if}}
        {{#if @last}}
          </div>
        {{/if}}
      {{/foreach}}
      {{/get}}
    </div>`;
  } else if (layout === "grid") {
    layoutMarkup = `
    <div class="featured-posts-grid">
      {{#get "posts" filter="featured:true" limit="${limit}"}}
      {{#foreach posts}}
        <article class="featured-post-grid-card">
          <a class="featured-post-card-link" href="{{url}}">
            {{#if feature_image}}
              <div class="featured-post-image-wrapper">
                <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
              </div>
            {{/if}}
            <div class="featured-post-content">
              {{#if primary_tag}}
                <span class="featured-post-tag">{{primary_tag.name}}</span>
              {{/if}}
              <h3 class="featured-post-title">{{title}}</h3>
              {{#if excerpt}}
                <p class="featured-post-excerpt">{{excerpt words="20"}}</p>
              {{/if}}
            </div>
          </a>
        </article>
      {{/foreach}}
      {{/get}}
    </div>`;
  } else if (layout === "list") {
    layoutMarkup = `
    <div class="featured-posts-list">
      {{#get "posts" filter="featured:true" limit="${limit}"}}
      {{#foreach posts}}
        <article class="featured-post-list-card">
          <a class="featured-post-list-link" href="{{url}}">
            {{#if feature_image}}
              <div class="featured-post-list-image">
                <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
              </div>
            {{/if}}
            <div class="featured-post-list-content">
              {{#if primary_tag}}
                <span class="featured-post-tag">{{primary_tag.name}}</span>
              {{/if}}
              <h3 class="featured-post-title-list">{{title}}</h3>
              {{#if excerpt}}
                <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
              {{/if}}
            </div>
          </a>
        </article>
      {{/foreach}}
      {{/get}}
    </div>`;
  } else if (layout === "carousel") {
    if (autoScroll) {
      layoutMarkup = `
      <div class="featured-posts-carousel featured-posts-carousel-autoscroll">
        {{#get "posts" filter="featured:true" limit="${limit}" include="tags"}}
          <div class="carousel-track-container">
            <div class="carousel-track">
              {{#foreach posts}}
                <article class="featured-post-carousel-card">
                  <a class="featured-post-card-link" href="{{url}}">
                    {{#if feature_image}}
                      <div class="featured-post-image-wrapper">
                        <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                      </div>
                    {{/if}}
                    <div class="featured-post-content">
                      {{#if primary_tag}}
                        <span class="featured-post-tag">{{primary_tag.name}}</span>
                      {{/if}}
                      <h3 class="featured-post-title">{{title}}</h3>
                      {{#if excerpt}}
                        <p class="featured-post-excerpt">{{excerpt words="20"}}</p>
                      {{/if}}
                    </div>
                  </a>
                </article>
              {{/foreach}}
              {{#foreach posts}}
                <article class="featured-post-carousel-card">
                  <a class="featured-post-card-link" href="{{url}}">
                    {{#if feature_image}}
                      <div class="featured-post-image-wrapper">
                        <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                      </div>
                    {{/if}}
                    <div class="featured-post-content">
                      {{#if primary_tag}}
                        <span class="featured-post-tag">{{primary_tag.name}}</span>
                      {{/if}}
                      <h3 class="featured-post-title">{{title}}</h3>
                      {{#if excerpt}}
                        <p class="featured-post-excerpt">{{excerpt words="20"}}</p>
                      {{/if}}
                    </div>
                  </a>
                </article>
              {{/foreach}}
            </div>
          </div>
        {{/get}}
      </div>`;
    } else {
      layoutMarkup = `
      <div class="featured-posts-carousel">
        {{#get "posts" filter="featured:true" limit="${limit}"}}
        {{#foreach posts}}
          <article class="featured-post-carousel-card">
            <a class="featured-post-card-link" href="{{url}}">
              {{#if feature_image}}
                <div class="featured-post-image-wrapper">
                  <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                </div>
              {{/if}}
              <div class="featured-post-content">
                {{#if primary_tag}}
                  <span class="featured-post-tag">{{primary_tag.name}}</span>
                {{/if}}
                <h3 class="featured-post-title">{{title}}</h3>
                {{#if excerpt}}
                  <p class="featured-post-excerpt">{{excerpt words="20"}}</p>
                {{/if}}
              </div>
            </a>
          </article>
        {{/foreach}}
        {{/get}}
      </div>`;
    }
  } else if (layout === "bento") {
    layoutMarkup = `
    <div class="featured-posts-bento">
      {{#get "posts" filter="featured:true" limit="${limit}" include="authors,tags"}}
      {{#foreach posts}}
        <article class="featured-post-bento-card">
          <a class="featured-post-card-link" href="{{url}}">
            {{#if feature_image}}
              <div class="featured-post-bento-image">
                <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
              </div>
            {{/if}}
            <div class="featured-post-bento-content">
              <div class="featured-post-bento-meta">
                {{#if primary_author}}
                  {{#if primary_author.profile_image}}
                    <img class="featured-post-author-avatar" src="{{primary_author.profile_image}}" alt="{{primary_author.name}}" />
                  {{/if}}
                {{/if}}
                {{#if primary_tag}}
                  <span class="featured-post-tag">{{primary_tag.name}}</span>
                {{/if}}
                <span class="featured-post-date">{{date format="MMM D, YYYY"}}</span>
              </div>
              <h3 class="featured-post-bento-title">{{title}}</h3>
              {{#if excerpt}}
                <p class="featured-post-bento-excerpt">{{excerpt words="20"}}</p>
              {{/if}}
              <span class="featured-post-read-more">Read Full Article &rarr;</span>
            </div>
          </a>
        </article>
      {{/foreach}}
      {{/get}}
    </div>`;
  } else if (layout === "editorial") {
    layoutMarkup = `
    <div class="featured-posts-editorial">
      {{#get "posts" filter="featured:true" limit="${limit}" include="tags"}}
      <div class="featured-posts-editorial-top">
        {{#foreach posts}}
          {{#if @first}}
            <article class="featured-post-editorial-main">
              <a class="featured-post-card-link" href="{{url}}">
                {{#if feature_image}}
                  <div class="featured-post-editorial-image">
                    <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                  </div>
                {{/if}}
                <div class="featured-post-editorial-content">
                  {{#if primary_tag}}
                    <span class="featured-post-tag">{{primary_tag.name}}</span>
                  {{/if}}
                  <h3 class="featured-post-editorial-title">{{title}}</h3>
                  {{#if excerpt}}
                    <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                  {{/if}}
                </div>
              </a>
            </article>
            <div class="featured-posts-editorial-sidebar">
              <div class="editorial-sidebar-header">
                <span class="editorial-star">&#9733;</span>
                <h4>Editor's Picks</h4>
              </div>
              <ul class="editorial-sidebar-list">
          {{else}}
            <li class="editorial-sidebar-item">
              <a href="{{url}}">
                <span class="editorial-index">0{{@index}}</span>
                <div class="editorial-info">
                  <h5>{{title}}</h5>
                  <span class="editorial-date">{{date format="MMM D"}}</span>
                </div>
              </a>
            </li>
          {{/if}}
          {{#if @last}}
              </ul>
            </div>
          {{/if}}
        {{/foreach}}
      </div>
      {{/get}}
    </div>`;
  } else if (layout === "masonry") {
    if (autoScroll) {
      layoutMarkup = `
      <div class="featured-posts-masonry-autoscroll">
        {{#get "posts" filter="featured:true" limit="${limit}" include="tags"}}
          <div class="masonry-autoscroll-grid">
            <div class="masonry-column masonry-col-up">
              <div class="masonry-column-track">
                {{#foreach posts}}
                  <article class="featured-post-masonry-card">
                    <a class="featured-post-card-link" href="{{url}}">
                      {{#if feature_image}}
                        <div class="featured-post-masonry-image">
                          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                        </div>
                      {{/if}}
                      <div class="featured-post-content">
                        {{#if primary_tag}}
                          <span class="featured-post-tag">{{primary_tag.name}}</span>
                        {{/if}}
                        <h3 class="featured-post-title">{{title}}</h3>
                        {{#if excerpt}}
                          <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                        {{/if}}
                      </div>
                    </a>
                  </article>
                {{/foreach}}
                {{#foreach posts}}
                  <article class="featured-post-masonry-card">
                    <a class="featured-post-card-link" href="{{url}}">
                      {{#if feature_image}}
                        <div class="featured-post-masonry-image">
                          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                        </div>
                      {{/if}}
                      <div class="featured-post-content">
                        {{#if primary_tag}}
                          <span class="featured-post-tag">{{primary_tag.name}}</span>
                        {{/if}}
                        <h3 class="featured-post-title">{{title}}</h3>
                        {{#if excerpt}}
                          <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                        {{/if}}
                      </div>
                    </a>
                  </article>
                {{/foreach}}
              </div>
            </div>
            <div class="masonry-column masonry-col-down">
              <div class="masonry-column-track">
                {{#foreach posts}}
                  <article class="featured-post-masonry-card">
                    <a class="featured-post-card-link" href="{{url}}">
                      {{#if feature_image}}
                        <div class="featured-post-masonry-image">
                          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                        </div>
                      {{/if}}
                      <div class="featured-post-content">
                        {{#if primary_tag}}
                          <span class="featured-post-tag">{{primary_tag.name}}</span>
                        {{/if}}
                        <h3 class="featured-post-title">{{title}}</h3>
                        {{#if excerpt}}
                          <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                        {{/if}}
                      </div>
                    </a>
                  </article>
                {{/foreach}}
                {{#foreach posts}}
                  <article class="featured-post-masonry-card">
                    <a class="featured-post-card-link" href="{{url}}">
                      {{#if feature_image}}
                        <div class="featured-post-masonry-image">
                          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                        </div>
                      {{/if}}
                      <div class="featured-post-content">
                        {{#if primary_tag}}
                          <span class="featured-post-tag">{{primary_tag.name}}</span>
                        {{/if}}
                        <h3 class="featured-post-title">{{title}}</h3>
                        {{#if excerpt}}
                          <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                        {{/if}}
                      </div>
                    </a>
                  </article>
                {{/foreach}}
              </div>
            </div>
            <div class="masonry-column masonry-col-up">
              <div class="masonry-column-track">
                {{#foreach posts}}
                  <article class="featured-post-masonry-card">
                    <a class="featured-post-card-link" href="{{url}}">
                      {{#if feature_image}}
                        <div class="featured-post-masonry-image">
                          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                        </div>
                      {{/if}}
                      <div class="featured-post-content">
                        {{#if primary_tag}}
                          <span class="featured-post-tag">{{primary_tag.name}}</span>
                        {{/if}}
                        <h3 class="featured-post-title">{{title}}</h3>
                        {{#if excerpt}}
                          <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                        {{/if}}
                      </div>
                    </a>
                  </article>
                {{/foreach}}
                {{#foreach posts}}
                  <article class="featured-post-masonry-card">
                    <a class="featured-post-card-link" href="{{url}}">
                      {{#if feature_image}}
                        <div class="featured-post-masonry-image">
                          <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                        </div>
                      {{/if}}
                      <div class="featured-post-content">
                        {{#if primary_tag}}
                          <span class="featured-post-tag">{{primary_tag.name}}</span>
                        {{/if}}
                        <h3 class="featured-post-title">{{title}}</h3>
                        {{#if excerpt}}
                          <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                        {{/if}}
                      </div>
                    </a>
                  </article>
                {{/foreach}}
              </div>
            </div>
          </div>
        {{/get}}
      </div>`;
    } else {
      layoutMarkup = `
      <div class="featured-posts-masonry">
        {{#get "posts" filter="featured:true" limit="${limit}" include="tags"}}
        {{#foreach posts}}
          <article class="featured-post-masonry-card">
            <a class="featured-post-card-link" href="{{url}}">
              {{#if feature_image}}
                <div class="featured-post-masonry-image">
                  <img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" />
                </div>
              {{/if}}
              <div class="featured-post-content">
                {{#if primary_tag}}
                  <span class="featured-post-tag">{{primary_tag.name}}</span>
                {{/if}}
                <h3 class="featured-post-title">{{title}}</h3>
                {{#if excerpt}}
                  <p class="featured-post-excerpt">{{excerpt words="25"}}</p>
                {{/if}}
              </div>
            </a>
          </article>
        {{/foreach}}
        {{/get}}
      </div>`;
    }
  }

  return `<style>
  #${wrapperId} {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 4vmin;
    box-sizing: border-box;
  }

  #${wrapperId} .featured-post-tag {
    font-family: var(--font-mono, monospace);
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    color: var(--color-link, #0070f3);
  }
  #${wrapperId} .featured-post-card-link,
  #${wrapperId} .featured-post-list-link,
  #${wrapperId} .featured-post-secondary-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  /* Split Layout */
  #${wrapperId} .featured-posts-split {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 992px) {
    #${wrapperId} .featured-posts-split {
      grid-template-columns: 7fr 5fr;
    }
  }
  #${wrapperId} .featured-post-main {
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border, #ebebeb);
    border-radius: 0.375rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  #${wrapperId} .featured-post-image-main {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--color-canvas-soft, #fafafa);
  }
  #${wrapperId} .featured-post-image-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .featured-post-content-main {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  #${wrapperId} .featured-post-title-main {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    line-height: 1.3;
    margin: 0;
  }
  #${wrapperId} .featured-post-excerpt-main {
    font-size: 0.75rem;
    color: var(--color-body, #4d4d4d);
    line-height: 1.5;
    margin: 0;
  }
  #${wrapperId} .featured-posts-secondary-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  #${wrapperId} .featured-post-secondary {
    border-bottom: 1px solid var(--color-border, #ebebeb);
    padding-bottom: 1.25rem;
  }
  #${wrapperId} .featured-post-secondary:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  #${wrapperId} .featured-post-secondary-link {
    flex-direction: row;
    gap: 1rem;
    align-items: flex-start;
  }
  #${wrapperId} .featured-post-image-secondary {
    width: 6rem;
    height: 5rem;
    flex-shrink: 0;
    border-radius: 0.25rem;
    overflow: hidden;
    background: #f4f4f5;
  }
  #${wrapperId} .featured-post-image-secondary img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .featured-post-content-secondary {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  #${wrapperId} .featured-post-title-secondary {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-fg, #171717);
    line-height: 1.3;
    margin: 0;
  }
  /* Grid Layout */
  #${wrapperId} .featured-posts-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 768px) {
    #${wrapperId} .featured-posts-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    /* 1 post: single centered card */
    #${wrapperId} .featured-posts-grid:has(> article:only-child) {
      grid-template-columns: minmax(auto, 420px);
      justify-content: center;
    }
    /* 2 posts: two centered columns */
    #${wrapperId} .featured-posts-grid:has(> article:nth-child(2):last-child) {
      grid-template-columns: repeat(2, minmax(auto, 420px));
      justify-content: center;
    }
  }
  #${wrapperId} .featured-post-grid-card,
  #${wrapperId} .featured-post-carousel-card {
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border, #ebebeb);
    border-radius: 0.375rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  #${wrapperId} .featured-post-image-wrapper {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--color-canvas-soft, #fafafa);
  }
  #${wrapperId} .featured-post-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .featured-post-content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  #${wrapperId} .featured-post-title {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    line-height: 1.3;
    margin: 0;
  }
  #${wrapperId} .featured-post-excerpt {
    font-size: 0.75rem;
    color: var(--color-body, #4d4d4d);
    line-height: 1.5;
    margin: 0;
  }
  /* List Layout */
  #${wrapperId} .featured-posts-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    box-sizing: border-box;
  }
  #${wrapperId} .featured-post-list-card {
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border, #ebebeb);
    border-radius: 0.375rem;
    padding: 1rem;
  }
  #${wrapperId} .featured-post-list-link {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
  #${wrapperId} .featured-post-list-image {
    width: 10rem;
    height: 7rem;
    flex-shrink: 0;
    border-radius: 0.25rem;
    overflow: hidden;
    background: #f4f4f5;
  }
  #${wrapperId} .featured-post-list-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .featured-post-list-content {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    flex: 1;
  }
  #${wrapperId} .featured-post-title-list {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    line-height: 1.3;
    margin: 0;
  }
  /* Carousel Layout */
  #${wrapperId} .featured-posts-carousel {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    padding-bottom: 1rem;
    scroll-snap-type: x mandatory;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 640px) {
    #${wrapperId} .featured-posts-carousel:has(> article:only-child),
    #${wrapperId} .featured-posts-carousel:has(> article:nth-child(2):last-child) {
      justify-content: center;
    }
  }
  #${wrapperId} .featured-post-carousel-card {
    min-width: 260px;
    max-width: 300px;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
  /* Bento Layout */
  #${wrapperId} .featured-posts-bento {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 768px) {
    #${wrapperId} .featured-posts-bento {
      grid-template-columns: repeat(2, 1fr);
    }
    #${wrapperId} .featured-post-bento-card:nth-child(3n+1) {
      grid-column: span 2;
    }
  }
  #${wrapperId} .featured-post-bento-card {
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border, #ebebeb);
    border-radius: 1rem;
    overflow: hidden;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  #${wrapperId} .featured-post-bento-image {
    aspect-ratio: 16 / 9;
    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--color-canvas-soft, #fafafa);
  }
  #${wrapperId} .featured-post-bento-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .featured-post-bento-content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  #${wrapperId} .featured-post-bento-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.6875rem;
    color: var(--color-mute, #888888);
  }
  #${wrapperId} .featured-post-author-avatar {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    object-fit: cover;
  }
  #${wrapperId} .featured-post-bento-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    line-height: 1.3;
    margin: 0;
  }
  #${wrapperId} .featured-post-bento-excerpt {
    font-size: 0.75rem;
    color: var(--color-body, #4d4d4d);
    line-height: 1.5;
    margin: 0;
  }
  #${wrapperId} .featured-post-read-more {
    font-size: 0.75rem;
    font-weight: 600;
    color: #059669;
    margin-top: 0.25rem;
  }

  /* Editorial Layout */
  #${wrapperId} .featured-posts-editorial-top {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 992px) {
    #${wrapperId} .featured-posts-editorial-top {
      grid-template-columns: 7fr 5fr;
    }
  }
  #${wrapperId} .featured-post-editorial-main {
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border, #ebebeb);
    border-radius: 0.75rem;
    overflow: hidden;
  }
  #${wrapperId} .featured-post-editorial-image {
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: var(--color-canvas-soft, #fafafa);
  }
  #${wrapperId} .featured-post-editorial-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .featured-post-editorial-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  #${wrapperId} .featured-post-editorial-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    margin: 0;
  }
  #${wrapperId} .featured-posts-editorial-sidebar {
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border, #ebebeb);
    border-radius: 0.75rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  #${wrapperId} .editorial-sidebar-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border, #ebebeb);
  }
  #${wrapperId} .editorial-star {
    color: #f59e0b;
    font-size: 1rem;
  }
  #${wrapperId} .editorial-sidebar-header h4 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0;
  }
  #${wrapperId} .editorial-sidebar-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  #${wrapperId} .editorial-sidebar-item a {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    text-decoration: none;
    color: inherit;
  }
  #${wrapperId} .editorial-index {
    font-family: var(--font-mono, monospace);
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-link, #0070f3);
  }
  #${wrapperId} .editorial-info h5 {
    font-size: 0.8125rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.3;
  }
  #${wrapperId} .editorial-date {
    font-size: 0.6875rem;
    color: var(--color-mute, #888888);
  }

  /* Masonry Layout */
  #${wrapperId} .featured-posts-masonry {
    column-count: 3;
    column-gap: 1.5rem;
    width: 100%;
    box-sizing: border-box;
  }
  /* 1 post: override columns → flex centered */
  #${wrapperId} .featured-posts-masonry:has(> article:only-child) {
    column-count: unset;
    display: flex;
    justify-content: center;
  }
  #${wrapperId} .featured-posts-masonry:has(> article:only-child) > article {
    width: 100%;
    max-width: 420px;
    margin-bottom: 0;
  }
  @media (min-width: 1024px) {
    #${wrapperId} .featured-posts-masonry {
      column-count: 3;
    }
    /* 1 post: centered */
    #${wrapperId} .featured-posts-masonry:has(> article:only-child) {
      column-count: unset;
      display: flex;
      justify-content: center;
    }
    #${wrapperId} .featured-posts-masonry:has(> article:only-child) > article {
      width: 100%;
      max-width: 420px;
      margin-bottom: 0;
    }
    /* 2 posts: 2 columns, centered */
    #${wrapperId} .featured-posts-masonry:has(> article:nth-child(2):last-child) {
      column-count: unset;
      display: flex;
      gap: 1.5rem;
      justify-content: center;
    }
    #${wrapperId} .featured-posts-masonry:has(> article:nth-child(2):last-child) > article {
      width: 100%;
      max-width: 420px;
      margin-bottom: 0;
    }
  }
  #${wrapperId} .featured-post-masonry-card {
    break-inside: avoid;
    margin-bottom: 1.5rem;
    background: var(--color-bg, #ffffff);
    border: 1px solid var(--color-border, #ebebeb);
    border-radius: 0.75rem;
    overflow: hidden;
  }
  #${wrapperId} .featured-post-masonry-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: var(--color-canvas-soft, #fafafa);
  }
  #${wrapperId} .featured-post-masonry-card:nth-child(3n+1) .featured-post-masonry-image {
    aspect-ratio: 1 / 1;
  }
  #${wrapperId} .featured-post-masonry-card:nth-child(3n+2) .featured-post-masonry-image {
    aspect-ratio: 4 / 5;
  }
  #${wrapperId} .featured-post-masonry-card:nth-child(3n+3) .featured-post-masonry-image {
    aspect-ratio: 16 / 9;
  }
  #${wrapperId} .featured-post-masonry-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Auto Scroll Carousel */
  #${wrapperId} .carousel-track-container {
    overflow: hidden;
    width: 100%;
    padding: 0.5rem 0;
  }
  #${wrapperId} .carousel-track {
    display: flex;
    gap: 1.5rem;
    width: max-content;
    animation: ghMarquee 25s linear infinite;
  }
  #${wrapperId} .featured-posts-carousel-autoscroll:hover .carousel-track {
    animation-play-state: paused;
  }
  @keyframes ghMarquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Auto Scroll Masonry */
  #${wrapperId} .masonry-autoscroll-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    height: 500px;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 1024px) {
    #${wrapperId} .masonry-autoscroll-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  #${wrapperId} .masonry-column {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  #${wrapperId} .masonry-column-track {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  #${wrapperId} .masonry-col-up .masonry-column-track {
    animation: ghScrollUp 30s linear infinite;
  }
  #${wrapperId} .masonry-col-down .masonry-column-track {
    animation: ghScrollDown 30s linear infinite;
  }
  #${wrapperId} .featured-posts-masonry-autoscroll:hover .masonry-column-track {
    animation-play-state: paused;
  }
  @keyframes ghScrollUp {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  @keyframes ghScrollDown {
    0% { transform: translateY(-50%); }
    100% { transform: translateY(0); }
  }
  #${wrapperId} .featured-posts-header {
    margin: 0 auto 3rem auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 42rem;
    gap: 0.5rem;
  }
  #${wrapperId} .featured-posts-title {
    font-family: var(--gh-font-heading, inherit);
    font-size: 1.75rem;
    font-weight: 700;
    color: ${headingColor};
    line-height: 1.2;
    margin: 0;
    width: 100%;
    text-align: center;
  }
  #${wrapperId} .featured-posts-description {
    font-size: 0.9375rem;
    color: ${descriptionColor};
    line-height: 1.6;
    margin: 0;
    width: 100%;
    text-align: center;
  }
  #${wrapperId} .featured-post-title,
  #${wrapperId} .featured-post-title-main,
  #${wrapperId} .featured-post-title-secondary,
  #${wrapperId} .featured-post-title-list,
  #${wrapperId} .featured-post-bento-title,
  #${wrapperId} .featured-post-editorial-title {
    color: ${cardTitleColor};
  }
  #${wrapperId} .featured-post-excerpt,
  #${wrapperId} .featured-post-excerpt-main,
  #${wrapperId} .featured-post-bento-excerpt {
    color: ${cardTextColor};
  }
</style>
<div id="${wrapperId}" class="featured-posts-container kg-width-full">
  ${(heading || description) ? `
  <div class="featured-posts-header">
    ${heading ? `<h2 class="featured-posts-title">${heading}</h2>` : ''}
    ${description ? `<p class="featured-posts-description">${description}</p>` : ''}
  </div>` : ''}
  ${layoutMarkup}
</div>`;
};
