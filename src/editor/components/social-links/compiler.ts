import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="social-links-row py-4 flex justify-center gap-6 text-xs font-mono">
  ${block.props.github ? `<a href="${block.props.github}" target="_blank" rel="noreferrer">GitHub</a>` : ""}
  ${block.props.twitter ? `<a href="${block.props.twitter}" target="_blank" rel="noreferrer">Twitter</a>` : ""}
  ${block.props.website ? `<a href="${block.props.website}" target="_blank" rel="noreferrer">Website</a>` : ""}
</div>`;
};