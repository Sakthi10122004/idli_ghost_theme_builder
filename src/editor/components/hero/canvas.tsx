import React from "react";
import { BuilderBlock } from "@/types/theme";

export const CanvasElement = ({ block, isSelected, onClick, onDelete, renderChildren }: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  renderChildren: () => React.ReactNode;
}) => {
  const { eyebrowText, title, subtitle, buttonLabel, showSecondaryButton, secondaryButtonLabel, useSiteData } = block.props;

  const bgStyle = useSiteData
    ? { backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=80')", backgroundSize: "cover", backgroundPosition: "center", color: "#fff" }
    : {};

  return (
    // FIX: compiler.ts's compiled output has `overflow: hidden` on this same
    // wrapper (added when the boxed-card bug was fixed), but that fix was
    // never mirrored here in the editor preview. Without it, anything wider
    // than the box (background layer, mesh-glow bleed) spills past the right
    // edge — which also throws off any resize-handle UI anchored to this
    // element's real bounding box, since the visible edge and the actual
    // DOM edge no longer match.
    <div
      className={`w-full text-center relative overflow-hidden ${!useSiteData ? 'mesh-glow' : ''}`}
      style={{
        ...bgStyle,
        paddingTop: (block.styles?.paddingTop as string) || '3rem',
        paddingBottom: (block.styles?.paddingBottom as string) || '5rem'
      }}
    >
      <div 
        className="mx-auto px-6 flex flex-col items-center gap-4 relative z-10"
        style={{ maxWidth: block.styles?.contentWidth || '700px' }}
      >
        {eyebrowText && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-link font-semibold bg-brand-link-bg-soft px-2 py-0.5 rounded-full">
            {eyebrowText}
          </span>
        )}
        <h1 className={`text-4xl md:text-5xl font-sans font-bold leading-tight tracking-tighter ${useSiteData ? 'text-white' : 'text-brand-ink'}`}>
          {useSiteData ? "{{@site.title}}" : (title || "Build beautiful templates.")}
        </h1>
        <p className={`text-base leading-relaxed max-w-[500px] ${useSiteData ? 'text-white/80' : 'text-brand-body'}`}>
          {useSiteData ? "{{@site.description}}" : (subtitle || "A visual workspace built directly on layout AST compilation logic, adhering strictly to Geist presets.")}
        </p>
        <div className="mt-4 flex gap-3">
          <button className="bg-brand-primary text-white hover:bg-black px-6 py-2.5 rounded-pill text-xs font-semibold shadow-level-3">
            {buttonLabel || "Start Free"}
          </button>
          {(showSecondaryButton ?? true) && (
            <button className="bg-white border border-brand-hairline text-brand-ink px-6 py-2.5 rounded-pill text-xs font-semibold shadow-level-2">
              {secondaryButtonLabel || "Documentation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};