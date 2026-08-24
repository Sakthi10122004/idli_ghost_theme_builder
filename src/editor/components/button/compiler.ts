import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<a href="${block.props.href || '#'}" class="btn btn-${block.props.variant || 'primary'}">${block.props.label || 'Click Here'}</a>`;
};