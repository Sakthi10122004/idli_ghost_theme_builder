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
    { id: 1, title: "Building custom Ghost themes with Next.js", excerpt: "Learn how to establish an elegant AST rendering architecture.", date: "August 20, 2026", readingTime: "4 min read", category: "Engineering", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Design languages that scale: Geist case study", excerpt: "How stark typography and mesh gradients define developer branding.", date: "August 18, 2026", readingTime: "6 min read", category: "Design", image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Deploying modern edge stacks to global nodes", excerpt: "Optimizing startup speeds and layout rendering algorithms.", date: "August 15, 2026", readingTime: "3 min read", category: "DevOps", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" }
  ];
  const featured = mockPosts[0];
  const secondaries = mockPosts.slice(1);
  return (
    <div className="w-full">
      <h2 className="text-xs font-mono uppercase tracking-wider text-brand-mute mb-6">{block.props.title || "Featured Articles"}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white border border-brand-hairline rounded-md overflow-hidden flex flex-col shadow-level-2 group hover:shadow-level-3 transition-all">
          <div className="aspect-video relative overflow-hidden bg-brand-canvas-soft-2">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover grayscale opacity-90 transition-all duration-300" />
          </div>
          <div className="p-6 flex flex-col gap-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-brand-link font-semibold">{featured.category}</span>
            <h3 className="text-xl font-bold text-brand-ink leading-snug">{featured.title}</h3>
            <p className="text-xs text-brand-body leading-relaxed">{featured.excerpt}</p>
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col gap-6">
          {secondaries.map(post => (
            <div key={post.id} className="flex gap-4 items-start border-b border-brand-hairline pb-5 last:border-0 last:pb-0">
              <div className="w-24 h-20 bg-brand-canvas-soft-2 border border-brand-hairline rounded-sm overflow-hidden shrink-0">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale opacity-90" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono uppercase tracking-wider text-brand-link font-semibold">{post.category}</span>
                <h4 className="text-xs font-semibold text-brand-ink leading-snug line-clamp-2">{post.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};