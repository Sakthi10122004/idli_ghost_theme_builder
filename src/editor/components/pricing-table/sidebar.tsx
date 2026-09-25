import React from "react";
import { BuilderBlock } from "@/types/theme";
import { BackgroundControls } from "../shared/BackgroundControls";

interface PricingTierItem {
  name?: string;
  price?: string;
  [key: string]: unknown;
}

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles: (styles: Record<string, unknown>) => void;
}) => {
  const tiers = (block.props.tiers as PricingTierItem[]) || [];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Table Title</label>
        <input
          type="text"
          value={(block.props.title as string) || ""}
          onChange={(e) => onChangeProps({ title: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      <BackgroundControls
        styles={block.styles}
        appearance={{ backgroundColor: (block.styles?.backgroundColor as string) || "transparent" }}
        onChangeStyles={(s) => onChangeStyles(s)}
        updateAppearance={(_, v) => onChangeStyles({ backgroundColor: v })}
      />

      <span className="text-[11px] font-sans font-semibold text-brand-body border-t border-brand-hairline pt-3">Pricing Tiers</span>
      {tiers.map((tier, idx: number) => (
        <div key={idx} className="border border-brand-hairline p-2 rounded-sm flex flex-col gap-2 bg-brand-canvas-soft">
          <input
            type="text"
            placeholder="Tier Name"
            value={tier.name || ""}
            onChange={(e) => {
              const nextTiers = [...tiers];
              nextTiers[idx] = { ...nextTiers[idx], name: e.target.value };
              onChangeProps({ tiers: nextTiers });
            }}
            className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
          />
          <input
            type="text"
            placeholder="Price"
            value={tier.price || ""}
            onChange={(e) => {
              const nextTiers = [...tiers];
              nextTiers[idx] = { ...nextTiers[idx], price: e.target.value };
              onChangeProps({ tiers: nextTiers });
            }}
            className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
          />
        </div>
      ))}
    </div>
  );
};