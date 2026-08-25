import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const p = block.props;
  const general = p.general || {};
  const colors = p.colors || {};
  const layout = p.layout || {};
  const spacing = p.spacing || {};
  const advanced = p.advanced || {};

  return `<footer 
  id="${advanced.htmlAnchor || 'site-footer'}" 
  class="site-footer palette-${colors.palette || 'default'} section-width-${layout.sectionWidth || 'full'}"
  style="--pt: ${spacing.padding?.topBottom || 40}px; --pb: ${spacing.padding?.topBottom || 40}px; --pl: ${spacing.padding?.leftRight || 24}px; --pr: ${spacing.padding?.leftRight || 24}px;"
>
  <div class="gh-container footer-inner content-width-${layout.contentWidth || 'standard'} align-${layout.align || 'center'}">
    ${general.showSecondaryNav !== false ? `
      <div class="footer-nav">
        {{navigation type="secondary"}}
      </div>
    ` : ''}

    ${general.showCopyright !== false ? `
      <div class="footer-bottom">
        <div class="footer-copyright">
          ${general.customCopyrightText ? general.customCopyrightText : `
            &copy; {{date format="YYYY"}} {{@site.title}}. Published with <a href="https://ghost.org" target="_blank" rel="noopener">Ghost</a>.
          `}
        </div>
      </div>
    ` : ''}
  </div>
</footer>`;
};