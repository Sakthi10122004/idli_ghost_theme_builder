import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<style>
  #accordion-${block.id} {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.5rem 0;
  }
  #accordion-${block.id} .accordion-item {
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: var(--radius-sm);
    padding: 1rem;
    background-color: var(--color-bg);
  }
  #accordion-${block.id} .accordion-header {
    font-size: 1rem;
    font-weight: bold;
    color: var(--color-fg);
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  #accordion-${block.id} .accordion-icon {
    font-size: 0.75rem;
    color: var(--color-muted);
  }
  #accordion-${block.id} .accordion-content {
    font-size: 0.95rem;
    color: var(--color-muted);
    line-height: 1.6;
    margin: 0;
  }
</style>
<div id="accordion-${block.id}">
  ${(block.props.items || []).map((item: any) => `
  <div class="accordion-item">
    <div class="accordion-header">
      <span>${item.question || "FAQ Question"}</span>
      <span class="accordion-icon">▼</span>
    </div>
    <p class="accordion-content">${item.answer || "Answer content."}</p>
  </div>`).join("\n")}
</div>`;
};