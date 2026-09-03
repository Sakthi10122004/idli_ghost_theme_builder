import { BuilderBlock } from "@/types/theme";
import { StatsProps, defaultProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";

const COLS_CLASS: Record<number, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
};

export const generateHTML = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as StatsProps;
  const general = p.general;
  const stats = p.stats || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};
  
  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = p.advanced?.htmlAnchor || `stats-${block.id}`;
  
  const renderStat = (stat: any) => {
    if (general.layoutStyle === "cards") {
      return `
        <div class="stats-item card">
          ${(stat.iconType === 'image' && stat.imageUrl) ? `<div class="stats-icon image"><img src="${stat.imageUrl}" alt="${stat.label}" /></div>` : stat.icon ? `<div class="stats-icon">${stat.icon}</div>` : ''}
          <dt class="stats-label">${stat.label}</dt>
          <dd class="stats-value">${stat.value}</dd>
        </div>
      `;
    } else if (general.layoutStyle === "bordered") {
      return `
        <div class="stats-item bordered">
          <dt class="stats-label">${stat.label}</dt>
          <dd class="stats-value">${stat.value}</dd>
        </div>
      `;
    } else if (general.layoutStyle === "accent-cards") {
      return `
        <div class="stats-item accent-card">
          ${(stat.iconType === 'image' && stat.imageUrl) ? `<div class="stats-icon image"><img src="${stat.imageUrl}" alt="${stat.label}" /></div>` : stat.icon ? `<div class="stats-icon">${stat.icon}</div>` : ''}
          <dd class="stats-value">${stat.value}</dd>
          <dt class="stats-label">${stat.label}</dt>
        </div>
      `;
    } else if (general.layoutStyle === "divider-grid") {
      return `
        <div class="stats-item divider-cell">
          <dt class="stats-label">${stat.label}</dt>
          <dd class="stats-value">${stat.value}</dd>
        </div>
      `;
    }
    
    // Default "row" and "split"
    return `
      <div class="stats-item row">
        <dt class="stats-label">${stat.label}</dt>
        <dd class="stats-value">${stat.value}</dd>
      </div>
    `;
  };

  const gridCols = COLS_CLASS[general.columns] || COLS_CLASS[3];
  
  const headingHtml = (general.heading || general.subheading) ? `
    <div class="stats-header">
      ${general.heading ? `<h2 class="stats-heading">${general.heading}</h2>` : ''}
      ${general.subheading ? `<p class="stats-subheading">${general.subheading}</p>` : ''}
    </div>
  ` : '';

  return `<style>
  #${wrapperId} {
    ${bgCss}
    padding-top: ${spacing.paddingTop || '4rem'};
    padding-bottom: ${spacing.paddingBottom || '4rem'};
    position: relative;
    width: 100%;
  }
  #${wrapperId} .stats-inner {
    width: 100%;
    min-width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  #${wrapperId} .stats-header {
    width: 100%;
    min-width: 100%;
    text-align: center;
    max-width: 56rem;
    margin: 0 auto 3rem auto;
  }
  #${wrapperId} .stats-heading {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.025em;
    color: ${appearance?.headingColor || "var(--color-fg)"};
    margin: 0;
  }
  @media (min-width: 640px) {
    #${wrapperId} .stats-heading {
      font-size: 2.5rem;
    }
  }
  #${wrapperId} .stats-subheading {
    margin-top: 1rem;
    font-size: 1.125rem;
    line-height: 1.75;
    color: ${appearance?.subheadingColor || "var(--color-muted)"};
  }
  
  #${wrapperId} .stats-grid {
    display: grid;
    gap: 3rem 2rem;
  }
  #${wrapperId} .stats-grid.gap-y-6 {
    gap: 1.5rem 2rem;
  }
  
  #${wrapperId} .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  @media (min-width: 640px) {
    #${wrapperId} .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width: 768px) {
    #${wrapperId} .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    #${wrapperId} .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    #${wrapperId} .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  /* Stat Items */
  #${wrapperId} .stats-item {
    display: flex;
    flex-direction: column;
  }
  
  /* Row Style */
  #${wrapperId} .stats-item.row {
    align-items: center;
    text-align: center;
  }
  #${wrapperId} .stats-item.row .stats-label {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.75;
    color: ${appearance?.labelColor || "var(--color-muted)"};
  }
  #${wrapperId} .stats-item.row .stats-value {
    order: -1;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: ${appearance?.valueColor || "var(--color-fg)"};
    margin: 0 0 0.5rem 0;
  }
  
  /* Cards Style */
  #${wrapperId} .stats-item.card {
    background-color: #ffffff;
    border-radius: 0.75rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0,0,0,0.05);
    padding: 2rem;
    align-items: center;
    text-align: center;
  }
  #${wrapperId} .stats-item.card .stats-icon {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    margin-bottom: 1rem;
    background-color: var(--color-primary-light, #e0f2fe);
    color: var(--color-primary);
  }
  #${wrapperId} .stats-item.card .stats-icon svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  #${wrapperId} .stats-item.card .stats-icon.image {
    background-color: transparent;
    overflow: hidden;
  }
  #${wrapperId} .stats-item.card .stats-icon.image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .stats-item.card .stats-label {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.5;
    color: ${appearance?.labelColor || "var(--color-muted)"};
  }
  #${wrapperId} .stats-item.card .stats-value {
    order: -1;
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: ${appearance?.valueColor || "var(--color-fg)"};
    margin: 0 0 0.5rem 0;
  }
  
  /* Split Layout */
  #${wrapperId} .stats-split-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    align-items: center;
  }
  @media (min-width: 1024px) {
    #${wrapperId} .stats-split-container {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }
  #${wrapperId} .stats-split-header {
    text-align: left;
    max-width: 100%;
    margin: 0;
  }
  #${wrapperId} .stats-split-header .stats-heading {
    margin-bottom: 1rem;
  }

  /* Accent Cards Style */
  #${wrapperId} .stats-item.accent-card {
    background-color: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(4px);
    border-radius: 0 0.75rem 0.75rem 0;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border-top: 1px solid rgba(0,0,0,0.05);
    border-right: 1px solid rgba(0,0,0,0.05);
    border-bottom: 1px solid rgba(0,0,0,0.05);
    border-left: 4px solid var(--color-primary, #171717);
    padding: 2rem;
    align-items: flex-start;
    text-align: left;
  }
  #${wrapperId} .stats-item.accent-card .stats-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    background-color: var(--color-primary-light, #e0f2fe);
    color: var(--color-primary);
  }
  #${wrapperId} .stats-item.accent-card .stats-icon svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  #${wrapperId} .stats-item.accent-card .stats-icon.image {
    background-color: transparent;
    overflow: hidden;
  }
  #${wrapperId} .stats-item.accent-card .stats-icon.image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${wrapperId} .stats-item.accent-card .stats-label {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
    color: ${appearance?.labelColor || "var(--color-muted)"};
  }
  #${wrapperId} .stats-item.accent-card .stats-value {
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: ${appearance?.valueColor || "var(--color-fg)"};
    margin: 0 0 0.5rem 0;
  }

  /* Divider Grid Style */
  #${wrapperId} .stats-grid.divider {
    gap: 0;
    border-top: 1px solid rgba(0,0,0,0.1);
    border-left: 1px solid rgba(0,0,0,0.1);
  }
  #${wrapperId} .stats-item.divider-cell {
    padding: 2rem;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    border-right: 1px solid rgba(0,0,0,0.1);
  }
  #${wrapperId} .stats-item.divider-cell .stats-label {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.5;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${appearance?.labelColor || "var(--color-muted)"};
    margin-bottom: 0.5rem;
  }
  #${wrapperId} .stats-item.divider-cell .stats-value {
    order: 1;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: ${appearance?.valueColor || "var(--color-fg)"};
    margin: 0;
  }
</style>
<div id="${wrapperId}" class="stats-section ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}">
  <div class="stats-inner">
    ${general.layoutStyle === 'split' ? `
      <div class="stats-split-container">
        <div class="stats-split-header">
          ${general.heading ? `<h2 class="stats-heading">${general.heading}</h2>` : ''}
          ${general.subheading ? `<p class="stats-subheading">${general.subheading}</p>` : ''}
        </div>
        <div class="stats-split-grid">
          <dl class="stats-grid ${gridCols}">
            ${stats.map(renderStat).join("")}
          </dl>
        </div>
      </div>
    ` : `
      ${headingHtml}
      <dl class="stats-grid ${gridCols} ${general.layoutStyle === 'cards' || general.layoutStyle === 'accent-cards' ? 'gap-y-6' : ''} ${general.layoutStyle === 'divider-grid' ? 'divider' : ''}">
        ${stats.map(renderStat).join("")}
      </dl>
    `}
  </div>
</div>`;
};

export const compileToHbs = generateHTML;
