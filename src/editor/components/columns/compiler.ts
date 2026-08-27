import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string) => {
  return `<style>
  #columns-${block.id} {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  #columns-${block.id} > * {
    flex: 1;
    min-width: 250px;
  }
</style>
<div id="columns-${block.id}">
  ${compiledChildren}
</div>`;
};