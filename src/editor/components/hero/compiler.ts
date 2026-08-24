import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="hero-block text-center py-16 mesh-glow relative overflow-hidden">
  <div class="max-w-xl mx-auto px-6">
    <span class="eyebrow bg-brand-light px-2 py-0.5 rounded-full text-xs font-semibold">Introducing V2</span>
    <h1 class="heading font-heading text-4xl font-bold mt-4">${block.props.title || "Build beautiful templates."}</h1>
    <p class="text-content font-body text-base mt-2">${block.props.subtitle || "A visual workspace built directly on layout AST compilation."}</p>
    <div class="mt-6 flex justify-center gap-3">
      <a href="#" class="btn btn-primary">${block.props.buttonLabel || "Start Free"}</a>
      <a href="#" class="btn btn-secondary">Documentation</a>
    </div>
  </div>
</div>`;
};