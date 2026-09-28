import { BuilderBlock } from "@/types/theme";
import { resolveCommentsProps } from "./schema";
import { escapeHtml } from "../shared/escape";

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
      ${escapeHtml(p.heading)}${countMarkup}
    </h3>
  </div>
  {{comments title="" count=false mode="auto"}}
</section>
<script>
(function() {
  function syncGhostCommentsTheme() {
    try {
      var isDark = document.documentElement.classList.contains('dark') || 
                   (localStorage.getItem('theme') === 'dark') ||
                   (!localStorage.getItem('theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var fgColor = isDark ? '#ffffff' : '#171717';
      var scheme = isDark ? 'dark' : 'light';

      var sec = document.querySelector('.gh-comments-section');
      if (sec) {
        sec.style.color = fgColor;
        sec.style.colorScheme = scheme;
        sec.style.backgroundColor = 'transparent';
        sec.classList.toggle('dark', isDark);
      }
      var root = document.getElementById('ghost-comments-root') || (sec && sec.querySelector('#ghost-comments-root'));
      if (root) {
        root.style.color = fgColor;
        root.style.colorScheme = scheme;
        root.style.backgroundColor = 'transparent';
        root.classList.toggle('dark', isDark);
      }
      var script = document.querySelector('script[data-ghost-comments]');
      if (script) {
        script.dataset.colorScheme = scheme;
      }

      var iframes = document.querySelectorAll('.gh-comments-section iframe, #ghost-comments-root iframe, iframe[title="comments-frame"], iframe[data-frame="comments"]');
      iframes.forEach(function(iframe) {
        iframe.setAttribute('allowtransparency', 'true');
        iframe.style.background = 'transparent';
        iframe.style.backgroundColor = 'transparent';
        iframe.style.colorScheme = scheme;
        try {
          if (iframe.contentDocument) {
            if (iframe.contentDocument.documentElement) {
              iframe.contentDocument.documentElement.classList.toggle('dark', isDark);
              iframe.contentDocument.documentElement.style.colorScheme = scheme;
              iframe.contentDocument.documentElement.style.backgroundColor = 'transparent';
            }
            if (iframe.contentDocument.body) {
              iframe.contentDocument.body.classList.toggle('dark', isDark);
              iframe.contentDocument.body.style.backgroundColor = 'transparent';
              iframe.contentDocument.body.style.colorScheme = scheme;
            }
          }
        } catch(e) {}
        try {
          if (iframe.contentWindow) {
            var msg = { theme: scheme, colorScheme: scheme, mode: scheme, isDark: isDark };
            iframe.contentWindow.postMessage(msg, '*');
            iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
          }
        } catch(e) {}
      });
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

    var secObs = new MutationObserver(function() {
      syncGhostCommentsTheme();
    });
    var targetSec = document.querySelector('.gh-comments-section');
    if (targetSec) {
      secObs.observe(targetSec, { childList: true, subtree: true });
    }
  }

  var attempts = 0;
  var pollInterval = setInterval(function() {
    attempts++;
    syncGhostCommentsTheme();
    var hasIframe = document.querySelector('.gh-comments-section iframe, #ghost-comments-root iframe');
    if (hasIframe || attempts > 20) {
      if (hasIframe) syncGhostCommentsTheme();
      if (attempts > 20) clearInterval(pollInterval);
    }
  }, 300);

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

