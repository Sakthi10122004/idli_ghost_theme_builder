import { BuilderBlock } from "@/types/theme";
import { resolveEmbedProps } from "./schema";

// Intentionally raw and unescaped — responsibility for the embed code's safety rests with whoever pastes it.
export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveEmbedProps(block.props);
  return `<div class="gh-embed-wrapper" style="max-width: ${p.maxWidth}; aspect-ratio: ${p.aspectRatio};">
  ${p.html}
</div>`;
};
