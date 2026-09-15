export interface TestimonialItem {
  id: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating?: number; // 1 - 5
  date?: string;
  location?: string;
  productUsed?: string;
  socialUrl?: string;
  socialPlatform?: "linkedin" | "twitter" | "website" | "github";
  featured?: boolean;
}

export const defaultProps = {
  useDynamicData: true,
  dynamicTag: "testimonial",
  dynamicLimit: 100,
  sectionBadge: "WALL OF LOVE",
  sectionTitle: "Loved by creators and readers worldwide",
  sectionSubtitle: "Discover how thousands of publications build and grow their audience with our themes.",
  showSectionHeader: true,
  layout: "grid-3", // "grid-1" | "grid-2" | "grid-3"
  cardStyle: "bordered", // "bordered" | "soft" | "minimal" | "elevated"
  showStars: true,
  showPhotos: true,
  showRoleCompany: true,
  showDate: true,
  showLocation: true,
  showSocialLink: true,
  textColor: "",
  items: [
    {
      id: "t-1",
      author: "Sarah Jenkins",
      role: "Head of Product",
      company: "Vercel",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      quote: "This theme builder transformed our publication workflow completely. We launched 4 custom Ghost newsletters in a single week with zero developer friction.",
      rating: 5,
      date: "March 15, 2026",
      location: "San Francisco, CA",
      socialUrl: "https://linkedin.com",
      socialPlatform: "linkedin",
      featured: false,
    },
    {
      id: "t-2",
      author: "Alex Rivera",
      role: "Lead Journalist",
      company: "Ghost",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      quote: "The speed and typographic elegance are unmatched. Our subscriber engagement and conversion rates jumped by 42% after switching.",
      rating: 5,
      date: "Feb 28, 2026",
      location: "Austin, TX",
      socialUrl: "https://twitter.com",
      socialPlatform: "twitter",
      featured: false,
    },
    {
      id: "t-3",
      author: "Elena Rostova",
      role: "Design Director",
      company: "Stripe",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      quote: "As a designer, I am extremely particular about typography and grid alignments. This tool respects the design system down to the pixel.",
      rating: 5,
      date: "Jan 19, 2026",
      location: "London, UK",
      socialUrl: "https://studioaura.design",
      socialPlatform: "website",
      featured: false,
    },
  ] as TestimonialItem[],
};

export const defaultStyles = { backgroundType: "solid", layout: "grid-3" };