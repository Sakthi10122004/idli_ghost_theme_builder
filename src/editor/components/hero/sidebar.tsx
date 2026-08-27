import React from "react";
import { BuilderBlock } from "@/types/theme";

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-4.5 flex items-center shrink-0 rounded-full p-0.5 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
  >
    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-3.5' : 'translate-x-0'}`} />
  </button>
);

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  const p = block.props || {};

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5 border-b border-gray-100 pb-4">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Use Dynamic Ghost Data</label>
          <Switch
            checked={p.useSiteData ?? false}
            onChange={(c) => onChangeProps({ useSiteData: c })}
          />
        </div>
        <span className="text-[10px] text-brand-mute">
          When enabled, the hero will automatically use your Ghost Site Title, Description, and Cover Image.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Eyebrow Text</label>
        <input
          type="text"
          value={p.eyebrowText || ""}
          onChange={(e) => onChangeProps({ eyebrowText: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="Small label above the title"
        />
      </div>

      <div className={`flex flex-col gap-1.5 ${p.useSiteData ? 'opacity-50 pointer-events-none' : ''}`}>
        <label className="text-[11px] font-sans font-semibold text-brand-body">Hero Title</label>
        <input
          type="text"
          value={p.useSiteData ? "{{@site.title}}" : (p.title || "")}
          onChange={(e) => onChangeProps({ title: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          disabled={p.useSiteData}
        />
      </div>

      <div className={`flex flex-col gap-1.5 ${p.useSiteData ? 'opacity-50 pointer-events-none' : ''}`}>
        <label className="text-[11px] font-sans font-semibold text-brand-body">Subtitle Text</label>
        <textarea
          rows={3}
          value={p.useSiteData ? "{{@site.description}}" : (p.subtitle || "")}
          onChange={(e) => onChangeProps({ subtitle: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none"
          disabled={p.useSiteData}
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <label className="text-[11px] font-sans font-semibold text-brand-body">Primary Button</label>
        <input
          type="text"
          value={p.buttonLabel || ""}
          onChange={(e) => onChangeProps({ buttonLabel: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="Button label"
        />
        <input
          type="text"
          value={p.buttonUrl || ""}
          onChange={(e) => onChangeProps({ buttonUrl: e.target.value })}
          className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          placeholder="https://example.com"
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Secondary Button</label>
          <Switch
            checked={p.showSecondaryButton ?? true}
            onChange={(c) => onChangeProps({ showSecondaryButton: c })}
          />
        </div>
        {(p.showSecondaryButton ?? true) && (
          <>
            <input
              type="text"
              value={p.secondaryButtonLabel || ""}
              onChange={(e) => onChangeProps({ secondaryButtonLabel: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              placeholder="Button label"
            />
            <input
              type="text"
              value={p.secondaryButtonUrl || ""}
              onChange={(e) => onChangeProps({ secondaryButtonUrl: e.target.value })}
              className="w-full px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
              placeholder="https://example.com"
            />
          </>
        )}
      </div>
    </div>
  );
};