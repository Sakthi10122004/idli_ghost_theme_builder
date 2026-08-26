export const WIDTH_VALUES: Record<string, string> = {
  narrow: "896px",   // max-w-4xl
  standard: "1152px", // max-w-6xl
  wide: "1280px",     // max-w-7xl
  full: "100%"
};

export const CONTENT_WIDTH_VALUES: Record<string, string> = {
  narrow: "768px",   // max-w-3xl
  standard: "1024px", // max-w-5xl
  wide: "1152px",     // max-w-6xl
  full: "100%"
};

export const hexToRgba = (hex: string, alpha: number) => {
  if (!hex.startsWith('#')) return hex;
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
