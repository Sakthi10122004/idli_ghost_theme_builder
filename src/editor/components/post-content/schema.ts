export interface PostContentProps {
  showTag?: boolean;
  showPrimaryTag?: boolean;
  showFeaturedFlag?: boolean;
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
  showTag: true,
  showPrimaryTag: true,
  showFeaturedFlag: true,
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
  const showTag = raw?.showTag !== undefined ? Boolean(raw.showTag) : raw?.showPrimaryTag !== false;
  const showFeaturedFlag = raw?.showFeaturedFlag !== undefined ? Boolean(raw.showFeaturedFlag) : raw?.showFeaturedBadge !== false;

  return {
    showTag,
    showPrimaryTag: showTag,
    showFeaturedFlag,
    showFeaturedBadge: showFeaturedFlag,
    showExcerpt: raw?.showExcerpt !== false,
    showByline: raw?.showByline !== false,
    showAuthorAvatar: raw?.showAuthorAvatar !== false,
    showPublishDate: raw?.showPublishDate !== false,
    showReadingTime: raw?.showReadingTime !== false,
    showFeatureImage: raw?.showFeatureImage !== false,
    contentWidth: (raw?.contentWidth as PostContentProps["contentWidth"]) || "regular",
  };
}