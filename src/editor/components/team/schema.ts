export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

export type PhotoShape = "circle" | "square" | "rounded";

export interface TeamProps {
  general: {
    heading?: string;
    subheading?: string;
    photoShape: PhotoShape;
    columns: 2 | 3 | 4;
    useDynamicData?: boolean;
    dynamicTag?: string;
  };
  members: TeamMember[];
  appearance: {
    backgroundColor?: string;
    headingColor?: string;
    subheadingColor?: string;
    nameColor?: string;
    roleColor?: string;
    bioColor?: string;
  };
  spacing: {
    paddingTop?: string;
    paddingBottom?: string;
  };
  advanced: {
    htmlAnchor?: string;
  };
}

export const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Alex Rivera",
    role: "Founder & CEO",
    bio: "Former design lead at Stripe. Building next-generation digital publication architectures with minimalist aesthetics.",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: "2",
    name: "Elena Rostova",
    role: "Head of Engineering",
    bio: "Distributed systems specialist. M.S. Computer Science from ETH Zürich, previously core engineer at Ghost Foundation.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: "3",
    name: "Marcus Chen",
    role: "Principal Architect",
    bio: "10+ years scaling modern web infrastructure. Contributor to open web compiler toolchains and node ecosystems.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80",
  },
  {
    id: "4",
    name: "Sarah Jenkins",
    role: "Head of Product Design",
    bio: "Human-computer interaction researcher and design system creator. Dedicated to crafted typography and seamless editorial tools.",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
  },
];

export const defaultProps: TeamProps = {
  general: {
    heading: "The Crew",
    subheading: "Meet the passionate team building the future of independent publishing.",
    photoShape: "circle",
    columns: 4,
    useDynamicData: false,
    dynamicTag: "team",
  },
  members: DEFAULT_MEMBERS,
  appearance: {
    backgroundColor: "var(--color-bg)",
  },
  spacing: {
    paddingTop: "5rem",
    paddingBottom: "5rem",
  },
  advanced: {
    htmlAnchor: "team",
  },
};

export const defaultStyles = {};
