import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="testimonials-wrapper py-6 flex flex-col gap-4">
  ${(block.props.items || []).map((item: any) => `
  <div class="testimonial-card border border-brand-hairline rounded-sm p-6 bg-brand-soft">
    <p class="text-xs italic leading-relaxed mb-4">"${item.quote || ""}"</p>
    <div class="flex flex-col">
      <span class="text-xs font-bold">${item.author || "User"}</span>
      <span class="text-[10px] text-muted font-mono">${item.title || ""}</span>
    </div>
  </div>`).join("\n")}
</div>`;
};