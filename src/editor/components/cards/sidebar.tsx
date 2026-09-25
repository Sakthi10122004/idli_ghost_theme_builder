import React from "react";
import { BuilderBlock } from "@/types/theme";
import { resolveCardsProps, CardItem, CardsProps } from "./schema";
import { RepeatableList } from "../shared/RepeatableList";
import { BackgroundControls } from "../shared/BackgroundControls";

export const SidebarElement = ({
  block,
  onChangeProps,
  onChangeStyles,
}: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, unknown>) => void;
  onChangeStyles?: (styles: Record<string, unknown>) => void;
}) => {
  const p = resolveCardsProps(block.props);
  const items: CardItem[] = p.items || [];

  const updateProp = <K extends keyof CardsProps>(key: K, value: CardsProps[K]) => {
    onChangeProps({ [key]: value });
  };

  const renderCardItem = (card: CardItem, update: (patch: Partial<CardItem>) => void) => (
    <div className="flex flex-col gap-2 w-full text-xs">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500">Title</label>
        <input
          type="text"
          value={card.title}
          onChange={(e) => update({ title: e.target.value })}
          className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-primary"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500">Description</label>
        <textarea
          rows={2}
          value={card.description}
          onChange={(e) => update({ description: e.target.value })}
          className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-primary resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Tag / Eyebrow</label>
          <input
            type="text"
            value={card.tag || ""}
            onChange={(e) => update({ tag: e.target.value })}
            placeholder="e.g. Feature"
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-primary"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Image URL</label>
          <input
            type="text"
            value={card.imageUrl || ""}
            onChange={(e) => update({ imageUrl: e.target.value })}
            placeholder="https://..."
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Link Label</label>
          <input
            type="text"
            value={card.linkText || ""}
            onChange={(e) => update({ linkText: e.target.value })}
            placeholder="Learn more"
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-primary"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500">Link URL</label>
          <input
            type="text"
            value={card.linkUrl || ""}
            onChange={(e) => update({ linkUrl: e.target.value })}
            placeholder="#"
            className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-brand-primary"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700">Section Heading</label>
        <input
          type="text"
          value={p.heading || ""}
          onChange={(e) => updateProp("heading", e.target.value)}
          placeholder="Section heading"
          className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700">Section Subheading</label>
        <textarea
          rows={2}
          value={p.subheading || ""}
          onChange={(e) => updateProp("subheading", e.target.value)}
          placeholder="Section subheading"
          className="border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-primary resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700">Columns</label>
        <div className="flex bg-gray-100 p-0.5 rounded-md border border-gray-200/50">
          {[2, 3, 4].map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => updateProp("columns", cols)}
              className={`flex-1 py-1 text-[11px] font-medium rounded-sm transition-all ${
                (p.columns || 3) === cols
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cols} Cols
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-gray-700">Card Style</label>
        <select
          value={p.cardStyle || "bordered"}
          onChange={(e) => updateProp("cardStyle", e.target.value as CardsProps["cardStyle"])}
          className="border border-gray-200 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-brand-primary"
        >
          <option value="bordered">Bordered</option>
          <option value="soft">Soft Canvas</option>
          <option value="elevated">Elevated Shadow</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      <BackgroundControls
        styles={block.styles}
        appearance={{ backgroundColor: (block.styles?.backgroundColor as string) || "transparent" }}
        onChangeStyles={(s) => onChangeStyles?.(s)}
        updateAppearance={(_, v) => onChangeStyles?.({ backgroundColor: v })}
      />

      <div className="border-t border-gray-100 pt-3">
        <label className="text-[11px] font-semibold text-gray-700 block mb-2">Cards List</label>
        <RepeatableList
          items={items}
          onChange={(updated) => updateProp("items", updated)}
          renderItem={renderCardItem}
          newItem={() => ({
            id: `card-${Date.now()}`,
            title: "New Feature",
            description: "Describe this feature or offer to your readers.",
            tag: "Feature",
            linkText: "Learn more",
            linkUrl: "#",
          })}
          addLabel="Add Card"
        />
      </div>
    </div>
  );
};
