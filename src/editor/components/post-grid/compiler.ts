import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="post-feed">
  {{#foreach posts}}
    {{> "post-card"}}
  {{/foreach}}
</div>`;
};