import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div style="height: ${block.props.height || '40px'};"></div>`;
};