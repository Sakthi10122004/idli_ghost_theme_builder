import { BuilderBlock } from "@/types/theme";

interface PricingTier {
  name: string;
  price: string;
  features?: string[];
  buttonLabel?: string;
  href?: string;
}

export const compileToHbs = (block: BuilderBlock): string => {
  const tiers: PricingTier[] = Array.isArray(block.props?.tiers) ? block.props.tiers : [];
  const title = block.props?.title as string | undefined;
  const wrapperId = `pricing-${block.id}`;

  return `<style>
  #${wrapperId} {
    padding: 3rem 1.5rem;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
  }
  #${wrapperId} .pricing-title {
    font-size: 0.875rem;
    font-family: var(--font-mono, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #737373);
    margin-bottom: 2rem;
  }
  #${wrapperId} .pricing-grid {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1.5rem;
    max-width: 56rem;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }
  @media (min-width: 768px) {
    #${wrapperId} .pricing-grid {
      flex-direction: row;
    }
  }
  #${wrapperId} .pricing-tier {
    border: 1px solid var(--color-hairline, #ebebeb);
    border-radius: var(--radius-md, 8px);
    padding: 1.5rem;
    background-color: var(--color-bg, #ffffff);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  #${wrapperId} .pricing-tier:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
  #${wrapperId} .tier-name {
    font-size: 0.6875rem;
    font-family: var(--font-mono, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-muted, #737373);
    font-weight: 600;
  }
  #${wrapperId} .tier-price {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-fg, #171717);
    margin-top: 0.5rem;
    line-height: 1.2;
  }
  #${wrapperId} .tier-features {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    font-size: 0.75rem;
    color: var(--color-muted, #737373);
  }
  #${wrapperId} .tier-btn {
    margin-top: 1.5rem;
    display: block;
    text-align: center;
    background-color: var(--color-primary, #171717);
    color: var(--color-on-primary, #ffffff) !important;
    text-decoration: none;
    padding: 0.625rem 1rem;
    border-radius: var(--radius-pill, 9999px);
    font-size: 0.75rem;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  #${wrapperId} .tier-btn:hover {
    opacity: 0.9;
  }
  html.dark #${wrapperId} .pricing-tier {
    background-color: var(--color-bg, #111111);
    border-color: var(--color-hairline, #333333);
  }
  html.dark #${wrapperId} .tier-price {
    color: var(--color-fg, #ffffff);
  }
  html.dark #${wrapperId} .tier-btn {
    background-color: var(--color-primary, #ffffff);
    color: var(--color-on-primary, #000000) !important;
  }
</style>
<div id="${wrapperId}" class="pricing-table-block">
  ${title ? `<h3 class="pricing-title">${title}</h3>` : ""}
  <div class="pricing-grid">
    ${tiers.map((tier) => `
    <div class="pricing-tier">
      <div>
        <span class="tier-name">${tier.name}</span>
        <span class="tier-price">${tier.price}</span>
        <div class="tier-features">
          ${(tier.features || []).map((f) => `<span>✓ ${f}</span>`).join("\n          ")}
        </div>
      </div>
      <a href="${tier.href || "#"}" class="tier-btn">${tier.buttonLabel || "Choose Plan"}</a>
    </div>`).join("\n    ")}
  </div>
</div>`;
};