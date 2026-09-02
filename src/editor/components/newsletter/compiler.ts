import { BuilderBlock } from "@/types/theme";

const getBackgroundCSS = (styles: any): string => {
  const bgType = styles?.backgroundType || "solid";
  const defaultBg = "var(--color-bg)";

  switch (bgType) {
    case "solid":
      return `background-color: ${styles?.backgroundColor || defaultBg};`;
    case "linear": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
      return `background-image: linear-gradient(${angle}deg, ${c1}, ${c2});`;
    }
    case "radial": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const pos = styles?.gradientPosition || "center";
      return `background-image: radial-gradient(circle at ${pos}, ${c1}, ${c2});`;
    }
    case "mesh": {
      const m1 = styles?.meshColor1 || "#ff0080";
      const m2 = styles?.meshColor2 || "#7928ca";
      const m3 = styles?.meshColor3 || "#0070f3";
      return `
    background-color: ${defaultBg};
    background-image: 
      radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
      radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
      radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%);
      `;
    }
    case "pattern": {
      const pType = styles?.patternType || "dots";
      const pColor = styles?.patternColor || "#000000";
      if (pType === "dots") {
        return `
    background-color: ${defaultBg};
    background-image: radial-gradient(${pColor} 1px, transparent 1px);
    background-size: 20px 20px;
        `;
      } else if (pType === "lines") {
        return `
    background-color: ${defaultBg};
    background-image: repeating-linear-gradient(45deg, ${pColor}20 0, ${pColor}20 1px, transparent 1px, transparent 10px);
        `;
      } else if (pType === "noise") {
        return `
    background-color: ${pColor};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E");
        `;
      }
      return `background-color: ${defaultBg};`;
    }
    case "image": {
      const url = styles?.bgImageUrl || "";
      const overlayColor = styles?.bgOverlayColor || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
      
      let r = 0, g = 0, b = 0;
      if (overlayColor.length === 7) {
        r = parseInt(overlayColor.slice(1, 3), 16);
        g = parseInt(overlayColor.slice(3, 5), 16);
        b = parseInt(overlayColor.slice(5, 7), 16);
      }
      
      const overlay = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      return `
    background-color: ${defaultBg};
    background-image: linear-gradient(${overlay}, ${overlay})${url ? `, url('${url}')` : ""};
    background-size: cover;
    background-position: center;
      `;
    }
    default:
      return `background-color: ${defaultBg};`;
  }
};

export const compileToHbs = (block: BuilderBlock) => {
  const bgCSS = getBackgroundCSS(block.styles);
  const layout = block.styles?.layout || "right";
  
  // Base wrapper styles
  let wrapperFlexDirectionDesktop = "row";
  let wrapperFlexDirectionMobile = "column";
  let wrapperJustifyContent = "space-between";
  let wrapperAlignItems = "center";
  let wrapperTextAlign = "left";
  
  // Text wrapper styles
  let textMaxWidth = "400px";
  let textWidth = "auto";
  
  // Form container styles
  let formMaxWidth = "320px";
  let formWidth = "100%";
  let formAlignItems = "stretch";
  
  switch (layout) {
    case "right":
      wrapperFlexDirectionDesktop = "row";
      wrapperFlexDirectionMobile = "column";
      wrapperJustifyContent = "space-between";
      wrapperAlignItems = "center";
      wrapperTextAlign = "left";
      textMaxWidth = "400px";
      formMaxWidth = "320px";
      break;
    case "left":
      wrapperFlexDirectionDesktop = "row-reverse";
      wrapperFlexDirectionMobile = "column"; // keep column on mobile for left? Usually row-reverse becomes column. Let's make mobile row-reverse or column-reverse. Actually, 'flex-col md:flex-row-reverse' means column on mobile.
      wrapperJustifyContent = "space-between";
      wrapperAlignItems = "center";
      wrapperTextAlign = "left";
      textMaxWidth = "400px";
      formMaxWidth = "320px";
      break;
    case "below":
      wrapperFlexDirectionDesktop = "column";
      wrapperFlexDirectionMobile = "column";
      wrapperJustifyContent = "flex-start";
      wrapperAlignItems = "flex-start";
      wrapperTextAlign = "left";
      textMaxWidth = "100%";
      textWidth = "100%";
      formMaxWidth = "100%";
      break;
    case "above":
      wrapperFlexDirectionDesktop = "column-reverse";
      wrapperFlexDirectionMobile = "column-reverse";
      wrapperJustifyContent = "flex-start";
      wrapperAlignItems = "flex-start";
      wrapperTextAlign = "left";
      textMaxWidth = "100%";
      textWidth = "100%";
      formMaxWidth = "100%";
      break;
    case "center":
      wrapperFlexDirectionDesktop = "column";
      wrapperFlexDirectionMobile = "column";
      wrapperJustifyContent = "flex-start";
      wrapperAlignItems = "center";
      wrapperTextAlign = "center";
      textMaxWidth = "600px";
      textWidth = "100%";
      formMaxWidth = "400px";
      formAlignItems = "center"; // to center the form inputs if it was flex column, but form is row.
      break;
  }
  
  return `<style>
  #newsletter-${block.id} {
    ${bgCSS}
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: var(--radius-md);
    padding: 3rem 2rem;
    display: flex;
    flex-direction: ${wrapperFlexDirectionMobile};
    justify-content: ${wrapperJustifyContent};
    align-items: ${wrapperAlignItems};
    text-align: ${wrapperTextAlign};
    gap: 1.5rem;
    position: relative;
    overflow: hidden;
  }
  @media (min-width: 768px) {
    #newsletter-${block.id} {
      flex-direction: ${wrapperFlexDirectionDesktop};
    }
  }
  #newsletter-${block.id} .newsletter-text {
    flex-grow: 1;
    position: relative;
    z-index: 10;
    max-width: ${textMaxWidth};
    width: ${textWidth};
  }
  #newsletter-${block.id} .newsletter-title {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: bold;
    margin: 0;
  }
  #newsletter-${block.id} .newsletter-subtitle {
    font-size: 0.75rem;
    color: var(--color-muted);
    margin: 0;
  }
  #newsletter-${block.id} .newsletter-form {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    max-width: ${formMaxWidth};
    align-items: ${formAlignItems};
    position: relative;
    z-index: 10;
  }
  @media (min-width: 768px) {
    #newsletter-${block.id} .newsletter-form {
      width: ${formMaxWidth !== '100%' ? 'auto' : '100%'};
    }
  }
  #newsletter-${block.id} .input-field {
    padding: 0.5rem 1rem;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: var(--radius-sm);
    flex-grow: 1;
  }
  #newsletter-${block.id} .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: var(--radius-pill);
    background-color: var(--color-primary);
    color: #ffffff;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;
  }
  #newsletter-${block.id} .btn-primary:hover {
    opacity: 0.85;
  }
</style>
<div id="newsletter-${block.id}" class="newsletter-block">
  <div class="newsletter-text">
    <h3 class="newsletter-title">${block.props.title || "Join our technical newsletter"}</h3>
    <p class="newsletter-subtitle">Stay up to date with new features and tutorials.</p>
  </div>
  <form class="newsletter-form">
    <input type="email" placeholder="${block.props.placeholder || 'you@domain.com'}" required class="input-field" />
    <button type="submit" class="btn-primary shrink-0">${block.props.buttonLabel || 'Subscribe'}</button>
  </form>
</div>`;
};