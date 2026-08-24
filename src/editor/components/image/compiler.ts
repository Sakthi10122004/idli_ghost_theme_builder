import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<figure class="image-wrapper">
  <img src="${block.props.url || ''}" alt="${block.props.alt || ''}" class="img-fluid" style="width: 100%; height: auto;" />
</figure>`;
};