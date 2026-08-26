import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string, isPageContext: boolean, blocks?: Record<string, BuilderBlock>) => {
  const p = block.props;
  const general = p.general || {};
  const colors = p.colors || {};
  const layout = p.layout || {};
  const spacing = p.spacing || {};
  const advanced = p.advanced || {};
  
  let bg = colors.backgroundColor || '#ffffff';
  let text = colors.textColor || '#1a1a1a';
  
  if (colors.syncWithHeader && blocks) {
    const headerBlock = Object.values(blocks).find((b: BuilderBlock) => b.type === "header");
    if (headerBlock) {
      const headerAppearance = headerBlock.props?.appearance || {};
      bg = headerAppearance.backgroundColor || "#ffffff";
      text = headerAppearance.textColor || "#000000";
    }
  }

  const htmlAnchor = advanced.htmlAnchor || 'site-footer';
  
  const copyrightHtml = general.customCopyrightText 
    ? general.customCopyrightText 
    : `&copy; {{date format="YYYY"}} {{@site.title}}. Published with <a href="https://ghost.org" target="_blank" rel="noopener">Ghost</a>.`;

  const socialIconsHtml = `
    <div style="display: flex; gap: 16px; align-items: center;">
      {{#if @site.facebook}}
        <a href="{{social_url type="facebook"}}" target="_blank" rel="noopener" aria-label="Facebook">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.954 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.898 10.124-5.864 10.124-11.853z"/></svg>
        </a>
      {{/if}}
      {{#if @site.twitter}}
        <a href="{{social_url type="twitter"}}" target="_blank" rel="noopener" aria-label="Twitter">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
        </a>
      {{/if}}
    </div>
  `;

  let innerHtml = '';
  
  if (general.layoutStyle === "Multi-Column") {
    innerHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 40px; margin-bottom: 48px;">
        <div>
          <h4 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">{{@site.title}}</h4>
          <p style="opacity: 0.8; line-height: 1.5; margin-bottom: 24px;">{{@site.description}}</p>
          ${general.showSocialIcons ? socialIconsHtml : ''}
        </div>
        <div>
          <h4 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; opacity: 0.6;">Navigation</h4>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            {{navigation}}
          </div>
        </div>
        ${general.showSecondaryNav ? `
        <div>
          <h4 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; opacity: 0.6;">More</h4>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            {{navigation type="secondary"}}
          </div>
        </div>
        ` : ''}
      </div>
      ${general.showCopyright ? `
      <div class="footer-bottom" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding-top: 24px; border-top: 1px solid currentColor; text-align: center;">
        <div class="footer-copyright" style="opacity: 0.7;">${copyrightHtml}</div>
      </div>
      ` : ''}
    `;
  } else if (general.layoutStyle === "Newsletter Integrated") {
    innerHtml = `
      ${general.showSubscribeBox !== false ? `
      <div style="text-align: center; max-width: 600px; margin: 0 auto 64px auto; padding: 48px 24px; background: currentColor; color: ${bg}; border-radius: 12px;">
        <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">Subscribe to our newsletter</h3>
        <p style="opacity: 0.8; margin-bottom: 24px;">Get the latest posts delivered right to your inbox.</p>
        <form data-members-form="subscribe" style="display: flex; flex-direction: column; gap: 8px; max-width: 400px; margin: 0 auto;">
          <input data-members-email type="email" required placeholder="Your email address" style="flex: 1; padding: 12px 16px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.1); outline: none; color: #000;">
          <button type="submit" style="padding: 12px 24px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; background-color: ${colors.buttonBgColor || '#000000'}; color: ${colors.buttonTextColor || '#ffffff'}; transition: opacity 0.2s;">Subscribe</button>
        </form>
      </div>
      ` : ''}
      
      <div class="footer-bottom" style="display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; ${general.showSubscribeBox !== false ? 'padding-top: 24px; border-top: 1px solid currentColor;' : ''}">
        ${general.showCopyright ? `<div class="footer-copyright" style="opacity: 0.7;">${copyrightHtml}</div>` : ''}
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; align-items: center;">
          ${general.showSecondaryNav ? `{{navigation type="secondary"}}` : ''}
          ${general.showSocialIcons ? socialIconsHtml : ''}
        </div>
      </div>
    `;
  } else {
    // Simple Minimal
    innerHtml = `
      <div class="footer-bottom" style="display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center;">
        ${general.showCopyright ? `<div class="footer-copyright" style="opacity: 0.7;">${copyrightHtml}</div>` : ''}
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; align-items: center;">
          ${general.showSecondaryNav ? `{{navigation type="secondary"}}` : ''}
          ${general.showSocialIcons ? socialIconsHtml : ''}
        </div>
      </div>
    `;
  }

  return `
<style>
  #${htmlAnchor} {
    background-color: ${bg};
    color: ${text};
    padding-top: ${spacing.padding?.topBottom || 40}px;
    padding-bottom: ${spacing.padding?.topBottom || 40}px;
    padding-left: ${spacing.padding?.leftRight || 24}px;
    padding-right: ${spacing.padding?.leftRight || 24}px;
  }
  #${htmlAnchor} a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  #${htmlAnchor} a:hover {
    opacity: 0.7;
  }
  #${htmlAnchor} .footer-inner {
    margin: 0 auto;
    max-width: 1200px; /* fallback, but mostly controlled by container class */
  }
  @media (min-width: 768px) {
    #${htmlAnchor} .footer-bottom {
      flex-direction: row !important;
      justify-content: space-between !important;
      text-align: left !important;
    }
  }
</style>
<footer 
  id="${htmlAnchor}" 
  class="site-footer section-width-${layout.sectionWidth || 'full'}"
>
  <div class="gh-container footer-inner content-width-${layout.contentWidth || 'standard'} align-${layout.align || 'center'}">
    ${innerHtml}
  </div>
</footer>`;
};