/* eslint-disable @next/next/no-img-element */
import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { TeamProps, TeamMember, defaultProps } from "./schema";
import { getBackgroundStyle } from "../shared/background";

export const CanvasElement = ({ block }: { block: BuilderBlock }) => {
  const p = { ...defaultProps, ...block.props } as TeamProps;
  const assets = useEditorStore((s) => s.document.assets) || {};
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isMobile = deviceMode === "mobile";
  const isTablet = deviceMode === "tablet";

  const general = p.general || defaultProps.general;
  const members = p.members || defaultProps.members;
  const appearance = p.appearance || defaultProps.appearance;
  const spacing = p.spacing || defaultProps.spacing;
  const styles = block.styles || {};

  const bgStyle = getBackgroundStyle(styles, appearance);
  const photoShape = general.photoShape || "circle";
  const columns = general.columns || 4;

  const shapeClass =
    photoShape === "circle"
      ? "rounded-full"
      : photoShape === "square"
        ? "rounded-none"
        : "rounded-2xl";

  const effCols = isMobile ? 1 : isTablet ? Math.min(2, columns) : columns;
  const itemWidth =
    effCols === 1
      ? "100%"
      : `calc((100% - ${(effCols - 1) * 2}rem) / ${effCols})`;
  const itemMaxWidth = effCols === 1 ? "24rem" : "none";
  const gridGap = isMobile ? "2.5rem 1.5rem" : isTablet ? "3rem 2rem" : "3.5rem 2rem";

  const renderPhoto = (member: TeamMember) => {
    let resolvedUrl = member.photoUrl;
    if (resolvedUrl && resolvedUrl.startsWith("asset://")) {
      const path = resolvedUrl.replace("asset://", "");
      resolvedUrl = assets[path] || assets[`assets/${path}`] || resolvedUrl;
    }

    if (!resolvedUrl) {
      const initials = (member.name || "T")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return (
        <div
          className={`w-28 h-28 mx-auto flex items-center justify-center bg-brand-canvas-soft-2 border border-brand-hairline ${shapeClass} overflow-hidden shadow-level-1 shrink-0`}
        >
          <span className="text-xl font-mono font-bold text-brand-primary">{initials}</span>
        </div>
      );
    }

    return (
      <div
        className={`w-28 h-28 mx-auto overflow-hidden bg-brand-canvas-soft-2 border border-brand-hairline/80 ${shapeClass} shadow-level-1 shrink-0 group-hover:scale-105 transition-transform duration-300`}
      >
        <img
          src={resolvedUrl}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  };

  return (
    <div
      id={`team-${block.id}`}
      className={`relative w-full min-w-full ${styles.backgroundType === "mesh" ? "mesh-glow" : ""}`}
      style={{
        ...bgStyle,
        paddingTop: isMobile ? "3rem" : (spacing.paddingTop || "5rem"),
        paddingBottom: isMobile ? "3rem" : (spacing.paddingBottom || "5rem"),
      }}
    >
      <style>{`
        #team-${block.id} .team-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: ${gridGap};
          width: 100%;
          box-sizing: border-box;
        }
        #team-${block.id} .team-grid > * {
          width: ${itemWidth};
          max-width: ${itemMaxWidth};
          flex-shrink: 0;
          box-sizing: border-box;
        }
        ${!isMobile && !isTablet ? `
        @media (max-width: 640px) {
          #team-${block.id} .team-grid {
            gap: 2.5rem 1.5rem;
          }
          #team-${block.id} .team-grid > * {
            width: 100%;
            max-width: 24rem;
          }
        }
        @media (min-width: 641px) and (max-width: 1023px) {
          #team-${block.id} .team-grid {
            gap: 3rem 2rem;
          }
          #team-${block.id} .team-grid > * {
            width: calc((100% - ${(Math.min(2, columns) - 1) * 2}rem) / ${Math.min(2, columns)});
            max-width: none;
          }
        }
        ` : ""}
      `}</style>

      <div className={`w-full min-w-full max-w-7xl mx-auto ${isMobile ? "px-4" : "px-6 lg:px-8"}`}>
        {/* Dynamic Badge Banner in Editor */}
        {general.useDynamicData && (
          <div className="mb-8 flex items-center justify-center gap-2 text-xs font-mono font-medium text-blue-700 bg-blue-50/80 border border-blue-200/80 rounded-full px-3.5 py-1 w-fit mx-auto shadow-xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span>Dynamic Ghost Query: Posts tagged <strong className="font-bold">#{general.dynamicTag || "team"}</strong></span>
          </div>
        )}

        {/* Section Header */}
        {(general.heading || general.subheading) && (
          <div className={`w-full min-w-full max-w-2xl mx-auto text-center ${isMobile ? "mb-8" : "mb-14"}`}>
            {general.heading && (
              <h2
                className={`w-full ${isMobile ? "text-2xl" : "text-3xl sm:text-4xl"} font-semibold tracking-tight text-brand-ink`}
                style={{ color: appearance?.headingColor || "var(--color-ink)" }}
              >
                {general.heading}
              </h2>
            )}
            {general.subheading && (
              <p
                className={`w-full mt-3 ${isMobile ? "text-sm" : "text-base sm:text-lg"} leading-relaxed text-brand-body`}
                style={{ color: appearance?.subheadingColor || "var(--color-mute)" }}
              >
                {general.subheading}
              </p>
            )}
          </div>
        )}

        {/* Member Grid */}
        <div className="team-grid w-full min-w-full">
          {members.map((member, idx) => (
            <div
              key={member.id || idx}
              className="team-card flex flex-col items-center text-center group"
            >
              {renderPhoto(member)}

              <div className="mt-4 flex flex-col items-center">
                <h3
                  className={`font-semibold text-brand-ink tracking-tight ${isMobile ? "text-base" : "text-base sm:text-lg"}`}
                  style={{ color: appearance?.nameColor || "var(--color-ink)" }}
                >
                  {member.name || "Team Member"}
                </h3>

                {member.role && (
                  <p
                    className="text-xs font-medium font-mono uppercase tracking-wider text-brand-primary/80 mt-1"
                    style={{ color: appearance?.roleColor || "var(--color-primary)" }}
                  >
                    {member.role}
                  </p>
                )}

                {member.bio && (
                  <p
                    className={`text-brand-body leading-relaxed mt-2.5 max-w-[280px] whitespace-pre-line ${isMobile ? "text-xs px-2" : "text-xs sm:text-sm"}`}
                    style={{ color: appearance?.bioColor || "var(--color-body)" }}
                  >
                    {member.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
