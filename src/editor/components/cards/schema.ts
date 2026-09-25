export interface CardItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
}

export interface CardsProps {
  heading?: string;
  subheading?: string;
  columns?: number;
  cardStyle?: "bordered" | "soft" | "elevated" | "minimal";
  items?: CardItem[];
}

export const defaultProps: CardsProps = {
  heading: "Explore Features",
  subheading: "Everything you need to build and scale your modern publication.",
  columns: 3,
  cardStyle: "bordered",
  items: [
    {
      id: "card-1",
      title: "Dynamic Content",
      description: "Seamlessly integrate your Ghost posts, tags, and authors with flexible dynamic data bindings.",
      tag: "Publishing",
      linkText: "Learn more",
      linkUrl: "#",
    },
    {
      id: "card-2",
      title: "Responsive Grids",
      description: "Craft pixel-perfect layouts that adapt automatically across desktop, tablet, and mobile devices.",
      tag: "Design",
      linkText: "Learn more",
      linkUrl: "#",
    },
    {
      id: "card-3",
      title: "High Performance",
      description: "Ultra-lean generated Handlebars templates and minified CSS for lightning fast 100/100 Lighthouse scores.",
      tag: "Speed",
      linkText: "Learn more",
      linkUrl: "#",
    },
  ],
};

export const defaultStyles: Record<string, unknown> = {
  paddingTop: "4rem",
  paddingBottom: "4rem",
};

export const resolveCardsProps = (props?: Record<string, unknown>): CardsProps => {
  return {
    ...defaultProps,
    ...props,
    items: Array.isArray(props?.items) ? (props.items as CardItem[]) : defaultProps.items,
  };
};
