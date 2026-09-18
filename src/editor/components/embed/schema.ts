export interface EmbedProps {
  html: string;
  maxWidth: string;
  aspectRatio: string;
}

export const defaultProps: EmbedProps = {
  html: `<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`,
  maxWidth: "100%",
  aspectRatio: "16/9",
};

export const defaultStyles = {};

export function resolveEmbedProps(props?: Record<string, unknown>): EmbedProps {
  const p = (props || {}) as Record<string, unknown>;
  const html =
    typeof p.html === "string"
      ? p.html
      : typeof p.rawHtml === "string"
      ? p.rawHtml
      : defaultProps.html;

  const maxWidth =
    typeof p.maxWidth === "string" && p.maxWidth.trim()
      ? p.maxWidth
      : defaultProps.maxWidth;

  const aspectRatio =
    typeof p.aspectRatio === "string" && p.aspectRatio.trim()
      ? p.aspectRatio
      : defaultProps.aspectRatio;

  return {
    html,
    maxWidth,
    aspectRatio,
  };
}
