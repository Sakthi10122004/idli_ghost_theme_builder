import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<p class="text-content font-body">${block.props.text || "Paragraph Content."}</p>`;
};