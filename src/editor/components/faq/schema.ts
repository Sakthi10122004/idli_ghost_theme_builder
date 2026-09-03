import { BuilderBlock } from "@/types/theme";

export interface FAQProps {
  general: {
    heading?: string;
    subheading?: string;
    layoutStyle: "accordion" | "two-column" | "categorized";
    allowMultipleOpen: boolean;
  };
  items: Array<{ id: string; question: string; answer: string; category?: string }>;
  appearance: { backgroundColor?: string };
  spacing: { paddingTop?: string; paddingBottom?: string };
  advanced: { htmlAnchor?: string };
}

export const DEFAULT_FAQS = [
  { id: "1", question: "How do I get started?", answer: "Create an account, choose a template, and start dragging components onto the canvas." },
  { id: "2", question: "Can I export my theme at any time?", answer: "Yes — export produces a real Ghost theme ZIP you can upload directly in Ghost Admin." },
  { id: "3", question: "Do I need to know Handlebars?", answer: "No — the visual editor handles all Ghost-specific templating for you." },
];

export const defaultProps: Partial<FAQProps> = {
  general: { heading: "Frequently Asked Questions", layoutStyle: "accordion", allowMultipleOpen: false },
  items: DEFAULT_FAQS,
  appearance: { backgroundColor: "var(--color-bg)" },
  spacing: { paddingTop: "4rem", paddingBottom: "4rem" },
  advanced: { htmlAnchor: "faq" },
};

export const defaultStyles = {};
