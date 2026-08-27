import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<style>
  #post-grid-${block.id} {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  #post-grid-${block.id} .gh-post-card {
    display: flex;
    flex-direction: column;
    background: var(--color-bg);
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    overflow: hidden;
    transition: transform 0.2s;
  }
  #post-grid-${block.id} .gh-post-card:hover {
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
    aspect-ratio: 16 / 9;
    overflow: hidden;
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
  }
  #post-grid-${block.id} .gh-post-card-title {
    font-size: 1.25rem;
    font-family: var(--font-heading);
    margin: 0 0 0.5rem 0;
  }
  #post-grid-${block.id} .gh-post-card-excerpt {
    font-size: 0.95rem;
    color: var(--color-muted);
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
    flex-grow: 1;
  }
  #post-grid-${block.id} .gh-post-card-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--color-muted);
    margin-top: auto;
  }
</style>
<div id="post-grid-${block.id}" class="post-feed">
  {{#foreach posts}}
    {{> "post-card"}}
  {{/foreach}}
</div>`;
};