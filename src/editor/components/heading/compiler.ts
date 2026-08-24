import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string, isPageContext: boolean) => {
  const level = block.props.level || 2;
  return `<h${level} class="heading font-heading">${block.props.text || "Heading Content"}</h${level}>`;
};