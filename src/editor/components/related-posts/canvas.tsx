import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveRelatedPostsProps } from "./schema";

export const CanvasElement = ({
  block,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) => {
  const p = resolveRelatedPostsProps(block.props);

  const mockPosts = [
    {
      id: 1,
      title: "Understanding modern CSS layout techniques",
      excerpt: "A deep dive into Grid, Flexbox, and container queries for responsive design.",
      tag: "CSS",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Building accessible web components from scratch",
      excerpt: "How to create reusable UI components that work for everyone.",
      tag: "Accessibility",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "The future of server-side rendering in 2027",
      excerpt: "Exploring new patterns in SSR and streaming architectures.",
      tag: "Architecture",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      title: "TypeScript tips for production-grade applications",
      excerpt: "Advanced type patterns that make your code safer and more maintainable.",
      tag: "TypeScript",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const displayPosts = mockPosts.slice(0, p.count);

  return (
    <div className="w-full py-8">
      <h3 className="text-xl font-bold text-brand-ink mb-6">{p.heading}</h3>
      <div className={`grid gap-6 ${p.count <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {displayPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white border border-brand-hairline rounded-md overflow-hidden shadow-level-2 group cursor-pointer"
          >
            {p.showImage && (
              <div className="aspect-video bg-brand-canvas-soft-2 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            )}
            <div className="p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-link font-semibold">
                {post.tag}
              </span>
              <h4 className="text-sm font-semibold text-brand-ink leading-snug mt-1 group-hover:text-brand-link transition-colors">
                {post.title}
              </h4>
              {p.showExcerpt && (
                <p className="text-xs text-brand-body leading-relaxed mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
