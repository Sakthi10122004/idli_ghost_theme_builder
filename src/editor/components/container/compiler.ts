import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string) => {
  const maxWidth = (block.props?.maxWidth as string) || (block.styles?.width as string) || "var(--container-width, 1200px)";
  const alignment = (block.props?.alignment as string) || "center";
  const margin = alignment === "left" ? "0 auto 0 0" : alignment === "right" ? "0 0 0 auto" : "0 auto";
  const paddingX = (block.props?.paddingX as string) || "clamp(1rem, 4vw, 2.5rem)";
  const paddingY = (block.props?.paddingY as string) || "0px";
  const bg = (block.styles?.backgroundColor as string) || (block.props?.backgroundColor as string) || "";
  const bgStyle = bg && bg !== "transparent" ? ` background-color: ${bg}; border-radius: 6px;` : "";
  const direction = (block.props?.direction as string) || "column";
  const gap = (block.props?.gap as string) || "16px";
  const flexStyle = direction === "row" ? ` display: flex; flex-direction: row; flex-wrap: wrap; gap: ${gap}; align-items: flex-start;` : "";

  return `<div class="container-inner" style="max-width: ${maxWidth}; margin: ${margin}; padding-left: ${paddingX}; padding-right: ${paddingX}; padding-top: ${paddingY}; padding-bottom: ${paddingY};${bgStyle}${flexStyle}">
  ${compiledChildren}
</div>`;
};