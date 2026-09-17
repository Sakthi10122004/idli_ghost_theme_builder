export interface CommentsProps {
  heading: string;
  showCount: boolean;
}

export const defaultProps: CommentsProps = {
  heading: "Discussion",
  showCount: true,
};

export const defaultStyles = {};

export function resolveCommentsProps(props?: Record<string, unknown>): CommentsProps {
  const p = (props || {}) as Record<string, unknown>;
  const heading =
    typeof p.heading === "string"
      ? p.heading
      : typeof p.title === "string"
      ? p.title
      : defaultProps.heading;

  const showCount =
    p.showCount !== undefined ? Boolean(p.showCount) : defaultProps.showCount;

  return {
    heading,
    showCount,
  };
}
