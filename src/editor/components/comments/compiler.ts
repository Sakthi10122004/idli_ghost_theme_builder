import { BuilderBlock } from "@/types/theme";
import { resolveCommentsProps } from "./schema";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = resolveCommentsProps(block.props);
  const countMarkup = p.showCount
    ? ` <span class="gh-comments-count">({{comment_count empty="0" singular="" plural=""}})</span>`
    : "";

  return `{{#if comments}}
<section class="gh-comments-section">
  <div class="gh-comments-header">
    <svg class="gh-comments-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <h3 class="gh-comments-heading">
      ${p.heading}${countMarkup}
    </h3>
  </div>
  {{comments title="" count=false mode="auto"}}
</section>
<script>
(function() {
  function syncGhostCommentsTheme() {
    try {
      var isDark = document.documentElement.classList.contains('dark') || 
                   (!localStorage.getItem('theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var sec = document.querySelector('.gh-comments-section');
      if (sec) {
        sec.style.color = isDark ? 'var(--color-fg, #ffffff)' : 'var(--color-fg, #171717)';
        sec.classList.toggle('dark', isDark);
      }
      var script = document.querySelector('script[data-ghost-comments]');
      if (script) {
        script.dataset.colorScheme = isDark ? 'dark' : 'light';
      }
    } catch(e) {}
  }
  syncGhostCommentsTheme();
  if (typeof MutationObserver !== 'undefined') {
    var obs = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === 'class') {
          syncGhostCommentsTheme();
          break;
        }
      }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }
  if (window.matchMedia) {
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    if (mql.addEventListener) {
      mql.addEventListener('change', syncGhostCommentsTheme);
    } else if (mql.addListener) {
      mql.addListener(syncGhostCommentsTheme);
    }
  }
  document.addEventListener('DOMContentLoaded', syncGhostCommentsTheme);
  window.addEventListener('load', syncGhostCommentsTheme);
})();
</script>
{{/if}}`;
};

