import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const height = (block.props?.height as string) || "40px";
  return `<div class="theme-spacer" style="height: ${height};" aria-hidden="true"></div>`;
};