import { BuilderBlock } from "@/types/theme";
import { hexToRgba, WIDTH_VALUES, CONTENT_WIDTH_VALUES } from "./constants";

export const compileToHbs = (block: BuilderBlock): string => {
  const p = block.props || {};
  const general = p.general || {};
  const appearance = p.appearance || {};
  const styles = p.styles || {};
  const advanced = p.advanced || {};

  const layoutStyle = general.layoutStyle || "Logo on Left";
  const isLogoCenter = layoutStyle === "Logo in Center";
  const isStacked = layoutStyle === "Stacked";

  const palette = {
    bg: appearance.backgroundColor || "#ffffff",
    text: appearance.textColor || "#000000",
    buttonBg: appearance.buttonBgColor || "#000000",
    buttonText: appearance.buttonTextColor || "#ffffff",
  };

  const glassEnabled = !!styles.backdropBlur && styles.backdropBlur !== "none";
  const bgStyle = glassEnabled ? hexToRgba(palette.bg, 0.75) : palette.bg;

  const sectionMaxWidth = WIDTH_VALUES[appearance.sectionWidth || "full"] || "100%";
  const contentMaxWidth = CONTENT_WIDTH_VALUES[appearance.contentWidth || "wide"] || "100%";
  const isSectionFull = sectionMaxWidth === "100%";

  const shadowValue = styles.boxShadow === "dark-glow" ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)" : styles.boxShadow && styles.boxShadow !== "none" ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none";
  const htmlAnchor = advanced.htmlAnchor || "gh-head";

  const brandHtml = general.showLogo !== false ? `
    <div class="gh-head-brand">
      <a class="gh-head-logo" href="{{@site.url}}" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 8px;">
        {{#if @site.logo}}
          <img src="{{@site.logo}}" alt="{{@site.title}}" style="max-height: ${general.logoSize || 40}px; width: auto;" />
        {{else}}
          <span class="gh-site-title">{{@site.title}}</span>
        {{/if}}
      </a>
      <button class="gh-burger" aria-label="Main Menu" style="display: none; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: ${palette.text}; padding: 8px;">
        <svg class="burger-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="pointer-events: none;">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg class="close-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display: none; pointer-events: none;">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>` : `
    <div class="gh-head-brand">
      <button class="gh-burger" aria-label="Main Menu" style="display: none; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: ${palette.text}; padding: 8px;">
        <svg class="burger-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg class="close-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display: none;">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>`;

  // FIX (bug 1): the nav had no flex/gap of its own — it only relied on a
  // `.gh-head-menu .nav` selector in the <style> block that doesn't match
  // Ghost's actual {{navigation}} output (plain <a> tags, no .nav wrapper).
  // Inline flex/gap here means it works even if the <style> block below is
  // stripped or the markup structure changes again.
  const navHtml = `
    <nav class="gh-head-menu">
      {{navigation}}
    </nav>`;

  const actionsHtml = `
    <div class="gh-head-actions">
      ${general.showSearch !== false ? `
      <button class="gh-search-btn" data-ghost-search aria-label="Search" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>` : ""}

      ${general.showThemeSwitcher !== false ? `
      <button class="gh-theme-toggle" aria-label="Toggle Theme" onclick="toggleThemeMode()" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>` : ""}

      {{#if @site.members_enabled}}
        {{#unless @member}}
          ${general.showSignIn !== false ? `
          <a class="gh-head-link" href="#/portal/signin" data-portal="signin" style="font-size: 17px; font-weight: 500; color: inherit; text-decoration: none; opacity: 0.9; padding: 0 4px; white-space: nowrap;">${general.signInText || "Sign in"}</a>` : ""}
          ${general.showSubscribe !== false ? `
          <a class="gh-head-btn gh-btn" href="#/portal/signup" data-portal="signup" style="background-color: ${palette.buttonBg} !important; color: ${palette.buttonText} !important; padding: 10px 24px; border-radius: 9999px; font-size: 17px; font-weight: 600; text-decoration: none; white-space: nowrap; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: opacity 0.15s; border: none; opacity: 0.95;">${general.subscribeText || "Subscribe"}</a>` : ""}
        {{else}}
          <a class="gh-head-link" href="#/portal/account" data-portal="account" style="font-size: 17px; font-weight: 500; color: inherit; text-decoration: none; opacity: 0.9; padding: 0 4px; white-space: nowrap;">Account</a>
          <a class="gh-head-link gh-signout" href="javascript:" data-members-signout style="font-size: 17px; font-weight: 500; color: inherit; text-decoration: none; opacity: 0.9; padding: 0 4px; white-space: nowrap;">Sign out</a>
        {{/unless}}
      {{/if}}
    </div>`;

  let desktopLayoutCss = "";
  if (isStacked) {
    desktopLayoutCss = `
      #${htmlAnchor} .gh-head-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        text-align: center;
      }
      #${htmlAnchor} .gh-head-menu {
        display: flex;
        justify-content: center;
        width: 100%;
      }
    `;
  } else if (isLogoCenter) {
    desktopLayoutCss = `
      #${htmlAnchor} .gh-head-inner {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 24px;
      }
      #${htmlAnchor} .gh-head-brand { justify-self: center; order: 2; }
      #${htmlAnchor} .gh-head-menu { 
        order: 1; 
        display: flex; 
        justify-content: flex-start; 
        width: 100%;
      }
      #${htmlAnchor} .gh-head-actions { justify-self: end; order: 3; }
    `;
  } else {
    desktopLayoutCss = `
      #${htmlAnchor} .gh-head-inner {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 32px;
      }
      #${htmlAnchor} .gh-head-brand { justify-self: start; }
      #${htmlAnchor} .gh-head-menu { 
        display: flex; 
        justify-content: center;
        width: 100%;
      }
      #${htmlAnchor} .gh-head-actions { justify-self: end; }
    `;
  }

  // FIX (bug 2): section-width-* / content-width-* classes were emitted on
  // the elements but nothing in this <style> block ever defined what they
  // do. max-width is now set directly (both here in the fallback CSS classes
  // AND as an inline style on the elements below, so it works regardless of
  // whether this <style> block or the inline style wins in your build).
  const sectionWidthCss = isSectionFull
    ? `max-width: none;`
    : `max-width: ${sectionMaxWidth}; margin-left: auto; margin-right: auto; border-radius: 12px;`;
  const contentWidthCss = `max-width: ${contentMaxWidth}; margin-left: auto; margin-right: auto;`;

  return `
<style>
  #${htmlAnchor}.section-width-${appearance.sectionWidth || 'full'} {
    ${sectionWidthCss}
  }
  #${htmlAnchor} .gh-head-inner.content-width-${appearance.contentWidth || 'wide'} {
    ${contentWidthCss}
  }
  #${htmlAnchor} .gh-head-brand {
    font-weight: 700;
    font-size: 24px;
    white-space: nowrap;
  }
  #${htmlAnchor} .gh-head-inner {
    padding: 0 4vmin;
  }
  @media (min-width: 768px) {
    #${htmlAnchor} .gh-head-inner {
      padding: 20px 24px;
    }
    ${desktopLayoutCss}
    #${htmlAnchor} .gh-head-brand {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    #${htmlAnchor} .gh-head-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    #${htmlAnchor} .gh-head-menu {
      opacity: 0.9;
    }
    #${htmlAnchor} .gh-head-menu .nav {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: ${isStacked ? 'center' : 'flex-start'};
      gap: ${isStacked ? '32px' : '28px'};
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
  #${htmlAnchor} .gh-head-menu .nav li {
    margin: 0;
    padding: 0;
  }
  #${htmlAnchor} .gh-head-menu a {
    color: inherit;
    text-decoration: none;
    font-size: 18px;
    font-weight: 500;
    opacity: 0.9;
    padding: 8px 16px;
    display: inline-block;
    transition: opacity 0.15s;
  }
  #${htmlAnchor} .gh-head-menu a:hover,
  #${htmlAnchor} .gh-search-btn:hover,
  #${htmlAnchor} .gh-theme-toggle:hover,
  #${htmlAnchor} .gh-head-link:hover,
  #${htmlAnchor} .gh-head-btn:hover {
    opacity: 1 !important;
  }
  
  /* Mobile Menu Overrides for Custom Colors and Fullscreen layout */
  .gh-head-open #${htmlAnchor} {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    height: 100vh !important;
    z-index: 9999999 !important;
    overflow-y: scroll !important;
    background-color: ${bgStyle} !important;
  }
  
  .gh-head-open #${htmlAnchor} .gh-head-inner {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    align-items: center !important;
    justify-content: flex-start !important;
    padding-top: 24px !important;
  }

  .gh-head-open #${htmlAnchor} .gh-head-brand {
    width: 100% !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    margin-bottom: 32px !important;
  }

  .gh-head-open #${htmlAnchor} .gh-head-actions {
    background-color: transparent !important;
    margin-top: 32px !important;
  }
  
  /* Ensure SVG overrides any native ghost lines */
  #${htmlAnchor} .gh-burger::before,
  #${htmlAnchor} .gh-burger::after {
    display: none !important;
  }
  .gh-head-open #${htmlAnchor} .gh-burger .burger-icon {
    display: none !important;
  }
  .gh-head-open #${htmlAnchor} .gh-burger .close-icon {
    display: block !important;
  }
  
  /* Fallback mobile layouts just in case Casper CSS is missing or ID changed */
  @media (max-width: 767px) {
    #${htmlAnchor} .gh-burger {
      display: flex !important;
    }
    #${htmlAnchor} .gh-head-menu,
    #${htmlAnchor} .gh-head-actions {
      position: fixed;
      justify-content: center;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .gh-head-open #${htmlAnchor} .gh-head-menu,
    .gh-head-open #${htmlAnchor} .gh-head-actions {
      position: relative !important;
      visibility: visible !important;
      opacity: 1 !important;
      display: flex !important;
      flex-direction: column !important;
      width: 100% !important;
    }
    .gh-head-open #${htmlAnchor} .nav {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 24px !important;
      width: 100% !important;
    }
  }
</style>

<div style="width: 100%; padding: 0; background-color: transparent;">
  <header 
    id="${htmlAnchor}" 
    class="gh-head section-width-${appearance.sectionWidth || 'full'}"
    style="
      position: relative;
      background-color: ${bgStyle};
      color: ${palette.text};
      width: 100%;
      ${isSectionFull ? "" : `max-width: ${sectionMaxWidth}; margin-left: auto; margin-right: auto; border-radius: 12px;`}
      margin-bottom: ${styles.marginBottom || '0px'};
      box-shadow: ${shadowValue};
      opacity: ${styles.opacity ?? 1};
      ${glassEnabled ? `backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);` : ""}
      transition: all 0.15s ease-in-out;
    "
  >
    <div class="gh-head-inner content-width-${appearance.contentWidth || 'wide'}" style="width: 100%; max-width: ${contentMaxWidth}; margin-left: auto; margin-right: auto;">
      ${brandHtml}
      ${navHtml}
      ${actionsHtml}
    </div>
  </header>
</div>`;
};