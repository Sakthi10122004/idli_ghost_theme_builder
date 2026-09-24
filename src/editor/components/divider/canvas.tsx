import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  useCanvasDarkMode();

  const lineStyle = (block.props?.style as string) || "solid";
  const thickness = (block.props?.thickness as string) || "1px";
  const width = (block.props?.width as string) || "100%";
  const alignment = (block.props?.alignment as string) || "center";
  const margin = (block.props?.margin as string) || "32px";
  const color = (block.props?.color as string) || "#ebebeb";

  const justify =
    alignment === "left"
      ? "justify-start"
      : alignment === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <div className={`w-full flex ${justify} py-1 items-center`}>
      <hr
        className="transition-all"
        style={{
          border: "none",
          borderTop: `${thickness} ${lineStyle} ${color}`,
          width,
          marginTop: margin,
          marginBottom: margin,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
};