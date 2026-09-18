export type GalleryLayout = "grid" | "masonry" | "carousel" | "list" | "bento" | "collage";
export type GalleryCornerStyle = "rounded" | "rectangle";
export type GalleryHoverEffect = "zoom" | "overlay" | "fade" | "none";
export type GalleryGap = "sm" | "md" | "lg";

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
}

export interface GridGalleryProps {
  general: {
    heading?: string;
    subheading?: string;
    layoutStyle: GalleryLayout;
    columns: 2 | 3 | 4;
    gap: GalleryGap;
    cornerStyle: GalleryCornerStyle;
    hoverEffect: GalleryHoverEffect;
    useDynamicData?: boolean;
    dynamicTag?: string;
    autoScroll?: boolean;
  };
  items: GalleryItem[];
  urls?: string[];
  appearance: {
    backgroundColor?: string;
    headingColor?: string;
    subheadingColor?: string;
    captionColor?: string;
  };
  spacing: {
    paddingTop?: string;
    paddingBottom?: string;
  };
  advanced: {
    htmlAnchor?: string;
  };
}

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    caption: "Deep Space Exploration",
    alt: "Deep Space Exploration",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    caption: "Neon Cybernetic Metropolis",
    alt: "Neon Cybernetic Metropolis",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    caption: "Atmospheric Earth Orbit",
    alt: "Atmospheric Earth Orbit",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    caption: "Majestic Alpine Summits",
    alt: "Majestic Alpine Summits",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    caption: "Serene Tropical Coastline",
    alt: "Serene Tropical Coastline",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    caption: "Mist-Covered Forest Valley",
    alt: "Mist-Covered Forest Valley",
  },
];

export const defaultProps: GridGalleryProps = {
  general: {
    heading: "Visual Gallery",
    subheading: "A curated collection of visual stories and high-resolution photography.",
    layoutStyle: "grid",
    columns: 3,
    gap: "md",
    cornerStyle: "rounded",
    hoverEffect: "zoom",
    useDynamicData: false,
    dynamicTag: "gallery",
    autoScroll: false,
  },
  items: DEFAULT_GALLERY_ITEMS,
  urls: DEFAULT_GALLERY_ITEMS.map((item) => item.url),
  appearance: {
    backgroundColor: "var(--color-bg)",
  },
  spacing: {
    paddingTop: "4rem",
    paddingBottom: "4rem",
  },
  advanced: {
    htmlAnchor: "gallery",
  },
};

export const defaultStyles = {};