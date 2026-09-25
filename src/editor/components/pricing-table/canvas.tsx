import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { useCanvasDarkMode } from "../shared/useCanvasDarkMode";
import { getBackgroundStyle } from "../shared/background";

interface PricingTier {
  name: string;
  price: string;
  features?: string[];
  buttonLabel?: string;
}

export const CanvasElement = ({ block }: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isDark = useCanvasDarkMode();
  const isMobile = deviceMode === "mobile";
  const tiers = block.props.tiers || [];
  const styles = block.styles || {};
  const bgStyle = getBackgroundStyle(styles);

  return (
    <div className={`pricing-table-block py-8 text-center w-full ${styles.backgroundType === "mesh" ? "mesh-glow" : ""}`} style={bgStyle}>
      {block.props.title && <h3 className={`text-sm font-mono uppercase tracking-wider mb-6 ${isDark ? "text-neutral-400" : "text-muted"}`}>{block.props.title}</h3>}
      <div className={`pricing-grid flex ${isMobile ? "flex-col" : "flex-col md:flex-row"} justify-center gap-6 max-w-4xl mx-auto`}>
        {tiers.map((tier: PricingTier, idx: number) => (
          <div key={idx} className={`pricing-tier border rounded-md p-6 flex flex-col justify-between flex-1 transition-colors ${
            isDark ? "bg-neutral-900 border-white/10 text-white" : "bg-brand-canvas border-brand-hairline text-brand-ink"
          }`}>
            <div className="mb-6">
              <span className={`tier-name text-[10px] font-mono uppercase tracking-wider font-semibold ${isDark ? "text-neutral-400" : "text-muted"}`}>{tier.name}</span>
              <span className={`tier-price block text-3xl font-bold mt-2 ${isDark ? "text-white" : "text-brand-ink"}`}>{tier.price}</span>
              <div className={`tier-features flex flex-col gap-1 mt-4 text-xs ${isDark ? "text-neutral-400" : "text-brand-mute"}`}>
                {(tier.features || []).map((f: string, fIdx: number) => <span key={fIdx}>✓ {f}</span>)}
              </div>
            </div>
            <button className={`${isDark ? "bg-white text-black" : "bg-brand-primary text-brand-on-primary"} hover:opacity-90 px-4 py-2 rounded-pill text-xs font-semibold shadow-level-3`}>
              {tier.buttonLabel || "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};