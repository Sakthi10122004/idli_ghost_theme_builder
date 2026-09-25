import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveCardsProps, CardItem } from "./schema";
import { useEditorStore } from "@/store/editorStore";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { getBackgroundStyle } from "../shared/background";

export const CanvasElement = ({
  block,
  isSelected,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const isDark = useCanvasDarkMode();
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const p = resolveCardsProps(block.props);
  const items: CardItem[] = p.items || [];
  const styles = block.styles || {};
  const bgStyle = getBackgroundStyle(styles);

  const columns = Math.min(Math.max(2, p.columns || 3), 4);
  const cardStyle = p.cardStyle || "bordered";

  // Grid columns class based on deviceMode
  const getGridColsClass = () => {
    if (deviceMode === "mobile") return "grid-cols-1";
    if (deviceMode === "tablet") return "grid-cols-2";
    if (columns === 2) return "grid-cols-1 sm:grid-cols-2";
    if (columns === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  const getCardStyleClass = () => {
    if (cardStyle === "soft") {
      return isDark
        ? "bg-neutral-900 border border-white/10"
        : "bg-brand-canvas-soft border border-brand-hairline";
    }
    if (cardStyle === "elevated") {
      return isDark
        ? "bg-neutral-900 border border-white/10 shadow-lg"
        : "bg-white border border-brand-hairline shadow-level-2";
    }
    if (cardStyle === "minimal") {
      return isDark
        ? "bg-transparent border border-white/10"
        : "bg-transparent border border-brand-hairline";
    }
    // bordered
    return isDark
      ? "bg-neutral-900 border border-white/10"
      : "bg-white border border-brand-hairline shadow-sm";
  };

  return (
    <div
      className={`cards-block w-full py-12 px-6 transition-all ${
        isSelected ? "ring-2 ring-brand-primary" : ""
      }`}
      style={bgStyle}
    >
      <div className="max-w-6xl mx-auto">
        {(p.heading || p.subheading) && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            {p.heading && (
              <h2
                className={`text-3xl font-semibold tracking-tight ${
                  isDark ? "text-white" : "text-brand-ink"
                }`}
              >
                {p.heading}
              </h2>
            )}
            {p.subheading && (
              <p
                className={`mt-2 text-base ${
                  isDark ? "text-neutral-400" : "text-brand-mute"
                }`}
              >
                {p.subheading}
              </p>
            )}
          </div>
        )}

        <div className={`grid gap-6 ${getGridColsClass()}`}>
          {items.map((card) => (
            <div
              key={card.id}
              className={`rounded-md overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 ${getCardStyleClass()}`}
            >
              {card.imageUrl && (
                <div className="w-full h-44 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                {card.tag && (
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider font-semibold mb-2 ${
                      isDark ? "text-blue-400" : "text-brand-primary"
                    }`}
                  >
                    {card.tag}
                  </span>
                )}
                <h4
                  className={`text-lg font-semibold mb-2 ${
                    isDark ? "text-white" : "text-brand-ink"
                  }`}
                >
                  {card.title}
                </h4>
                <p
                  className={`text-sm leading-relaxed mb-4 flex-1 ${
                    isDark ? "text-neutral-400" : "text-brand-mute"
                  }`}
                >
                  {card.description}
                </p>
                {card.linkText && (
                  <span
                    className={`text-xs font-semibold mt-auto inline-flex items-center gap-1 ${
                      isDark ? "text-white" : "text-brand-primary"
                    }`}
                  >
                    {card.linkText} &rarr;
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
