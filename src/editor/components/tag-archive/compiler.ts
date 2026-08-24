import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const title = block.props.title || "Topics";
  return `<div class="tag-archive-block">
  <h3 style="font-size: 0.75rem; font-family: monospace; text-transform: uppercase; letter-spacing: 0.05em; color: #888888; margin-bottom: 1rem;">${title}</h3>
  <div class="tag-grid">
    {{#get "tags" limit="100"}}
      {{#foreach tags}}
        <a href="{{url}}" class="tag-card">
          <span style="font-size: 0.75rem; font-weight: 700;">{{name}}</span>
          <span style="font-size: 0.65rem; background-color: #fafafa; border: 1px solid #ebebeb; padding: 0.15rem 0.4rem; border-radius: 4px; color: #4d4d4d;">{{count.posts}} posts</span>
        </a>
      {{/foreach}}
    {{/get}}
  </div>
</div>`;
};