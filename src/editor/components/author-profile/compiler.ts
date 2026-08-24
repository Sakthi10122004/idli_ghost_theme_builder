import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  const name = block.props.name || "{{name}}";
  const bio = block.props.bio || "{{bio}}";
  return `<div class="author-profile-card">
  <div style="width: 64px; height: 64px; border-radius: 50%; background-color: #fafafa; border: 1px solid #ebebeb; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">
    {{#if profile_image}}
      <img src="{{profile_image}}" alt="${name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />
    {{else}}
      <span>A</span>
    {{/if}}
  </div>
  <div class="author-details" style="display: flex; flex-direction: column; gap: 0.25rem;">
    <h4 style="margin: 0; font-size: 0.875rem; font-weight: 700;">${name}</h4>
    <p style="margin: 0; font-size: 0.75rem; color: #888888; line-height: 1.5;">${bio}</p>
  </div>
</div>`;
};