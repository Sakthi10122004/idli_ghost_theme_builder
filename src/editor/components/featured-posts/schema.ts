import { BuilderBlock } from "@/types/theme";

export interface FeaturedPostsProps {
  title?: string;
  heading?: string;
  description?: string;
  layout?: "split" | "grid" | "list" | "carousel" | "bento" | "editorial" | "masonry";
  limit?: number;
  autoScroll?: boolean;
  headingColor?: string;
  descriptionColor?: string;
  cardTitleColor?: string;
  cardTextColor?: string;
}

export const defaultProps: FeaturedPostsProps = {
  title: "Featured Articles",
  heading: "Featured Articles",
  description: "Hand-picked stories and top editorial selections from our writers.",
  layout: "split",
  limit: 3,
  autoScroll: false,
  headingColor: "#171717",
  descriptionColor: "#666666",
  cardTitleColor: "#171717",
  cardTextColor: "#4d4d4d",
};

export const defaultStyles = {};