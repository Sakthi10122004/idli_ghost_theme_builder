/**
 * Utility functions for HTML and attribute escaping in Ghost theme compilers.
 * Prevents HTML injection, attribute breakouts, and broken markup from user inputs.
 */

/**
 * Escapes special characters for safe interpolation into HTML text content and attributes.
 * Encodes &, <, >, ", and '.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Validates and escapes URLs for use in href, src, and other link attributes.
 * Prevents attribute breakout and strips unsafe schemes like javascript:.
 */
export function escapeUrl(url: unknown, fallback: string = "#"): string {
  if (!url || typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed) return fallback;
  // Disallow javascript: schemes for XSS prevention
  if (/^javascript:/i.test(trimmed)) return fallback;
  return escapeHtml(trimmed);
}
