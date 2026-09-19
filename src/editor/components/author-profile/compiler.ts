import { BuilderBlock } from "@/types/theme";
import { resolveAuthorProfileProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveAuthorProfileProps(block.props);
  const isBanner = p.layoutStyle === "banner";

  if (isBanner) {
    return `{{#author}}
<header class="author-header" style="text-align: center; padding: 4rem 1rem 2.5rem 1rem; max-width: 800px; margin: 0 auto;">
  {{#if profile_image}}
  <div style="width: 96px; height: 96px; border-radius: 50%; overflow: hidden; margin: 0 auto 1.25rem auto; border: 2px solid var(--color-hairline, #ebebeb); box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
    <img src="{{img_url profile_image size="m"}}" alt="{{name}}" style="width: 100%; height: 100%; object-fit: cover;" />
  </div>
  {{/if}}
  <h1 class="author-name" style="font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.025em;">{{name}}</h1>
  {{#if bio}}
  <p class="author-bio" style="font-size: 1.125rem; line-height: 1.6; color: var(--color-muted, #666); max-width: 600px; margin: 0 auto 1.25rem auto;">{{bio}}</p>
  {{/if}}
  <div class="author-meta" style="font-size: 0.8125rem; color: var(--color-muted, #666); display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; align-items: center;">
    {{#if location}}<span>📍 {{location}}</span>{{/if}}
    {{#if website}}<a href="{{website}}" target="_blank" rel="noopener" style="color: var(--color-primary);">🔗 Website</a>{{/if}}
    {{#if twitter}}<a href="{{social_url type="twitter"}}" target="_blank" rel="noopener" style="color: var(--color-primary);">Twitter</a>{{/if}}
    {{#if facebook}}<a href="{{social_url type="facebook"}}" target="_blank" rel="noopener" style="color: var(--color-primary);">Facebook</a>{{/if}}
    <span style="font-family: monospace; background: var(--color-bg, #fafafa); border: 1px solid var(--color-hairline, #ebebeb); padding: 0.2rem 0.5rem; border-radius: 4px;">{{plural count.posts empty="0 posts" singular="% post" plural="% posts"}}</span>
  </div>
</header>
{{/author}}`;
  }

  return `{{#foreach authors}}
<section class="author-card">
  {{#if profile_image}}
  <div class="author-card-avatar">
    <img src="{{img_url profile_image size="s"}}" alt="{{name}}" />
  </div>
  {{else}}
  <div class="author-card-avatar author-card-initial">
    <span>{{name}}</span>
  </div>
  {{/if}}
  <div class="author-card-content">
    <span class="author-card-eyebrow">Written by</span>
    <h4 class="author-card-name"><a href="{{url}}">{{name}}</a></h4>
    {{#if bio}}<p class="author-card-bio">{{bio}}</p>{{/if}}
  </div>
</section>
{{/foreach}}`;
};