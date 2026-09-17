export type RelatedPostsLayout = "grid" | "list" | "compact";

export interface RelatedPostsProps {
  heading: string;
  count: number;
  showExcerpt: boolean;
  showImage: boolean;
  layout?: RelatedPostsLayout;
}

export const defaultProps: RelatedPostsProps = {
  heading: "You might also like",
  count: 3,
  showExcerpt: true,
  showImage: true,
  layout: "grid",
};

export const defaultStyles = {};

export function resolveRelatedPostsProps(props?: Record<string, unknown>): RelatedPostsProps {
  const p = (props || {}) as Record<string, unknown>;
  const heading =
    typeof p.heading === "string"
      ? p.heading
      : typeof p.title === "string"
      ? p.title
      : defaultProps.heading;

  const count =
    typeof p.count === "number"
      ? Math.max(1, Math.min(12, p.count))
      : typeof p.postCount === "number"
      ? Math.max(1, Math.min(12, p.postCount))
      : defaultProps.count;

  const showExcerpt =
    p.showExcerpt !== undefined ? Boolean(p.showExcerpt) : defaultProps.showExcerpt;

  const showImage =
    p.showImage !== undefined
      ? Boolean(p.showImage)
      : p.showFeatureImage !== undefined
      ? Boolean(p.showFeatureImage)
      : defaultProps.showImage;

  const layout: RelatedPostsLayout =
    typeof p.layout === "string" && ["grid", "list", "compact"].includes(p.layout)
      ? (p.layout as RelatedPostsLayout)
      : defaultProps.layout!;

  return {
    heading,
    count,
    showExcerpt,
    showImage,
    layout,
  };
}
