export interface HeaderProps {
  general: {
    layoutStyle: "Logo on Left" | "Logo in Center" | "Stacked";
    logoSize: number;
    showLogo: boolean;
    showSearch: boolean;
    showThemeSwitcher: boolean;
    showSignIn: boolean;
    signInText?: string;
    showSubscribe: boolean;
    subscribeText?: string;
    sticky: boolean;
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
  navItems?: Array<{ label: string; url: string }>;
}

export const defaultProps: HeaderProps = {
  general: {
    layoutStyle: "Logo on Left",
    logoSize: 40,
    showLogo: true,
    showSearch: true,
    showThemeSwitcher: true,
    showSignIn: true,
    signInText: "Sign in",
    showSubscribe: true,
    subscribeText: "Subscribe",
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
    { label: "Articles", url: "/articles" },
    { label: "About", url: "/about" }
  ]
};

export const defaultStyles = { backgroundType: "solid" };