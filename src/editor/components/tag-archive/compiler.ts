import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const title = block.props.title || "Topics";
  return `<style>
  #tags-${block.id} {
    padding: 1.5rem 0;
  }
  #tags-${block.id} .tag-archive-title {
    font-size: 0.75rem;
    font-family: monospace;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted);
    margin-bottom: 1rem;
  }
  #tags-${block.id} .tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }
  #tags-${block.id} .tag-card {
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-sm);
    padding: 1rem;
    background-color: var(--color-bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    color: var(--color-fg);
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
    border: 1px solid rgba(0,0,0,0.05);
    padding: 0.15rem 0.4rem;
    border-radius: var(--radius-sm);
    color: var(--color-muted);
  }
</style>
<div id="tags-${block.id}">
  <h3 class="tag-archive-title">${title}</h3>
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