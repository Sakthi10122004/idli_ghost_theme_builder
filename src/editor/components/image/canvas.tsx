import React from "react";
import { BuilderBlock } from "@/types/theme";
import { useEditorStore } from "@/store/editorStore";
import { ImageProps, resolveImageProps } from "./schema";
import { Image as ImageIcon, Sparkles, ExternalLink } from "lucide-react";

const EMPTY_ASSETS: Record<string, string> = {};

export function CanvasElement({
  block,
  isSelected,
}: {
  block: BuilderBlock;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  renderChildren?: () => React.ReactNode;
}) {
  const p: ImageProps = resolveImageProps(block.props);
  const assets = useEditorStore((state) => state.document.assets) || EMPTY_ASSETS;

  // Resolve local image URLs including asset:// data URIs
  const resolveUrl = (rawUrl?: string): string => {
    if (!rawUrl) return "";
    if (rawUrl.startsWith("asset://")) {
      const path = rawUrl.replace("asset://", "");
      return assets[path] || assets[`assets/${path}`] || rawUrl;
    }
    return rawUrl;
  };

  const isDynamic = p.sourceType === "dynamic";
  const displayUrl = isDynamic
    ? resolveUrl(p.fallbackUrl)
    : resolveUrl(p.url);

  // Resolved Aspect Ratio string (e.g. "16 / 9", "4 / 3", "1 / 1")
  const isFixedAspect = p.aspectRatio && p.aspectRatio !== "auto";
  const resolvedRatio = isFixedAspect ? p.aspectRatio.replace("/", " / ") : undefined;

  // Sizing resolution to guarantee object-fit (contain, cover, fill) functions cleanly in all modes
  const containerHeight = isFixedAspect
    ? undefined
    : p.maxHeight
      ? p.maxHeight
      : p.objectFit === "contain" || p.objectFit === "fill"
        ? "450px"
        : undefined;

  const imageHeight = isFixedAspect
    ? "100%"
    : containerHeight || "auto";

  // Object Fit class
  const getObjectFitClass = (fit: ImageProps["objectFit"]) => {
    switch (fit) {
      case "contain":
        return "object-contain";
      case "fill":
        return "object-fill";
      case "cover":
      default:
        return "object-cover";
    }
  };

  // Width mode class
  const getWidthModeClass = (mode: ImageProps["widthMode"]) => {
    switch (mode) {
      case "wide":
        return "w-full max-w-[1140px] mx-auto px-4";
      case "full":
        return "w-full max-w-full";
      case "regular":
      default:
        return "w-full max-w-[840px] mx-auto px-4";
    }
  };

  // Corner radius
  const getRadiusCss = (radius?: string): string => {
    if (!radius) return "8px";
    if (radius === "0px" || radius === "rounded-none") return "0px";
    if (radius === "4px" || radius === "rounded-sm") return "4px";
    if (radius === "8px" || radius === "rounded-md") return "8px";
    if (radius === "16px" || radius === "rounded-xl") return "16px";
    if (radius === "9999px" || radius === "rounded-full") return "9999px";
    return radius;
  };

  const getRadiusClass = (radius?: string) => {
    if (!radius) return "rounded-md";
    if (radius === "0px" || radius === "rounded-none") return "rounded-none";
    if (radius === "4px" || radius === "rounded-sm") return "rounded-sm";
    if (radius === "8px" || radius === "rounded-md") return "rounded-md";
    if (radius === "16px" || radius === "rounded-xl") return "rounded-xl";
    if (radius === "9999px" || radius === "rounded-full") return "rounded-full";
    return radius;
  };

  const getDynamicTagLabel = () => {
    switch (p.dynamicSource) {
      case "feature_image":
        return "{{feature_image}}";
      case "site_cover":
        return "{{@site.cover_image}}";
      case "site_logo":
        return "{{@site.logo}}";
      case "author_profile":
        return "{{author.profile_image}}";
      case "tag_feature":
        return "{{tag.feature_image}}";
      default:
        return "{{feature_image}}";
    }
  };

  const radiusClass = getRadiusClass(p.borderRadius);
  const radiusCss = getRadiusCss(p.borderRadius);
  const fitClass = getObjectFitClass(p.objectFit);

  return (
    <div className={`relative group/image w-full py-4 ${getWidthModeClass(p.widthMode)}`}>
      {/* Dynamic Source Indicator */}
      {isDynamic && isSelected && (
        <div className="mb-2.5 flex justify-center">
          <div className="flex items-center gap-1 text-[10px] font-mono text-blue-600 bg-blue-50/90 px-2.5 py-0.5 rounded border border-blue-200/70 w-fit select-none shadow-xs">
            <Sparkles size={11} />
            <span>Dynamic: {getDynamicTagLabel()}</span>
          </div>
        </div>
      )}

      {/* Link indicator */}
      {!isDynamic && p.linkUrl && isSelected && (
        <div className="mb-2.5 flex justify-center">
          <div className="flex items-center gap-1 text-[10px] font-mono text-brand-body bg-brand-canvas-soft px-2.5 py-0.5 rounded border border-brand-hairline w-fit select-none">
            <ExternalLink size={10} />
            <span className="truncate max-w-[200px]">Link: {p.linkUrl}</span>
          </div>
        </div>
      )}

      {/* Image Element or Placeholder */}
      <figure className="w-full m-0 block">
        {displayUrl ? (
          <div
            className={`w-full overflow-hidden border border-brand-hairline/60 bg-brand-canvas-soft ${radiusClass} flex items-center justify-center`}
            style={{
              width: "100%",
              borderRadius: radiusCss,
              ...(isFixedAspect ? { aspectRatio: resolvedRatio } : {}),
              ...(containerHeight ? { height: containerHeight, maxHeight: p.maxHeight || undefined } : {}),
            }}
          >
            <img
              src={displayUrl}
              alt={p.alt || (isDynamic ? "Dynamic Ghost Image" : "Image")}
              className={`w-full block ${fitClass} ${radiusClass} transition-transform duration-300`}
              style={{
                width: "100%",
                height: imageHeight,
                maxHeight: p.maxHeight || undefined,
                objectFit: p.objectFit || "cover",
                borderRadius: radiusCss,
              }}
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className={`w-full flex flex-col items-center justify-center gap-2.5 bg-brand-canvas-soft border-2 border-dashed border-brand-hairline ${radiusClass} text-brand-mute select-none`}
            style={{
              width: "100%",
              borderRadius: radiusCss,
              ...(isFixedAspect ? { aspectRatio: resolvedRatio } : { minHeight: "180px", padding: "3.5rem 1rem" }),
              ...(p.maxHeight ? { maxHeight: p.maxHeight } : {}),
            }}
          >
            <ImageIcon size={36} className="opacity-40" />
            <span className="text-xs font-semibold text-brand-ink">No image URL configured</span>
            <span className="text-[11px] text-brand-mute">Upload an image or enter a URL in the sidebar</span>
          </div>
        )}

        {/* Caption */}
        {p.caption && (
          <figcaption className="text-center text-xs text-brand-body/80 mt-2.5 px-4 italic font-sans">
            {p.caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}