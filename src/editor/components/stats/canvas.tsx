import React from "react";
import { BuilderBlock } from "@/types/theme";
import { StatsProps, defaultProps } from "./schema";
import { getBackgroundStyle } from "../shared/background";

const COLS_CLASS: Record<number, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
};

export const CanvasElement = ({ block }: { block: BuilderBlock }) => {
  const p = { ...defaultProps, ...block.props } as StatsProps;
  const general = p.general;
  const stats = p.stats || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};

  const bgStyle = getBackgroundStyle(styles, appearance);
  // We use inline container queries instead of gridCols Tailwind classes to make it responsive in the editor canvas

  const renderStat = (stat: any, idx: number) => {
    if (general.layoutStyle === "cards") {
      return (
        <div key={stat.id || idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
          {(stat.iconType === 'image' && stat.imageUrl) ? (
            <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4 overflow-hidden">
              <img src={stat.imageUrl} alt={stat.label} className="w-full h-full object-cover" />
            </div>
          ) : stat.icon ? (
            <div 
              className="w-12 h-12 flex items-center justify-center rounded-full mb-4" 
              style={{ backgroundColor: "var(--color-primary-light, #e0f2fe)", color: "var(--color-primary)" }}
              dangerouslySetInnerHTML={{ __html: stat.icon }}
            />
          ) : null}
          <dt className="text-sm font-semibold leading-6 text-gray-600" style={{ color: appearance?.labelColor || "var(--color-mute)" }}>{stat.label}</dt>
          <dd className="order-first text-4xl font-bold tracking-tight text-gray-900 mb-2" style={{ color: appearance?.valueColor || "var(--color-ink)" }}>{stat.value}</dd>
        </div>
      );
    } else if (general.layoutStyle === "accent-cards") {
      return (
        <div key={stat.id || idx} className="bg-white/40 backdrop-blur-sm rounded-r-xl shadow-sm border-y border-r border-gray-100 p-8 flex flex-col items-start border-l-4" style={{ borderLeftColor: "var(--color-primary)" }}>
          {(stat.iconType === 'image' && stat.imageUrl) ? (
            <div className="w-10 h-10 flex items-center justify-center rounded-lg mb-4 overflow-hidden">
              <img src={stat.imageUrl} alt={stat.label} className="w-full h-full object-cover" />
            </div>
          ) : stat.icon ? (
            <div 
              className="w-10 h-10 flex items-center justify-center rounded-lg mb-4" 
              style={{ backgroundColor: "var(--color-primary-light, #e0f2fe)", color: "var(--color-primary)" }}
              dangerouslySetInnerHTML={{ __html: stat.icon }}
            />
          ) : null}
          <dd className="text-4xl font-bold tracking-tight text-gray-900 mb-2" style={{ color: appearance?.valueColor || "var(--color-ink)" }}>{stat.value}</dd>
          <dt className="text-sm font-medium leading-6 text-gray-600" style={{ color: appearance?.labelColor || "var(--color-mute)" }}>{stat.label}</dt>
        </div>
      );
    } else if (general.layoutStyle === "bordered") {
      return (
        <div key={stat.id || idx} className="flex flex-col border-t border-gray-200 py-6">
          <dt className="text-sm font-semibold leading-6 text-gray-600" style={{ color: appearance?.labelColor || "var(--color-mute)" }}>{stat.label}</dt>
          <dd className="order-first text-4xl font-bold tracking-tight text-gray-900 mb-2" style={{ color: appearance?.valueColor || "var(--color-ink)" }}>{stat.value}</dd>
        </div>
      );
    } else if (general.layoutStyle === "divider-grid") {
      return (
        <div key={stat.id || idx} className="flex flex-col items-center justify-center text-center p-8 border-b border-r" style={{ borderColor: "var(--color-hairline, rgba(0,0,0,0.1))" }}>
          <dt className="text-sm font-semibold leading-6 text-gray-600 uppercase tracking-wider mb-2" style={{ color: appearance?.labelColor || "var(--color-mute)" }}>{stat.label}</dt>
          <dd className="text-5xl font-bold tracking-tight text-gray-900" style={{ color: appearance?.valueColor || "var(--color-ink)" }}>{stat.value}</dd>
        </div>
      );
    }
    
    // Default "row" and "split" stat style
    return (
      <div key={stat.id || idx} className="flex flex-col items-center text-center">
        <dt className="text-base font-semibold leading-7 text-gray-600" style={{ color: appearance?.labelColor || "var(--color-mute)" }}>{stat.label}</dt>
        <dd className="order-first text-5xl font-bold tracking-tight text-gray-900 mb-2" style={{ color: appearance?.valueColor || "var(--color-ink)" }}>{stat.value}</dd>
      </div>
    );
  };

  const isCards = general.layoutStyle === 'cards' || general.layoutStyle === 'accent-cards';
  const isDivider = general.layoutStyle === 'divider-grid';

  return (
    <div id={`stats-${block.id}`} className={`relative w-full min-w-full ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}`} style={{ ...bgStyle, paddingTop: spacing.paddingTop, paddingBottom: spacing.paddingBottom, containerType: 'inline-size' }}>
      <style>{`
        #stats-${block.id} .responsive-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }
        @container (min-width: 640px) {
          #stats-${block.id} .responsive-grid {
            grid-template-columns: repeat(${Math.min(2, general.columns)}, minmax(0, 1fr));
          }
        }
        @container (min-width: 768px) {
          #stats-${block.id} .responsive-grid {
            grid-template-columns: repeat(${general.columns}, minmax(0, 1fr));
          }
        }
        #stats-${block.id} .responsive-split {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          align-items: center;
        }
        @container (min-width: 1024px) {
          #stats-${block.id} .responsive-split {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
      <div className="w-full min-w-full max-w-7xl mx-auto px-6 lg:px-8">
        {general.layoutStyle === "split" ? (
          <div className="w-full responsive-split gap-12 lg:gap-8">
            <div className="w-full text-left">
              {general.heading && (
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4" style={{ color: appearance?.headingColor || "var(--color-ink)" }}>
                  {general.heading}
                </h2>
              )}
              {general.subheading && (
                <p className="text-lg leading-8 text-gray-600" style={{ color: appearance?.subheadingColor || "var(--color-mute)" }}>
                  {general.subheading}
                </p>
              )}
            </div>
            <div className="w-full">
              <dl className={`responsive-grid gap-x-8 gap-y-12`}>
                {stats.map(renderStat)}
              </dl>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full min-w-full max-w-4xl mx-auto text-center mb-12">
              {general.heading && (
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" style={{ color: appearance?.headingColor || "var(--color-ink)" }}>
                  {general.heading}
                </h2>
              )}
              {general.subheading && (
                <p className="mt-4 text-lg leading-8 text-gray-600" style={{ color: appearance?.subheadingColor || "var(--color-mute)" }}>
                  {general.subheading}
                </p>
              )}
            </div>
            
            <dl className={`responsive-grid ${isDivider ? 'border-t border-l gap-0' : 'gap-x-8 gap-y-12'} ${isCards ? 'gap-y-6' : ''}`} style={isDivider ? { borderColor: "var(--color-hairline, rgba(0,0,0,0.1))" } : {}}>
              {stats.map(renderStat)}
            </dl>
          </>
        )}
      </div>
    </div>
  );
};
