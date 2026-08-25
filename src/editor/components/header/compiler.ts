import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const p = block.props;
  const general = p.general || {};
  const colors = p.colors || {};
  const layout = p.layout || {};
  const spacing = p.spacing || {};
  const advanced = p.advanced || {};

  return `<header 
  id="${advanced.htmlAnchor || 'gh-head'}" 
  class="gh-head layout-${general.layoutStyle?.replace(/ /g, '-').toLowerCase() || 'logo-on-left'} palette-${colors.palette || 'default'} ${general.sticky ? 'is-sticky' : ''} section-width-${layout.sectionWidth || 'full'}"
  style="--logo-size: ${general.logoSize || 40}px; --pt: ${spacing.padding?.topBottom || 16}px; --pb: ${spacing.padding?.topBottom || 16}px; --pl: ${spacing.padding?.leftRight || 24}px; --pr: ${spacing.padding?.leftRight || 24}px;"
>
  <div class="gh-head-inner gh-container content-width-${layout.contentWidth || 'standard'} align-${layout.align || 'left'} valign-${layout.verticalAlign || 'middle'}">
    
    {{!-- Brand / Logo --}}
    <div class="gh-head-brand">
      <a class="gh-head-logo" href="{{@site.url}}">
        ${general.showLogo !== false ? `
          {{#if @site.logo}}
            <img src="{{@site.logo}}" alt="{{@site.title}}" />
          {{else}}
            <span class="gh-site-title">{{@site.title}}</span>
          {{/if}}
        ` : ''}
      </a>
    </div>

    {{!-- Primary Navigation --}}
    <nav class="gh-head-menu">
      {{navigation}}
    </nav>

    {{!-- Actions --}}
    <div class="gh-head-actions">
      ${general.showSearch !== false ? `
        <button class="gh-search" data-ghost-search aria-label="Search">
          <svg viewBox="0 0 24 24" width="20" height="20"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" fill="none"/></svg>
        </button>
      ` : ''}

      {{#if @site.members_enabled}}
        {{#unless @member}}
          ${general.showSignIn !== false ? `
            <a class="gh-head-link" href="#/portal/signin" data-portal="signin">
              ${general.signInText || 'Sign in'}
            </a>
          ` : ''}
          ${general.showSubscribe !== false ? `
            <a class="gh-head-btn gh-btn" href="#/portal/signup" data-portal="signup">
              ${general.subscribeText || 'Subscribe'}
            </a>
          ` : ''}
        {{else}}
          <a class="gh-head-btn gh-btn" href="#/portal/account" data-portal="account">Account</a>
        {{/unless}}
      {{/if}}
    </div>

  </div>
</header>`;
};