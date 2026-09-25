import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { getBackgroundStyle } from "../shared/background";

export const CanvasElement = ({
  block,
  renderChildren,
}: {
  block?: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();

  const maxWidth = (block?.props?.maxWidth as string) || (block?.styles?.width as string) || "1200px";
  const alignment = (block?.props?.alignment as string) || "center";
  const paddingTop = (block?.styles?.paddingTop as string) || (block?.props?.paddingY as string) || "0px";
  const paddingBottom = (block?.styles?.paddingBottom as string) || (block?.props?.paddingY as string) || "0px";
  const paddingLeft = (block?.styles?.paddingLeft as string) || (block?.props?.paddingX as string) || "24px";
  const paddingRight = (block?.styles?.paddingRight as string) || (block?.props?.paddingX as string) || "24px";
  const direction = (block?.props?.direction as string) || "column";
  const gap = (block?.props?.gap as string) || "16px";

  const marginLeft = alignment === "left" ? "0" : "auto";
  const marginRight = alignment === "right" ? "0" : "auto";

  const rawBg = (block?.styles?.backgroundColor as string) || (block?.props?.backgroundColor as string) || "";
  const bgType = block?.styles?.backgroundType || "solid";
  const hasBg = Boolean((rawBg && rawBg !== "transparent") || (bgType && bgType !== "solid"));
  const bgStyle = hasBg ? getBackgroundStyle(block?.styles, { backgroundColor: rawBg }) : {};

  return (
    <div
      className={`w-full box-border text-brand-ink dark:text-brand-ink transition-all min-h-[32px] ${hasBg ? "rounded-sm" : ""}`}
      style={{
        maxWidth,
        marginLeft,
        marginRight,
        paddingLeft,
        paddingRight,
        paddingTop,
        paddingBottom,
        ...bgStyle,
        display: direction === "row" ? "flex" : undefined,
        flexDirection: direction === "row" ? "row" : undefined,
        flexWrap: direction === "row" ? "wrap" : undefined,
        gap: direction === "row" ? gap : undefined,
        alignItems: direction === "row" ? "flex-start" : undefined,
      }}
    >
      {renderChildren ? renderChildren() : null}
    </div>
  );
};