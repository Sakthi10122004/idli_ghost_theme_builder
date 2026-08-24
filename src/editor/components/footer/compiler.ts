import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<footer class="site-footer outer">
  <div class="inner">
    <section class="copyright"><a href="{{@site.url}}">{{@site.title}}</a> &copy; {{date format="YYYY"}}</section>
    <div class="site-footer-center">
      <nav class="site-footer-nav">
        {{navigation type="secondary"}}
      </nav>
    </div>
    <div class="gh-powered-by"><a href="https://ghost.org/" target="_blank" rel="noopener">Powered by Ghost</a></div>
  </div>
</footer>`;
};