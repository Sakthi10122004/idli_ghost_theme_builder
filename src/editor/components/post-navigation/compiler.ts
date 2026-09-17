import { BuilderBlock } from "@/types/theme";
import { resolvePostNavigationProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolvePostNavigationProps(block.props);
  const styles = block.styles || {};
  const marginBottom = (styles.marginBottom as string) || "";
  const styleAttr = marginBottom ? ` style="margin-bottom: ${marginBottom};"` : "";

  const prevImageMarkup = p.showImage
    ? `\n    {{#if feature_image}}<img src="{{img_url feature_image size="s"}}" alt="" loading="lazy" />{{/if}}`
    : "";
  const prevExcerptMarkup = p.showExcerpt
    ? `\n    <p>{{excerpt words="15"}}</p>`
    : "";

  const nextImageMarkup = p.showImage
    ? `\n    {{#if feature_image}}<img src="{{img_url feature_image size="s"}}" alt="" loading="lazy" />{{/if}}`
    : "";
  const nextExcerptMarkup = p.showExcerpt
    ? `\n    <p>{{excerpt words="15"}}</p>`
    : "";

  return `<nav class="gh-post-nav grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-t border-gray-100"${styleAttr}>
  {{#prev_post}}
  <a href="{{url}}" class="gh-post-nav-prev">
    <span class="gh-post-nav-label">&larr; Previous</span>${prevImageMarkup}
    <h4>{{title}}</h4>${prevExcerptMarkup}
  </a>
  {{/prev_post}}
  {{#next_post}}
  <a href="{{url}}" class="gh-post-nav-next">
    <span class="gh-post-nav-label">Next &rarr;</span>${nextImageMarkup}
    <h4>{{title}}</h4>${nextExcerptMarkup}
  </a>
  {{/next_post}}
</nav>`;
};
