import { BuilderBlock } from "@/types/theme";

export const compileToHbs = (block: BuilderBlock, compiledChildren: string) => {
  const { backgroundVideoUrl, enableParallax = false, contentWidth } = block.styles || {};
  const maxWidth = (block.props?.contentWidth as string) || (contentWidth as string) || "var(--container-width, 1200px)";
  const videoHtml = backgroundVideoUrl
    ? `\n<video src="${backgroundVideoUrl}" autoplay loop muted playsinline style="position: ${
        enableParallax ? "fixed" : "absolute"
      }; top: 0; left: 0; width: ${
        enableParallax ? "100vw" : "100%"
      }; height: ${
        enableParallax ? "100vh" : "100%"
      }; object-fit: cover; z-index: 0; pointer-events: none;"></video>\n`
    : "";
  const extraClasses = backgroundVideoUrl ? " relative overflow-hidden" : "";
  const extraStyles = backgroundVideoUrl && enableParallax ? "clip-path: inset(0px);" : "";
  const innerStyle = ` style="max-width: ${maxWidth}; position: relative; z-index: 10;"`;

  return `<section class="section${extraClasses}" style="${extraStyles}">${videoHtml}
  <div class="container-width mx-auto px-6"${innerStyle}>
    ${compiledChildren}
  </div>
</section>`;
};