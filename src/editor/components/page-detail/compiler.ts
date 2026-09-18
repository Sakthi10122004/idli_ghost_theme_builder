import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (
  block: BuilderBlock,
  _compiledChildren?: string,
  _isPageContext?: boolean,
  blocks?: Record<string, BuilderBlock>
) => {
  // Check if a separate heading block exists on the page
  const hasHeadingBlock = blocks
    ? Object.values(blocks).some((b) => b.type === "heading" && b.id !== block.id)
    : false;

  const showTitle =
    block.props?.showTitle !== undefined
      ? Boolean(block.props.showTitle)
      : !hasHeadingBlock;

  const titleHeader = showTitle
    ? `  <header class="post-header mb-8">
    <h1 class="text-3xl font-bold leading-tight">{{title}}</h1>
  </header>\n`
    : "";

  return `<article class="post-full-content py-12 max-w-2xl mx-auto px-6">
  {{#if @page.show_title_and_feature_image}}
${titleHeader}  {{#if feature_image}}
    <figure class="post-feature-image rounded-md overflow-hidden my-6">
      <img src="{{feature_image}}" alt="{{title}}" class="w-full h-auto" />
    </figure>
  {{/if}}
  {{/if}}
  <div class="post-body text-sm leading-relaxed mt-4">
    {{content}}
  </div>
</article>`;
};