import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveCommentsProps } from "./schema";
import { MessageSquare } from "lucide-react";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const p = resolveCommentsProps(block.props);

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-brand-hairline pb-3">
        <MessageSquare size={18} className="text-brand-ink" />
        <h3 className="text-lg font-bold text-brand-ink">
          {p.heading}
          {p.showCount && <span className="text-brand-mute font-normal ml-2">(3)</span>}
        </h3>
      </div>

      {/* 3 Mock Comment Bubbles */}
      <div className="space-y-4">
        {/* Comment 1 */}
        <div className="flex items-start gap-3 bg-white p-4 rounded-md border border-brand-hairline shadow-level-1">
          <div className="w-8 h-8 rounded-full bg-brand-canvas-soft-2 border border-brand-hairline flex items-center justify-center font-semibold text-xs text-brand-body shrink-0">
            SC
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-brand-hairline-strong/60 rounded"></div>
              <div className="h-2.5 w-14 bg-brand-hairline rounded"></div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-brand-hairline/70 rounded"></div>
              <div className="h-3 w-4/5 bg-brand-hairline/70 rounded"></div>
            </div>
          </div>
        </div>

        {/* Comment 2 */}
        <div className="flex items-start gap-3 bg-white p-4 rounded-md border border-brand-hairline shadow-level-1">
          <div className="w-8 h-8 rounded-full bg-brand-canvas-soft-2 border border-brand-hairline flex items-center justify-center font-semibold text-xs text-brand-body shrink-0">
            JR
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-brand-hairline-strong/60 rounded"></div>
              <div className="h-2.5 w-16 bg-brand-hairline rounded"></div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-11/12 bg-brand-hairline/70 rounded"></div>
              <div className="h-3 w-3/4 bg-brand-hairline/70 rounded"></div>
            </div>
          </div>
        </div>

        {/* Comment 3 */}
        <div className="flex items-start gap-3 bg-white p-4 rounded-md border border-brand-hairline shadow-level-1">
          <div className="w-8 h-8 rounded-full bg-brand-canvas-soft-2 border border-brand-hairline flex items-center justify-center font-semibold text-xs text-brand-body shrink-0">
            AP
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-brand-hairline-strong/60 rounded"></div>
              <div className="h-2.5 w-12 bg-brand-hairline rounded"></div>
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-5/6 bg-brand-hairline/70 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
