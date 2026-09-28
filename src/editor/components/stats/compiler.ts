import { BuilderBlock } from "@/types/theme";
import { StatsProps, StatItem, defaultProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";
import { escapeHtml, escapeUrl } from "../shared/escape";

function resolveStyleValue(val: unknown, fallback: string = ""): string {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    return String(obj.desktop || obj.mobile || obj.tablet || fallback);
  }
  return fallback;
}

function resolveHbsAsset(url?: string): string {
  if (!url) return "";
  if (url.startsWith("asset://")) {
    const rel = url.replace(/^asset:\/\/(assets\/)?/, "");
    return `{{asset "${rel}"}}`;
  }
  return escapeUrl(url);
}

const COLS_CLASS: Record<number, string> = {
  2: "cols-2",
  3: "cols-3",
  4: "cols-4",
};

export const generateHTML = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as StatsProps;
  const general = p.general || defaultProps.general || { heading: "Our impact", subheading: "", layoutStyle: "row", columns: 3 };
  const stats = p.stats || defaultProps.stats || [];
  const appearance = p.appearance || defaultProps.appearance || {};
  const spacing = p.spacing || defaultProps.spacing || { paddingTop: "4rem", paddingBottom: "4rem" };
  const styles = block.styles || {};

  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = p.advanced?.htmlAnchor || `stats-${block.id}`;

  const pt = resolveStyleValue(spacing.paddingTop, "4rem");
  const pb = resolveStyleValue(spacing.paddingBottom, "4rem");

  const renderStat = (stat: StatItem, idx: number) => {
    const num = idx + 1;
    const valueHbs = `{{#if @custom.stat_${num}_value}}{{@custom.stat_${num}_value}}{{else}}${escapeHtml(stat.value || "")}{{/if}}`;
    const labelHbs = `{{#if @custom.stat_${num}_label}}{{@custom.stat_${num}_label}}{{else}}${escapeHtml(stat.label || "")}{{/if}}`;

    const defaultIconHtml = (stat.iconType === 'image' && stat.imageUrl) 
      ? `<div class="stats-icon image"><img src="${resolveHbsAsset(stat.imageUrl)}" alt="${escapeHtml(stat.label || "")}" /></div>` 
      : stat.icon 
        ? `<div class="stats-icon">${stat.icon}</div>` 
        : '';
        
    const iconHbs = `{{#if @custom.stat_${num}_icon}}
<div class="stats-icon image"><img src="{{@custom.stat_${num}_icon}}" alt="${escapeHtml(stat.label || "")}" /></div>
{{else}}
${defaultIconHtml}
{{/if}}`;

    if (general.layoutStyle === "cards") {
      return `
        <div class="stats-item card">
          ${iconHbs}
          <dd class="stats-value">${valueHbs}</dd>
          <dt class="stats-label">${labelHbs}</dt>
        </div>
      `;
    } else if (general.layoutStyle === "bordered") {
      return `
        <div class="stats-item bordered">
          <dd class="stats-value">${valueHbs}</dd>
          <dt class="stats-label">${labelHbs}</dt>
        </div>
      `;
    } else if (general.layoutStyle === "accent-cards") {
      return `
        <div class="stats-item accent-card">
          ${iconHbs}
          <dd class="stats-value">${valueHbs}</dd>
          <dt class="stats-label">${labelHbs}</dt>
        </div>
      `;
    } else if (general.layoutStyle === "divider-grid") {
      return `
        <div class="stats-item divider-cell">
          <dt class="stats-label">${labelHbs}</dt>
          <dd class="stats-value">${valueHbs}</dd>
        </div>
      `;
    }

    // Default "row" and "split"
    return `
      <div class="stats-item row">
        <dt class="stats-label">${labelHbs}</dt>
        <dd class="stats-value">${valueHbs}</dd>
      </div>
    `;
  };

  let statsHtml = "";
  for (let i = 0; i < stats.length; i++) {
    const statObj = stats[i];
    const renderedMarkup = renderStat(statObj, i);
    statsHtml += renderedMarkup;
  }


  const activeCols = Math.max(1, Math.min(general.columns, stats.length));
  const gridCols = COLS_CLASS[activeCols] || `cols-${activeCols}`;

  const headingHtml = (general.heading || general.subheading) ? `
    <div class="stats-header">
      {{#if @custom.stats_heading}}
        <h2 class="stats-heading">{{@custom.stats_heading}}</h2>
      {{else}}
        ${general.heading ? `<h2 class="stats-heading">${escapeHtml(general.heading)}</h2>` : ''}
      {{/if}}
      {{#if @custom.stats_subheading}}
        <p class="stats-subheading">{{@custom.stats_subheading}}</p>
      {{else}}
        ${general.subheading ? `<p class="stats-subheading">${escapeHtml(general.subheading)}</p>` : ''}
      {{/if}}
    </div>
  ` : `
    {{#if @custom.stats_heading}}
    <div class="stats-header">
      <h2 class="stats-heading">{{@custom.stats_heading}}</h2>
      {{#if @custom.stats_subheading}}<p class="stats-subheading">{{@custom.stats_subheading}}</p>{{/if}}
    </div>
    {{/if}}
  `;

  return `<style>
  #${wrapperId} {
    ${bgCss}
    padding-top: ${pt};
    padding-bottom: ${pb};
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
  
  #${wrapperId} .cols-1,
  #${wrapperId} .cols-2,
  #${wrapperId} .cols-3,
  #${wrapperId} .cols-4 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  @media (min-width: 640px) {
    #${wrapperId} .cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    #${wrapperId} .cols-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    #${wrapperId} .cols-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (min-width: 768px) {
    #${wrapperId} .cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    #${wrapperId} .cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
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
    background-color: var(--color-bg, #ffffff);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.06);
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
    font-size: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    color: ${appearance?.valueColor || "var(--color-fg)"};
    margin: 0 0 0.5rem 0;
  }
  
  /* Bordered Style */
  #${wrapperId} .stats-item.bordered {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding: 1.5rem 0;
  }
  #${wrapperId} .stats-item.bordered .stats-label {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.5;
    color: ${appearance?.labelColor || "var(--color-muted)"};
  }
  #${wrapperId} .stats-item.bordered .stats-value {
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

  /* Dark Mode Styles */
  html.dark #${wrapperId} .stats-item.card {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
  html.dark #${wrapperId} .stats-item.accent-card {
    background-color: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
  html.dark #${wrapperId} .stats-grid.divider,
  html.dark #${wrapperId} .stats-item.divider-cell {
    border-color: rgba(255, 255, 255, 0.12);
  }
  html.dark #${wrapperId} .stats-item.bordered {
    border-top-color: rgba(255, 255, 255, 0.12);
  }
</style>
<div id="${wrapperId}" class="stats-section kg-width-full ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}">
  <div class="stats-inner">
    ${general.layoutStyle === 'split' ? `
      <div class="stats-split-container">
        <div class="stats-split-header">
          {{#if @custom.stats_heading}}
            <h2 class="stats-heading">{{@custom.stats_heading}}</h2>
          {{else}}
            ${general.heading ? `<h2 class="stats-heading">${escapeHtml(general.heading)}</h2>` : ''}
          {{/if}}
          {{#if @custom.stats_subheading}}
            <p class="stats-subheading">{{@custom.stats_subheading}}</p>
          {{else}}
            ${general.subheading ? `<p class="stats-subheading">${escapeHtml(general.subheading)}</p>` : ''}
          {{/if}}
        </div>
        <div class="stats-split-grid">
          <dl class="stats-grid ${gridCols}">
            ${statsHtml}
          </dl>
        </div>
      </div>
    ` : `
      ${headingHtml}
      <dl class="stats-grid ${gridCols} ${general.layoutStyle === 'cards' || general.layoutStyle === 'accent-cards' ? 'gap-y-6' : ''} ${general.layoutStyle === 'divider-grid' ? 'divider' : ''}">
        ${statsHtml}
      </dl>
    `}
  </div>
</div>`;
};

export const compileToHbs = generateHTML;
