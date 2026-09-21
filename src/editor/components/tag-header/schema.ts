export interface TagHeaderProps {
  showFeatureImage: boolean;
  showDescription: boolean;
  showCount: boolean;
}

export const defaultProps: TagHeaderProps = {
  showFeatureImage: true,
  showDescription: true,
  showCount: true,
};

export const defaultStyles = {};

export function resolveTagHeaderProps(raw?: Record<string, unknown>): TagHeaderProps {
  return {
    showFeatureImage: raw?.showFeatureImage !== false,
    showDescription: raw?.showDescription !== false,
    showCount: raw?.showCount !== false,
  };
}
