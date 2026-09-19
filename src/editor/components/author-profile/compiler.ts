import { BuilderBlock } from "@/types/theme";
import { resolveAuthorProfileProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveAuthorProfileProps(block.props);
  const isBanner = p.layoutStyle === "banner";

  if (isBanner) {
    return `{{#author}}
<header class="author-header gh-canvas" style="text-align: center; padding: 4rem 1rem 2.5rem 1rem; max-width: 800px; margin: 0 auto;">
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
    {{#if twitter}}<a href="{{twitter_url}}" target="_blank" rel="noopener" style="color: var(--color-primary);">Twitter</a>{{/if}}
    {{#if facebook}}<a href="{{facebook_url}}" target="_blank" rel="noopener" style="color: var(--color-primary);">Facebook</a>{{/if}}
    <span style="font-family: monospace; background: var(--color-bg, #fafafa); border: 1px solid var(--color-hairline, #ebebeb); padding: 0.2rem 0.5rem; border-radius: 4px;">{{plural count.posts empty="0 posts" singular="% post" plural="% posts"}}</span>
  </div>
</header>
{{/author}}`;
  }

  return `{{#foreach authors}}
<section class="author-card gh-canvas" style="display: flex; gap: 1.25rem; align-items: center; padding: 1.5rem; border: 1px solid var(--color-hairline, #ebebeb); border-radius: var(--radius-md, 8px); background-color: var(--color-bg, #ffffff); margin: 3rem auto 0 auto; max-width: 720px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
  {{#if profile_image}}
  <div style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; border: 1px solid var(--color-hairline, #ebebeb); flex-shrink: 0;">
    <img src="{{img_url profile_image size="s"}}" alt="{{name}}" style="width: 100%; height: 100%; object-fit: cover;" />
  </div>
  {{/if}}
  <div class="author-card-content" style="flex: 1; min-width: 0;">
    <span style="font-size: 0.6875rem; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-muted, #737373); font-weight: 600;">Written by</span>
    <h4 style="margin: 0.25rem 0; font-size: 1.125rem; font-weight: 600;"><a href="{{url}}" style="color: inherit; text-decoration: none;">{{name}}</a></h4>
    {{#if bio}}<p style="margin: 0; font-size: 0.875rem; color: var(--color-muted, #737373); line-height: 1.5;">{{bio}}</p>{{/if}}
  </div>
</section>
{{/foreach}}`;
};