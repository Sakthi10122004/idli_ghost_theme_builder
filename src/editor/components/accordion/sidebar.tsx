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
      <span className="text-[11px] font-sans font-semibold text-brand-body">FAQ Items</span>
      {items.map((item: any, idx: number) => (
        <div key={idx} className="border border-brand-hairline p-2 rounded-sm flex flex-col gap-2 bg-brand-canvas-soft">
          <input
            type="text"
            placeholder="Question"
            value={item.question || ""}
            onChange={(e) => {
              const nextItems = [...items];
              nextItems[idx] = { ...nextItems[idx], question: e.target.value };
              onChangeProps({ items: nextItems });
            }}
            className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
          />
          <textarea
            placeholder="Answer"
            rows={2}
            value={item.answer || ""}
            onChange={(e) => {
              const nextItems = [...items];
              nextItems[idx] = { ...nextItems[idx], answer: e.target.value };
              onChangeProps({ items: nextItems });
            }}
            className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans resize-none"
          />
        </div>
      ))}
      <button
        onClick={() => {
          const nextItems = [...items, { question: "New Question?", answer: "New Answer." }];
          onChangeProps({ items: nextItems });
        }}
        className="w-full py-1 text-[11px] font-mono border border-dashed border-brand-hairline hover:bg-brand-canvas-soft"
      >
        + Add FAQ Item
      </button>
    </div>
  );
};