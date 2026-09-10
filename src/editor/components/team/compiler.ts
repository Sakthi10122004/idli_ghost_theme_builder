import { BuilderBlock } from "@/types/theme";
import { TeamProps, TeamMember, defaultProps } from "./schema";
import { getBackgroundCSS } from "../shared/background";

export const generateHTML = (block: BuilderBlock): string => {
  const p = { ...defaultProps, ...block.props } as TeamProps;
  const general = p.general || defaultProps.general;
  const members = p.members || defaultProps.members;
  const appearance = p.appearance || defaultProps.appearance;
  const spacing = p.spacing || defaultProps.spacing;
  const styles = block.styles || {};

  const bgCss = getBackgroundCSS(styles, appearance);
  const wrapperId = p.advanced?.htmlAnchor || `team-${block.id}`;
  const photoShape = general.photoShape || "circle";
  const columns = general.columns || 4;

  const borderRadiusCss =
    photoShape === "circle"
      ? "50%"
      : photoShape === "square"
      ? "0px"
      : "1rem";

  const renderMember = (member: TeamMember) => {
    let src = member.photoUrl || "";
    if (src && src.startsWith("asset://")) {
      const path = src.replace("asset://", "");
      src = `{{asset "${path}"}}`;
    }

    const photoMarkup = src
      ? `<div class="team-photo-container">
          <img src="${src}" alt="${member.name || "Team Member"}" class="team-photo" loading="lazy" />
        </div>`
      : `<div class="team-photo-container team-photo-placeholder">
          <span class="team-initials">${(member.name || "T").slice(0, 1)}</span>
        </div>`;

    const bioHtml = member.bio ? member.bio.replace(/\n/g, "<br/>") : "";

    return `
      <div class="team-card">
        ${photoMarkup}
        <div class="team-info">
          <h3 class="team-name">${member.name || "Team Member"}</h3>
          ${member.role ? `<p class="team-role">${member.role}</p>` : ""}
          ${member.bio ? `<p class="team-bio">${bioHtml}</p>` : ""}
        </div>
      </div>
    `;
  };

  const headingHtml =
    general.heading || general.subheading
      ? `
    <div class="team-header">
      ${general.heading ? `<h2 class="team-heading">${general.heading}</h2>` : ""}
      ${general.subheading ? `<p class="team-subheading">${general.subheading}</p>` : ""}
    </div>
  `
      : "";

  const tag = general.dynamicTag || "team";
  const dynamicMembersHtml = `{{#get "posts" filter="tag:${tag}" limit="100" formats="html"}}
      {{#foreach posts}}
        <div class="team-card">
          {{#if canonical_url}}
            <a href="{{canonical_url}}" target="_blank" rel="noopener" class="team-photo-link">
          {{/if}}
          {{#if feature_image}}
            <div class="team-photo-container">
              <img src="{{img_url feature_image size="m"}}" alt="{{title}}" class="team-photo" loading="lazy" />
            </div>
          {{else}}
            <div class="team-photo-container team-photo-placeholder">
              <span class="team-initials">{{#if title}}{{title}}{{else}}T{{/if}}</span>
            </div>
          {{/if}}
          {{#if canonical_url}}
            </a>
          {{/if}}
          <div class="team-info">
            <h3 class="team-name">{{title}}</h3>
            {{#if custom_excerpt}}
              <p class="team-role">{{custom_excerpt}}</p>
            {{/if}}
            {{#if html}}
              <div class="team-bio">{{{html}}}</div>
            {{else if content}}
              <div class="team-bio">{{{content}}}</div>
            {{/if}}
          </div>
        </div>
      {{/foreach}}
    {{/get}}`;

  const membersHtml = general.useDynamicData
    ? dynamicMembersHtml
    : members.map(renderMember).join("\n");

  return `<style>
  #${wrapperId} {
    ${bgCss}
    padding-top: ${spacing.paddingTop || "5rem"};
    padding-bottom: ${spacing.paddingBottom || "5rem"};
    position: relative;
    width: 100%;
  }
  #${wrapperId} .team-inner {
    max-width: 80rem;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  #${wrapperId} .team-header {
    text-align: center;
    max-width: 42rem;
    margin: 0 auto 3.5rem auto;
  }
  #${wrapperId} .team-heading {
    font-family: var(--gh-font-heading, inherit);
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.025em;
    color: ${appearance?.headingColor || "var(--color-ink, #171717)"};
    margin: 0;
  }
  #${wrapperId} .team-subheading {
    margin-top: 0.75rem;
    font-family: var(--gh-font-body, inherit);
    font-size: 1.125rem;
    line-height: 1.6;
    color: ${appearance?.subheadingColor || "var(--color-mute, #4d4d4d)"};
    margin-bottom: 0;
  }
  #${wrapperId} .team-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2.5rem 1.5rem;
  }
  #${wrapperId} .team-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 24rem;
    flex-shrink: 0;
  }
  @media (min-width: 640px) {
    #${wrapperId} .team-grid {
      gap: 3rem 2rem;
    }
    #${wrapperId} .team-card {
      width: calc((100% - ${(Math.min(2, columns) - 1) * 2}rem) / ${Math.min(2, columns)});
      max-width: none;
    }
  }
  @media (min-width: 1024px) {
    #${wrapperId} .team-grid {
      gap: 3.5rem 2rem;
    }
    #${wrapperId} .team-card {
      width: calc((100% - ${(columns - 1) * 2}rem) / ${columns});
      max-width: none;
    }
  }
  #${wrapperId} .team-photo-link {
    display: block;
    text-decoration: none;
    color: inherit;
    border-radius: ${borderRadiusCss};
  }
  #${wrapperId} .team-photo-container {
    width: 7rem;
    height: 7rem;
    border-radius: ${borderRadiusCss};
    overflow: hidden;
    background-color: var(--color-canvas-soft, #f5f5f5);
    border: 1px solid var(--color-hairline, #ebebeb);
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
  #${wrapperId} .team-card:hover .team-photo-container {
    transform: scale(1.05);
  }
  #${wrapperId} .team-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  #${wrapperId} .team-photo-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #${wrapperId} .team-initials {
    font-size: 1.25rem;
    font-weight: 700;
    font-family: monospace;
    color: var(--color-primary, #171717);
  }
  #${wrapperId} .team-info {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #${wrapperId} .team-name {
    font-family: var(--gh-font-heading, inherit);
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    color: ${appearance?.nameColor || "var(--color-ink, #171717)"};
    margin: 0;
  }
  #${wrapperId} .team-role {
    margin-top: 0.25rem;
    font-family: monospace;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${appearance?.roleColor || "var(--color-primary, #171717)"};
    margin-bottom: 0;
  }
  #${wrapperId} .team-bio {
    margin-top: 0.625rem;
    font-family: var(--gh-font-body, inherit);
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${appearance?.bioColor || "var(--color-body, #4d4d4d)"};
    max-width: 17.5rem;
    margin-bottom: 0;
  }
  #${wrapperId} .team-bio p {
    margin: 0 0 0.5rem 0;
  }
  #${wrapperId} .team-bio p:last-child {
    margin-bottom: 0;
  }
</style>
<div id="${wrapperId}" class="team-section ${styles.backgroundType === "mesh" ? "mesh-glow" : ""}">
  <div class="team-inner">
    ${headingHtml}
    <div class="team-grid">
      ${membersHtml}
    </div>
  </div>
</div>`;
};

export const compileToHbs = generateHTML;
