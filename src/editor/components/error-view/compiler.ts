import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="error-view-block py-16 text-center">
  <h1 style="font-size: 4rem; font-weight: 700; margin: 0; color: #171717;">404</h1>
  <p style="font-size: 1rem; color: #888888; margin-top: 1rem;">Page not found</p>
  <a href="{{@site.url}}" class="btn btn-primary" style="margin-top: 1.5rem;">Go to Home</a>
</div>`;
};