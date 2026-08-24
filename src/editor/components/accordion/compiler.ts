import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="accordion-wrapper py-6 flex flex-col gap-3">
  ${(block.props.items || []).map((item: any) => `
  <div class="accordion-item border border-brand-hairline rounded-sm p-4 bg-white">
    <h4 class="text-xs font-bold text-brand-ink mb-2 flex justify-between items-center cursor-pointer">
      <span>${item.question || "FAQ Question"}</span>
      <span class="text-[10px] text-muted">▼</span>
    </h4>
    <p class="text-xs text-muted leading-relaxed">${item.answer || "Answer content."}</p>
  </div>`).join("\n")}
</div>`;
};