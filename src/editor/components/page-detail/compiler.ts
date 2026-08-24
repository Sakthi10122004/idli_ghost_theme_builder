import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<article class="post-full-content py-12 max-w-2xl mx-auto px-6">
  <header class="post-header mb-8">
    <h1 class="text-3xl font-bold leading-tight">{{title}}</h1>
  </header>
  {{#if feature_image}}
    <figure class="post-feature-image rounded-md overflow-hidden my-6">
      <img src="{{feature_image}}" alt="{{title}}" class="w-full h-auto" />
    </figure>
  {{/if}}
  <div class="post-body text-sm leading-relaxed mt-4">
    {{content}}
  </div>
</article>`;
};