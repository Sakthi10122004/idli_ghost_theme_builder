export interface HeaderNavItem {
  label: string;
  url: string;
  children?: Array<{ label: string; url: string }>;
}

export interface HeaderProps {
  general: {
    layoutStyle: "Logo on Left" | "Logo in Center" | "Stacked";
    logoSize: number;
    showLogo: boolean;
    siteTitle?: string;
    logoUrl?: string;
    showSearch: boolean;
    showThemeSwitcher: boolean;
    showSignIn: boolean;
    signInText?: string;
    showSubscribe: boolean;
    subscribeText?: string;
    memberPreviewState?: "visitor" | "member";
    sticky: boolean;
    dropdownPrefix?: string;
  };
  appearance: {
    backgroundColor: string;
    textColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
    sectionWidth: "full" | "wide" | "standard" | "narrow";
    contentWidth: "full" | "wide" | "standard" | "narrow";
  };
  styles: {
    marginBottom: string;
    boxShadow: string;
    backdropBlur: string;
    opacity: number;
  };
  advanced: {
    htmlAnchor: string;
  };
  spacing?: {
    paddingTop?: number;
    paddingBottom?: number;
  };
  navItems?: HeaderNavItem[];
}

export const defaultProps: HeaderProps = {
  general: {
    layoutStyle: "Logo on Left",
    logoSize: 40,
    showLogo: true,
    siteTitle: "",
    showSearch: true,
    showThemeSwitcher: true,
    showSignIn: true,
    signInText: "Sign in",
    showSubscribe: true,
    subscribeText: "Subscribe",
    memberPreviewState: "visitor",
    sticky: false,
  },
  appearance: {
    backgroundColor: "#ffffff",
    textColor: "#000000",
    buttonBgColor: "#000000",
    buttonTextColor: "#ffffff",
    sectionWidth: "full",
    contentWidth: "wide",
  },
  spacing: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  styles: {
    marginBottom: "0px",
    boxShadow: "none",
    backdropBlur: "none",
    opacity: 1,
  },
  advanced: {
    htmlAnchor: "gh-head",
  },
  navItems: [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Team", url: "/team" }
  ]
};

export const defaultStyles = { backgroundType: "solid" };