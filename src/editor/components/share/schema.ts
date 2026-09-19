export type ShareStyleVariant = "pill" | "outline" | "ghost" | "icon-only";
export type ShareIconType = "share-2" | "share" | "send";
export type ShareSize = "sm" | "md" | "lg";
export type ShareAlignment = "left" | "center" | "right";

export interface ShareProps {
  buttonText: string;
  variant: ShareStyleVariant;
  iconType: ShareIconType;
  showIcon: boolean;
  size: ShareSize;
  alignment: ShareAlignment;
  customColor?: string;
  borderRadius?: string;
}

export const defaultProps: ShareProps = {
  buttonText: "Share",
  variant: "pill",
  iconType: "share-2",
  showIcon: true,
  size: "md",
  alignment: "left",
  customColor: "",
  borderRadius: "rounded-full",
};

export const defaultStyles = {};

export function resolveShareProps(props?: Record<string, unknown>): ShareProps {
  const p = (props || {}) as Partial<ShareProps>;

  return {
    buttonText: typeof p.buttonText === "string" ? p.buttonText : defaultProps.buttonText,
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
    customColor: typeof p.customColor === "string" ? p.customColor : "",
    borderRadius: typeof p.borderRadius === "string" ? p.borderRadius : defaultProps.borderRadius,
  };
}
