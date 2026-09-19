export interface PostContentProps {
  showPrimaryTag?: boolean;
  showFeaturedBadge?: boolean;
  showExcerpt?: boolean;
  showByline?: boolean;
  showAuthorAvatar?: boolean;
  showPublishDate?: boolean;
  showReadingTime?: boolean;
  showFeatureImage?: boolean;
  contentWidth?: "narrow" | "regular" | "wide";
}

export const defaultProps: PostContentProps = {
  showPrimaryTag: true,
  showFeaturedBadge: true,
  showExcerpt: true,
  showByline: true,
  showAuthorAvatar: true,
  showPublishDate: true,
  showReadingTime: true,
  showFeatureImage: true,
  contentWidth: "regular",
};

export const defaultStyles = {};

export function resolvePostContentProps(raw?: Record<string, unknown>): PostContentProps {
  return {
    showPrimaryTag: raw?.showPrimaryTag !== false,
    showFeaturedBadge: raw?.showFeaturedBadge !== false,
    showExcerpt: raw?.showExcerpt !== false,
    showByline: raw?.showByline !== false,
    showAuthorAvatar: raw?.showAuthorAvatar !== false,
    showPublishDate: raw?.showPublishDate !== false,
    showReadingTime: raw?.showReadingTime !== false,
    showFeatureImage: raw?.showFeatureImage !== false,
    contentWidth: (raw?.contentWidth as PostContentProps["contentWidth"]) || "regular",
  };
}