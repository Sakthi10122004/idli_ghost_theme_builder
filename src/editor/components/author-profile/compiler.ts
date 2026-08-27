import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const name = block.props.name || "{{name}}";
  const bio = block.props.bio || "{{bio}}";
  return `<style>
  #author-${block.id} {
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    background-color: var(--color-bg);
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }
  #author-${block.id} .author-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: rgba(0,0,0,0.02);
    border: 1px solid rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
    overflow: hidden;
  }
  #author-${block.id} .author-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  #author-${block.id} .author-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  #author-${block.id} .author-name {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 700;
  }
  #author-${block.id} .author-bio {
    margin: 0;
    font-size: 0.75rem;
    color: var(--color-muted);
    line-height: 1.5;
  }
</style>
<div id="author-${block.id}">
  <div class="author-avatar">
    {{#if profile_image}}
      <img src="{{profile_image}}" alt="${name}" />
    {{else}}
      <span>A</span>
    {{/if}}
  </div>
  <div class="author-details">
    <h4 class="author-name">${name}</h4>
    <p class="author-bio">${bio}</p>
  </div>
</div>`;
};