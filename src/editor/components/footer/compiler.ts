import { BuilderBlock } from "@/types/theme";
import { getBackgroundCSS } from "../shared/background";
import { WIDTH_VALUES } from "./schema";
import { ALL_SOCIAL_PLATFORMS, DEFAULT_SOCIAL_PLATFORMS, SocialPlatform } from "./socialIcons";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string, isPageContext: boolean, blocks?: Record<string, BuilderBlock>) => {
  const p = block.props;
  const general = p.general || {};
  const colors = p.colors || {};
  const layout = p.layout || {};
  const spacing = p.spacing || {};
  const advanced = p.advanced || {};
  
  let activeStyles = block.styles || {};
  let activeAppearance = colors;
  let text = colors.textColor || '#1a1a1a';
  
  if (colors.syncWithHeader && blocks) {
    const headerBlock = Object.values(blocks).find((b: BuilderBlock) => b.type === "header");
    if (headerBlock) {
      activeStyles = headerBlock.styles || {};
      activeAppearance = headerBlock.props?.appearance || {};
      text = activeAppearance.textColor || "#000000";
    }
  }

  const bgCss = getBackgroundCSS(activeStyles, activeAppearance);
  const bgFallbackColor = activeAppearance.backgroundColor || "#ffffff";

  const htmlAnchor = advanced.htmlAnchor || 'site-footer';
  
  const copyrightHtml = general.customCopyrightText 
    ? general.customCopyrightText 
    : `&copy; {{date format="YYYY"}} {{@site.title}}. Published with <a href="https://ghost.org" target="_blank" rel="noopener">Ghost</a>.`;

  const activePlatforms: SocialPlatform[] = Array.isArray(general.socialPlatforms) && general.socialPlatforms.length > 0
    ? general.socialPlatforms
    : DEFAULT_SOCIAL_PLATFORMS;

  const socialLinksParts = activePlatforms.map(platform => {
    const config = ALL_SOCIAL_PLATFORMS.find(p => p.id === platform);
    if (!config) return "";
    const label = config.label;
    const partial = config.casperIconPartial;
    
    if (platform === "facebook") {
      return `{{#if (social_url type="facebook")}}
        <a href="{{social_url type="facebook"}}" target="_blank" rel="noopener" aria-label="Facebook" style="color: inherit; opacity: 0.8; transition: opacity 0.2s;">
          {{> "icons/facebook"}}
        </a>
      {{else}}{{#if @site.facebook}}
        <a href="{{@site.facebook}}" target="_blank" rel="noopener" aria-label="Facebook" style="color: inherit; opacity: 0.8; transition: opacity 0.2s;">
          {{> "icons/facebook"}}
        </a>
      {{/if}}{{/if}}`;
    }
    if (platform === "twitter") {
      return `{{#if (social_url type="twitter")}}
        <a href="{{social_url type="twitter"}}" target="_blank" rel="noopener" aria-label="X" style="color: inherit; opacity: 0.8; transition: opacity 0.2s;">
          {{> "icons/x"}}
        </a>
      {{else}}{{#if @site.twitter}}
        <a href="{{@site.twitter}}" target="_blank" rel="noopener" aria-label="X" style="color: inherit; opacity: 0.8; transition: opacity 0.2s;">
          {{> "icons/x"}}
        </a>
      {{/if}}{{/if}}`;
    }

    return `{{#if (social_url type="${platform}")}}
        <a href="{{social_url type="${platform}"}}" target="_blank" rel="noopener" aria-label="${label}" style="color: inherit; opacity: 0.8; transition: opacity 0.2s;">
          {{> "${partial}"}}
        </a>
      {{/if}}`;
  }).filter(Boolean).join("\n      ");

  const socialIconsHtml = `
    <div class="footer-social-links" style="display: flex; gap: 16px; align-items: center; justify-content: center;">
      ${socialLinksParts}
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
        <div class="footer-nav-column">
          <h4 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; opacity: 0.6;">Navigation</h4>
          {{#if @site.navigation}}
            {{navigation}}
          {{else}}
            <ul class="nav" role="menu">
              <li class="nav-home" role="menuitem"><a href="/">Home</a></li>
              <li class="nav-about" role="menuitem"><a href="/about/">About</a></li>
              <li class="nav-collection" role="menuitem"><a href="/collection/">Collection</a></li>
            </ul>
          {{/if}}
        </div>
        ${general.showSecondaryNav !== false ? `
        <div class="footer-nav-column">
          <h4 style="font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; opacity: 0.6;">${general.secondaryNavTitle || 'More'}</h4>
          {{#if @site.secondary_navigation}}
            {{navigation type="secondary"}}
          {{else}}
            <ul class="nav nav-secondary" role="menu">
              <li class="nav-privacy" role="menuitem"><a href="/privacy/">Privacy Policy</a></li>
              <li class="nav-terms" role="menuitem"><a href="/terms/">Terms of Service</a></li>
              <li class="nav-contact" role="menuitem"><a href="/contact/">Contact</a></li>
            </ul>
          {{/if}}
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
      <div style="text-align: center; max-width: 600px; margin: 0 auto 64px auto; padding: 48px 24px; background: currentColor; color: ${bgFallbackColor}; border-radius: 12px;">
        <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 12px;">Subscribe to our newsletter</h3>
        <p style="opacity: 0.8; margin-bottom: 24px;">Get the latest posts delivered right to your inbox.</p>
        <form data-members-form="subscribe" style="display: flex; flex-direction: column; gap: 8px; max-width: 400px; margin: 0 auto;">
          <input data-members-email type="email" required placeholder="Your email address" style="flex: 1; padding: 12px 16px; border-radius: 6px; border: 1px solid rgba(0,0,0,0.1); outline: none; color: #000;">
          <button type="submit" class="footer-subscribe-btn" style="padding: 12px 24px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; background-color: ${colors.buttonBgColor || '#000000'}; color: ${colors.buttonTextColor || '#ffffff'}; transition: opacity 0.2s;">Subscribe</button>
        </form>
      </div>
      ` : ''}
      
      <div class="footer-bottom" style="display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; ${general.showSubscribeBox !== false ? 'padding-top: 24px; border-top: 1px solid currentColor;' : ''}">
        ${general.showCopyright ? `<div class="footer-copyright" style="opacity: 0.7;">${copyrightHtml}</div>` : ''}
        <div class="footer-actions" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; align-items: center;">
          ${general.showSecondaryNav !== false ? `
          <nav class="footer-secondary-nav" aria-label="Secondary Navigation">
            {{#if @site.secondary_navigation}}
              {{navigation type="secondary"}}
            {{else}}
              <ul class="nav nav-secondary" role="menu">
                <li class="nav-privacy" role="menuitem"><a href="/privacy/">Privacy Policy</a></li>
                <li class="nav-terms" role="menuitem"><a href="/terms/">Terms of Service</a></li>
                <li class="nav-contact" role="menuitem"><a href="/contact/">Contact</a></li>
              </ul>
            {{/if}}
          </nav>
          ` : ''}
          ${general.showSocialIcons ? socialIconsHtml : ''}
        </div>
      </div>
    `;
  } else {
    // Simple Minimal
    innerHtml = `
      <div class="footer-bottom" style="display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center;">
        ${general.showCopyright ? `<div class="footer-copyright" style="opacity: 0.7;">${copyrightHtml}</div>` : ''}
        <div class="footer-actions" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; align-items: center;">
          ${general.showSecondaryNav !== false ? `
          <nav class="footer-secondary-nav" aria-label="Secondary Navigation">
            {{#if @site.secondary_navigation}}
              {{navigation type="secondary"}}
            {{else}}
              <ul class="nav nav-secondary" role="menu">
                <li class="nav-privacy" role="menuitem"><a href="/privacy/">Privacy Policy</a></li>
                <li class="nav-terms" role="menuitem"><a href="/terms/">Terms of Service</a></li>
                <li class="nav-contact" role="menuitem"><a href="/contact/">Contact</a></li>
              </ul>
            {{/if}}
          </nav>
          ` : ''}
          ${general.showSocialIcons ? socialIconsHtml : ''}
        </div>
      </div>
    `;
  }

  const pt = spacing.paddingTop !== undefined 
    ? (typeof spacing.paddingTop === 'number' ? `${spacing.paddingTop}px` : spacing.paddingTop)
    : (block.styles?.paddingTop 
        ? (typeof block.styles.paddingTop === 'number' ? `${block.styles.paddingTop}px` : block.styles.paddingTop)
        : `${spacing.padding?.topBottom || 40}px`);

  const pb = spacing.paddingBottom !== undefined 
    ? (typeof spacing.paddingBottom === 'number' ? `${spacing.paddingBottom}px` : spacing.paddingBottom)
    : (block.styles?.paddingBottom 
        ? (typeof block.styles.paddingBottom === 'number' ? `${block.styles.paddingBottom}px` : block.styles.paddingBottom)
        : `${spacing.padding?.topBottom || 40}px`);

  const sectionWidth = layout.sectionWidth || "full";
  const sectionMaxWidth = WIDTH_VALUES[sectionWidth] || "100%";
  const isSectionFull = sectionWidth === "full";

  return `
<style>
  #${htmlAnchor} {
    ${bgCss}
    color: ${text};
    padding-top: ${pt};
    padding-bottom: ${pb};
    padding-left: ${spacing.padding?.leftRight || 24}px;
    padding-right: ${spacing.padding?.leftRight || 24}px;
    max-width: ${sectionMaxWidth};
    margin-left: auto;
    margin-right: auto;
    ${!isSectionFull ? 'border-radius: 12px; margin-top: 24px; margin-bottom: 24px;' : ''}
  }
  #${htmlAnchor} a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  #${htmlAnchor} a:hover {
    opacity: 0.7;
  }

  #${htmlAnchor} .footer-social-links:empty,
  #${htmlAnchor} .footer-secondary-nav:empty,
  #${htmlAnchor} .footer-secondary-column:empty {
    display: none !important;
  }
  #${htmlAnchor} .footer-social-links a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s;
  }
  #${htmlAnchor} .footer-social-links a:hover {
    opacity: 1;
  }
  #${htmlAnchor} .footer-social-links svg {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  /* Footer Navigation Columns (Multi-Column) */
  #${htmlAnchor} .footer-nav-column .nav,
  #${htmlAnchor} .footer-nav-column .nav-secondary {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  #${htmlAnchor} .footer-nav-column .nav li,
  #${htmlAnchor} .footer-nav-column .nav-secondary li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #${htmlAnchor} .footer-nav-column .nav a,
  #${htmlAnchor} .footer-nav-column .nav-secondary a {
    color: inherit;
    text-decoration: none;
    opacity: 0.8;
    font-size: 0.875rem;
    line-height: 1.5;
    transition: opacity 0.2s;
  }
  #${htmlAnchor} .footer-nav-column .nav a:hover,
  #${htmlAnchor} .footer-nav-column .nav-secondary a:hover {
    opacity: 1;
  }

  /* Footer Secondary Navigation (Horizontal row in bottom bar) */
  #${htmlAnchor} .footer-secondary-nav,
  #${htmlAnchor} .footer-secondary-nav .nav,
  #${htmlAnchor} .footer-secondary-nav .nav-secondary,
  #${htmlAnchor} .footer-bottom ul.nav,
  #${htmlAnchor} .footer-bottom ul.nav-secondary {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 16px 24px;
  }
  #${htmlAnchor} .footer-secondary-nav .nav li,
  #${htmlAnchor} .footer-secondary-nav .nav-secondary li,
  #${htmlAnchor} .footer-bottom ul.nav li,
  #${htmlAnchor} .footer-bottom ul.nav-secondary li {
    list-style: none;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
  }
  #${htmlAnchor} .footer-secondary-nav .nav a,
  #${htmlAnchor} .footer-secondary-nav .nav-secondary a,
  #${htmlAnchor} .footer-bottom ul.nav a,
  #${htmlAnchor} .footer-bottom ul.nav-secondary a {
    color: inherit;
    text-decoration: none;
    opacity: 0.8;
    font-size: 0.875rem;
    transition: opacity 0.2s;
  }
  #${htmlAnchor} .footer-secondary-nav .nav a:hover,
  #${htmlAnchor} .footer-secondary-nav .nav-secondary a:hover,
  #${htmlAnchor} .footer-bottom ul.nav a:hover,
  #${htmlAnchor} .footer-bottom ul.nav-secondary a:hover {
    opacity: 1;
  }

  html.dark #${htmlAnchor} {
    background-color: #111111 !important;
    color: #ffffff !important;
  }
  html.dark #${htmlAnchor} .footer-subscribe-btn {
    background-color: #ffffff !important;
    color: #000000 !important;
  }
  #${htmlAnchor} .footer-inner {
    margin: 0 auto;
    max-width: 1200px;
  }
  @media (min-width: 768px) {
    #${htmlAnchor} .footer-bottom {
      flex-direction: row !important;
      justify-content: space-between !important;
      text-align: left !important;
    }
    #${htmlAnchor} .footer-secondary-nav,
    #${htmlAnchor} .footer-secondary-nav .nav,
    #${htmlAnchor} .footer-bottom ul.nav,
    #${htmlAnchor} .footer-bottom ul.nav-secondary {
      justify-content: flex-end;
    }
  }
</style>
<footer 
  id="${htmlAnchor}" 
  class="site-footer section-width-${layout.sectionWidth || 'full'} ${activeStyles.backgroundType === "mesh" ? 'mesh-glow' : ''}"
>
  <div class="gh-container footer-inner content-width-${layout.contentWidth || 'standard'} align-${layout.align || 'center'}">
    ${innerHtml}
  </div>
</footer>`;
};