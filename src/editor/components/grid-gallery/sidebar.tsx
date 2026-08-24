import React from "react";
import { BuilderBlock } from "@/types/theme";

export const SidebarElement = ({ block, onChangeProps, onChangeStyles }: {
  block: BuilderBlock;
  onChangeProps: (props: Record<string, any>) => void;
  onChangeStyles: (styles: Record<string, any>) => void;
}) => {
  const urls = block.props.urls || [];
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-sans font-semibold text-brand-body">Gallery Images</span>
      {urls.map((url: string, idx: number) => (
        <input
          key={idx}
          type="text"
          value={url}
          onChange={(e) => {
            const nextUrls = [...urls];
            nextUrls[idx] = e.target.value;
            onChangeProps({ urls: nextUrls });
          }}
          className="w-full px-2 py-1 border border-brand-hairline rounded-sm text-xs font-sans"
        />
      ))}
      <button
        onClick={() => {
          const nextUrls = [...urls, "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80"];
          onChangeProps({ urls: nextUrls });
        }}
        className="w-full py-1 text-[11px] font-mono border border-dashed border-brand-hairline hover:bg-brand-canvas-soft"
      >
        + Add Gallery Image
      </button>
    </div>
  );
};