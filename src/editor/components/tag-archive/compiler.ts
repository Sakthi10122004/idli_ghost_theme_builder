import { BuilderBlock } from "@/types/theme";
import { resolveTagArchiveProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveTagArchiveProps(block.props);
  const isBanner = p.layoutStyle === "banner";

  if (isBanner) {
    return `{{#tag}}
<header class="tag-header" style="text-align: center; padding: 4rem 1rem 2.5rem 1rem; max-width: 800px; margin: 0 auto;">
  <span style="font-size: 0.75rem; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-primary, #171717); font-weight: 700; display: block; margin-bottom: 0.5rem;">Topic Archive</span>
  <h1 class="tag-title" style="font-size: 2.75rem; font-weight: 700; margin-bottom: 0.5rem; letter-spacing: -0.025em;">{{name}}</h1>
  {{#if description}}
  <p class="tag-description" style="font-size: 1.125rem; line-height: 1.6; color: var(--color-muted, #666); max-width: 600px; margin: 0 auto 1.25rem auto;">{{description}}</p>
  {{/if}}
  ${p.showCount ? '<span style="font-family: monospace; font-size: 0.8125rem; background: var(--color-bg, #fafafa); border: 1px solid var(--color-hairline, #ebebeb); padding: 0.25rem 0.6rem; border-radius: 4px; color: var(--color-muted, #666);">{{plural count.posts empty="0 posts" singular="% post" plural="% posts"}}</span>' : ""}
  {{#if feature_image}}
  <div style="margin-top: 2rem; border-radius: var(--radius-md, 8px); overflow: hidden; max-height: 400px;">
    <img src="{{img_url feature_image size="xl"}}" alt="{{name}}" style="width: 100%; height: 100%; object-fit: cover;" />
  </div>
  {{/if}}
</header>
{{/tag}}`;
  }

  return `<style>
  #tags-${block.id} {
    padding: 1.5rem 0;
  }
  #tags-${block.id} .tag-archive-title {
    font-size: 0.75rem;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #666);
    margin-bottom: 1rem;
  }
  #tags-${block.id} .tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }
  #tags-${block.id} .tag-card {
    border: 1px solid var(--color-hairline, rgba(0,0,0,0.05));
    border-radius: var(--radius-sm, 4px);
    padding: 1rem;
    background-color: var(--color-bg, #fff);
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    color: var(--color-fg, #171717);
    transition: background-color 0.2s;
  }
  #tags-${block.id} .tag-card:hover {
    background-color: rgba(0,0,0,0.02);
  }
  #tags-${block.id} .tag-name {
    font-size: 0.75rem;
    font-weight: 700;
  }
  #tags-${block.id} .tag-count {
    font-size: 0.65rem;
    background-color: rgba(0,0,0,0.02);
    border: 1px solid var(--color-hairline, rgba(0,0,0,0.05));
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-sm, 4px);
    color: var(--color-muted, #666);
  }
</style>
<div id="tags-${block.id}">
  <h3 class="tag-archive-title">${p.title || "Topics"}</h3>
  <div class="tag-grid">
    {{#get "tags" limit="100"}}
      {{#foreach tags}}
        <a href="{{url}}" class="tag-card">
          <span class="tag-name">{{name}}</span>
          <span class="tag-count">{{count.posts}} posts</span>
        </a>
      {{/foreach}}
    {{/get}}
  </div>
</div>`;
};