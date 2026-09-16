export type ImageSourceType = "custom" | "dynamic";

export type ImageDynamicSource =
  | "feature_image"
  | "site_cover"
  | "site_logo"
  | "author_profile"
  | "tag_feature";

export type ImageWidthMode = "regular" | "wide" | "full";
export type ImageAspectRatio =
  | "auto"
  | "16/9"
  | "4/3"
  | "3/2"
  | "1/1"
  | "21/9"
  | "4/5"
  | "9/16"
  | "2/3";

export const VALID_ASPECT_RATIOS: ImageAspectRatio[] = [
  "auto",
  "16/9",
  "4/3",
  "3/2",
  "1/1",
  "21/9",
  "4/5",
  "9/16",
  "2/3",
];
export type ImageObjectFit = "cover" | "contain" | "fill";

export interface ImageProps {
  sourceType: ImageSourceType;
  // Custom mode
  url: string;
  alt: string;
  caption?: string;
  linkUrl?: string;
  openInNewTab?: boolean;
  // Dynamic mode
  dynamicSource: ImageDynamicSource;
  fallbackUrl?: string;
  // Layout & Sizing
  widthMode: ImageWidthMode;
  aspectRatio: ImageAspectRatio;
  objectFit: ImageObjectFit;
  maxHeight?: string;
  borderRadius?: string;
}

export const defaultProps: ImageProps = {
  sourceType: "custom",
  url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  alt: "Mock Image description",
  caption: "",
  linkUrl: "",
  openInNewTab: false,
  dynamicSource: "feature_image",
  fallbackUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
  widthMode: "regular",
  aspectRatio: "auto",
  objectFit: "cover",
  maxHeight: "",
  borderRadius: "rounded-md",
};

export const defaultStyles = {};

export function resolveImageProps(props?: Record<string, unknown>): ImageProps {
  const p = (props || {}) as Partial<ImageProps>;

  const sourceType: ImageSourceType = p.sourceType === "dynamic" ? "dynamic" : "custom";
  const url = typeof p.url === "string" ? p.url : defaultProps.url;
  const alt = typeof p.alt === "string" ? p.alt : defaultProps.alt;
  const caption = typeof p.caption === "string" ? p.caption : "";
  const linkUrl = typeof p.linkUrl === "string" ? p.linkUrl : "";
  const openInNewTab = Boolean(p.openInNewTab);

  const dynamicSource: ImageDynamicSource =
    p.dynamicSource &&
    ["feature_image", "site_cover", "site_logo", "author_profile", "tag_feature"].includes(p.dynamicSource)
      ? p.dynamicSource
      : "feature_image";

  const fallbackUrl = typeof p.fallbackUrl === "string" && p.fallbackUrl ? p.fallbackUrl : defaultProps.fallbackUrl;
  const widthMode: ImageWidthMode = ["regular", "wide", "full"].includes(p.widthMode as string)
    ? (p.widthMode as ImageWidthMode)
    : "regular";

  const aspectRatio: ImageAspectRatio = VALID_ASPECT_RATIOS.includes(p.aspectRatio as ImageAspectRatio)
    ? (p.aspectRatio as ImageAspectRatio)
    : "auto";

  const objectFit: ImageObjectFit = ["cover", "contain", "fill"].includes(p.objectFit as string)
    ? (p.objectFit as ImageObjectFit)
    : "cover";

  const maxHeight = typeof p.maxHeight === "string" ? p.maxHeight : "";
  const borderRadius = typeof p.borderRadius === "string" ? p.borderRadius : "rounded-md";

  return {
    sourceType,
    url,
    alt,
    caption,
    linkUrl,
    openInNewTab,
    dynamicSource,
    fallbackUrl,
    widthMode,
    aspectRatio,
    objectFit,
    maxHeight,
    borderRadius,
  };
}