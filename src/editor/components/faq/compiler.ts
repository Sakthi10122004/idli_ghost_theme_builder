import { BuilderBlock } from "@/types/theme";
import { FAQProps, defaultProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";

export const generateHTML = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as FAQProps;
  const general = p.general;
  const items = p.items || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};
  
  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = p.advanced?.htmlAnchor || `faq-${block.id}`;
  
  const renderFaqItem = (item: any) => {
    return `
      <div class="faq-item pt-6">
        <dt>
          <button
            type="button"
            class="faq-button flex w-full items-start justify-between text-left"
            aria-controls="faq-content-${block.id}-${item.id}"
            aria-expanded="false"
            data-faq-id="${item.id}"
          >
            <span class="faq-question">${item.question}</span>
            <span class="faq-icon-wrapper ml-6 flex h-7 items-center">
              <svg class="faq-icon-plus h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
              </svg>
              <svg class="faq-icon-minus h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 12H6" />
              </svg>
            </span>
          </button>
        </dt>
        <dd 
          class="faq-answer mt-2 pr-12 hidden" 
          id="faq-content-${block.id}-${item.id}"
        >
          <p class="faq-answer-text">${item.answer}</p>
        </dd>
      </div>
    `;
  };

  let contentHtml = "";

  if (general.layoutStyle === "two-column") {
    const mid = Math.ceil(items.length / 2);
    const col1 = items.slice(0, mid);
    const col2 = items.slice(mid);
    contentHtml = `
      <div class="faq-two-col mx-auto mt-16 max-w-7xl grid grid-cols-1 gap-x-8 gap-y-0 lg:grid-cols-2">
        <dl class="space-y-6 divide-y">
          ${col1.map(renderFaqItem).join("")}
        </dl>
        <dl class="space-y-6 divide-y lg:mt-0 mt-6">
          ${col2.map(renderFaqItem).join("")}
        </dl>
      </div>
    `;
  } else if (general.layoutStyle === "categorized") {
    const categories = Array.from(new Set(items.map(i => i.category || "General")));
    contentHtml = `
      <div class="faq-categorized mx-auto mt-16 max-w-3xl">
        ${categories.map((cat, idx) => `
          <div class="faq-category mb-12">
            <h3 class="faq-category-title text-xl font-bold tracking-tight mb-6">${cat}</h3>
            <dl class="space-y-6 divide-y">
              ${items.filter(i => (i.category || "General") === cat).map(renderFaqItem).join("")}
            </dl>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    // Accordion default
    contentHtml = `
      <div class="faq-accordion mx-auto mt-16 max-w-3xl divide-y">
        <dl class="space-y-6 divide-y">
          ${items.map(renderFaqItem).join("")}
        </dl>
      </div>
    `;
  }

  const headingHtml = (general.heading || general.subheading) ? `
    <div class="faq-header mx-auto max-w-4xl text-center">
      ${general.heading ? `<h2 class="faq-heading text-3xl font-bold tracking-tight sm:text-4xl">${general.heading}</h2>` : ''}
      ${general.subheading ? `<p class="faq-subheading mt-4 text-base leading-7">${general.subheading}</p>` : ''}
    </div>
  ` : '';

  // Inline script for accordion interactivity
  const scriptHtml = `
    <script>
      (function() {
        var wrapper = document.getElementById('${wrapperId}');
        if (!wrapper) return;
        var allowMultiple = ${general.allowMultipleOpen ? 'true' : 'false'};
        var buttons = wrapper.querySelectorAll('.faq-button');
        
        buttons.forEach(function(btn) {
          btn.addEventListener('click', function() {
            var isExpanded = btn.getAttribute('aria-expanded') === 'true';
            
            if (!allowMultiple) {
              // Close all others
              buttons.forEach(function(otherBtn) {
                if (otherBtn !== btn) {
                  otherBtn.setAttribute('aria-expanded', 'false');
                  var otherContent = document.getElementById(otherBtn.getAttribute('aria-controls'));
                  if (otherContent) otherContent.classList.add('hidden');
                  var p = otherBtn.querySelector('.faq-icon-plus');
                  var m = otherBtn.querySelector('.faq-icon-minus');
                  if(p) p.classList.remove('hidden');
                  if(m) m.classList.add('hidden');
                }
              });
            }
            
            // Toggle current
            btn.setAttribute('aria-expanded', !isExpanded);
            var content = document.getElementById(btn.getAttribute('aria-controls'));
            var pIcon = btn.querySelector('.faq-icon-plus');
            var mIcon = btn.querySelector('.faq-icon-minus');
            
            if (!isExpanded) {
              if (content) content.classList.remove('hidden');
              if (pIcon) pIcon.classList.add('hidden');
              if (mIcon) mIcon.classList.remove('hidden');
            } else {
              if (content) content.classList.add('hidden');
              if (pIcon) pIcon.classList.remove('hidden');
              if (mIcon) mIcon.classList.add('hidden');
            }
          });
        });
      })();
    </script>
  `;

  return `<style>
  #${wrapperId} {
    ${bgCss}
    padding-top: ${spacing.paddingTop || '4rem'};
    padding-bottom: ${spacing.paddingBottom || '4rem'};
    position: relative;
  }
  #${wrapperId} .faq-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  #${wrapperId} .faq-heading {
    color: var(--color-fg);
    margin: 0;
  }
  #${wrapperId} .faq-subheading {
    color: var(--color-mute);
  }
  #${wrapperId} .faq-category-title {
    color: var(--color-fg);
  }
  #${wrapperId} .faq-button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--color-fg);
    padding: 0;
  }
  #${wrapperId} .faq-question {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.75;
  }
  #${wrapperId} .faq-answer-text {
    color: var(--color-mute);
    font-size: 1rem;
    line-height: 1.75;
    margin: 0;
  }
  
  /* Utilities used in markup */
  #${wrapperId} .mx-auto { margin-left: auto; margin-right: auto; }
  #${wrapperId} .mt-16 { margin-top: 4rem; }
  #${wrapperId} .mt-6 { margin-top: 1.5rem; }
  #${wrapperId} .mt-4 { margin-top: 1rem; }
  #${wrapperId} .mt-2 { margin-top: 0.5rem; }
  #${wrapperId} .mb-12 { margin-bottom: 3rem; }
  #${wrapperId} .mb-6 { margin-bottom: 1.5rem; }
  #${wrapperId} .pt-6 { padding-top: 1.5rem; }
  #${wrapperId} .pr-12 { padding-right: 3rem; }
  #${wrapperId} .w-full { width: 100%; }
  #${wrapperId} .h-6 { height: 1.5rem; }
  #${wrapperId} .w-6 { width: 1.5rem; }
  #${wrapperId} .h-7 { height: 1.75rem; }
  #${wrapperId} .ml-6 { margin-left: 1.5rem; }
  #${wrapperId} .flex { display: flex; }
  #${wrapperId} .items-start { align-items: flex-start; }
  #${wrapperId} .items-center { align-items: center; }
  #${wrapperId} .justify-between { justify-content: space-between; }
  #${wrapperId} .text-left { text-align: left; }
  #${wrapperId} .text-center { text-align: center; }
  #${wrapperId} .max-w-7xl { max-width: 80rem; }
  #${wrapperId} .max-w-4xl { max-width: 56rem; }
  #${wrapperId} .max-w-3xl { max-width: 48rem; }
  #${wrapperId} .grid { display: grid; }
  #${wrapperId} .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
  #${wrapperId} .gap-x-8 { column-gap: 2rem; }
  #${wrapperId} .gap-y-0 { row-gap: 0; }
  #${wrapperId} .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
  #${wrapperId} .divide-y > :not([hidden]) ~ :not([hidden]) { border-top: 1px solid rgba(0,0,0,0.1); }
  #${wrapperId} .hidden { display: none !important; }
  
  @media (min-width: 1024px) {
    #${wrapperId} .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    #${wrapperId} .lg\\:mt-0 { margin-top: 0; }
  }
</style>
<div id="${wrapperId}" class="faq-section ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}">
  <div class="faq-inner">
    ${headingHtml}
    ${contentHtml}
  </div>
  ${scriptHtml}
</div>`;
};

export const compileToHbs = generateHTML;
