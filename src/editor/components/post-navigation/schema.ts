export interface PostNavigationProps {
  showExcerpt: boolean;
  showImage: boolean;
}

export const defaultProps: PostNavigationProps = {
  showExcerpt: false,
  showImage: true,
};

export const defaultStyles = {};

export function resolvePostNavigationProps(props?: Record<string, unknown>): PostNavigationProps {
  const p = (props || {}) as Record<string, unknown>;
  return {
    showExcerpt: p.showExcerpt !== undefined ? Boolean(p.showExcerpt) : defaultProps.showExcerpt,
    showImage: p.showImage !== undefined ? Boolean(p.showImage) : defaultProps.showImage,
  };
}
