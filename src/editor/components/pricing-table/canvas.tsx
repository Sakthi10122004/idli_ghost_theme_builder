import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";

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
  const isMobile = deviceMode === "mobile";
  const tiers = block.props.tiers || [];
  return (
    <div className="pricing-table-block py-8 text-center w-full">
      {block.props.title && <h3 className="text-sm font-mono uppercase tracking-wider text-muted mb-6">{block.props.title}</h3>}
      <div className={`pricing-grid flex ${isMobile ? "flex-col" : "flex-col md:flex-row"} justify-center gap-6 max-w-4xl mx-auto`}>
        {tiers.map((tier: PricingTier, idx: number) => (
          <div key={idx} className="pricing-tier border border-brand-hairline rounded-md p-6 bg-white flex flex-col justify-between flex-1">
            <div className="mb-6">
              <span className="tier-name text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">{tier.name}</span>
              <span className="tier-price block text-3xl font-bold mt-2">{tier.price}</span>
              <div className="tier-features flex flex-col gap-1 mt-4 text-xs text-brand-mute">
                {(tier.features || []).map((f: string, fIdx: number) => <span key={fIdx}>✓ {f}</span>)}
              </div>
            </div>
            <button className="bg-brand-primary text-white hover:bg-black px-4 py-2 rounded-pill text-xs font-semibold shadow-level-3">
              {tier.buttonLabel || "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};