import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<footer class="site-footer py-8 border-t border-brand-hairline">
  <div class="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
    <span>© {{@site.title}} - Visual compiler output.</span>
    <nav class="flex gap-4">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </nav>
  </div>
</footer>`;
};