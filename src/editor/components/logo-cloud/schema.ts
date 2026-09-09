
export interface LogoCloudProps {
  general: {
    heading?: string;
    subheading?: string;
    layoutStyle: "row" | "grid" | "marquee";
    columns: 3 | 4 | 5 | 6; // only used for "grid"
    grayscale: boolean;
    invertInDark?: boolean;
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
  {
    id: "logo-1",
    name: "Acme Corp",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 36' fill='none'%3E%3Cpath d='M16 4L28 11V25L16 32L4 25V11L16 4Z' stroke='%23171717' stroke-width='2.5' stroke-linejoin='round'/%3E%3Cpath d='M16 4V18M16 18L28 25M16 18L4 25' stroke='%23171717' stroke-width='2.5' stroke-linejoin='round'/%3E%3Ctext x='38' y='23' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='700' letter-spacing='-0.5' fill='%23171717'%3EACME%3Ctspan font-weight='400' fill='%23171717' opacity='0.65'%3ECORP%3C/tspan%3E%3C/text%3E%3C/svg%3E",
  },
  {
    id: "logo-2",
    name: "Apex Global",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 36' fill='none'%3E%3Cpath d='M6 26L16 10L26 26H20L16 19L12 26H6Z' fill='%23171717'/%3E%3Cpath d='M16 5L24 17H19L16 11L13 17H8L16 5Z' fill='%23171717' opacity='0.5'/%3E%3Ctext x='36' y='23' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='700' letter-spacing='-0.3' fill='%23171717'%3EApex%3Ctspan font-weight='400' fill='%23171717' opacity='0.65'%3EGlobal%3C/tspan%3E%3C/text%3E%3C/svg%3E",
  },
  {
    id: "logo-3",
    name: "BoltFlow",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 36' fill='none'%3E%3Ccircle cx='16' cy='18' r='14' fill='%23171717' fill-opacity='0.08'/%3E%3Cpath d='M18 7L9 19H16L14 29L23 17H16L18 7Z' fill='%23171717'/%3E%3Ctext x='38' y='23' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='700' letter-spacing='-0.4' fill='%23171717'%3EBolt%3Ctspan font-weight='400' fill='%23171717' opacity='0.65'%3EFlow%3C/tspan%3E%3C/text%3E%3C/svg%3E",
  },
  {
    id: "logo-4",
    name: "Nexus AI",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 36' fill='none'%3E%3Cellipse cx='14' cy='18' rx='10' ry='4.5' transform='rotate(-30 14 18)' stroke='%23171717' stroke-width='2.2'/%3E%3Cellipse cx='18' cy='18' rx='10' ry='4.5' transform='rotate(30 18 18)' stroke='%23171717' stroke-width='2.2'/%3E%3Ccircle cx='16' cy='18' r='2.5' fill='%23171717'/%3E%3Ctext x='36' y='23' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='700' letter-spacing='-0.3' fill='%23171717'%3ENexus%3Ctspan font-weight='400' fill='%23171717' opacity='0.65'%3EAI%3C/tspan%3E%3C/text%3E%3C/svg%3E",
  },
  {
    id: "logo-5",
    name: "Vertex Labs",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 36' fill='none'%3E%3Cpath d='M4 9L16 27L28 9H22L16 19L10 9H4Z' fill='%23171717'/%3E%3Ccircle cx='16' cy='8' r='2.5' fill='%23171717'/%3E%3Ctext x='36' y='23' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='700' letter-spacing='-0.3' fill='%23171717'%3EVertex%3Ctspan font-weight='400' fill='%23171717' opacity='0.65'%3ELabs%3C/tspan%3E%3C/text%3E%3C/svg%3E",
  },
  {
    id: "logo-6",
    name: "Pulse Data",
    imageUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 36' fill='none'%3E%3Crect x='4' y='13' width='3' height='10' rx='1.5' fill='%23171717' opacity='0.4'/%3E%3Crect x='9' y='9' width='3' height='18' rx='1.5' fill='%23171717' opacity='0.7'/%3E%3Crect x='14' y='5' width='3' height='26' rx='1.5' fill='%23171717'/%3E%3Crect x='19' y='10' width='3' height='16' rx='1.5' fill='%23171717' opacity='0.7'/%3E%3Crect x='24' y='14' width='3' height='8' rx='1.5' fill='%23171717' opacity='0.4'/%3E%3Ctext x='36' y='23' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='700' letter-spacing='-0.3' fill='%23171717'%3EPulse%3Ctspan font-weight='400' fill='%23171717' opacity='0.65'%3EData%3C/tspan%3E%3C/text%3E%3C/svg%3E",
  },
];

export const GENERIC_SVG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 36' fill='none'%3E%3Cpath d='M16 6L19 13L26 16L19 19L16 26L13 19L6 16L13 13L16 6Z' fill='%23171717'/%3E%3Ctext x='36' y='23' font-family='system-ui, -apple-system, sans-serif' font-size='15' font-weight='600' letter-spacing='-0.3' fill='%23171717'%3ENew%3Ctspan font-weight='400' fill='%23171717' opacity='0.65'%3EBrand%3C/tspan%3E%3C/text%3E%3C/svg%3E";

export const defaultProps: Partial<LogoCloudProps> = {
  general: { 
    heading: "Trusted by innovative teams worldwide", 
    subheading: "Join thousands of builders, creators, and modern teams using our platform daily",
    layoutStyle: "row", 
    columns: 6, 
    grayscale: true,
    invertInDark: true,
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

export function resolveLogoCloudProps(props?: Record<string, unknown>): LogoCloudProps {
  const p = props as Partial<LogoCloudProps> | undefined;
  return {
    general: {
      ...defaultProps.general,
      ...(p?.general || {}),
    } as LogoCloudProps["general"],
    logos: p?.logos && p.logos.length > 0 ? p.logos : DEFAULT_LOGOS,
    appearance: {
      ...defaultProps.appearance,
      ...(p?.appearance || {}),
    },
    spacing: {
      ...defaultProps.spacing,
      ...(p?.spacing || {}),
    },
    advanced: {
      ...defaultProps.advanced,
      ...(p?.advanced || {}),
    },
  };
}
