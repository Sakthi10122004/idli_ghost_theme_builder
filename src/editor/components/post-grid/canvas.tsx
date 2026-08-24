import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const mockPosts = [
    { id: 1, title: "Building custom Ghost themes with Next.js", excerpt: "Learn how to establish an elegant AST rendering architecture for your static publication sites.", date: "August 20, 2026", readingTime: "4 min read", category: "Engineering", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Design languages that scale: Geist case study", excerpt: "How stark typography, 1px borders, and mesh gradients define developer branding aesthetics.", date: "August 18, 2026", readingTime: "6 min read", category: "Design", image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Deploying modern edge stacks to global nodes", excerpt: "Optimizing startup speeds, resource footprints, and layout rendering algorithms.", date: "August 15, 2026", readingTime: "3 min read", category: "DevOps", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" }
  ];
  return (
    <div className="post-grid-wrapper py-8 w-full">
      <div className="grid-columns grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockPosts.map(post => (
          <article key={post.id} className="post-card border border-brand-hairline rounded-md overflow-hidden flex flex-col bg-white">
            <div className="post-card-image h-48 bg-brand-canvas-soft-2">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale opacity-90" />
            </div>
            <div className="post-card-content p-5 flex flex-col gap-2">
              <span className="post-tag text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">{post.category}</span>
              <h3 className="post-title text-sm font-semibold">{post.title}</h3>
              <p className="post-excerpt text-xs text-brand-body leading-relaxed">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};