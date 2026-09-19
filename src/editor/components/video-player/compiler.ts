import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock): string => {
  const wrapperId = `video-${block.id}`;
  const url = block.props?.url as string | undefined;

  return `<style>
  #${wrapperId} {
    padding: 2rem 0;
    display: flex;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
  }
  #${wrapperId} .video-container {
    aspect-ratio: 16 / 9;
    width: 100%;
    max-width: 48rem;
    background-color: #000000;
    border-radius: var(--radius-md, 8px);
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  #${wrapperId} .video-container iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }
</style>
<div id="${wrapperId}" class="video-player-wrapper">
  <div class="video-container">
    ${url ? `<iframe src="${url}" allowfullscreen loading="lazy"></iframe>` : ""}
  </div>
</div>`;
};