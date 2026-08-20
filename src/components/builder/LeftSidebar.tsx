"use client";
import React, { useState } from "react";

import { useEditorStore } from "@/store/editorStore";
import { useDraggable } from "@dnd-kit/core";
import { 
  Heading, 
  Type, 
  Square, 
  Columns as ColumnsIcon, 
  Menu, 
  Trash2,
  Layers,
  Plus,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Mail,
  Grid,
  Image as ImageIcon,
  Minus,
  Move,
  User,
  Tag,
  HelpCircle,
  MessageSquare,
  DollarSign,
  Image as GalleryIcon,
  Share2,
  Play
} from "lucide-react";

interface BlockTemplate {
  type: string;
  label: string;
  category: "Layout" | "Content" | "Ghost Core";
  icon: any;
}

function DraggableBlockButton({ b }: { b: BlockTemplate }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${b.type}`,
  });

  const Icon = b.icon;

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 99,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center p-3 border border-brand-hairline rounded-sm hover:border-brand-hairline-strong hover:bg-brand-canvas-soft transition-all text-brand-body hover:text-brand-ink group cursor-grab active:cursor-grabbing shadow-level-2 bg-white touch-none select-none ${
        isDragging ? "opacity-50 ring-2 ring-brand-primary" : ""
      }`}
    >
      <Icon size={16} className="mb-1.5 text-brand-mute group-hover:text-brand-ink" />
      <span className="text-[11px] font-medium">{b.label}</span>
    </div>
  );
}

export default function LeftSidebar() {
  const { document: themeDoc, activePage, selectBlock, selectedBlockId, deleteBlock } = useEditorStore();

  const blocksList: BlockTemplate[] = [
    { type: "section", label: "Section", category: "Layout", icon: Square },
    { type: "container", label: "Container", category: "Layout", icon: Square },
    { type: "columns", label: "Columns Row", category: "Layout", icon: ColumnsIcon },
    { type: "divider", label: "Divider Line", category: "Layout", icon: Minus },
    { type: "spacer", label: "Spacer Block", category: "Layout", icon: Move },
    
    { type: "heading", label: "Heading", category: "Content", icon: Heading },
    { type: "text", label: "Text Block", category: "Content", icon: Type },
    { type: "button", label: "Button", category: "Content", icon: Square },
    { type: "image", label: "Image Block", category: "Content", icon: ImageIcon },
    { type: "hero", label: "Hero Component", category: "Content", icon: Sparkles },
    { type: "newsletter", label: "Newsletter", category: "Content", icon: Mail },
    { type: "accordion", label: "Accordion", category: "Content", icon: HelpCircle },
    { type: "testimonials", label: "Testimonials", category: "Content", icon: MessageSquare },
    { type: "pricing-table", label: "Pricing Table", category: "Content", icon: DollarSign },
    { type: "grid-gallery", label: "Grid Gallery", category: "Content", icon: GalleryIcon },
    { type: "social-links", label: "Social Links", category: "Content", icon: Share2 },
    { type: "video-player", label: "Video Player", category: "Content", icon: Play },
    
    { type: "header", label: "Header", category: "Ghost Core", icon: Menu },
    { type: "post-grid", label: "Post Grid", category: "Ghost Core", icon: ColumnsIcon },
    { type: "featured-posts", label: "Featured Posts", category: "Ghost Core", icon: Grid },
    { type: "author-profile", label: "Author Profile", category: "Ghost Core", icon: User },
    { type: "tag-archive", label: "Tag Archive", category: "Ghost Core", icon: Tag },
    { type: "footer", label: "Footer", category: "Ghost Core", icon: Menu },
  ];

  const pageSections = themeDoc.pages[activePage]?.sections || [];
  const categories = ["Layout", "Content", "Ghost Core"] as const;

  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});
  const [isLayersExpanded, setIsLayersExpanded] = useState<boolean>(false);

  const toggleExpand = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const renderLayerItem = (blockId: string, depth = 0) => {
    const block = themeDoc.blocks[blockId];
    if (!block) return null;

    const isSelected = selectedBlockId === blockId;
    const hasChildren = block.childrenIds && block.childrenIds.length > 0;
    const isExpanded = !!expandedBlocks[blockId];

    return (
      <div key={blockId} className="w-full">
        <div 
          onClick={() => selectBlock(blockId)}
          style={{ paddingLeft: `${depth * 12 + 4}px` }}
          className={`group flex items-center justify-between py-1.5 pr-2 text-xs cursor-pointer rounded-sm transition-all ${
            isSelected 
              ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold border-l-2 border-brand-primary" 
              : "text-brand-body hover:text-brand-ink hover:bg-brand-canvas-soft"
          }`}
        >
          <span className="truncate flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(blockId, e)}
                className="p-0.5 hover:bg-brand-canvas-soft-2 rounded-xs text-brand-mute hover:text-brand-ink transition-all"
              >
                {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
            ) : (
              <span className="w-4 h-4 flex items-center justify-center shrink-0">
                <span className="w-1 h-1 bg-brand-mute/40 rounded-full"></span>
              </span>
            )}
            <span className="font-mono text-[9px] text-brand-mute uppercase shrink-0">[${block.type}]</span>
            <span className="truncate">{block.props.text || block.props.label || block.props.title || block.type}</span>
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(blockId);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 text-brand-mute hover:text-brand-error transition-all shrink-0"
            title="Delete Block"
          >
            <Trash2 size={12} />
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {block.childrenIds!.map(cid => renderLayerItem(cid, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-[280px] border-r border-brand-hairline bg-white flex flex-col shrink-0 select-none shadow-level-1">
      {/* Block List Panel */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 border-b border-brand-hairline">
        <h3 className="font-mono text-[10px] uppercase tracking-wider text-brand-mute flex items-center gap-1.5">
          <Plus size={10} />
          <span>Add Components</span>
        </h3>

        {categories.map((cat) => (
          <div key={cat} className="flex flex-col gap-2">
            <span className="text-[11px] font-sans font-semibold text-brand-body">{cat}</span>
            <div className="grid grid-cols-2 gap-2">
              {blocksList
                .filter((b) => b.category === cat)
                .map((b) => (
                  <DraggableBlockButton key={b.type} b={b} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Layers Panel */}
      <div className={`flex flex-col p-4 overflow-y-auto border-t border-brand-hairline transition-all duration-300 ${
        isLayersExpanded ? "h-[320px]" : "h-[48px] overflow-hidden"
      }`}>
        <h3 
          onClick={() => setIsLayersExpanded(!isLayersExpanded)}
          className="font-mono text-[10px] uppercase tracking-wider text-brand-mute flex items-center justify-between cursor-pointer hover:text-brand-ink select-none"
        >
          <span className="flex items-center gap-1.5">
            <Layers size={10} />
            <span>Layers Tree</span>
          </span>
          <ChevronDown size={10} className={`transform transition-transform duration-200 ${isLayersExpanded ? "rotate-180" : ""}`} />
        </h3>
        {isLayersExpanded && (
          <div className="flex-1 flex flex-col gap-0.5 mt-3">
            {pageSections.length > 0 ? (
              pageSections.map(sid => renderLayerItem(sid))
            ) : (
              <div className="text-center text-xs text-brand-mute mt-6 font-sans">
                No sections on this page.
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
