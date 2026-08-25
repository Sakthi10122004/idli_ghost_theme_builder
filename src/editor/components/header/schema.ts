export const defaultProps = {
  general: {
    layoutStyle: "Logo on Left",
    sticky: false,
    showLogo: true,
    logoSize: 40,
    showSearch: true,
    darkModeToggle: false,
    showSignIn: true,
    signInText: "Sign in",
    showSubscribe: true,
    subscribeText: "Subscribe",
  },
  colors: {
    mode: "inherit",
    palette: "default",
  },
  layout: {
    sectionWidth: "full",
    contentWidth: "standard",
    minHeight: "M",
    align: "left",
    verticalAlign: "middle",
  },
  spacing: {
    padding: { linked: true, topBottom: 16, leftRight: 24 },
    margin: { linked: true, topBottom: 0, leftRight: 0 },
  },
  advanced: {
    htmlAnchor: "gh-head",
  }
};
export const defaultStyles = {};