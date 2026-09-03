import React from "react";

export const getBackgroundStyle = (styles: any, appearance: any): React.CSSProperties => {
  const bgType = styles?.backgroundType || "solid";
  const defaultBg = appearance?.backgroundColor || "var(--color-canvas)";

  switch (bgType) {
    case "solid":
      return { backgroundColor: defaultBg };
    case "linear": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
      return { backgroundImage: `linear-gradient(${angle}deg, ${c1}, ${c2})`, backgroundColor: defaultBg };
    }
    case "radial": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const pos = styles?.gradientPosition || "center";
      return { backgroundImage: `radial-gradient(circle at ${pos}, ${c1}, ${c2})`, backgroundColor: defaultBg };
    }
    case "mesh": {
      const m1 = styles?.meshColor1 || "#ff0080";
      const m2 = styles?.meshColor2 || "#7928ca";
      const m3 = styles?.meshColor3 || "#0070f3";
      return {
        backgroundColor: defaultBg,
        backgroundImage: `
          radial-gradient(at 0% 0%, ${m1}40 0, transparent 50%),
          radial-gradient(at 50% 100%, ${m2}40 0, transparent 50%),
          radial-gradient(at 100% 0%, ${m3}40 0, transparent 50%)
        `
      };
    }
    case "pattern": {
      const pType = styles?.patternType || "dots";
      const pColor = styles?.patternColor || "#000000";
      if (pType === "dots") {
        return {
          backgroundColor: defaultBg,
          backgroundImage: `radial-gradient(${pColor} 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        };
      } else if (pType === "lines") {
        return {
          backgroundColor: defaultBg,
          backgroundImage: `repeating-linear-gradient(45deg, ${pColor} 0, ${pColor} 1px, transparent 1px, transparent 10px)`
        };
      } else if (pType === "noise") {
        return {
          backgroundColor: defaultBg,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
        };
      }
      return { backgroundColor: defaultBg };
    }
    case "image": {
      const url = styles?.bgImageUrl || "";
      const overlay = styles?.bgOverlayColor || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
      return {
        backgroundColor: defaultBg,
        backgroundImage: url ? `linear-gradient(to right, ${overlay}${Math.round(opacity * 255).toString(16).padStart(2, '0')}, ${overlay}${Math.round(opacity * 255).toString(16).padStart(2, '0')}), url(${url})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center"
      };
    }
    default:
      return { backgroundColor: defaultBg };
  }
};

export const getBackgroundCSS = (styles: any, appearance: any): string => {
  const bgType = styles?.backgroundType || "solid";
  const defaultBg = appearance?.backgroundColor || "var(--color-bg)";

  switch (bgType) {
    case "solid":
      return `background-color: ${defaultBg};`;
    case "linear": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const angle = styles?.gradientAngle !== undefined ? styles.gradientAngle : 90;
      return `background-image: linear-gradient(${angle}deg, ${c1}, ${c2}); background-color: ${defaultBg};`;
    }
    case "radial": {
      const c1 = styles?.gradientColor1 || "#000000";
      const c2 = styles?.gradientColor2 || "#333333";
      const pos = styles?.gradientPosition || "center";
      return `background-image: radial-gradient(circle at ${pos}, ${c1}, ${c2}); background-color: ${defaultBg};`;
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
          background-image: repeating-linear-gradient(45deg, ${pColor} 0, ${pColor} 1px, transparent 1px, transparent 10px);
        `;
      } else if (pType === "noise") {
        return `
          background-color: ${defaultBg};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        `;
      }
      return `background-color: ${defaultBg};`;
    }
    case "image": {
      const url = styles?.bgImageUrl || "";
      const overlay = styles?.bgOverlayColor || "#000000";
      const opacity = styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5;
      const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return url 
        ? `background-color: ${defaultBg}; background-image: linear-gradient(to right, ${overlay}${hexOpacity}, ${overlay}${hexOpacity}), url('${url}'); background-size: cover; background-position: center;`
        : `background-color: ${defaultBg};`;
    }
    default:
      return `background-color: ${defaultBg};`;
  }
};
