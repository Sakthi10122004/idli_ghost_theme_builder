export type ShareDesignLayout =
  | "pill-bar"
  | "editorial-card"
  | "floating-dock"
  | "social-grid"
  | "inline-minimal";

export type ShareStyleVariant = "pill" | "outline" | "ghost" | "icon-only";
export type ShareIconType = "share-2" | "share" | "send";
export type ShareSize = "sm" | "md" | "lg";
export type ShareAlignment = "left" | "center" | "right";

export interface ShareProps {
  layout: ShareDesignLayout;
  buttonText: string;
  cardTitle: string;
  cardSubtitle: string;
  variant: ShareStyleVariant;
  iconType: ShareIconType;
  showIcon: boolean;
  size: ShareSize;
  alignment: ShareAlignment;
  showDirectLinks: boolean;
  showWhatsapp: boolean;
  showCopyLink: boolean;
  showLabels: boolean;
  customColor?: string;
  borderRadius?: string;
}

export const defaultProps: ShareProps = {
  layout: "pill-bar",
  buttonText: "Share",
  cardTitle: "Share this article",
  cardSubtitle: "If you found this piece insightful, pass it along to your network.",
  variant: "pill",
  iconType: "share-2",
  showIcon: true,
  size: "md",
  alignment: "left",
  showDirectLinks: true,
  showWhatsapp: true,
  showCopyLink: true,
  showLabels: false,
  customColor: "",
  borderRadius: "rounded-full",
};

export const defaultStyles = {};

export function resolveShareProps(props?: Record<string, unknown>): ShareProps {
  const p = (props || {}) as Partial<ShareProps>;

  const layout: ShareDesignLayout = [
    "pill-bar",
    "editorial-card",
    "floating-dock",
    "social-grid",
    "inline-minimal",
  ].includes(p.layout as string)
    ? (p.layout as ShareDesignLayout)
    : defaultProps.layout;

  return {
    layout,
    buttonText: typeof p.buttonText === "string" ? p.buttonText : defaultProps.buttonText,
    cardTitle: typeof p.cardTitle === "string" ? p.cardTitle : defaultProps.cardTitle,
    cardSubtitle: typeof p.cardSubtitle === "string" ? p.cardSubtitle : defaultProps.cardSubtitle,
    variant: ["pill", "outline", "ghost", "icon-only"].includes(p.variant as string)
      ? (p.variant as ShareStyleVariant)
      : defaultProps.variant,
    iconType: ["share-2", "share", "send"].includes(p.iconType as string)
      ? (p.iconType as ShareIconType)
      : defaultProps.iconType,
    showIcon: p.showIcon !== undefined ? Boolean(p.showIcon) : defaultProps.showIcon,
    size: ["sm", "md", "lg"].includes(p.size as string) ? (p.size as ShareSize) : defaultProps.size,
    alignment: ["left", "center", "right"].includes(p.alignment as string)
      ? (p.alignment as ShareAlignment)
      : defaultProps.alignment,
    showDirectLinks: p.showDirectLinks !== undefined ? Boolean(p.showDirectLinks) : defaultProps.showDirectLinks,
    showWhatsapp: p.showWhatsapp !== undefined ? Boolean(p.showWhatsapp) : defaultProps.showWhatsapp,
    showCopyLink: p.showCopyLink !== undefined ? Boolean(p.showCopyLink) : defaultProps.showCopyLink,
    showLabels: p.showLabels !== undefined ? Boolean(p.showLabels) : defaultProps.showLabels,
    customColor: typeof p.customColor === "string" ? p.customColor : "",
    borderRadius: typeof p.borderRadius === "string" ? p.borderRadius : defaultProps.borderRadius,
  };
}
