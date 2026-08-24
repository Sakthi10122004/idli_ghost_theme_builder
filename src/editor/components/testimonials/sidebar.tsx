import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  const items = block.props.items || [];
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-sans font-semibold text-brand-body">Testimonials</span>
      {items.map((item: any, idx: number) => (
        <div key={idx} className="border border-brand-hairline p-2 rounded-sm flex flex-col gap-2 bg-brand-canvas-soft">
          <textarea
            placeholder="Quote"
            rows={2}
            value={item.quote || ""}
            onChange={(e) => {
              const nextItems = [...items];
              nextItems[idx] = { ...nextItems[idx], quote: e.target.value };
              onChangeProps({ items: nextItems });
            }}
            className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans resize-none"
          />
          <input
            type="text"
            placeholder="Author"
            value={item.author || ""}
            onChange={(e) => {
              const nextItems = [...items];
              nextItems[idx] = { ...nextItems[idx], author: e.target.value };
              onChangeProps({ items: nextItems });
            }}
            className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
          />
          <input
            type="text"
            placeholder="Title / Company"
            value={item.title || ""}
            onChange={(e) => {
              const nextItems = [...items];
              nextItems[idx] = { ...nextItems[idx], title: e.target.value };
              onChangeProps({ items: nextItems });
            }}
            className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
          />
        </div>
      ))}
      <button
        onClick={() => {
          const nextItems = [...items, { quote: "Excellent output structures.", author: "Developer", title: "Theme Builder" }];
          onChangeProps({ items: nextItems });
        }}
        className="w-full py-1 text-[11px] font-mono border border-dashed border-brand-hairline hover:bg-brand-canvas-soft"
      >
        + Add Testimonial
      </button>
    </div>
  );
};