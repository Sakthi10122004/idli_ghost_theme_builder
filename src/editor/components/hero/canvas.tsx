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

  return (
    <div
      className={`w-full text-center relative overflow-hidden ${!useSiteData ? 'mesh-glow' : ''}`}
      style={{
        paddingTop: (block.styles?.paddingTop as string) || '3rem',
        paddingBottom: (block.styles?.paddingBottom as string) || '5rem'
      }}
    >
      <div 
        className="mx-auto px-6 flex flex-col items-center gap-5 relative z-10"
        style={{ maxWidth: block.styles?.contentWidth || '800px' }}
      >
        {eyebrowText && (
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-link font-semibold bg-brand-link-bg-soft px-3 py-1 rounded-full mb-2">
            {eyebrowText}
          </span>
        )}
        <h1 className="text-[2.75rem] md:text-[3.5rem] font-sans font-bold leading-[1.1] tracking-[-0.02em] break-words max-w-full text-[var(--color-ink)]">
          {useSiteData ? "{{@site.title}}" : (title || "Build beautiful templates.")}
        </h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-[600px] break-words text-[var(--color-body)]">
          {useSiteData ? "{{@site.description}}" : (subtitle || "A visual workspace built directly on layout AST compilation logic, adhering strictly to Geist presets.")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button 
            className="hover:opacity-90 px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all shadow-sm flex items-center justify-center"
            style={{ 
              backgroundColor: block.props.buttonBgColor || 'var(--color-primary)', 
              color: block.props.buttonTextColor || 'var(--color-on-primary)' 
            }}
          >
            {buttonLabel || "Start Free"}
          </button>
          {(showSecondaryButton ?? true) && (
            <button className="border-2 px-8 py-3.5 rounded-full text-[15px] font-semibold transition-all flex items-center justify-center border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:border-[var(--color-primary)]">
              {secondaryButtonLabel || "Documentation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};