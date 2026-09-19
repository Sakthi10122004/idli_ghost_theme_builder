export interface TagArchiveProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  showImage?: boolean;
  showCount?: boolean;
  layoutStyle?: "banner" | "cloud";
}

export const defaultProps: TagArchiveProps = {
  title: "Engineering",
  description: "A comprehensive collection of software architecture patterns, developer tooling, and technical case studies.",
  imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=400&q=80",
  showImage: false,
  showCount: true,
  layoutStyle: "banner",
};

export const defaultStyles = {};

export function resolveTagArchiveProps(raw?: Record<string, unknown>): TagArchiveProps {
  return {
    title: (raw?.title as string) || defaultProps.title,
    description: (raw?.description as string) || defaultProps.description,
    imageUrl: (raw?.imageUrl as string) || defaultProps.imageUrl,
    showImage: raw?.showImage === true,
    showCount: raw?.showCount !== false,
    layoutStyle: (raw?.layoutStyle as TagArchiveProps["layoutStyle"]) || "banner",
  };
}