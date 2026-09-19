export interface AuthorProfileProps {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  website?: string;
  twitter?: string;
  layoutStyle?: "banner" | "card";
}

export const defaultProps: AuthorProfileProps = {
  name: "Alex Rivera",
  bio: "Founder & Lead Architect at Ghost Foundation. Dedicated to building minimalist, high-speed publication frameworks.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  location: "San Francisco, CA",
  website: "https://example.com",
  twitter: "@alexrivera",
  layoutStyle: "card",
};

export const defaultStyles = {};

export function resolveAuthorProfileProps(raw?: Record<string, unknown>): AuthorProfileProps {
  return {
    name: (raw?.name as string) || defaultProps.name,
    bio: (raw?.bio as string) || defaultProps.bio,
    avatarUrl: (raw?.avatarUrl as string) || defaultProps.avatarUrl,
    location: (raw?.location as string) || defaultProps.location,
    website: (raw?.website as string) || defaultProps.website,
    twitter: (raw?.twitter as string) || defaultProps.twitter,
    layoutStyle: (raw?.layoutStyle as AuthorProfileProps["layoutStyle"]) || "card",
  };
}