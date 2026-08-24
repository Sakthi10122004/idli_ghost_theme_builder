import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock) => {
  return `<div class="video-player-wrapper py-6 flex justify-center">
  <div class="video-container aspect-video w-full max-w-2xl bg-black rounded-md overflow-hidden">
    ${block.props.url ? `<iframe src="${block.props.url}" class="w-full h-full" allowfullscreen></iframe>` : ""}
  </div>
</div>`;
};