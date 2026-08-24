import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="newsletter-block py-12 px-8 bg-brand-soft border border-brand-hairline rounded-md flex flex-col md:flex-row justify-between items-center gap-6">
  <div>
    <h3 class="font-heading text-lg font-bold">${block.props.title || "Join our technical newsletter"}</h3>
    <p class="text-xs text-muted">Stay up to date with new features and tutorials.</p>
  </div>
  <form class="newsletter-form flex gap-2">
    <input type="email" placeholder="${block.props.placeholder || 'you@domain.com'}" required class="input-field" />
    <button type="submit" class="btn btn-primary shrink-0">${block.props.buttonLabel || 'Subscribe'}</button>
  </form>
</div>`;
};