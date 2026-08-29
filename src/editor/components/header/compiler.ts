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

  const searchSvg = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

  const themeSvg = `
    <svg class="icon-moon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    <svg class="icon-sun" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" style="display: none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
  `;

  const brandHtml = general.showLogo !== false ? `
    <div class="gh-head-brand">
      <a class="gh-head-logo" href="{{@site.url}}" style="color: inherit; text-decoration: none; display: flex; align-items: center; gap: 8px;">
        {{#if @site.logo}}
          <img src="{{@site.logo}}" alt="{{@site.title}}" style="max-height: ${general.logoSize || 40}px; width: auto;" />
        {{else}}
          <span class="gh-site-title">{{@site.title}}</span>
        {{/if}}
      </a>
      <div class="gh-head-brand-actions" style="display: flex; align-items: center; gap: 8px;">
        ${general.showSearch !== false ? `<button class="gh-search-btn gh-mobile-only" data-ghost-search aria-label="Search" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">${searchSvg}</button>` : ""}
        ${general.showThemeSwitcher !== false ? `<button class="gh-theme-toggle gh-mobile-only" aria-label="Toggle Theme" onclick="toggleThemeMode()" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">${themeSvg}</button>` : ""}
        <button class="gh-burger" aria-label="Main Menu">
          <svg class="burger-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="pointer-events: none;">
            <line x1="3" y1="8" x2="21" y2="8"></line>
            <line x1="3" y1="16" x2="21" y2="16"></line>
          </svg>
          <svg class="close-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display: none; pointer-events: none;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>` : `
    <div class="gh-head-brand">
      <div class="gh-head-brand-actions" style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
        ${general.showSearch !== false ? `<button class="gh-search-btn gh-mobile-only" data-ghost-search aria-label="Search" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">${searchSvg}</button>` : ""}
        ${general.showThemeSwitcher !== false ? `<button class="gh-theme-toggle gh-mobile-only" aria-label="Toggle Theme" onclick="toggleThemeMode()" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">${themeSvg}</button>` : ""}
        <button class="gh-burger" aria-label="Main Menu">
          <svg class="burger-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="pointer-events: none;">
            <line x1="3" y1="8" x2="21" y2="8"></line>
            <line x1="3" y1="16" x2="21" y2="16"></line>
          </svg>
          <svg class="close-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="display: none; pointer-events: none;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>`;

  // FIX (bug 1): the nav had no flex/gap of its own — it only relied on a
  // `.gh-head-menu .nav` selector in the <style> block that doesn't match
  // Ghost's actual {{navigation}} output (plain <a> tags, no .nav wrapper).
  // Inline flex/gap here means it works even if the <style> block below is
  // stripped or the markup structure changes again.
  const navHtml = `
    <nav class="gh-head-menu">
      <ul class="nav">
        {{navigation}}
      </ul>
    </nav>`;

  const actionsHtml = `
    <div class="gh-head-actions">
      ${general.showSearch !== false ? `
      <button class="gh-search-btn gh-desktop-only" data-ghost-search aria-label="Search" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>` : ""}

      ${general.showThemeSwitcher !== false ? `
      <button class="gh-theme-toggle gh-desktop-only" aria-label="Toggle Theme" onclick="toggleThemeMode()" style="padding: 6px; border-radius: 9999px; border: none; background: transparent; color: inherit; cursor: pointer; opacity: 0.8; transition: opacity 0.15s;">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>` : ""}

      {{#if @site.members_enabled}}
        {{#unless @member}}
          ${general.showSignIn !== false ? `
          <a class="gh-head-link" href="#/portal/signin" data-portal="signin" style="font-size: 17px; font-weight: 500; color: inherit; text-decoration: none; opacity: 0.9; padding: 0 4px; white-space: nowrap;">${general.signInText || "Sign in"}</a>` : ""}
          ${general.showSubscribe !== false ? `
          <a class="gh-head-btn gh-btn" href="#/portal/signup" data-portal="signup" style="background-color: ${palette.buttonBg}; color: ${palette.buttonText}; padding: 10px 24px; border-radius: 9999px; font-size: 17px; font-weight: 600; text-decoration: none; white-space: nowrap; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: opacity 0.15s; border: none; opacity: 0.95;">${general.subscribeText || "Subscribe"}</a>` : ""}
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
    #${htmlAnchor} .gh-burger {
      display: none !important;
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
  #${htmlAnchor} .gh-head-menu .nav a {
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
  
  #${htmlAnchor} .gh-mobile-only {
    display: none !important;
  }
  
  /* ===== Mobile Menu ===== */
  /* 
   * These rules use doubled-up class selectors to beat Casper's built-in
   * #gh-head specificity on the same elements. The .gh-head class is always
   * present on the <header> alongside the #gh-head id.
   */
  @media (max-width: 767px) {
    /* -- Closed state: compact 64px bar -- */
    #${htmlAnchor}.gh-head {
      height: 64px !important;
    }
    #${htmlAnchor}.gh-head .gh-desktop-only {
      display: none !important;
    }
    #${htmlAnchor}.gh-head .gh-mobile-only {
      display: block !important;
    }

    #${htmlAnchor}.gh-head .gh-head-inner {
      grid-template-rows: auto 1fr auto !important;
      grid-template-columns: 1fr !important;
      gap: 48px !important;
    }

    #${htmlAnchor}.gh-head .gh-head-brand {
      display: grid !important;
      grid-template-columns: 1fr auto !important;
      align-items: center !important;
      height: 64px !important;
    }

    #${htmlAnchor}.gh-head .gh-burger {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: transparent !important;
      border: none !important;
      cursor: pointer !important;
      color: ${palette.text} !important;
      padding: 8px !important;
    }

    #${htmlAnchor}.gh-head .gh-head-menu,
    #${htmlAnchor}.gh-head .gh-head-actions {
      position: fixed !important;
      justify-content: center !important;
      visibility: hidden !important;
      opacity: 0 !important;
      transition: opacity 0.3s ease, visibility 0.3s ease !important;
    }

    #${htmlAnchor}.gh-head .gh-head-menu {
      margin: 0 !important;
      transform: translateY(0) !important;
    }

    #${htmlAnchor}.gh-head .nav li {
      opacity: 0 !important;
      transform: translateY(-4px) !important;
      transition: transform 0.2s ease, opacity 0.2s ease !important;
    }

    #${htmlAnchor}.gh-head :is(.gh-head-button, .gh-head-link, .gh-head-btn) {
      opacity: 0 !important;
      transform: translateY(8px) !important;
      transition: transform 0.4s ease, opacity 0.4s ease !important;
    }

    /* -- Open state: full viewport overlay -- */
    .gh-head-open #${htmlAnchor}.gh-head {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      height: 100% !important;
      max-height: none !important;
      z-index: 3999999 !important;
      overflow-y: scroll !important;
      -webkit-overflow-scrolling: touch !important;
      background-color: ${bgStyle} !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .gh-head-inner {
      display: flex !important;
      flex-direction: column !important;
      height: 100% !important;
      box-sizing: border-box !important;
      align-items: center !important;
      justify-content: flex-start !important;
      padding-top: 0 !important;
      gap: 48px !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .gh-head-brand {
      width: 100% !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      height: 64px !important;
      flex-shrink: 0 !important;
      margin-bottom: 0 !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .gh-head-menu,
    .gh-head-open #${htmlAnchor}.gh-head .gh-head-actions {
      position: static !important;
      visibility: visible !important;
      opacity: 1 !important;
      transition: opacity 0.3s ease, visibility 0.3s ease !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      width: 100% !important;
      background-color: transparent !important;
      margin: 0 !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .gh-head-menu {
      gap: 16px !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .gh-head-actions {
      position: sticky !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      display: inline-flex !important;
      flex-direction: column-reverse !important;
      gap: 12px !important;
      align-items: center !important;
      padding: max(4vmin, 20px) 0 max(4vmin, 28px) !important;
      background-color: ${bgStyle} !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .nav {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 16px !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      list-style: none !important;
      line-height: 1.4 !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .nav li {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      text-align: center !important;
      opacity: 1 !important;
      transform: translateY(0) !important;
      transition: transform 0.2s ease, opacity 0.2s ease !important;
    }

    /* Staggered delays for nav items */
    .gh-head-open #${htmlAnchor}.gh-head .nav li:nth-child(1) { transition-delay: 0.05s !important; }
    .gh-head-open #${htmlAnchor}.gh-head .nav li:nth-child(2) { transition-delay: 0.10s !important; }
    .gh-head-open #${htmlAnchor}.gh-head .nav li:nth-child(3) { transition-delay: 0.15s !important; }
    .gh-head-open #${htmlAnchor}.gh-head .nav li:nth-child(4) { transition-delay: 0.20s !important; }
    .gh-head-open #${htmlAnchor}.gh-head .nav li:nth-child(5) { transition-delay: 0.25s !important; }
    .gh-head-open #${htmlAnchor}.gh-head .nav li:nth-child(6) { transition-delay: 0.30s !important; }

    .gh-head-open #${htmlAnchor}.gh-head .nav a {
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      width: 100% !important;
      display: inline-block !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head :is(.gh-head-button, .gh-head-link, .gh-head-btn) {
      opacity: 1 !important;
      transform: translateY(0) !important;
      transition: transform 0.4s ease, opacity 0.4s ease !important;
      transition-delay: 0.3s !important;
    }

    .gh-head-open #${htmlAnchor}.gh-head .gh-head-btn {
      width: 100% !important;
      max-width: 280px !important;
      text-align: center !important;
    }

    /* SVG burger icon toggle */
    #${htmlAnchor}.gh-head .gh-burger::before,
    #${htmlAnchor}.gh-head .gh-burger::after {
      display: none !important;
    }
    .gh-head-open #${htmlAnchor}.gh-head .gh-burger .burger-icon {
      display: none !important;
    }
    .gh-head-open #${htmlAnchor}.gh-head .gh-burger .close-icon {
      display: block !important;
    }
  }

  /* Dark mode overrides (placed at the end to ensure they win over previous styles) */
  html.dark #${htmlAnchor}.gh-head,
  html.dark #${htmlAnchor}.gh-head.gh-head-open,
  html.dark .gh-head-open #${htmlAnchor}.gh-head .gh-head-actions,
  html.dark #${htmlAnchor}.gh-head .gh-head-actions {
    background-color: #111111 !important;
    color: #ffffff !important;
  }
  
  html.dark #${htmlAnchor}.gh-head .gh-head-btn {
    background-color: #ffffff !important;
    color: #000000 !important;
  }

  html.dark #${htmlAnchor}.gh-head .icon-moon { display: none !important; }
  html.dark #${htmlAnchor}.gh-head .icon-sun { display: block !important; }
  html:not(.dark) #${htmlAnchor}.gh-head .icon-sun { display: none !important; }
  html:not(.dark) #${htmlAnchor}.gh-head .icon-moon { display: block !important; }

