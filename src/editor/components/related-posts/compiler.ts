import { BuilderBlock } from "@/types/theme";
import { resolveRelatedPostsProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveRelatedPostsProps(block.props);
  const styles = block.styles || {};
  const marginBottom = (styles.marginBottom as string) || "";
  const styleAttr = marginBottom ? ` style="margin-bottom: ${marginBottom};"` : "";
  const limit = Math.min(Math.max(1, p.count), 12);

  const imageMarkup = p.showImage
    ? `\n          {{#if feature_image}}\n          <a href="{{url}}"><img src="{{img_url feature_image size="m"}}" alt="{{title}}" loading="lazy" /></a>\n          {{/if}}`
    : "";

  const excerptMarkup = p.showExcerpt
    ? `\n          <p>{{excerpt words="20"}}</p>`
    : "";

  return `<section class="gh-related-posts py-12"${styleAttr}>
  <h3 class="gh-related-heading text-2xl font-bold mb-6">${p.heading}</h3>
  {{#get "posts" filter="tags:{{primary_tag.slug}}+id:-{{id}}" limit="${limit}" as |related|}}
    {{#if related}}
    <div class="gh-related-grid grid grid-cols-1 md:grid-cols-3 gap-6">
      {{#foreach related}}
        <article class="gh-related-card">${imageMarkup}
          <h4><a href="{{url}}">{{title}}</a></h4>${excerptMarkup}
        </article>
      {{/foreach}}
    </div>
    {{/if}}
  {{/get}}
</section>`;
};
