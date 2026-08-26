import { BuilderBlock } from "@/types/theme";
import { getPaletteConfig, hexToRgba, WIDTH_VALUES, CONTENT_WIDTH_VALUES } from "./constants";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = block.props || {};
  const general = p.general || {};
  const appearance = p.appearance || {};
  const styles = p.styles || {};
  const advanced = p.advanced || {};

  const layoutStyle = general.layoutStyle || "Logo on Left";
  const isLogoCenter = layoutStyle === "Logo in Center";
  const isStacked = layoutStyle === "Stacked";

  // Note: For Handlebars export, we statically compile the "light/dark" if forced,
  // or fall back to default colors which Ghost can override if it has a native dark mode.
  // We use the forced light palette for the baseline here to ensure the builder's look is preserved.
  const isDarkForce = appearance.colorMode === "dark";
  const palette = getPaletteConfig(appearance.colorPalette || "default", isDarkForce);

  const glassEnabled = !!styles.backdropBlur && styles.backdropBlur !== "none";
  const bgStyle = glassEnabled ? hexToRgba(palette.bg, 0.75) : palette.bg;

  const sectionMaxWidth = WIDTH_VALUES[appearance.sectionWidth || "full"] || "100%";
  const contentMaxWidth = CONTENT_WIDTH_VALUES[appearance.contentWidth || "wide"] || "100%";
  const isSectionFull = sectionMaxWidth === "100%";

  const shadowValue = styles.boxShadow === "dark-glow" ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : styles.boxShadow !== "none" ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none";
  const htmlAnchor = advanced.htmlAnchor || "gh-head";

  const brandHtml = general.showLogo !== false ? `
    <div class="gh-head-brand" style="display: flex; align-items: center; gap: 0.5rem; font-weight: 700; font-size: 1.5rem; white-space: nowrap; flex-shrink: 0;">
      <a class="gh-head-logo" href="{{@site.url}}" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;">
        {{#if @site.logo}}
          <img src="{{@site.logo}}" alt="{{@site.title}}" style="max-height: ${general.logoSize || 40}px; width: auto;" />
        {{else}}
          <span class="gh-site-title">{{@site.title}}</span>
        {{/if}}
      </a>
    </div>` : "";

  const navHtml = `
    <nav class="gh-head-menu" style="overflow: hidden; opacity: 0.9;">
      {{navigation}}
    </nav>`;

  const actionsHtml = `
    <div class="gh-head-actions" style="display: flex; align-items: center; gap: 1rem; flex-shrink: 0;">
      ${general.showSearch !== false ? `
      <button class="gh-search-btn" data-ghost-search aria-label="Search" style="padding: 0.375rem; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>` : ""}

      ${general.showThemeSwitcher !== false ? `
      <button class="gh-theme-toggle" aria-label="Toggle Theme" onclick="toggleThemeMode()" style="padding: 0.375rem; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>` : ""}

      {{#if @site.members_enabled}}
        {{#unless @member}}
          ${general.showSignIn !== false ? `
          <a class="gh-head-link" href="#/portal/signin" data-portal="signin" style="font-size: 1.0625rem; font-weight: 500; color: inherit; text-decoration: none; opacity: 0.9; padding: 0 0.25rem; white-space: nowrap;">${general.signInText || "Sign in"}</a>` : ""}
          ${general.showSubscribe !== false ? `
          <a class="gh-head-btn gh-btn" href="#/portal/signup" data-portal="signup" style="background-color: ${palette.buttonBg}; color: ${palette.buttonText}; padding: 0.625rem 1.5rem; border-radius: 9999px; font-size: 1.0625rem; font-weight: 600; text-decoration: none; white-space: nowrap; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: opacity 0.15s; border: none; opacity: 0.95;">${general.subscribeText || "Subscribe"}</a>` : ""}
        {{else}}
          <a class="gh-head-link" href="#/portal/account" data-portal="account" style="font-size: 1.0625rem; font-weight: 500; color: inherit; text-decoration: none; opacity: 0.9; padding: 0 0.25rem; white-space: nowrap;">Account</a>
          <a class="gh-head-link gh-signout" href="javascript:" data-members-signout style="font-size: 1.0625rem; font-weight: 500; color: inherit; text-decoration: none; opacity: 0.9; padding: 0 0.25rem; white-space: nowrap;">Sign out</a>
        {{/unless}}
      {{/if}}
    </div>`;

  let innerLayoutHtml = "";
  if (isStacked) {
    innerLayoutHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; text-align: center; width: 100%;">
        ${brandHtml}
        ${navHtml}
        ${actionsHtml}
      </div>`;
  } else if (isLogoCenter) {
    innerLayoutHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 1.5rem;">
        <div style="flex: 1; display: flex; align-items: center; justify-content: flex-start; min-width: 0;">
          ${navHtml}
        </div>
        <div style="flex-shrink: 0; display: flex; align-items: center; justify-content: center; padding: 0 1rem;">
          ${brandHtml}
        </div>
        <div style="flex: 1; display: flex; align-items: center; justify-content: flex-end; min-width: 0;">
          ${actionsHtml}
        </div>
      </div>`;
  } else {
    innerLayoutHtml = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 2rem;">
        <div style="display: flex; align-items: center; gap: 2rem; min-width: 0;">
          ${brandHtml}
          ${navHtml}
        </div>
        <div style="flex-shrink: 0;">
          ${actionsHtml}
        </div>
      </div>`;
  }

  return `
<style>
  #${htmlAnchor} .gh-head-menu .nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: ${isStacked ? 'center' : 'flex-start'};
    gap: ${isStacked ? '2rem' : '1.75rem'};
    list-style: none;
    margin: 0;
    padding: 0;
  }
  #${htmlAnchor} .gh-head-menu .nav a {
    color: inherit;
    text-decoration: none;
    font-size: 1.0625rem;
    font-weight: 500;
    transition: opacity 0.15s;
  }
  #${htmlAnchor} .gh-head-menu .nav a:hover,
  #${htmlAnchor} .gh-search-btn:hover,
  #${htmlAnchor} .gh-theme-toggle:hover,
  #${htmlAnchor} .gh-head-link:hover,
  #${htmlAnchor} .gh-head-btn:hover {
    opacity: 1 !important;
  }
</style>

<div style="width: 100%; padding: 0; background-color: transparent;">
  <header 
    id="${htmlAnchor}" 
    class="gh-head"
    style="
      position: relative;
      background-color: ${bgStyle};
      color: ${palette.text};
      max-width: ${sectionMaxWidth};
      width: 100%;
      margin: ${isSectionFull ? '0' : '0.5rem auto'};
      border-radius: ${isSectionFull ? '0' : '0.75rem'};
      box-shadow: ${shadowValue};
      opacity: ${styles.opacity ?? 1};
      backdrop-filter: ${glassEnabled ? 'blur(12px)' : 'none'};
      -webkit-backdrop-filter: ${glassEnabled ? 'blur(12px)' : 'none'};
      transition: all 0.15s ease-in-out;
      margin-bottom: ${styles.marginBottom || "0px"};
    "
  >
    <div class="gh-head-inner" style="max-width: ${contentMaxWidth}; width: 100%; margin: 0 auto; padding: 1.25rem 1.5rem; display: flex;">
      ${innerLayoutHtml}
    </div>
  </header>
</div>`;
};