import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<style>
  #gallery-${block.id} {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1.5rem 0;
  }
  #gallery-${block.id} .gallery-image {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: var(--radius-sm);
  }
  #gallery-${block.id} .gallery-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
<div id="gallery-${block.id}">
  ${(block.props.urls || []).map((url: any) => `
  <div class="gallery-image">
    <img src="${url}" alt="Gallery Image" loading="lazy" />
  </div>`).join("\n")}
</div>`;
};