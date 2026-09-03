import { BuilderBlock } from "@/types/theme";

export interface LogoCloudProps {
  general: {
    heading?: string;
    subheading?: string;
    layoutStyle: "row" | "grid" | "marquee";
    columns: 3 | 4 | 5 | 6; // only used for "grid"
    grayscale: boolean;
    dataSource: "static" | "dynamic";
    dynamicTag: string;
    dynamicLimit: number | "all";
  };
  logos: Array<{ id: string; name: string; imageUrl: string; linkUrl?: string }>;
  appearance: { backgroundColor?: string };
  spacing: { paddingTop?: string; paddingBottom?: string };
  advanced: { htmlAnchor?: string };
}

export const DEFAULT_LOGOS = [
  { id: "1", name: "Placeholder Co", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='transparent'/%3E%3Ccircle cx='30' cy='30' r='16' fill='%239ca3af'/%3E%3Ctext x='55' y='36' font-family='sans-serif' font-size='20' font-weight='bold' fill='%239ca3af'%3ELogo Ipsum%3C/text%3E%3C/svg%3E" },
  { id: "2", name: "Placeholder Inc", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='transparent'/%3E%3Cpolygon points='30,14 46,46 14,46' fill='%239ca3af'/%3E%3Ctext x='55' y='36' font-family='sans-serif' font-size='20' font-weight='bold' fill='%239ca3af'%3ELogo Ipsum%3C/text%3E%3C/svg%3E" },
  { id: "3", name: "Placeholder Labs", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='transparent'/%3E%3Crect x='14' y='14' width='32' height='32' fill='%239ca3af'/%3E%3Ctext x='55' y='36' font-family='sans-serif' font-size='20' font-weight='bold' fill='%239ca3af'%3ELogo Ipsum%3C/text%3E%3C/svg%3E" },
  { id: "4", name: "Placeholder Group", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='transparent'/%3E%3Cpath d='M14,30 Q30,10 46,30 T14,30' fill='%239ca3af'/%3E%3Ctext x='55' y='36' font-family='sans-serif' font-size='20' font-weight='bold' fill='%239ca3af'%3ELogo Ipsum%3C/text%3E%3C/svg%3E" },
  { id: "5", name: "Placeholder Studio", imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='transparent'/%3E%3Cpolygon points='30,14 46,30 30,46 14,30' fill='%239ca3af'/%3E%3Ctext x='55' y='36' font-family='sans-serif' font-size='20' font-weight='bold' fill='%239ca3af'%3ELogo Ipsum%3C/text%3E%3C/svg%3E" },
];

export const GENERIC_SVG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' fill='transparent'/%3E%3Crect x='14' y='14' width='32' height='32' fill='%239ca3af'/%3E%3Ctext x='55' y='36' font-family='sans-serif' font-size='20' font-weight='bold' fill='%239ca3af'%3ELogo Ipsum%3C/text%3E%3C/svg%3E";

export const defaultProps: Partial<LogoCloudProps> = {
  general: { 
    heading: "Trusted by teams worldwide", 
    layoutStyle: "row", 
    columns: 5, 
    grayscale: true,
    dataSource: "static",
    dynamicTag: "hash-partner-logo",
    dynamicLimit: 10
  },
  logos: DEFAULT_LOGOS,
  appearance: { backgroundColor: "var(--color-bg)" },
  spacing: { paddingTop: "4rem", paddingBottom: "4rem" },
  advanced: { htmlAnchor: "logo-cloud" },
};

export const defaultStyles = {};
