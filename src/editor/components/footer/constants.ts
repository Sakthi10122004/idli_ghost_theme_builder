export const WIDTH_VALUES: Record<string, string> = {
  narrow: "56rem",   // max-w-4xl
  standard: "72rem", // max-w-6xl
  wide: "80rem",     // max-w-7xl
  full: "100%"
};

export const CONTENT_WIDTH_VALUES: Record<string, string> = {
  narrow: "48rem",   // max-w-3xl
  standard: "64rem", // max-w-5xl
  wide: "72rem",     // max-w-6xl
  full: "100%"
};

export const getPaletteConfig = (id: string, isDark: boolean) => {
  if (isDark) {
    switch (id) {
      case 'default': return { bg: '#18181b', text: '#ffffff', buttonBg: '#3f3f46', buttonText: '#ffffff' };
      case 'classic': return { bg: '#111827', text: '#ffffff', buttonBg: '#3b82f6', buttonText: '#ffffff' };
      case 'dynamic': return { bg: '#b91c1c', text: '#ffffff', buttonBg: '#ffffff', buttonText: '#b91c1c' };
      case 'sand': return { bg: '#292524', text: '#ffffff', buttonBg: '#ef4444', buttonText: '#ffffff' };
      case 'zinc': return { bg: '#27272a', text: '#ffffff', buttonBg: '#ef4444', buttonText: '#ffffff' };
      case 'graphite': return { bg: '#18181b', text: '#ffffff', buttonBg: '#ef4444', buttonText: '#ffffff' };
      case 'stone': return { bg: '#1c1917', text: '#ffffff', buttonBg: '#ef4444', buttonText: '#ffffff' };
      case 'ocean': return { bg: '#0c4a6e', text: '#e0f2fe', buttonBg: '#0ea5e9', buttonText: '#ffffff' };
      case 'indigo': return { bg: '#1e1b4b', text: '#e0e7ff', buttonBg: '#6366f1', buttonText: '#ffffff' };
      case 'violet': return { bg: '#2e1065', text: '#ede9fe', buttonBg: '#8b5cf6', buttonText: '#ffffff' };
      case 'rose': return { bg: '#4c0519', text: '#ffe4e6', buttonBg: '#f43f5e', buttonText: '#ffffff' };
      case 'amber': return { bg: '#451a03', text: '#fef3c7', buttonBg: '#f59e0b', buttonText: '#ffffff' };
      case 'sage': return { bg: '#064e3b', text: '#d1fae5', buttonBg: '#10b981', buttonText: '#ffffff' };
      default: return { bg: '#18181b', text: '#ffffff', buttonBg: '#3f3f46', buttonText: '#ffffff' };
    }
  } else {
    switch (id) {
      case 'default': return { bg: '#ffffff', text: '#111827', buttonBg: '#111827', buttonText: '#ffffff' };
      case 'classic': return { bg: '#f3f4f6', text: '#111827', buttonBg: '#3b82f6', buttonText: '#ffffff' };
      case 'dynamic': return { bg: '#fee2e2', text: '#7f1d1d', buttonBg: '#b91c1c', buttonText: '#ffffff' };
      case 'sand': return { bg: '#f5f5f4', text: '#44403c', buttonBg: '#111827', buttonText: '#ffffff' };
      case 'zinc': return { bg: '#f4f4f5', text: '#27272a', buttonBg: '#111827', buttonText: '#ffffff' };
      case 'graphite': return { bg: '#e4e4e7', text: '#18181b', buttonBg: '#111827', buttonText: '#ffffff' };
      case 'stone': return { bg: '#e7e5e4', text: '#1c1917', buttonBg: '#111827', buttonText: '#ffffff' };
      case 'ocean': return { bg: '#e0f2fe', text: '#0c4a6e', buttonBg: '#0ea5e9', buttonText: '#ffffff' };
      case 'indigo': return { bg: '#e0e7ff', text: '#1e1b4b', buttonBg: '#6366f1', buttonText: '#ffffff' };
      case 'violet': return { bg: '#ede9fe', text: '#4c1d95', buttonBg: '#8b5cf6', buttonText: '#ffffff' };
      case 'rose': return { bg: '#ffe4e6', text: '#881337', buttonBg: '#f43f5e', buttonText: '#ffffff' };
      case 'amber': return { bg: '#fef3c7', text: '#78350f', buttonBg: '#f59e0b', buttonText: '#ffffff' };
      case 'sage': return { bg: '#d1fae5', text: '#064e3b', buttonBg: '#10b981', buttonText: '#ffffff' };
      default: return { bg: '#ffffff', text: '#111827', buttonBg: '#111827', buttonText: '#ffffff' };
    }
  }
};

export const hexToRgba = (hex: string, alpha: number) => {
  if (!hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
