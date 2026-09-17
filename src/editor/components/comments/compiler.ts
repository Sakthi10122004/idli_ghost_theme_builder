import { BuilderBlock } from "@/types/theme";
import { resolveCommentsProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveCommentsProps(block.props);
  const countMarkup = p.showCount ? " ({{comment_count}})" : "";

  return `<section class="gh-comments-section py-8 max-w-2xl mx-auto px-6">
  <h3 class="gh-comments-heading text-xl font-bold mb-4">${p.heading}${countMarkup}</h3>
  {{comments}}
</section>`;
};
