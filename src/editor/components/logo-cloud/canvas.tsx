import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { LogoCloudProps, defaultProps } from "./schema";
import { getBackgroundStyle } from "../shared/background";
import { LOGO_CLOUD_MAX_WIDTH } from "./constants";

export const CanvasElement = ({ block }: { block: BuilderBlock }) => {
  const p = { ...defaultProps, ...block.props } as LogoCloudProps;
  const assets = useEditorStore(s => s.document.assets) || {};
  const general = p.general;
  const logos = p.logos || [];
  const appearance = p.appearance;
  const spacing = p.spacing;
  const styles = block.styles || {};

  const bgStyle = getBackgroundStyle(styles, appearance);
  const grayscaleClass = general.grayscale ? "grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100" : "transition-all duration-300 opacity-80 hover:opacity-100";

  const renderLogo = (logo: any) => {
    let resolvedUrl = logo.imageUrl;
    if (resolvedUrl && resolvedUrl.startsWith("asset://")) {
      const path = resolvedUrl.replace("asset://", "");
      resolvedUrl = assets[path] || resolvedUrl;
    }

    return (
      <div key={logo.id} className={`flex items-center justify-center p-4 ${grayscaleClass}`}>
        {logo.linkUrl ? (
          <a href={logo.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full max-h-16 flex items-center justify-center" onClick={(e) => e.preventDefault()}>
            <img src={resolvedUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
          </a>
        ) : (
          <img src={resolvedUrl} alt={logo.name} className="max-w-full max-h-16 object-contain" />
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${styles.backgroundType === 'mesh' ? 'mesh-glow' : ''}`} style={{ ...bgStyle, paddingTop: spacing.paddingTop, paddingBottom: spacing.paddingBottom }}>
      {general.dataSource === "dynamic" && (
        <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-[10px] font-mono font-bold px-2 py-1 rounded-sm border border-purple-200 z-10 shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
          Dynamic: #{general.dynamicTag || 'hash-partner-logo'}
        </div>
      )}
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth: LOGO_CLOUD_MAX_WIDTH }}>
        
        {(general.heading || general.subheading) && (
          <div className="text-center mb-10">
            {general.heading && (
              <h2 className="text-lg font-semibold leading-8 tracking-tight text-gray-900" style={{ color: "var(--color-ink)" }}>
                {general.heading}
              </h2>
            )}
            {general.subheading && (
              <p className="mt-2 text-sm leading-6 text-gray-600" style={{ color: "var(--color-mute)" }}>
                {general.subheading}
              </p>
            )}
          </div>
        )}

        {general.layoutStyle === "marquee" ? (
          <div className="w-full overflow-hidden whitespace-nowrap flex items-center relative py-4 mask-edges">
            <div className="flex w-max animate-marquee gap-16 items-center">
              {/* Duplicate the logos so it scrolls infinitely without gap */}
              {[...logos, ...logos, ...logos].map((logo, idx) => (
                <div key={`${logo.id}-${idx}`} className="flex-shrink-0 w-32 md:w-40 flex items-center justify-center">
                  {renderLogo(logo)}
                </div>
              ))}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .mask-edges {
                mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
              }
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.33%); }
              }
              .animate-marquee {
                animation: marquee 20s linear infinite;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
            `}} />
          </div>
        ) : general.layoutStyle === "grid" ? (
          <div 
            className="mx-auto grid max-w-lg items-center gap-x-8 gap-y-10 sm:max-w-xl md:max-w-none"
            style={{ 
              gridTemplateColumns: `repeat(var(--logo-cloud-cols), minmax(0, 1fr))`,
              '--logo-cloud-cols': general.columns 
            } as React.CSSProperties}
          >
            {logos.map(renderLogo)}
          </div>
        ) : (
          /* "row" layout - flex wrap centered */
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10">
            {logos.map((logo) => (
              <div key={logo.id} className="w-32 md:w-40 flex-shrink-0 flex items-center justify-center">
                {renderLogo(logo)}
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
};
