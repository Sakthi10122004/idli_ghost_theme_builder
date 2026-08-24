import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="gallery-grid-wrapper py-6">
  <div class="gallery-grid">
    ${(block.props.urls || []).map((url: any) => `
    <div class="gallery-image">
      <img src="${url}" alt="Gallery Image" class="w-full h-full object-cover" />
    </div>`).join("\n")}
  </div>
</div>`;
};