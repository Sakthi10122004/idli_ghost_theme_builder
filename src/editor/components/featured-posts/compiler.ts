import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="post-feed">
  {{#foreach posts featured="true" limit="3"}}
    {{> "post-card"}}
  {{/foreach}}
</div>`;
};