import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="post-grid-wrapper py-8">
  <div class="grid-columns">
    {{#foreach posts}}
    <article class="post-card">
      {{#if feature_image}}
      <div class="post-card-image">
        <a href="{{url}}"><img src="{{img_url feature_image size="m"}}" alt="{{title}}" /></a>
      </div>
      {{/if}}
      <div class="post-card-content">
        {{#if primary_tag}}
        <span class="post-tag">{{primary_tag.name}}</span>
        {{/if}}
        <h3 class="post-title"><a href="{{url}}">{{title}}</a></h3>
        <p class="post-excerpt">{{excerpt words="26"}}</p>
        <div class="post-card-meta">
          <time datetime="{{date format="YYYY-MM-DD"}}">{{date format="MMM DD, YYYY"}}</time>
          <span>{{reading_time}}</span>
        </div>
      </div>
    </article>
    {{/foreach}}
  </div>
</div>`;
};