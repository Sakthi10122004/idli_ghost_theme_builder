"use client";
import React, { useState } from "react";

import { useEditorStore } from "@/store/editorStore";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ThemeDocument, BuilderBlock } from "@/types/theme";
import { 
  Menu, 
  Trash2,
  Layers,
  Plus,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  GripVertical,
} from "lucide-react";

import { BLOCK_TEMPLATES, BlockTemplate } from "@/editor/components/blockTemplates";

function DraggableBlockButton({
  b,
  onAdd,
}: {
  b: BlockTemplate;
  onAdd: (type: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${b.type}`,
  });

  const Icon = b.icon;

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation();
          onAdd(b.type);
        }
      }}
      className={`flex flex-col items-center justify-center p-3 border rounded-sm transition-all text-brand-body hover:text-brand-ink group cursor-grab active:cursor-grabbing shadow-level-2 bg-white select-none touch-none text-center w-full relative ${
        isDragging
          ? "opacity-30 border-dashed border-brand-primary scale-95"
          : "border-brand-hairline hover:border-brand-hairline-strong hover:bg-brand-canvas-soft hover:shadow-level-3"
      }`}
      title={`Click to put ${b.label} into canvas, or drag to position`}
    >
      <Icon size={16} className="mb-1.5 text-brand-mute group-hover:text-brand-ink transition-transform group-hover:scale-110" />
      <span className="text-[11px] font-medium leading-tight">{b.label}</span>
      <span className="text-[9px] text-brand-link opacity-0 group-hover:opacity-100 transition-opacity mt-1 font-mono flex items-center gap-0.5 pointer-events-none">
        <Plus size={8} /> Click to put
      </span>
    </button>
  );
}

function getBlockLabel(block: BuilderBlock): string {
  if (typeof block.props?.title === "string" && block.props.title.trim()) return block.props.title;
  if (typeof block.props?.label === "string" && block.props.label.trim()) return block.props.label;
  if (typeof block.props?.text === "string" && block.props.text.trim()) return block.props.text;
  return block.type;
}

function GlobalHeaderLayerItem({
  headerId,
  selectedBlockId,
  onSelectBlock,
}: {
  headerId: string;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "layer-global-header" });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelectBlock(headerId)}
      className={`group flex items-center justify-between py-1.5 px-2 text-xs cursor-pointer rounded-sm transition-all ${
        isOver
          ? "bg-purple-100 ring-2 ring-purple-500 font-semibold text-purple-900"
          : selectedBlockId === headerId
          ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold border-l-2 border-brand-primary"
          : "text-brand-body hover:text-brand-ink hover:bg-brand-canvas-soft"
      }`}
    >
      <span className="truncate flex items-center gap-1.5 min-w-0">
        <span className="font-mono text-[9px] text-purple-600 font-bold uppercase shrink-0">[GLOBAL]</span>
        <span className="truncate font-medium">Header</span>
      </span>
    </div>
  );
}

function GlobalFooterLayerItem({
  footerId,
  selectedBlockId,
  onSelectBlock,
}: {
  footerId: string;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "layer-global-footer" });

  return (
    <div
      ref={setNodeRef}
      onClick={() => onSelectBlock(footerId)}
      className={`group flex items-center justify-between py-1.5 px-2 text-xs cursor-pointer rounded-sm transition-all ${
        isOver
          ? "bg-purple-100 ring-2 ring-purple-500 font-semibold text-purple-900"
          : selectedBlockId === footerId
          ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold border-l-2 border-brand-primary"
          : "text-brand-body hover:text-brand-ink hover:bg-brand-canvas-soft"
      }`}
    >
      <span className="truncate flex items-center gap-1.5 min-w-0">
        <span className="font-mono text-[9px] text-purple-600 font-bold uppercase shrink-0">[GLOBAL]</span>
        <span className="truncate font-medium">Footer</span>
      </span>
    </div>
  );
}

function SortableLayerItem({
  blockId,
  depth = 0,
  themeDoc,
  selectedBlockId,
  expandedBlocks,
  onSelectBlock,
  onDeleteBlock,
  onToggleExpand,
}: {
  blockId: string;
  depth?: number;
  themeDoc: ThemeDocument;
  selectedBlockId: string | null;
  expandedBlocks: Record<string, boolean>;
  onSelectBlock: (id: string) => void;
  onDeleteBlock: (id: string) => void;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
}) {
  const block = themeDoc.blocks[blockId];
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `layer-${blockId}` });

  if (!block) return null;

  const isSelected = selectedBlockId === blockId;
  const hasChildren = Boolean(block.childrenIds && block.childrenIds.length > 0);
  const isExpanded = Boolean(expandedBlocks[blockId]);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 50 : undefined,
    position: "relative",
  };

  const label = getBlockLabel(block);

  return (
    <div ref={setNodeRef} style={style} className="w-full touch-none select-none">
      <div
        {...attributes}
        {...listeners}
        onClick={() => onSelectBlock(blockId)}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        className={`group flex items-center justify-between py-1.5 pr-2 text-xs cursor-pointer rounded-sm transition-all ${
          isDragging
            ? "opacity-50 bg-brand-canvas-soft-2 ring-1 ring-brand-primary shadow-xs z-50"
            : isSelected
            ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold border-l-2 border-brand-primary"
            : "text-brand-body hover:text-brand-ink hover:bg-brand-canvas-soft"
        }`}
      >
        <div className="truncate flex items-center gap-1.5 min-w-0 flex-1">
          {/* Visual Drag Handle */}
          <span
            className="text-brand-mute/40 group-hover:text-brand-ink hover:text-brand-primary cursor-grab active:cursor-grabbing p-0.5 -ml-0.5 rounded hover:bg-brand-canvas-soft-2 transition-colors shrink-0"
            title="Drag up or down to reorder"
          >
            <GripVertical size={11} />
          </span>

          {/* Child Expand / Collapse */}
          {hasChildren ? (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(blockId, e);
              }}
              className="p-0.5 hover:bg-brand-canvas-soft-2 rounded-xs text-brand-mute hover:text-brand-ink transition-all shrink-0"
            >
              {isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
            </button>
          ) : (
            <span className="w-3 h-3 flex items-center justify-center shrink-0">
              <span className="w-1 h-1 bg-brand-mute/40 rounded-full"></span>
            </span>
          )}

          <span className="font-mono text-[9px] text-brand-mute uppercase shrink-0 font-medium">
            [${block.type}]
          </span>
          <span className="truncate">{label}</span>
        </div>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBlock(blockId);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-brand-mute hover:text-brand-error transition-all shrink-0 ml-1"
          title="Delete Block"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Children Sortable List */}
      {hasChildren && isExpanded && block.childrenIds && (
        <SortableContext
          items={block.childrenIds.map((cid) => `layer-${cid}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col">
            {block.childrenIds.map((cid) => (
              <SortableLayerItem
                key={cid}
                blockId={cid}
                depth={depth + 1}
                themeDoc={themeDoc}
                selectedBlockId={selectedBlockId}
                expandedBlocks={expandedBlocks}
                onSelectBlock={onSelectBlock}
                onDeleteBlock={onDeleteBlock}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}

export default function LeftSidebar() {
  const { 
    document: themeDoc, 
    activePage, 
    selectBlock, 
    selectedBlockId, 
    deleteBlock,
    insertBlockAt,
    isLeftSidebarOpen,
    toggleLeftSidebar
  } = useEditorStore();

  const handleQuickAddBlock = (blockType: string) => {
    if (blockType === "header" || blockType === "footer") return;

    if (selectedBlockId) {
      const selBlock = themeDoc.blocks[selectedBlockId];

      // 1. If selected block is a layout container, insert directly INSIDE it
      if (
        selBlock &&
        (selBlock.type === "container" || selBlock.type === "columns" || selBlock.type === "section") &&
        !(blockType === "section" && selBlock.type === "section")
      ) {
        insertBlockAt(blockType, selBlock.childrenIds?.length || 0, selectedBlockId);
        return;
      }

      // 2. If selected block is a child inside a container, insert after it inside that container
      for (const pid of Object.keys(themeDoc.blocks)) {
        const parent = themeDoc.blocks[pid];
        if (parent.childrenIds) {
          const childIdx = parent.childrenIds.indexOf(selectedBlockId);
          if (childIdx !== -1) {
            insertBlockAt(blockType, childIdx + 1, pid);
            return;
          }
        }
      }

      // 3. Otherwise if selected block is a root page section, insert after it
      const pageSections = themeDoc.pages[activePage]?.sections || [];
      const selectedIndex = pageSections.indexOf(selectedBlockId);
      if (selectedIndex !== -1) {
        insertBlockAt(blockType, selectedIndex + 1);
        return;
      }
    }

    const pageSections = themeDoc.pages[activePage]?.sections || [];
    insertBlockAt(blockType, pageSections.length);
  };

  const pageSections = themeDoc.pages[activePage]?.sections || [];
  const categories = ["Layout", "Content", "Ghost Core"] as const;

  const [expandedBlocks, setExpandedBlocks] = useState<Record<string, boolean>>({});
  const [isLayersExpanded, setIsLayersExpanded] = useState<boolean>(true);

  const toggleExpand = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const sortableLayerIds = pageSections.map((sid) => `layer-${sid}`);

  if (!isLeftSidebarOpen) {
    return (
      <aside className="w-[48px] border-r border-brand-hairline bg-white flex flex-col items-center py-3 shrink-0 select-none shadow-level-1 gap-4 transition-all duration-200 z-30">
        <button
          onClick={() => toggleLeftSidebar(true)}
          className="p-2 text-brand-mute hover:text-brand-ink hover:bg-brand-canvas-soft rounded-sm transition-colors"
          title="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
        <div className="w-6 h-[1px] bg-brand-hairline" />
        <button
          onClick={() => toggleLeftSidebar(true)}
          className="p-2 text-brand-mute hover:text-brand-ink hover:bg-brand-canvas-soft rounded-sm transition-colors"
          title="Add Components"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => toggleLeftSidebar(true)}
          className="p-2 text-brand-mute hover:text-brand-ink hover:bg-brand-canvas-soft rounded-sm transition-colors"
          title="Layers Tree"
        >
          <Layers size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-[280px] border-r border-brand-hairline bg-white flex flex-col shrink-0 select-none shadow-level-1 transition-all duration-200">
      {/* Block List Panel */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 border-b border-brand-hairline">
        {/* Global Layout (Header / Footer) */}
        <div className="flex flex-col gap-2 pb-3 border-b border-brand-hairline">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans font-semibold text-brand-body flex items-center gap-1.5">
              <span>Global Layout</span>
              <span className="text-[9px] font-mono text-purple-700 bg-purple-50 border border-purple-200 uppercase px-1.5 py-0.5 rounded font-medium">All Pages</span>
            </span>
            <button
              onClick={() => toggleLeftSidebar(false)}
              className="p-1 text-brand-mute hover:text-brand-ink hover:bg-brand-canvas-soft rounded-sm transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => themeDoc.layouts?.header && selectBlock(themeDoc.layouts.header)}
              className={`flex items-center gap-1.5 p-2 border rounded-sm transition-all text-xs font-medium cursor-pointer ${
                selectedBlockId === themeDoc.layouts?.header
                  ? "bg-brand-canvas-soft-2 border-brand-primary text-brand-primary font-semibold shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:text-brand-ink hover:bg-brand-canvas-soft"
              }`}
            >
              <Menu size={13} className="text-brand-mute shrink-0" />
              <span className="truncate">Edit Header</span>
            </button>
            <button
              type="button"
              onClick={() => themeDoc.layouts?.footer && selectBlock(themeDoc.layouts.footer)}
              className={`flex items-center gap-1.5 p-2 border rounded-sm transition-all text-xs font-medium cursor-pointer ${
                selectedBlockId === themeDoc.layouts?.footer
                  ? "bg-brand-canvas-soft-2 border-brand-primary text-brand-primary font-semibold shadow-xs"
                  : "bg-white border-brand-hairline text-brand-body hover:text-brand-ink hover:bg-brand-canvas-soft"
              }`}
            >
              <Menu size={13} className="text-brand-mute shrink-0" />
              <span className="truncate">Edit Footer</span>
            </button>
          </div>
        </div>

        <h3 className="font-mono text-[10px] uppercase tracking-wider text-brand-mute flex items-center gap-1.5">
          <Plus size={10} />
          <span>Add Components</span>
        </h3>

        {categories.map((cat) => (
          <div key={cat} className="flex flex-col gap-2">
            <span className="text-[11px] font-sans font-semibold text-brand-body">{cat}</span>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TEMPLATES
                .filter((b) => b.category === cat)
                .map((b) => (
                  <DraggableBlockButton key={b.type} b={b} onAdd={handleQuickAddBlock} />
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Layers Panel */}
      <div className={`flex flex-col p-4 overflow-y-auto border-t border-brand-hairline transition-all duration-300 ${
        isLayersExpanded ? "h-[340px]" : "h-[48px] overflow-hidden"
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
            {themeDoc.layouts?.header && (
              <GlobalHeaderLayerItem
                headerId={themeDoc.layouts.header}
                selectedBlockId={selectedBlockId}
                onSelectBlock={selectBlock}
              />
            )}

            {pageSections.length > 0 ? (
              <SortableContext items={sortableLayerIds} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-0.5">
                  {pageSections.map((sid) => (
                    <SortableLayerItem
                      key={sid}
                      blockId={sid}
                      depth={0}
                      themeDoc={themeDoc}
                      selectedBlockId={selectedBlockId}
                      expandedBlocks={expandedBlocks}
                      onSelectBlock={selectBlock}
                      onDeleteBlock={deleteBlock}
                      onToggleExpand={toggleExpand}
                    />
                  ))}
                </div>
              </SortableContext>
            ) : (
              <div className="text-center text-xs text-brand-mute py-3 font-sans">
                No sections on this page.
              </div>
            )}

            {themeDoc.layouts?.footer && (
              <GlobalFooterLayerItem
                footerId={themeDoc.layouts.footer}
                selectedBlockId={selectedBlockId}
                onSelectBlock={selectBlock}
              />
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
