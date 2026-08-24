import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="featured-posts-block py-8">
  <div class="grid-columns">
    {{#foreach posts featured="true" limit="3"}}
    <article class="post-card border-brand-hairline shadow-level-1">
      {{#if feature_image}}
      <div class="post-card-image">
        <a href="{{url}}"><img src="{{img_url feature_image size="m"}}" alt="{{title}}" /></a>
      </div>
      {{/if}}
      <div class="post-card-content">
        <h3 class="post-title"><a href="{{url}}">{{title}}</a></h3>
        <p class="post-excerpt">{{excerpt words="20"}}</p>
      </div>
    </article>
    {{/foreach}}
  </div>
</div>`;
};