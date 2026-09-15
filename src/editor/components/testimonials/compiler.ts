import { BuilderBlock } from "@/types/theme";
import { TestimonialItem } from "./schema";
import { getBackgroundCSS } from "@/editor/components/shared/background";

const renderStarIcons = (filledCount: number) => {
  return Array.from({ length: 5 })
    .map((_, i) => {
      const isFilled = i < filledCount;
      return `<svg class="gh-star ${isFilled ? "gh-star-filled" : "gh-star-empty"}" width="15" height="15" viewBox="0 0 20 20" fill="${
        isFilled ? "#f59e0b" : "#d4d4d8"
      }"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
    })
    .join("");
};

export const compileToHbs = (block: BuilderBlock) => {
  const props = block.props || {};
  const items: TestimonialItem[] = props.items || [];
  const useDynamicData = props.useDynamicData !== false;
  const dynamicTag = props.dynamicTag || "testimonial";
  const dynamicLimit = props.dynamicLimit ? Math.max(1, Number(props.dynamicLimit)) : 100;
  const layout = props.layout || "grid-3";
  const cardStyle = props.cardStyle || "bordered";
  const showSectionHeader = props.showSectionHeader !== false;
  const textColor = props.textColor || "";

  const showStars = props.showStars !== false;
  const showPhotos = props.showPhotos !== false;
  const showRoleCompany = props.showRoleCompany !== false;
  const showDate = props.showDate !== false;
  const showLocation = props.showLocation !== false;
  const showSocialLink = props.showSocialLink !== false;

  const isSingle = layout === "grid-1" || items.length === 1;
  const containerClass = isSingle
    ? "gh-testimonials-grid-1"
    : layout === "grid-2"
    ? "gh-testimonials-grid-2"
    : "gh-testimonials-grid-3";

  const uid = `testimonials-${Math.random().toString(36).slice(2, 9)}`;
  const pt = (block.styles?.paddingTop as string) || "3rem";
  const pb = (block.styles?.paddingBottom as string) || "4rem";
  const bgCSS = getBackgroundCSS(block.styles);

  // Section Header HTML
  let headerHtml = "";
  if (showSectionHeader && (props.sectionTitle || props.sectionSubtitle || props.sectionBadge)) {
    headerHtml = `
  <div class="gh-testimonials-header">
    ${props.sectionBadge ? `<span class="gh-testimonials-badge">${props.sectionBadge}</span>` : ""}
    ${props.sectionTitle ? `<h2 class="gh-testimonials-title">${props.sectionTitle}</h2>` : ""}
    ${props.sectionSubtitle ? `<p class="gh-testimonials-subtitle">${props.sectionSubtitle}</p>` : ""}
  </div>`;
  }

  // Social Icon Helper
  const getSocialIconSvg = (platform?: string) => {
    switch (platform) {
      case "twitter":
        return `<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
      case "linkedin":
        return `<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6-1.6c0-.88-.72-1.6-1.6-1.6Z"/></svg>`;
      case "facebook":
        return `<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
      case "github":
        return `<svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`;
      case "website":
      default:
        return `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    }
  };

  // Dynamic Card Template
  const dynamicCardTemplate = `
    <div class="gh-testimonial-card gh-card-${cardStyle} {{#if featured}}gh-card-featured{{/if}}">
      <span class="gh-card-raw-excerpt" style="display:none !important;">{{#if custom_excerpt}}{{custom_excerpt}}{{/if}}</span>
      {{#if featured}}<div class="gh-featured-pill">★ Featured</div>{{/if}}
      ${showStars ? `
      <div class="gh-card-top">
        <div class="gh-testimonial-stars">
          {{#has tag="1-star, 1-stars, #1-star, star-1, #star-1, rating-1, 1"}}
            ${renderStarIcons(1)}
          {{else has tag="2-star, 2-stars, #2-star, star-2, #star-2, rating-2, 2"}}
            ${renderStarIcons(2)}
          {{else has tag="3-star, 3-stars, #3-star, star-3, #star-3, rating-3, 3"}}
            ${renderStarIcons(3)}
          {{else has tag="4-star, 4-stars, #4-star, star-4, #star-4, rating-4, 4"}}
            ${renderStarIcons(4)}
          {{else}}
            ${renderStarIcons(5)}
          {{/has}}
        </div>
      </div>` : ""}
      
      <div class="gh-card-body">
        <div class="gh-testimonial-quote">{{#if content}}{{{content}}}{{else if html}}{{{html}}}{{else if custom_excerpt}}"{{custom_excerpt}}"{{else}}"{{title}}"{{/if}}</div>
      </div>

      <div class="gh-card-footer">
        <div class="gh-author-wrap">
          ${showPhotos ? `
          {{#if feature_image}}
            <img src="{{feature_image}}" alt="{{title}}" class="gh-author-avatar" loading="lazy" />
          {{else}}
            {{#if primary_author.profile_image}}
              <img src="{{primary_author.profile_image}}" alt="{{title}}" class="gh-author-avatar" loading="lazy" />
            {{else}}
              <div class="gh-author-avatar-fallback">{{#if title}}{{title}}{{else}}U{{/if}}</div>
            {{/if}}
          {{/if}}` : ""}
          <div class="gh-author-details">
            <span class="gh-author-name">{{title}}</span>
            ${showRoleCompany ? `
            <span class="gh-author-role" {{#unless twitter_title}}{{#unless og_title}}{{#unless meta_title}}{{#unless primary_author.bio}}style="display:none;"{{/unless}}{{/unless}}{{/unless}}{{/unless}}>
              {{#if twitter_title}}
                {{twitter_title}}
              {{else if og_title}}
                {{og_title}}
              {{else if meta_title}}
                {{meta_title}}
              {{else if primary_author.bio}}
                {{primary_author.bio}}
              {{/if}}
            </span>` : ""}
            <div class="gh-author-meta-row">
              ${showLocation ? `
              <span class="gh-author-location" {{#unless twitter_description}}{{#unless og_description}}{{#unless meta_description}}{{#unless primary_author.location}}style="display:none;"{{/unless}}{{/unless}}{{/unless}}{{/unless}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span class="gh-loc-text">
                  {{#if twitter_description}}
                    {{twitter_description}}
                  {{else if og_description}}
                    {{og_description}}
                  {{else if meta_description}}
                    {{meta_description}}
                  {{else if primary_author.location}}
                    {{primary_author.location}}
                  {{/if}}
                </span>
              </span>
              <span class="gh-meta-sep" {{#unless twitter_description}}{{#unless og_description}}{{#unless meta_description}}{{#unless primary_author.location}}style="display:none;"{{/unless}}{{/unless}}{{/unless}}{{/unless}}>•</span>` : ""}
              ${showDate ? `<span class="gh-author-meta">{{date format="MMMM YYYY"}}</span>` : ""}
            </div>
          </div>
        </div>
        ${showSocialLink ? `
        <a href="{{#if canonical_url}}{{canonical_url}}{{else if primary_author.website}}{{primary_author.website}}{{else if primary_author.twitter}}{{twitter_url primary_author.twitter}}{{else if primary_author.facebook}}{{facebook_url primary_author.facebook}}{{else}}{{url}}{{/if}}" target="_blank" rel="noopener noreferrer" class="gh-social-link" title="Website / Profile" {{#unless canonical_url}}{{#unless primary_author.website}}{{#unless primary_author.twitter}}{{#unless primary_author.facebook}}style="display:none;"{{/unless}}{{/unless}}{{/unless}}{{/unless}}>
          ${getSocialIconSvg("website")}
        </a>` : ""}
      </div>
    </div>`;

  let contentHtml = "";

  if (useDynamicData) {
    const cleanTag = dynamicTag.startsWith("#") ? dynamicTag.slice(1) : dynamicTag;

    contentHtml = `
  {{#get "posts" filter="tag:[${cleanTag},${cleanTag}s]" limit="${dynamicLimit}" include="authors,tags"}}
  <div class="gh-testimonials-container ${containerClass}">
    {{#foreach posts}}
      ${dynamicCardTemplate}
    {{/foreach}}
  </div>
  {{else}}
  {{#get "posts" limit="${dynamicLimit}" include="authors,tags"}}
  <div class="gh-testimonials-container ${containerClass}">
    {{#foreach posts}}
      ${dynamicCardTemplate}
    {{/foreach}}
  </div>
  {{/get}}
  {{/get}}`;
  } else {
    // Static Custom Testimonials Cards HTML
    const cardsHtml = items
      .map((item) => {
        const isFeatured = !!item.featured;
        const cardClass = `gh-testimonial-card gh-card-${cardStyle} ${isFeatured ? "gh-card-featured" : ""}`;

        // Star ratings SVG (5 stars)
        let starsHtml = "";
        if (showStars) {
          const rating = item.rating || 5;
          starsHtml = `<div class="gh-card-top"><div class="gh-testimonial-stars">${renderStarIcons(rating)}</div></div>`;
        }

        // Author Photo / Initials Fallback
        let avatarHtml = "";
        if (showPhotos) {
          if (item.avatar) {
            avatarHtml = `<img src="${item.avatar}" alt="${item.author || "User"}" class="gh-author-avatar" loading="lazy" />`;
          } else {
            const initials = (item.author || "U")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            avatarHtml = `<div class="gh-author-avatar-fallback">${initials}</div>`;
          }
        }

        // Role & Company
        let roleHtml = "";
        if (showRoleCompany && (item.role || item.company)) {
          roleHtml = `<span class="gh-author-role">${item.role || ""}${
            item.role && item.company ? " • " : ""
          }<strong>${item.company || ""}</strong></span>`;
        }

        // Meta: Location & Date
        let metaHtml = "";
        if ((showDate && item.date) || (showLocation && item.location)) {
          metaHtml = `
          <div class="gh-author-meta-row">
            ${showLocation && item.location ? `<span class="gh-author-location"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>${item.location}</span><span class="gh-meta-sep">•</span>` : ""}
            ${showDate && item.date ? `<span class="gh-author-meta">${item.date}</span>` : ""}
          </div>`;
        }

        // Social Link
        let socialHtml = "";
        if (showSocialLink && item.socialUrl) {
          socialHtml = `<a href="${item.socialUrl}" target="_blank" rel="noopener noreferrer" class="gh-social-link" title="View Profile">
            ${getSocialIconSvg(item.socialPlatform)}
          </a>`;
        }

        return `
      <div class="${cardClass}">
        ${isFeatured ? `<div class="gh-featured-pill">★ Featured</div>` : ""}
        ${starsHtml}
        <div class="gh-card-body">
          <p class="gh-testimonial-quote">"${item.quote || ""}"</p>
        </div>
        <div class="gh-card-footer">
          <div class="gh-author-wrap">
            ${avatarHtml}
            <div class="gh-author-details">
              <span class="gh-author-name">${item.author || "Anonymous"}</span>
              ${roleHtml}
              ${metaHtml}
            </div>
          </div>
          ${socialHtml}
        </div>
      </div>`;
      })
      .join("\n");

    contentHtml = `
  <div class="gh-testimonials-container ${containerClass}">
    ${cardsHtml}
  </div>`;
  }

  const clientScript = useDynamicData ? `
  <script>
  (function() {
    function parseExcerptInfo() {
      var section = document.getElementById("${uid}");
      if (!section) return;
      var cards = section.querySelectorAll(".gh-testimonial-card");
      cards.forEach(function(card) {
        var rawEl = card.querySelector(".gh-card-raw-excerpt");
        var raw = rawEl ? (rawEl.textContent || "").trim() : "";
        if (!raw) return;

        var lines = raw.split(/\\r?\\n|\\|/g).map(function(s) { return s.trim(); }).filter(Boolean);
        if (!lines.length) return;

        var role = "";
        var location = "";
        var link = "";

        lines.forEach(function(line) {
          if (/^(https?:\\/\\/|www\\.)/i.test(line) || /^[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}(\\/.*)?$/i.test(line)) {
            link = /^www\\./i.test(line) ? "https://" + line : (line.indexOf("://") === -1 ? "https://" + line : line);
          } else if (!role) {
            role = line;
          } else if (!location) {
            location = line;
          } else if (!link) {
            link = line;
          }
        });

        if (role) {
          var roleEl = card.querySelector(".gh-author-role");
          if (roleEl) {
            roleEl.textContent = role;
            roleEl.style.display = "block";
          }
        }

        if (location) {
          var locEl = card.querySelector(".gh-author-location");
          if (locEl) {
            var locText = locEl.querySelector(".gh-loc-text");
            if (locText) {
              locText.textContent = location;
            } else {
              locEl.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span class="gh-loc-text">' + location + "</span>";
            }
            locEl.style.display = "inline-flex";
            var sep = card.querySelector(".gh-meta-sep");
            if (sep) sep.style.display = "inline";
          }
        }

        if (link) {
          var socialEl = card.querySelector(".gh-social-link");
          if (socialEl) {
            socialEl.href = link;
            socialEl.style.display = "flex";
          }
        }
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", parseExcerptInfo);
    } else {
      parseExcerptInfo();
    }
  })();
  </script>` : "";

  return `<section id="${uid}" class="gh-testimonials-section ${block.styles?.backgroundType === "mesh" ? "mesh-glow" : ""}">
  <style>
    #${uid}.gh-testimonials-section {
      width: 100%;
      padding: ${pt} 1.25rem ${pb} 1.25rem;
      box-sizing: border-box;
      ${bgCSS}
      ${textColor ? `color: ${textColor};` : ""}
    }
    #${uid} .gh-testimonials-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 2.5rem auto;
    }
    #${uid} .gh-testimonials-badge {
      display: inline-block;
      font-size: 11px;
      font-family: monospace;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 4px 12px;
      border-radius: 9999px;
      background: #f4f4f5;
      color: ${textColor ? textColor : "#18181b"};
      border: 1px solid #e4e4e7;
      margin-bottom: 0.75rem;
    }
    #${uid} .gh-testimonials-title {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.2;
      color: ${textColor ? textColor : "#18181b"};
      margin: 0 0 0.5rem 0;
    }
    #${uid} .gh-testimonials-subtitle {
      font-size: 1rem;
      color: ${textColor ? textColor : "#71717a"};
      ${textColor ? "opacity: 0.85;" : ""}
      line-height: 1.6;
      margin: 0;
    }
    #${uid} .gh-testimonials-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: stretch;
      gap: 1.5rem;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    #${uid} .gh-testimonial-card {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 14px;
      padding: 1.5rem;
      box-sizing: border-box;
      flex: 1 1 320px;
      max-width: 380px;
      min-width: 280px;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.2s ease;
    }
    #${uid} .gh-testimonial-card:hover {
      ${block.styles?.hoverEffect === "glow"
        ? "transform: translateY(-3px); box-shadow: 0 0 30px rgba(0, 0, 0, 0.12), 0 12px 28px -4px rgba(0, 0, 0, 0.14) !important;"
        : block.styles?.hoverEffect === "scale"
        ? "transform: scale(1.02); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);"
        : "transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);"
      }
    }
    html.dark #${uid} .gh-testimonial-card:hover {
      ${block.styles?.hoverEffect === "glow"
        ? "box-shadow: 0 0 30px rgba(255, 255, 255, 0.15), 0 12px 28px rgba(0, 0, 0, 0.6) !important;"
        : ""
      }
    }
    /* Auto-center and balance for 1 post */
    #${uid} .gh-testimonials-grid-1 .gh-testimonial-card,
    #${uid} .gh-testimonials-container > .gh-testimonial-card:only-child {
      flex: 0 1 680px;
      max-width: 680px;
      width: 100%;
    }
    /* Balanced equal columns for 2 posts */
    #${uid} .gh-testimonials-grid-2 .gh-testimonial-card,
    #${uid} .gh-testimonials-container:has(> .gh-testimonial-card:nth-child(2):last-child) .gh-testimonial-card {
      flex: 1 1 420px;
      max-width: 460px;
    }
    @media (max-width: 768px) {
      #${uid} .gh-testimonials-container {
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
      }
      #${uid} .gh-testimonial-card {
        flex: 1 1 100% !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      #${uid} .gh-testimonials-title {
        font-size: 1.5rem;
      }
      #${uid}.gh-testimonials-section {
        padding: 2rem 1rem;
      }
    }
    #${uid} .gh-card-bordered {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    #${uid} .gh-card-soft {
      background: #f4f4f5;
      border: 1px solid #e4e4e7;
    }
    #${uid} .gh-card-elevated {
      background: #ffffff;
      border: 1px solid #f4f4f5;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);
    }
    #${uid} .gh-card-minimal {
      background: transparent;
      border: 1px solid #e4e4e7;
    }
    #${uid} .gh-card-featured {
      border: 2px solid #18181b;
      box-shadow: 0 4px 14px rgba(0,0,0,0.08);
    }
    #${uid} .gh-featured-pill {
      position: absolute;
      top: -11px;
      right: 16px;
      background: #18181b;
      color: #ffffff;
      font-size: 10px;
      font-family: monospace;
      font-weight: 600;
      padding: 2px 10px;
      border-radius: 9999px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    #${uid} .gh-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 0.65rem;
      min-width: 0;
    }
    #${uid} .gh-testimonial-stars {
      display: flex;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
    }
    #${uid} .gh-card-body {
      margin-bottom: 1.25rem;
    }
    #${uid} .gh-testimonial-quote {
      font-size: 15px;
      line-height: 1.6;
      color: #27272a;
      margin: 0;
      word-break: break-word;
    }
    #${uid} .gh-testimonial-quote p {
      margin: 0 0 0.5rem 0;
      font-size: inherit;
      line-height: inherit;
      color: inherit;
    }
    #${uid} .gh-testimonial-quote p:last-child {
      margin-bottom: 0;
    }
    #${uid} .gh-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-top: 0.85rem;
      border-top: 1px solid #f4f4f5;
      margin-top: auto;
      min-width: 0;
      text-align: left;
    }
    #${uid} .gh-author-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
      text-align: left;
    }
    #${uid} .gh-author-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
      border: 1px solid #e4e4e7;
    }
    #${uid} .gh-author-avatar-fallback {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e4e4e7;
      color: #27272a;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid #d4d4d8;
    }
    #${uid} .gh-author-details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
      flex: 1;
      text-align: left;
    }
    #${uid} .gh-author-name {
      font-size: 13px;
      font-weight: 600;
      color: #18181b;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      display: block;
    }
    #${uid} .gh-author-role {
      font-size: 11px;
      color: #71717a;
      line-height: 1.3;
      margin-top: 1px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      display: block;
    }
    #${uid} .gh-author-meta-row {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 3px;
      font-size: 10px;
      color: #a1a1aa;
      line-height: 1.2;
      text-align: left;
      flex-wrap: wrap;
    }
    #${uid} .gh-author-location {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      color: #71717a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }
    #${uid} .gh-loc-text {
      display: inline;
    }
    #${uid} .gh-meta-sep {
      color: #d4d4d8;
    }
    #${uid} .gh-author-meta {
      font-size: 10px;
      color: #a1a1aa;
      font-family: monospace;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #${uid} .gh-social-link {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #f4f4f5;
      color: #71717a;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    #${uid} .gh-social-link:hover {
      background: #e4e4e7;
      color: #18181b;
    }
  </style>
  ${headerHtml}
  ${contentHtml}
  ${clientScript}
</section>`;
};