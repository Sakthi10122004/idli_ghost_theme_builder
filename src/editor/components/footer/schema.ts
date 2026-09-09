import { DEFAULT_SOCIAL_PLATFORMS, SocialPlatform } from "./socialIcons";

export interface FooterNavItem {
  label: string;
  url: string;
}

export const DEFAULT_SECONDARY_NAV: FooterNavItem[] = [
  { label: "Privacy Policy", url: "/privacy/" },
  { label: "Terms of Service", url: "/terms/" },
  { label: "Contact", url: "/contact/" },
];

export const WIDTH_VALUES: Record<string, string> = {
  narrow: "896px",
  standard: "1152px",
  wide: "1280px",
  full: "100%"
};

export const defaultProps = {
  general: {
    layoutStyle: "Simple Minimal",
    showSecondaryNav: true,
    secondaryNavTitle: "More",
    secondaryNavItems: DEFAULT_SECONDARY_NAV,
    showSocialIcons: true,
    socialPlatforms: DEFAULT_SOCIAL_PLATFORMS as SocialPlatform[],
    showSubscribeBox: false,
    showCopyright: true,
    customCopyrightText: "",
  },
  colors: {
    syncWithHeader: false,
    backgroundColor: "#ffffff",
    textColor: "#1a1a1a",
    buttonBgColor: "#000000",
    buttonTextColor: "#ffffff",
  },
  layout: {
    sectionWidth: "full",
    contentWidth: "standard",
    minHeight: "M",
    align: "center",
    verticalAlign: "middle",
  },
  spacing: {
    paddingTop: 40,
    paddingBottom: 40,
    padding: { linked: true, topBottom: 40, leftRight: 24 },
    margin: { linked: true, topBottom: 0, leftRight: 0 },
  },
  advanced: {
    htmlAnchor: "site-footer",
  }
};
export const defaultStyles = { backgroundType: "solid" };