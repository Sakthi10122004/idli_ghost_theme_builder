import React from "react";

export const toTranslucent = (color: string, opacity = 0.75): string => {
  if (!color || color === "var(--color-canvas)" || color === "var(--color-bg)" || color === "#ffffff" || color === "#fff" || color === "#fafafa") {
    return `rgba(255, 255, 255, ${opacity})`;
  }
  if (color === "#171717" || color === "#000000" || color === "#111111") {
    return `rgba(23, 23, 23, ${opacity})`;
  }
  if (color.startsWith("#") && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const getBackgroundStyle = (styles: any, appearance?: any): React.CSSProperties => {
  const bgType = styles?.backgroundType || "solid";
  let defaultBg = appearance?.backgroundColor || styles?.backgroundColor || "var(--color-canvas)";
  const glassBlur = styles?.backdropBlur;
  const glassEnabled = !!glassBlur && glassBlur !== "none" && glassBlur !== "0px";

  if (glassEnabled) {
    defaultBg = toTranslucent(defaultBg);
  }

  const glassProps: React.CSSProperties = glassEnabled ? {
    backdropFilter: `blur(${glassBlur})`,
    WebkitBackdropFilter: `blur(${glassBlur})`,
  } : {};

  let baseStyle: React.CSSProperties;
  switch (bgType) {
    case "solid":
      baseStyle = { backgroundColor: defaultBg };
      break;
    case "linear": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
      baseStyle = { backgroundImage: `linear-gradient(${angle}deg, ${c1}, ${c2})`, backgroundColor: defaultBg };
      break;
    }
    case "radial": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const pos = styles?.gradientPosition || "center";
      baseStyle = { backgroundImage: `radial-gradient(circle at ${pos}, ${c1}, ${c2})`, backgroundColor: defaultBg };
      break;
    }
    case "mesh": {
      const m1 = styles?.meshColor1 || "#ff0080";
      const m2 = styles?.meshColor2 || "#7928ca";
      const m3 = styles?.meshColor3 || "#0070f3";
      baseStyle = {
        backgroundColor: defaultBg,
        backgroundImage: `
          radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
          radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
          radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%)
        `
      };
      break;
    }
    case "pattern": {
      const pType = styles?.patternType || "dots";
      const pColor = styles?.patternColor || "#000000";
      if (pType === "dots") {
        baseStyle = {
          backgroundColor: defaultBg,
          backgroundImage: `radial-gradient(${pColor} 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        };
      } else if (pType === "lines") {
        baseStyle = {
          backgroundColor: defaultBg,
          backgroundImage: `repeating-linear-gradient(45deg, ${pColor} 0, ${pColor} 1px, transparent 1px, transparent 10px)`
        };
      } else if (pType === "noise") {
        baseStyle = {
          backgroundColor: defaultBg,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
        };
      } else {
        baseStyle = { backgroundColor: defaultBg };
      }
      break;
    }
    case "image": {
      const url = styles?.bgImageUrl || "";
      const overlay = styles?.bgOverlayColor || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
      baseStyle = {
        backgroundColor: defaultBg,
        backgroundImage: url ? `linear-gradient(to right, ${overlay}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${overlay}${Math.round(opacity * 255).toString(16).padStart(2, '0')}), url(${url})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center"
      };
      break;
    }
    default:
      baseStyle = { backgroundColor: defaultBg };
  }

  return {
    ...baseStyle,
    ...glassProps,
  };
};

export const getBackgroundCSS = (styles: any, appearance?: any): string => {
  const bgType = styles?.backgroundType || "solid";
  let defaultBg = appearance?.backgroundColor || styles?.backgroundColor || "var(--color-bg)";
  const glassBlur = styles?.backdropBlur;
  const glassEnabled = !!glassBlur && glassBlur !== "none" && glassBlur !== "0px";

  if (glassEnabled) {
    defaultBg = toTranslucent(defaultBg);
  }

  const glassCss = glassEnabled ? `backdrop-filter: blur(${glassBlur}); -webkit-backdrop-filter: blur(${glassBlur}); ` : "";

  let baseCss = `background-color: ${defaultBg};`;
  switch (bgType) {
    case "solid":
      baseCss = `background-color: ${defaultBg};`;
      break;
    case "linear": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
      baseCss = `background-image: linear-gradient(${angle}deg, ${c1}, ${c2}); background-color: ${defaultBg};`;
      break;
    }
    case "radial": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const pos = styles?.gradientPosition || "center";
      baseCss = `background-image: radial-gradient(circle at ${pos}, ${c1}, ${c2}); background-color: ${defaultBg};`;
      break;
    }
    case "mesh": {
      const m1 = styles?.meshColor1 || "#ff0080";
      const m2 = styles?.meshColor2 || "#7928ca";
      const m3 = styles?.meshColor3 || "#0070f3";
      baseCss = `
        background-color: ${defaultBg};
        background-image: 
          radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
          radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
          radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%);
      `;
      break;
    }
    case "pattern": {
      const pType = styles?.patternType || "dots";
      const pColor = styles?.patternColor || "#000000";
      if (pType === "dots") {
        baseCss = `
          background-color: ${defaultBg};
          background-image: radial-gradient(${pColor} 1px, transparent 1px);
          background-size: 20px 20px;
        `;
      } else if (pType === "lines") {
        baseCss = `
          background-color: ${defaultBg};
          background-image: repeating-linear-gradient(45deg, ${pColor} 0, ${pColor} 1px, transparent 1px, transparent 10px);
        `;
      } else if (pType === "noise") {
        baseCss = `
          background-color: ${defaultBg};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        `;
      }
      break;
    }
    case "image": {
      const url = styles?.bgImageUrl || "";
      const overlay = styles?.bgOverlayColor || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
      const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
      baseCss = url 
        ? `background-color: ${defaultBg}; background-image: linear-gradient(to right, ${overlay}${hexOpacity}, ${overlay}${hexOpacity}), url('${url}'); background-size: cover; background-position: center;`
        : `background-color: ${defaultBg};`;
      break;
    }
    default:
      baseCss = `background-color: ${defaultBg};`;
  }

  return `${glassCss}${baseCss}`;
};
