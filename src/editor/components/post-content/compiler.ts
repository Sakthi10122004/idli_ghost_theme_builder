import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string, isPageContext: boolean) => {
  return `<main id="site-main" class="site-main">
<article class="article {{post_class}}">
  <header class="article-header gh-canvas">
    <h1 class="article-title">{{title}}</h1>
    {{#if feature_image}}
      <figure class="article-image">
        <img src="{{img_url feature_image size="xl"}}" alt="{{title}}" />
      </figure>
    {{/if}}
  </header>
  <section class="gh-content gh-canvas">
    {{content}}
  </section>
</article>
</main>`;
};