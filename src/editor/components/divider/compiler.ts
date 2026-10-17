import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const lineStyle = (block.props?.style as string) || "solid";
  const thickness = (block.props?.thickness as string) || "1px";
  const width = (block.props?.width as string) || "100%";
  const alignment = (block.props?.alignment as string) || "center";
  const margin = (block.props?.margin as string) || "32px";
  const color = (block.props?.color as string) || "var(--color-hairline, #ebebeb)";

  const marginX =
    alignment === "left"
      ? "margin-left: 0; margin-right: auto;"
      : alignment === "right"
      ? "margin-left: auto; margin-right: 0;"
      : "margin-left: auto; margin-right: auto;";

  return `<hr class="divider-hairline" style="border: none; border-top: ${thickness} ${lineStyle} ${color}; width: ${width}; margin-top: ${margin}; margin-bottom: ${margin}; ${marginX} box-sizing: border-box;" />`;
};
