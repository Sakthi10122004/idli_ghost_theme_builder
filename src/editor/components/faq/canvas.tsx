import React, { useState } from "react";
import { BuilderBlock } from "@/types/theme";
import { FAQProps, defaultProps } from "./schema";
import { getBackgroundStyle } from "../shared/background";

export const CanvasElement = ({ block }: { block: BuilderBlock }) => {
  const p = { ...defaultProps, ...block.props } as FAQProps;
  const general = p.general;
  const items = p.items || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};

  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = general.allowMultipleOpen ? new Set(prev) : new Set<string>();
      if (prev.has(id) && !general.allowMultipleOpen) {
        next.clear();
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const bgStyle = getBackgroundStyle(styles, appearance);

  const renderFaqItem = (item: any) => {
    const isOpen = openIds.has(item.id);
    return (
      <div key={item.id} className="pt-6">
        <dt>
          <button
            type="button"
            className="flex w-full items-start justify-between text-left text-gray-900"
            style={{ color: "var(--color-ink)" }}
            aria-controls={`faq-${block.id}-${item.id}`}
            aria-expanded={isOpen}
            onClick={() => toggle(item.id)}
          >
            <span className="text-base font-semibold leading-7">{item.question}</span>
            <span className="ml-6 flex h-7 items-center">
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              )}
            </span>
          </button>
        </dt>
        <dd 
          className="mt-2 pr-12" 
          id={`faq-${block.id}-${item.id}`}
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          <p className="text-base leading-7 text-gray-600" style={{ color: "var(--color-mute)" }}>{item.answer}</p>
        </dd>
      </div>
    );
  };

  const renderContent = () => {
    if (general.layoutStyle === "two-column") {
      const mid = Math.ceil(items.length / 2);
      const col1 = items.slice(0, mid);
      const col2 = items.slice(mid);
      return (
        <div className="mx-auto mt-16 max-w-7xl grid grid-cols-1 gap-x-8 gap-y-0 lg:grid-cols-2">
          <dl className="space-y-6 divide-y divide-gray-900/10 divide-opacity-10">
            {col1.map(renderFaqItem)}
          </dl>
          <dl className="space-y-6 divide-y divide-gray-900/10 divide-opacity-10 lg:mt-0 mt-6">
            {col2.map(renderFaqItem)}
          </dl>
        </div>
      );
    } else if (general.layoutStyle === "categorized") {
      // Group by category
      const categories = Array.from(new Set(items.map(i => i.category || "General")));
      return (
        <div className="mx-auto mt-16 max-w-3xl">
          {categories.map((cat, idx) => (
            <div key={idx} className="mb-12">
              <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-6" style={{ color: "var(--color-ink)" }}>{cat}</h3>
              <dl className="space-y-6 divide-y divide-gray-900/10 divide-opacity-10">
                {items.filter(i => (i.category || "General") === cat).map(renderFaqItem)}
              </dl>
            </div>
          ))}
        </div>
      );
    }
    
    // Default: accordion (single column centered)
    return (
      <div className="mx-auto mt-16 max-w-3xl divide-y divide-gray-900/10 divide-opacity-10">
        <dl className="space-y-6 divide-y divide-gray-900/10 divide-opacity-10">
          {items.map(renderFaqItem)}
        </dl>
      </div>
    );
  };

  return (
    <div className={`relative ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}`} style={{ ...bgStyle, paddingTop: spacing.paddingTop, paddingBottom: spacing.paddingBottom }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {(general.heading || general.subheading) && (
          <div className="mx-auto max-w-4xl text-center">
            {general.heading && (
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" style={{ color: "var(--color-ink)" }}>
                {general.heading}
              </h2>
            )}
            {general.subheading && (
              <p className="mt-4 text-base leading-7 text-gray-600" style={{ color: "var(--color-mute)" }}>
                {general.subheading}
              </p>
            )}
          </div>
        )}
        
        {renderContent()}
      </div>
    </div>
  );
};
