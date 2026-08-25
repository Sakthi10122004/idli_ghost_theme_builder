import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="hero-block relative overflow-hidden text-center py-16 mesh-glow">
  <div class="hero-content max-w-xl mx-auto px-6">
    <span class="hero-eyebrow">${block.props.subtitle ? "Introducing Builder V2" : "Introducing"}</span>
    <h1 class="hero-title heading text-4xl font-bold mt-4">${block.props.title || "Build beautiful templates."}</h1>
    <p class="hero-subtitle text-content text-base mt-2">${block.props.subtitle || "A visual workspace built directly on layout AST compilation logic."}</p>
    <div class="hero-actions mt-6">
      <a href="#" class="btn btn-primary">${block.props.buttonLabel || "Start Free"}</a>
      <a href="#" class="btn btn-secondary">Documentation</a>
    </div>
  </div>
</div>`;
};