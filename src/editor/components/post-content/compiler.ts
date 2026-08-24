import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string, isPageContext: boolean) => {
  const headerHtml = `<header class="post-header mb-8">
    <h1 class="text-3xl font-bold leading-tight">{{title}}</h1>
    <div class="post-meta text-xs text-muted mt-2">
      <time datetime="{{date format="YYYY-MM-DD"}}">{{date format="MMM DD, YYYY"}}</time>
    </div>
  </header>`;
  const imageHtml = `{{#if feature_image}}
    <figure class="post-feature-image rounded-md overflow-hidden my-6">
      <img src="{{feature_image}}" alt="{{title}}" class="w-full h-auto" />
    </figure>
  {{/if}}`;
  return `<article class="post-full-content py-12 max-w-2xl mx-auto px-6">
  ${headerHtml}
  ${imageHtml}
  <div class="post-body text-sm leading-relaxed mt-4">
    {{content}}
  </div>
</article>`;
};