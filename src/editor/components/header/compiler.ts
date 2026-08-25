import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = block.props || {};
  const general = p.general || {};
  const appearance = p.appearance || {};
  const styles = p.styles || {};
  const advanced = p.advanced || {};

  const layoutClass = `layout-${(general.layoutStyle || "Logo on Left").toLowerCase().replace(/\s+/g, "-")}`;
  const paletteClass = `palette-${appearance.colorPalette || "default"}`;
  const colorModeClass = appearance.colorMode && appearance.colorMode !== "inherit" ? `color-mode-${appearance.colorMode}` : "";
  const sectionWidthClass = `section-width-${appearance.sectionWidth || "full"}`;
  const contentWidthClass = `content-width-${appearance.contentWidth || "wide"}`;

  return `<header 
  id="${advanced.htmlAnchor || "gh-head"}" 
  class="gh-head ${layoutClass} ${paletteClass} ${colorModeClass} ${sectionWidthClass}"
  style="
    --logo-size: ${general.logoSize || 40}px;
    --mb: ${styles.marginBottom || "0px"};
    --shadow: ${styles.boxShadow || "none"};
    --backdrop-blur: ${styles.backdropBlur || "none"};
    --opacity: ${styles.opacity ?? 1};
  "
>
  <div class="gh-head-inner ${contentWidthClass}">
    
    {{!-- Brand / Logo --}}
    ${general.showLogo !== false ? `
    <div class="gh-head-brand">
      <a class="gh-head-logo" href="{{@site.url}}">
        {{#if @site.logo}}
          <img src="{{@site.logo}}" alt="{{@site.title}}" style="max-height: ${general.logoSize || 40}px;" />
        {{else}}
          <span class="gh-site-title">{{@site.title}}</span>
        {{/if}}
      </a>
    </div>` : ""}

    {{!-- Primary Navigation --}}
    <nav class="gh-head-menu">
      {{navigation}}
    </nav>

    {{!-- Actions: Search & Memberships --}}
    <div class="gh-head-actions">
      ${general.showSearch !== false ? `
      <button class="gh-search-btn" data-ghost-search aria-label="Search">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>` : ""}

      ${general.showThemeSwitcher !== false ? `
      <button class="gh-theme-toggle" aria-label="Toggle Theme" onclick="toggleThemeMode()">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>` : ""}

      {{#if @site.members_enabled}}
        {{#unless @member}}
          ${general.showSignIn !== false ? `
          <a class="gh-head-link" href="#/portal/signin" data-portal="signin">${general.signInText || "Sign in"}</a>` : ""}
          ${general.showSubscribe !== false ? `
          <a class="gh-head-btn gh-btn" href="#/portal/signup" data-portal="signup">${general.subscribeText || "Subscribe"}</a>` : ""}
        {{else}}
          <a class="gh-head-link" href="#/portal/account" data-portal="account">Account</a>
          <a class="gh-head-link gh-signout" href="javascript:" data-members-signout>Sign out</a>
        {{/unless}}
      {{/if}}
    </div>

  </div>
</header>`;
};