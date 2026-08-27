import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<style>
  #social-${block.id} {
    padding: 1rem 0;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }
  #social-${block.id} a {
    color: var(--color-muted);
    text-decoration: none;
    font-size: 0.875rem;
    font-family: monospace;
    transition: color 0.2s;
  }
  #social-${block.id} a:hover {
    color: var(--color-fg);
  }
</style>
<div id="social-${block.id}">
  ${block.props.github ? `<a href="${block.props.github}" target="_blank" rel="noreferrer">GitHub</a>` : ""}
  ${block.props.twitter ? `<a href="${block.props.twitter}" target="_blank" rel="noreferrer">Twitter</a>` : ""}
  ${block.props.website ? `<a href="${block.props.website}" target="_blank" rel="noreferrer">Website</a>` : ""}
</div>`;
};