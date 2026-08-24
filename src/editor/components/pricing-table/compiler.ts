import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="pricing-table-block py-8 text-center">
  ${block.props.title ? `<h3 class="text-sm font-mono uppercase tracking-wider text-muted mb-6">${block.props.title}</h3>` : ""}
  <div class="pricing-grid flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto">
    ${(block.props.tiers || []).map((tier: any) => `
    <div class="pricing-tier border border-brand-hairline rounded-md p-6 bg-white flex flex-col justify-between flex-1">
      <div class="mb-6">
        <span class="tier-name text-[10px] font-mono uppercase tracking-wider text-muted font-semibold">${tier.name}</span>
        <span class="tier-price block text-3xl font-bold mt-2">${tier.price}</span>
        <div class="tier-features flex flex-col gap-1 mt-4 text-xs text-muted">
          ${(tier.features || []).map((f: any) => `<span>✓ ${f}</span>`).join("\n")}
        </div>
      </div>
      <a href="#" class="btn btn-primary">${tier.buttonLabel || "Choose Plan"}</a>
    </div>`).join("\n")}
  </div>
</div>`;
};