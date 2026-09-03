export interface HeroProps {
  eyebrowText: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  showSecondaryButton: boolean;
  secondaryButtonLabel: string;
  secondaryButtonUrl: string;
  useSiteData?: boolean;
  useCoverImageAsBackground?: boolean;
  textColor?: string;
  imageUrl?: string;
  imageAlt?: string;
}

// FIX: previously "Introducing Builder V2" (the page-builder's own internal
// branding) was hardcoded with no field to edit it, and compiler.ts tied it
// to whether `subtitle` was filled in — a copy/paste error with no logical
// connection to the actual content. It's now a normal editable field like
// title/subtitle, defaulting to something a real site would actually say.
export const defaultProps: HeroProps = {
  eyebrowText: "New",
  title: "Verve Landing",
  subtitle: "Build visual layout sections at rapid speeds.",
  buttonLabel: "Get Started",
  buttonUrl: "#",
  showSecondaryButton: true,
  secondaryButtonLabel: "Documentation",
  secondaryButtonUrl: "#",
  useSiteData: false,
  useCoverImageAsBackground: true,
  textColor: "",
  imageUrl: "",
  imageAlt: "Hero Image",
};

export const defaultStyles = { backgroundType: "solid", layout: "center" };