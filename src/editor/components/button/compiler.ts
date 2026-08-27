import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const isPrimary = block.props.variant !== 'secondary';
  return `<style>
  #btn-${block.id} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: var(--radius-pill);
    text-decoration: none;
    transition: all 0.2s ease;
    ${isPrimary ? `
    background-color: var(--color-primary);
    color: #ffffff;
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
</style>
<a id="btn-${block.id}" href="${block.props.href || '#'}" class="btn">${block.props.label || 'Click Here'}</a>`;
};