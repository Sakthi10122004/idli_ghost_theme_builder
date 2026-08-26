import { BuilderBlock } from "../types/theme";
import { generateId } from "./editorStore";

export type PageTemplate = {
  id: string;
  name: string;
  description: string;
  generateBlocks: () => { sections: string[], blocks: Record<string, BuilderBlock> };
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start fresh with an empty section.",
    generateBlocks: () => {
      const sectionId = generateId("section");
      return {
        sections: [sectionId],
        blocks: {
          [sectionId]: {
            id: sectionId,
            type: "section",
            props: {},
            styles: { paddingTop: "96px", paddingBottom: "96px", backgroundColor: "#ffffff" },
            childrenIds: [],
          }
        }
      };
    }
  },
  {
    id: "blog-home",
    name: "Blog Home",
    description: "A standard blog homepage with a hero and post grid.",
    generateBlocks: () => {
      const heroSecId = generateId("section");
      const heroContainerId = generateId("container");
      const heroHeadingId = generateId("heading");
      const heroTextId = generateId("text");
      
      const gridSecId = generateId("section");
      const gridId = generateId("post-grid");

      const newsletterSecId = generateId("section");
      const newsletterId = generateId("newsletter");

      return {
        sections: [heroSecId, gridSecId, newsletterSecId],
        blocks: {
          [heroSecId]: {
            id: heroSecId,
            type: "section",
            props: {},
            styles: { paddingTop: "96px", paddingBottom: "64px", backgroundColor: "#ffffff" },
            childrenIds: [heroContainerId],
          },
          [heroContainerId]: {
            id: heroContainerId,
            type: "container",
            props: {},
            styles: { textAlign: "center" },
            childrenIds: [heroHeadingId, heroTextId],
          },
          [heroHeadingId]: {
            id: heroHeadingId,
            type: "heading",
            props: { text: "Welcome to our publication.", level: 1 },
            styles: { fontSize: "48px", fontWeight: "600", marginBottom: "16px" },
          },
          [heroTextId]: {
            id: heroTextId,
            type: "text",
            props: { text: "Discover our latest stories, insights, and updates." },
            styles: { fontSize: "18px", textColor: "#666666" },
          },
          [gridSecId]: {
            id: gridSecId,
            type: "section",
            props: {},
            styles: { paddingTop: "32px", paddingBottom: "64px", backgroundColor: "#fafafa" },
            childrenIds: [gridId],
          },
          [gridId]: {
            id: gridId,
            type: "post-grid",
            props: { title: "Latest Stories", limit: 6 },
            styles: {},
          },
          [newsletterSecId]: {
            id: newsletterSecId,
            type: "section",
            props: {},
            styles: { paddingTop: "64px", paddingBottom: "96px", backgroundColor: "#ffffff" },
            childrenIds: [newsletterId],
          },
          [newsletterId]: {
            id: newsletterId,
            type: "newsletter",
            props: { title: "Subscribe to our newsletter" },
            styles: {},
          }
        }
      };
    }
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "A conversion-focused layout with features and testimonials.",
    generateBlocks: () => {
      const heroSecId = generateId("section");
      const heroId = generateId("hero");

      const featuresSecId = generateId("section");
      const featuresId = generateId("columns");

      const testimonialsSecId = generateId("section");
      const testimonialsId = generateId("testimonials");

      return {
        sections: [heroSecId, featuresSecId, testimonialsSecId],
        blocks: {
          [heroSecId]: {
            id: heroSecId,
            type: "section",
            props: {},
            styles: { backgroundColor: "#111111" },
            childrenIds: [heroId],
          },
          [heroId]: {
            id: heroId,
            type: "hero",
            props: { 
              title: "Build faster.", 
              subtitle: "The ultimate landing page template for your product.",
              primaryActionText: "Get Started",
              secondaryActionText: "Learn More"
            },
            styles: {},
          },
          [featuresSecId]: {
            id: featuresSecId,
            type: "section",
            props: {},
            styles: { paddingTop: "96px", paddingBottom: "96px", backgroundColor: "#ffffff" },
            childrenIds: [featuresId],
          },
          [featuresId]: {
            id: featuresId,
            type: "columns",
            props: { columns: 3 },
            styles: {},
          },
          [testimonialsSecId]: {
            id: testimonialsSecId,
            type: "section",
            props: {},
            styles: { paddingTop: "64px", paddingBottom: "96px", backgroundColor: "#fafafa" },
            childrenIds: [testimonialsId],
          },
          [testimonialsId]: {
            id: testimonialsId,
            type: "testimonials",
            props: { count: 3, title: "What our customers say" },
            styles: {},
          }
        }
      };
    }
  }
];