</style>

<script>
(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const head = document.getElementById('${htmlAnchor}');
    const burger = head ? head.querySelector('.gh-burger') : null;
    
    if (!head || !burger) return;

    // Check if there's a pre-existing open state (e.g., from server-side)
    const isOpen = head.classList.contains('gh-head-open');
    
    // Toggle function
    function toggleMenu(e) {
      e.stopPropagation();
      head.classList.toggle('gh-head-open');
      document.body.classList.toggle('gh-head-open');
      
      // Toggle burger/close icons
      const burgerIcon = burger.querySelector('.burger-icon');
      const closeIcon = burger.querySelector('.close-icon');
      if (burgerIcon && closeIcon) {
        const open = head.classList.contains('gh-head-open');
        burgerIcon.style.display = open ? 'none' : 'block';
        closeIcon.style.display = open ? 'block' : 'none';
      }
    }

    // Click handler
    burger.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (head.classList.contains('gh-head-open')) {
        const isClickInside = head.contains(e.target);
        if (!isClickInside) {
          head.classList.remove('gh-head-open');
          document.body.classList.remove('gh-head-open');
          
          const burgerIcon = burger.querySelector('.burger-icon');
          const closeIcon = burger.querySelector('.close-icon');
          if (burgerIcon && closeIcon) {
            burgerIcon.style.display = 'block';
            closeIcon.style.display = 'none';
          }
        }
      }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && head.classList.contains('gh-head-open')) {
        head.classList.remove('gh-head-open');
        document.body.classList.remove('gh-head-open');
        
        const burgerIcon = burger.querySelector('.burger-icon');
        const closeIcon = burger.querySelector('.close-icon');
        if (burgerIcon && closeIcon) {
          burgerIcon.style.display = 'block';
          closeIcon.style.display = 'none';
        }
      }
    });
  }
})();

function toggleThemeMode() {
  document.documentElement.classList.toggle('dark');
  if (document.documentElement.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
}

(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();
</script>

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