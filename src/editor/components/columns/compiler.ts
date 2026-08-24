import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string) => {
  return `<div class="flex-columns">
  ${compiledChildren}
</div>`;
};