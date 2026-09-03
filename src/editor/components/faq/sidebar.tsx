import React from "react";
import { BuilderBlock } from "@/types/theme";
import { FAQProps, defaultProps } from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
import { BackgroundControls } from "../shared/BackgroundControls";

const Switch = ({ checked, onChange }: { checked: boolean, onChange: (c: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-8 h-[1.125rem] flex items-center shrink-0 rounded-full p-0.5 transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
  >
    <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-3.5' : 'translate-x-0'}`} />
  </button>
);

const SegmentedControl = ({ options, value, onChange }: { 
  options: { label: React.ReactNode; value: string; disabled?: boolean }[]; 
  value: string; 
  onChange: (v: string) => void 
}) => (
  <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200/50">
    {options.map(opt => (
      <button
        key={opt.value}
        type="button"
        disabled={opt.disabled}
        onClick={() => onChange(opt.value)}
        className={`flex-1 flex justify-center items-center py-1.5 text-[11px] font-medium rounded-sm transition-all ${
          opt.disabled
            ? 'text-gray-300 cursor-not-allowed'
            : value === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles?: (styles: Record<string, any>) => void;
}) => {
  const p = { ...defaultProps, ...block.props } as FAQProps;
  const general = p.general;
  const items = p.items || [];

  const updateGeneral = (patch: Partial<FAQProps['general']>) => {
    onChangeProps({ general: { ...general, ...patch } });
  };

  const renderFaqItem = (item: any, update: (patch: any) => void) => (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[10px] font-semibold text-gray-500">Question</label>
        <input 
          type="text" 
          value={item.question} 
          onChange={(e) => update({ question: e.target.value })}
          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
          placeholder="How does this work?"
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
        <label className="text-[10px] font-semibold text-gray-500">Answer</label>
        <textarea 
          value={item.answer} 
          onChange={(e) => update({ answer: e.target.value })}
          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none min-h-[4rem] resize-y"
          placeholder="Detailed answer..."
        />
      </div>
      {general.layoutStyle === "categorized" && (
        <div className="flex flex-col gap-1 w-full">
          <label className="text-[10px] font-semibold text-gray-500">Category</label>
          <input 
            type="text" 
            value={item.category || ""} 
            onChange={(e) => update({ category: e.target.value })}
            className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            placeholder="e.g. Billing"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* General Settings */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1 border-b border-brand-hairline pb-1">General</span>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Heading</label>
          <input
            type="text"
            value={general.heading || ""}
            onChange={(e) => updateGeneral({ heading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-1">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Subheading</label>
          <textarea
            value={general.subheading || ""}
            onChange={(e) => updateGeneral({ subheading: e.target.value })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft resize-none h-16"
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Layout Style</label>
          <SegmentedControl
            options={[
              { label: "Accordion", value: "accordion" },
              { label: "2 Column", value: "two-column" },
              { label: "Categorized", value: "categorized" }
            ]}
            value={general.layoutStyle}
            onChange={(v: any) => updateGeneral({ layoutStyle: v })}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="text-[11px] font-sans font-semibold text-brand-body">Allow Multiple Open</label>
          <Switch checked={general.allowMultipleOpen} onChange={(c) => updateGeneral({ allowMultipleOpen: c })} />
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Questions</span>
        <RepeatableList
          items={items}
          onChange={(newItems) => onChangeProps({ items: newItems })}
          renderItem={renderFaqItem}
          newItem={() => ({ id: Math.random().toString(36).substring(7), question: "New Question?", answer: "New Answer.", category: "General" })}
          addLabel="Add Question"
        />
      </div>

      {/* Background Controls */}
      <BackgroundControls 
        styles={block.styles || {}} 
        appearance={p.appearance || {}} 
        onChangeStyles={onChangeStyles || (() => {})} 
        updateAppearance={(key, val) => onChangeProps({ appearance: { ...p.appearance, [key]: val } })}
      />

      {/* Spacing */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Spacing</span>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Top Padding</label>
            <input 
              type="text" 
              value={p.spacing.paddingTop || ""} 
              onChange={(e) => onChangeProps({ spacing: { ...p.spacing, paddingTop: e.target.value } })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[10px] font-semibold text-gray-500">Bottom Padding</label>
            <input 
              type="text" 
              value={p.spacing.paddingBottom || ""} 
              onChange={(e) => onChangeProps({ spacing: { ...p.spacing, paddingBottom: e.target.value } })}
              className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div className="flex flex-col gap-2 border-t border-brand-hairline pt-3 mt-1">
        <span className="text-[10px] uppercase font-bold text-brand-ink mb-1">Advanced</span>
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-sans font-semibold text-brand-body">HTML Anchor</label>
          <input
            type="text"
            value={p.advanced?.htmlAnchor || ""}
            onChange={(e) => onChangeProps({ advanced: { ...p.advanced, htmlAnchor: e.target.value } })}
            className="w-full px-2 py-1.5 border border-brand-hairline rounded-sm text-xs font-sans focus:outline-none bg-brand-canvas-soft"
            placeholder="e.g. faq"
          />
        </div>
      </div>
    </div>
  );
};
