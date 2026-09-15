export interface HeroSlide {
  id: string;
  eyebrowText?: string;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  buttonUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  bgImageUrl?: string;
}

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

  // Carousel Options
  enableCarousel?: boolean;
  carouselMode?: "static" | "dynamic";
  dynamicTag?: string;
  slides?: HeroSlide[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  transitionEffect?: "slide" | "fade";
}

export const defaultProps: HeroProps = {
  eyebrowText: "Featured",
  title: "Build beautiful layouts.",
  subtitle: "A visual workspace built directly on layout AST compilation logic, adhering strictly to Geist presets.",
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

  // Carousel Defaults
  enableCarousel: false,
  carouselMode: "static",
  dynamicTag: "hero-carousel",
  slides: [
    {
      id: "slide-1",
      eyebrowText: "Featured",
      title: "Discover Verve Edition",
      subtitle: "Experience modern publishing with fluid visual storytelling.",
      buttonLabel: "Explore Now",
      buttonUrl: "#",
      imageUrl: "",
      imageAlt: "Slide 1 Image",
    },
    {
      id: "slide-2",
      eyebrowText: "New Release",
      title: "Built For Modern Creators",
      subtitle: "Craft lightning-fast dynamic publication layouts in Ghost CMS.",
      buttonLabel: "Get Started",
      buttonUrl: "#",
      imageUrl: "",
      imageAlt: "Slide 2 Image",
    },
  ],
  autoplay: true,
  autoplayInterval: 5000,
  showArrows: true,
  showDots: true,
  transitionEffect: "slide",
};

export const defaultStyles = { backgroundType: "solid", layout: "center" };
