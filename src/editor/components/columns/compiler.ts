import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string) => {
  return `<style>
  #columns-${block.id} {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(1rem, 2.5vw, 2rem);
    width: 100%;
    box-sizing: border-box;
  }
  #columns-${block.id} > * {
    flex: 1 1 clamp(250px, 30%, 100%);
    min-width: min(100%, 260px);
    box-sizing: border-box;
  }
</style>
<div id="columns-${block.id}">
  ${compiledChildren}
</div>`;
};