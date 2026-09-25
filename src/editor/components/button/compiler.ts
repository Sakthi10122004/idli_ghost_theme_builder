import { BuilderBlock } from "@/types/theme";
import { escapeHtml, escapeUrl } from "../shared/escape";

export const compileToHbs = (block: BuilderBlock) => {
  const isPrimary = block.props.variant !== 'secondary';
  const shape = block.props.shape || 'pill';

  let shapeCss = 'border-radius: var(--radius-pill); padding: 0.5rem 1.5rem;';
  if (shape === 'square') {
    shapeCss = 'border-radius: 0px; padding: 0.5rem 1.5rem;';
  } else if (shape === 'rounded') {
    shapeCss = 'border-radius: var(--radius-md, 8px); padding: 0.5rem 1.5rem;';
  } else if (shape === 'circle') {
    shapeCss = 'border-radius: 50%; aspect-ratio: 1 / 1; min-width: 2.5rem; min-height: 2.5rem; padding: 0.5rem; text-align: center;';
  }

  return `<style>
  #btn-${block.id} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    ${shapeCss}
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    ${isPrimary ? `
    background-color: var(--color-primary);
    color: var(--color-on-primary, #ffffff);
    ` : `
    background-color: var(--color-bg);
    color: var(--color-fg);
    border: 1px solid rgba(0,0,0,0.1);
    `}
  }
  #btn-${block.id}:hover {
    ${isPrimary ? `
    opacity: 0.85;
    ` : `
    background-color: rgba(0,0,0,0.02);
    `}
  }
  html.dark #btn-${block.id} {
    ${isPrimary ? `
    background-color: var(--color-primary);
    color: var(--color-on-primary, #000000);
    ` : `
    background-color: var(--color-bg);
    color: var(--color-fg);
    border-color: rgba(255, 255, 255, 0.2);
    `}
  }
</style>
<a id="btn-${block.id}" href="${escapeUrl(block.props.href)}" class="btn">${escapeHtml(block.props.label || 'Click Here')}</a>`;
};