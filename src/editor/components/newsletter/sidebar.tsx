import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  const bgType = block.styles?.backgroundType || "solid";

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Newsletter Title</label>
        <input
          type="text"
          value={block.props.title || ""}
          onChange={(e) => onChangeProps({ title: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Button Label</label>
        <input
          type="text"
          value={block.props.buttonLabel || ""}
          onChange={(e) => onChangeProps({ buttonLabel: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Input Placeholder</label>
        <input
          type="text"
          value={block.props.placeholder || ""}
          onChange={(e) => onChangeProps({ placeholder: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        />
      </div>

      <div className="my-2 border-t border-brand-hairline"></div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Layout</label>
        <select
          value={block.styles?.layout || "right"}
          onChange={(e) => onChangeStyles({ layout: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="right">Form on Right</option>
          <option value="left">Form on Left</option>
          <option value="below">Form Below</option>
          <option value="above">Form Above</option>
          <option value="center">Stacked Centered</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Background Type</label>
        <select
          value={bgType}
          onChange={(e) => onChangeStyles({ backgroundType: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
        >
          <option value="solid">Solid Color</option>
          <option value="linear">Linear Gradient</option>
          <option value="radial">Radial Gradient</option>
          <option value="mesh">Mesh Gradient</option>
          <option value="pattern">Pattern</option>
          <option value="image">Image URL</option>
        </select>
      </div>

      {bgType === "solid" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Background Color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={block.styles?.backgroundColor || "#fafafa"}
              onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
              className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="text"
              value={block.styles?.backgroundColor || "#fafafa"}
              onChange={(e) => onChangeStyles({ backgroundColor: e.target.value })}
              className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
        </div>
      )}

      {bgType === "linear" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.gradientColor1 || "#000000"}
                onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="color"
                value={block.styles?.gradientColor2 || "#333333"}
                onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Angle (deg)</label>
              <span className="text-[10px] text-brand-muted">{block.styles?.gradientAngle || 90}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={block.styles?.gradientAngle || 90}
              onChange={(e) => onChangeStyles({ gradientAngle: parseInt(e.target.value) })}
              className="w-full accent-brand-primary"
            />
          </div>
        </>
      )}

      {bgType === "radial" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Gradient Colors</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.styles?.gradientColor1 || "#000000"}
                onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="color"
                value={block.styles?.gradientColor2 || "#333333"}
                onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })}
                className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Position</label>
            <select
              value={block.styles?.gradientPosition || "center"}
              onChange={(e) => onChangeStyles({ gradientPosition: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="center">Center</option>
              <option value="top left">Top Left</option>
              <option value="top right">Top Right</option>
              <option value="bottom left">Bottom Left</option>
              <option value="bottom right">Bottom Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </>
      )}

      {bgType === "mesh" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Mesh Colors</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={block.styles?.meshColor1 || "#ff0080"}
              onChange={(e) => onChangeStyles({ meshColor1: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="color"
              value={block.styles?.meshColor2 || "#7928ca"}
              onChange={(e) => onChangeStyles({ meshColor2: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="color"
              value={block.styles?.meshColor3 || "#0070f3"}
              onChange={(e) => onChangeStyles({ meshColor3: e.target.value })}
              className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
          </div>
        </div>
      )}

      {bgType === "pattern" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Pattern Type</label>
            <select
              value={block.styles?.patternType || "dots"}
              onChange={(e) => onChangeStyles({ patternType: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            >
              <option value="dots">Dots</option>
              <option value="lines">Diagonal Lines</option>
              <option value="noise">Noise / Grain</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Pattern Base Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={block.styles?.patternColor || "#000000"}
                onChange={(e) => onChangeStyles({ patternColor: e.target.value })}
                className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
              <input
                type="text"
                value={block.styles?.patternColor || "#000000"}
                onChange={(e) => onChangeStyles({ patternColor: e.target.value })}
                className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              />
            </div>
            <p className="text-[10px] text-brand-muted">Controls the color of dots/lines/noise over the default background.</p>
          </div>
        </>
      )}

      {bgType === "image" && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={block.styles?.bgImageUrl || ""}
              onChange={(e) => onChangeStyles({ bgImageUrl: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-sans font-semibold text-brand-body">Overlay Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={block.styles?.bgOverlayColor || "#000000"}
                onChange={(e) => onChangeStyles({ bgOverlayColor: e.target.value })}
                className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-sans font-semibold text-brand-body">Overlay Opacity</label>
              <span className="text-[10px] text-brand-muted">
                {Math.round((block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={block.styles?.bgOverlayOpacity !== undefined ? block.styles.bgOverlayOpacity : 0.5}
              onChange={(e) => onChangeStyles({ bgOverlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-brand-primary"
            />
          </div>
        </>
      )}
    </>
  );
};