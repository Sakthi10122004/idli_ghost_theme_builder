import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveEmbedProps } from "./schema";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const p = resolveEmbedProps(block.props);

  return (
    <div
      className="w-full mx-auto my-4 overflow-hidden rounded-md border border-brand-hairline bg-brand-canvas-soft flex items-center justify-center"
      style={{
        maxWidth: p.maxWidth || "100%",
        aspectRatio: p.aspectRatio && p.aspectRatio !== "auto" ? p.aspectRatio : undefined,
      }}
    >
      {p.html ? (
        <div
          className="w-full h-full flex items-center justify-center [&>iframe]:w-full [&>iframe]:h-full"
          dangerouslySetInnerHTML={{ __html: p.html }}
        />
      ) : (
        <div className="p-8 text-center text-brand-mute text-xs font-mono">
          Paste embed code or iframe in sidebar
        </div>
      )}
    </div>
  );
};
