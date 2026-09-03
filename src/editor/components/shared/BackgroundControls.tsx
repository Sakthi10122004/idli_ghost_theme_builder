import React from "react";

interface BackgroundStyles {
  backgroundType?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientAngle?: number;
  gradientPosition?: string;
  meshColor1?: string;
  meshColor2?: string;
  meshColor3?: string;
  patternType?: string;
  patternColor?: string;
  bgImageUrl?: string;
  bgOverlayColor?: string;
  bgOverlayOpacity?: number;
}

interface BackgroundControlsProps {
  styles: any;
  appearance: { backgroundColor?: string };
  onChangeStyles: (styles: Partial<BackgroundStyles>) => void;
  updateAppearance: (key: string, value: any) => void;
}

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-sans font-semibold text-brand-body">{children}</label>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[12px] font-bold text-gray-900 tracking-tight">{children}</span>
);

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({ styles, appearance, onChangeStyles, updateAppearance }) => {
  return (
    <>
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-5">
        <SectionLabel>Background</SectionLabel>
        
        <FieldLabel>Background Type</FieldLabel>
        <select
          value={styles?.backgroundType || "solid"}
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

      {(styles?.backgroundType || "solid") === "solid" && (
        <div className="flex flex-col gap-1.5 mt-2">
          <FieldLabel>Background Color</FieldLabel>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={appearance.backgroundColor || "#ffffff"}
              onChange={(e) => updateAppearance("backgroundColor", e.target.value)}
              className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0"
            />
            <input
              type="text"
              value={appearance.backgroundColor || "#ffffff"}
              onChange={(e) => updateAppearance("backgroundColor", e.target.value)}
              className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            />
          </div>
        </div>
      )}

      {styles?.backgroundType === "linear" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Gradient Colors</FieldLabel>
            <div className="flex gap-2">
              <input type="color" value={styles?.gradientColor1 || "#000000"} onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="color" value={styles?.gradientColor2 || "#333333"} onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <FieldLabel>Angle (deg)</FieldLabel>
              <span className="text-[10px] text-brand-mute">{styles?.gradientAngle || 90}°</span>
            </div>
            <input type="range" min="0" max="360" value={styles?.gradientAngle || 90} onChange={(e) => onChangeStyles({ gradientAngle: parseInt(e.target.value) })} className="w-full accent-brand-primary" />
          </div>
        </div>
      )}

      {styles?.backgroundType === "radial" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Gradient Colors</FieldLabel>
            <div className="flex gap-2">
              <input type="color" value={styles?.gradientColor1 || "#000000"} onChange={(e) => onChangeStyles({ gradientColor1: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="color" value={styles?.gradientColor2 || "#333333"} onChange={(e) => onChangeStyles({ gradientColor2: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Position</FieldLabel>
            <select value={styles?.gradientPosition || "center"} onChange={(e) => onChangeStyles({ gradientPosition: e.target.value })} className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft">
              <option value="center">Center</option>
              <option value="top left">Top Left</option>
              <option value="top right">Top Right</option>
              <option value="bottom left">Bottom Left</option>
              <option value="bottom right">Bottom Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
      )}

      {styles?.backgroundType === "mesh" && (
        <div className="flex flex-col gap-1.5 mt-2">
          <FieldLabel>Mesh Colors</FieldLabel>
          <div className="flex gap-2">
            <input type="color" value={styles?.meshColor1 || "#ff0080"} onChange={(e) => onChangeStyles({ meshColor1: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            <input type="color" value={styles?.meshColor2 || "#7928ca"} onChange={(e) => onChangeStyles({ meshColor2: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
            <input type="color" value={styles?.meshColor3 || "#0070f3"} onChange={(e) => onChangeStyles({ meshColor3: e.target.value })} className="w-8 h-8 rounded-sm cursor-pointer border border-brand-hairline p-0" />
          </div>
        </div>
      )}

      {styles?.backgroundType === "pattern" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Pattern Type</FieldLabel>
            <select value={styles?.patternType || "dots"} onChange={(e) => onChangeStyles({ patternType: e.target.value })} className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft">
              <option value="dots">Dots</option>
              <option value="lines">Diagonal Lines</option>
              <option value="noise">Noise / Grain</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Pattern Base Color</FieldLabel>
            <div className="flex gap-2 items-center">
              <input type="color" value={styles?.patternColor || "#000000"} onChange={(e) => onChangeStyles({ patternColor: e.target.value })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
              <input type="text" value={styles?.patternColor || "#000000"} onChange={(e) => onChangeStyles({ patternColor: e.target.value })} className="flex-1 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft" />
            </div>
          </div>
        </div>
      )}

      {styles?.backgroundType === "image" && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Image URL</FieldLabel>
            <input type="text" value={styles?.bgImageUrl || ""} onChange={(e) => onChangeStyles({ bgImageUrl: e.target.value })} className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft" placeholder="https://example.com/image.jpg" />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Overlay Color</FieldLabel>
            <input type="color" value={styles?.bgOverlayColor || "#000000"} onChange={(e) => onChangeStyles({ bgOverlayColor: e.target.value })} className="w-6 h-6 rounded-sm cursor-pointer border border-brand-hairline p-0" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <FieldLabel>Overlay Opacity</FieldLabel>
              <span className="text-[10px] text-brand-mute">{Math.round((styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5) * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={styles?.bgOverlayOpacity !== undefined ? styles.bgOverlayOpacity : 0.5} onChange={(e) => onChangeStyles({ bgOverlayOpacity: parseFloat(e.target.value) })} className="w-full accent-brand-primary" />
          </div>
        </div>
      )}
    </>
  );
};
