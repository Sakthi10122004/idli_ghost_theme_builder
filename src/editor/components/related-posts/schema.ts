export type RelatedPostsLayout =
  | "split"
  | "grid"
  | "list"
  | "carousel"
  | "bento"
  | "editorial"
  | "masonry";

export interface RelatedPostsProps {
  heading: string;
  description?: string;
  count: number;
  showExcerpt: boolean;
  showImage: boolean;
  layout: RelatedPostsLayout;
  autoScroll?: boolean;
  headingColor?: string;
  descriptionColor?: string;
  cardTitleColor?: string;
  cardTextColor?: string;
  appearance?: {
    backgroundColor?: string;
  };
}

export const defaultProps: RelatedPostsProps = {
  heading: "You might also like",
  description: "",
  count: 3,
  showExcerpt: true,
  showImage: true,
  layout: "grid",
  autoScroll: false,
  headingColor: "#171717",
  descriptionColor: "#666666",
  cardTitleColor: "#171717",
  cardTextColor: "#4d4d4d",
};

export const defaultStyles = {
  backgroundType: "solid",
};

export function resolveRelatedPostsProps(props?: Record<string, unknown>): RelatedPostsProps {
  const p = (props || {}) as Record<string, unknown>;
  const heading =
    typeof p.heading === "string"
      ? p.heading
      : typeof p.title === "string"
      ? p.title
      : defaultProps.heading;

  const description =
    typeof p.description === "string" ? p.description : defaultProps.description;

  const count =
    typeof p.count === "number"
      ? Math.max(1, Math.min(12, p.count))
      : typeof p.limit === "number"
      ? Math.max(1, Math.min(12, p.limit))
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

  const validLayouts: RelatedPostsLayout[] = [
    "split",
    "grid",
    "list",
    "carousel",
    "bento",
    "editorial",
    "masonry",
  ];

  const layout: RelatedPostsLayout =
    typeof p.layout === "string" && validLayouts.includes(p.layout as RelatedPostsLayout)
      ? (p.layout as RelatedPostsLayout)
      : defaultProps.layout;

  const autoScroll = p.autoScroll !== undefined ? Boolean(p.autoScroll) : defaultProps.autoScroll;

  const headingColor =
    typeof p.headingColor === "string" ? p.headingColor : defaultProps.headingColor;

  const descriptionColor =
    typeof p.descriptionColor === "string" ? p.descriptionColor : defaultProps.descriptionColor;

  const cardTitleColor =
    typeof p.cardTitleColor === "string" ? p.cardTitleColor : defaultProps.cardTitleColor;

  const cardTextColor =
    typeof p.cardTextColor === "string" ? p.cardTextColor : defaultProps.cardTextColor;

  const appearance = (p.appearance && typeof p.appearance === "object" ? p.appearance : {}) as {
    backgroundColor?: string;
  };

  return {
    heading,
    description,
    count,
    showExcerpt,
    showImage,
    layout,
    autoScroll,
    headingColor,
    descriptionColor,
    cardTitleColor,
    cardTextColor,
    appearance,
  };
}
