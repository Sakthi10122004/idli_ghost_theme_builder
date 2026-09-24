import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

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
  const paddingX = (block?.props?.paddingX as string) || "24px";
  const paddingY = (block?.props?.paddingY as string) || "0px";
  const direction = (block?.props?.direction as string) || "column";
  const gap = (block?.props?.gap as string) || "16px";

  const marginLeft = alignment === "left" ? "0" : "auto";
  const marginRight = alignment === "right" ? "0" : "auto";

  const bgColor = (block?.styles?.backgroundColor as string) || (block?.props?.backgroundColor as string) || undefined;
  const hasBg = bgColor && bgColor !== "transparent";

  return (
    <div
      className={`w-full box-border text-brand-ink dark:text-brand-ink transition-all min-h-[32px] ${hasBg ? "rounded-sm" : ""}`}
      style={{
        maxWidth,
        marginLeft,
        marginRight,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        backgroundColor: hasBg ? bgColor : undefined,
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