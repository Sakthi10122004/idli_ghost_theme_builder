"use client";

import { useEditorStore } from "@/store/editorStore";
import { BuilderBlock } from "@/types/theme";
import { componentRegistry } from "@/editor/components/registry";
import React from "react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable, useDndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Image as ImageIcon, ChevronUp, ChevronDown } from "lucide-react";

// Sortable Wrapper Component with hover/selection Drag Handle
function SortableElement({
  block,
  isSelected,
  onClick,
  onDelete,
  children,
  style = {},
  className = "",
  isGlobal = false
}: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  isGlobal?: boolean;
}) {
  const { isPreviewMode, updateBlockStyles, updateBlockProps, document: themeDoc, activePage, reorderBlocks, deviceMode } = useEditorStore();

  const getBlockContext = () => {
    const sections = themeDoc.pages[activePage]?.sections || [];
    const rootIndex = sections.indexOf(block.id);
    if (rootIndex !== -1) {
      return { parentId: undefined, index: rootIndex, siblings: sections };
    }
    for (const pid of Object.keys(themeDoc.blocks)) {
      const parent = themeDoc.blocks[pid];
      if (parent.childrenIds) {
        const idx = parent.childrenIds.indexOf(block.id);
        if (idx !== -1) {
          return { parentId: pid, index: idx, siblings: parent.childrenIds };
        }
      }
    }
    return { parentId: undefined, index: -1, siblings: [] };
  };

  const { parentId, index, siblings } = getBlockContext();
  const isFirst = index === 0;
  const isLast = index === siblings.length - 1;

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFirst) return;
    reorderBlocks(index, index - 1, parentId);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLast) return;
    reorderBlocks(index, index + 1, parentId);
  };
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({ id: block.id, disabled: isPreviewMode || isGlobal });
  const { active } = useDndContext();
  const isSidebarDragOver = active?.id.toString().startsWith("sidebar-") && isOver;

  const resolveStyleLocal = (val: any): string | undefined => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    return val[deviceMode] || val.desktop || undefined;
  };

  const {
    boxShadow,
    borderWidth,
    borderColor,
    backdropBlur,
    opacity,
    hoverEffect
  } = block.styles;

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    position: "relative",
    boxShadow: resolveStyleLocal(boxShadow) || style.boxShadow || undefined,
    border: borderWidth && borderWidth !== "0px" ? `${resolveStyleLocal(borderWidth)} solid ${resolveStyleLocal(borderColor) || "#e2e8f0"}` : undefined,
    backdropFilter: backdropBlur ? `blur(${resolveStyleLocal(backdropBlur)})` : undefined,
    WebkitBackdropFilter: backdropBlur ? `blur(${resolveStyleLocal(backdropBlur)})` : undefined,
    opacity: isDragging ? 0.3 : (opacity ? parseFloat(resolveStyleLocal(opacity) || "1") : undefined),
  };

  const getHoverClass = () => {
    if (isPreviewMode) return "";
    const effect = resolveStyleLocal(hoverEffect);
    if (effect === "scale") return "hover:scale-[1.02] transition-transform duration-200";
    if (effect === "float") return "hover:-translate-y-1 transition-transform duration-200";
    if (effect === "glow") return "hover:shadow-md transition-shadow duration-200";
    return "";
  };

  const borderClass = isPreviewMode
    ? ""
    : isDragging
      ? "border-2 border-dashed border-brand-primary/50 bg-brand-primary/5 rounded-md min-h-[50px] pointer-events-none"
      : isOver
        ? "border-2 border-dashed border-brand-primary rounded-md ring-2 ring-brand-primary/10"
        : isSelected
          ? "outline-2 outline-brand-primary outline-offset-1 ring-2 ring-white/50"
          : "hover:outline-1 hover:outline-brand-hairline-strong hover:outline-offset-1";

  const handleResizeStart = (e: React.MouseEvent, direction: 'width' | 'innerWidth' | 'height') => {
    e.stopPropagation();
    e.preventDefault();
    const parentEl = e.currentTarget.parentElement;
    if (!parentEl) return;

    const rect = parentEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;

    // For inner width resizing of section content container
    const innerContainerEl = parentEl.querySelector('.container-width');
    const startInnerWidth = innerContainerEl ? innerContainerEl.getBoundingClientRect().width : 1200;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (direction === 'width') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = startWidth + deltaX * 2; // dual-side expand representation
        const snappedWidth = Math.round(newWidth / 16) * 16;
        updateBlockStyles(block.id, { width: `${Math.max(200, snappedWidth)}px` });
      } else if (direction === 'innerWidth') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = startInnerWidth + deltaX * 2;
        const snappedWidth = Math.round(newWidth / 16) * 16;
        updateBlockStyles(block.id, { contentWidth: `${Math.max(200, snappedWidth)}px` });
      } else {
        const deltaY = moveEvent.clientY - startY;
        const newHeight = startHeight + deltaY;
        const snappedHeight = Math.round(newHeight / 8) * 8;

        if (block.type === 'spacer') {
          updateBlockProps(block.id, { height: `${Math.max(8, snappedHeight)}px` });
        } else if (block.type === 'section') {
          const halfPadding = Math.max(16, snappedHeight / 2);
          updateBlockStyles(block.id, { 
            paddingTop: `${halfPadding}px`, 
            paddingBottom: `${halfPadding}px` 
          });
        } else {
          updateBlockStyles(block.id, { height: `${Math.max(16, snappedHeight)}px` });
        }
      }
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={setNodeRef}
      style={combinedStyle}
      onClick={isPreviewMode ? undefined : onClick}
      className={`group/sortable relative ${className} ${borderClass} ${getHoverClass()} transition-all duration-200`}
    >
      {isSidebarDragOver && (
        <div className="absolute -top-1.5 left-0 w-full h-1 bg-brand-primary rounded-full animate-pulse z-40" />
      )}
      {isDragging ? (
        <div className="w-full py-4 px-6 flex items-center justify-center text-brand-primary/60 font-mono text-[10px] uppercase font-bold tracking-wider animate-pulse">
          Drop {block.type} Here
        </div>
      ) : (
        <>
          {/* Floating Grip handle shown on hover OR selection */}
          {!isPreviewMode && !isGlobal && (
            <div className={`absolute -top-6 left-0 bg-brand-primary text-white text-[9px] font-mono px-2 py-0.5 rounded-t-sm flex items-center gap-1.5 z-20 transition-all select-none pointer-events-auto ${
              isSelected ? "opacity-100 visible" : "opacity-0 invisible group-hover/sortable:opacity-100 group-hover/sortable:visible"
            }`}>
              <span 
                {...listeners} 
                {...attributes} 
                className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-white/20 rounded-xs"
                title="Drag to reorder"
              >
                <GripVertical size={10} />
              </span>
              <button
                onClick={handleMoveUp}
                disabled={isFirst}
                className={`p-0.5 rounded-xs hover:bg-white/20 transition-colors ${
                  isFirst ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                }`}
                title="Move component up"
              >
                <ChevronUp size={10} />
              </button>
              <button
                onClick={handleMoveDown}
                disabled={isLast}
                className={`p-0.5 rounded-xs hover:bg-white/20 transition-colors ${
                  isLast ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                }`}
                title="Move component down"
              >
                <ChevronDown size={10} />
              </button>
              <span className="font-semibold uppercase tracking-wider text-[8px]">{block.type}</span>
              <button 
                onClick={onDelete}
                className="hover:bg-brand-error-deep p-0.5 rounded-xs transition-colors ml-1"
                title="Delete block"
              >
                <Trash2 size={10} />
              </button>
            </div>
          )}

          {/* Resizing Edge Handles */}
          {!isPreviewMode && !isGlobal && (
            <>
              {/* Outer Section / General Block Width Handle */}
              <div 
                onMouseDown={(e) => handleResizeStart(e, 'width')}
                className="absolute top-0 -right-1 w-2.5 h-full cursor-col-resize group-hover/sortable:bg-brand-primary/20 hover:bg-brand-primary active:bg-brand-primary z-30 transition-all"
                title={block.type === 'section' ? "Drag to resize Outer Background Width" : "Drag to resize Width"}
              />
              
              {/* Inner Section Content Width Handle (rendered only on Section types) */}
              {block.type === 'section' && (
                <div 
                  onMouseDown={(e) => handleResizeStart(e, 'innerWidth')}
                  className="absolute top-0 right-1/2 translate-x-[600px] w-2 h-2/3 my-auto bottom-0 cursor-col-resize border-r border-dashed border-brand-primary/50 hover:border-solid hover:border-brand-primary hover:border-r-2 z-30 transition-all"
                  style={{
                    transform: `translateX(clamp(100px, calc(${resolveStyleLocal(block.styles.contentWidth) || '1200px'} / 2), 50vw))`
                  }}
                  title="Drag to resize Inner Content Width"
                />
              )}

              {/* Bottom Edge (Height / Padding) Resize handle */}
              <div 
                onMouseDown={(e) => handleResizeStart(e, 'height')}
                className="absolute -bottom-1 left-0 w-full h-2 cursor-row-resize group-hover/sortable:border-b-2 group-hover/sortable:border-brand-primary/30 hover:border-brand-primary active:border-brand-primary z-30 transition-all"
                title={block.type === 'section' ? "Drag to resize Section Vertical Padding" : "Drag to resize Height"}
              />
            </>
          )}

          {children}
        </>
      )}
    </div>
  );
}

export default function Canvas() {
  const { document: themeDoc, activePage, deviceMode, selectedBlockId, selectBlock, deleteBlock } = useEditorStore();
  const pageSections = themeDoc.pages[activePage]?.sections || [];
  const { isPreviewMode } = useEditorStore();

  // Register canvas container as a droppable target zone
  const { setNodeRef: setCanvasDropRef, isOver: isCanvasOver } = useDroppable({
    id: "canvas-root",
  });

  const mockPosts = [
    {
      id: 1,
      title: "Building custom Ghost themes with Next.js",
      excerpt: "Learn how to establish an elegant AST rendering architecture for your static publication sites.",
      date: "August 20, 2026",
      readingTime: "4 min read",
      category: "Engineering",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      title: "Design languages that scale: Geist case study",
      excerpt: "How stark typography, 1px borders, and mesh gradients define developer branding aesthetics.",
      date: "August 18, 2026",
      readingTime: "6 min read",
      category: "Design",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      title: "Deploying modern edge stacks to global nodes",
      excerpt: "Optimizing startup speeds, resource footprints, and layout rendering algorithms.",
      date: "August 15, 2026",
      readingTime: "3 min read",
      category: "DevOps",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const getViewportWidthClass = () => {
    if (deviceMode === "mobile") return "w-[375px]";
    if (deviceMode === "tablet") return "w-[768px]";
    return "w-full max-w-[1280px]";
  };

  const resolveStyle = (val: any): string | undefined => {
    if (!val) return undefined;
    if (typeof val === "string") return val;
    return val[deviceMode] || val.desktop || undefined;
  };

  const renderBlock = (blockId: string, isGlobal = false): React.ReactNode => {
    const block = themeDoc.blocks[blockId];
    if (!block) return null;

    const isSelected = selectedBlockId === blockId;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      selectBlock(blockId);
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteBlock(blockId);
    };

    const def = componentRegistry[block.type];
    if (def) {
      const CanvasElement = def.CanvasElement;
      
      const { 
        backgroundColor, 
        paddingTop, 
        paddingBottom,
        backgroundImage,
        backgroundVideoUrl,
        enableParallax = false,
        backgroundSize = "cover",
        backgroundRepeat = "no-repeat",
        backgroundPosition = "center",
        width,
        contentWidth,
        display,
        gap,
        justifyContent,
        textAlign,
        borderRadius,
        fontSize,
        fontWeight,
        letterSpacing,
        marginBottom,
        textColor
      } = block.styles;

      return (
        <SortableElement
          key={block.id}
          block={block}
          isSelected={isSelected}
          onClick={handleClick}
          onDelete={handleDelete}
          isGlobal={isGlobal}
          style={{
            backgroundColor: resolveStyle(backgroundColor) || undefined,
            paddingTop: resolveStyle(paddingTop) || undefined,
            paddingBottom: resolveStyle(paddingBottom) || undefined,
            backgroundImage: backgroundImage ? `url('${resolveStyle(backgroundImage)}')` : undefined,
            backgroundSize: backgroundImage ? (resolveStyle(backgroundSize) || "cover") : undefined,
            backgroundRepeat: backgroundImage ? (resolveStyle(backgroundRepeat) || "no-repeat") : undefined,
            backgroundPosition: backgroundImage ? (resolveStyle(backgroundPosition) || "center") : undefined,
            backgroundAttachment: (backgroundImage && enableParallax) ? "fixed" : undefined,
            clipPath: (backgroundVideoUrl && enableParallax) ? "inset(0px)" : undefined,
            width: resolveStyle(width) || undefined,
            marginLeft: resolveStyle(width) ? "auto" : undefined,
            marginRight: resolveStyle(width) ? "auto" : undefined,
            display: resolveStyle(display) || undefined,
            gap: resolveStyle(gap) || undefined,
            justifyContent: resolveStyle(justifyContent) || undefined,
            textAlign: (resolveStyle(textAlign) as any) || undefined,
            borderRadius: resolveStyle(borderRadius) || undefined,
            fontSize: resolveStyle(fontSize) || undefined,
            fontWeight: resolveStyle(fontWeight) || undefined,
            letterSpacing: resolveStyle(letterSpacing) || undefined,
            marginBottom: resolveStyle(marginBottom) || undefined,
            color: resolveStyle(textColor) || undefined,
          }}
          className={`relative w-full ${block.type === "header" || block.type === "footer" ? "overflow-visible z-50" : "overflow-hidden z-10"}`}
        >
          {backgroundVideoUrl && (
            <video
              src={resolveStyle(backgroundVideoUrl)}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: enableParallax ? "fixed" : "absolute",
                top: 0,
                left: 0,
                width: enableParallax ? "100vw" : "100%",
                height: enableParallax ? "100vh" : "100%",
                objectFit: "cover",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          )}
          <div 
            style={{ maxWidth: resolveStyle(contentWidth) || undefined }}
            className={block.type === "section" ? "container-width w-full px-6 mx-auto min-h-[40px] border border-dashed border-transparent hover:border-brand-hairline transition-all relative z-10" : "w-full relative z-10"}
          >
            <CanvasElement
              block={block}
              isSelected={isSelected}
              onClick={handleClick}
              onDelete={handleDelete}
              renderChildren={() => (
                block.childrenIds && block.childrenIds.length > 0 ? (
                  <SortableContext items={block.childrenIds} strategy={verticalListSortingStrategy}>
                    {block.childrenIds.filter(cid => {
                      const cb = themeDoc.blocks[cid];
                      return cb && cb.type !== "header" && cb.type !== "footer";
                    }).map((cid) => renderBlock(cid))}
                  </SortableContext>
                ) : (
                  block.type === "section" ? (
                    <div className="p-4 border border-dashed border-brand-hairline text-center text-xs text-brand-mute">
                      Empty Section (Drop components here)
                    </div>
                  ) : block.type === "container" ? (
                    <div className="p-2 border border-dashed border-brand-hairline text-center text-[10px] text-brand-mute">
                      Empty Container
                    </div>
                  ) : block.type === "columns" ? (
                    <div className="p-4 text-center text-xs text-brand-mute w-full">
                      Columns container (Drop inner blocks here)
                    </div>
                  ) : null
                )
              )}
            />
          </div>
        </SortableElement>
      );
    }

    return (
      <div key={block.id} className="p-4 border border-dashed border-brand-hairline-strong text-center text-xs text-brand-mute">
        Unknown block type: {block.type}
      </div>
    );
  };

  let headerBlockId: string | undefined;
  let footerBlockId: string | undefined;
  Object.values(themeDoc.blocks).forEach((block) => {
    if (block.type === "header" && !headerBlockId) headerBlockId = block.id;
    if (block.type === "footer" && !footerBlockId) footerBlockId = block.id;
  });

  return (
    <div className="flex-1 bg-brand-canvas-soft overflow-y-auto p-8 flex justify-center items-start mesh-glow select-none">
      <div 
        ref={setCanvasDropRef}
        onClick={() => selectBlock(null)}
        className={`${getViewportWidthClass()} bg-white shadow-level-5 rounded-md min-h-[850px] border overflow-visible transition-all duration-300 flex flex-col ${
          isCanvasOver ? "border-brand-primary ring-2 ring-brand-primary/20 scale-[1.002]" : "border-brand-hairline"
        }`}
      >
        {headerBlockId && renderBlock(headerBlockId, true)}

        <div className="flex-1 w-full flex flex-col pt-8 pb-8">
          {pageSections.length > 0 ? (
            <SortableContext items={pageSections} strategy={verticalListSortingStrategy}>
              {pageSections.filter(sid => {
                const b = themeDoc.blocks[sid];
                return b && b.type !== "header" && b.type !== "footer";
              }).map((sid) => renderBlock(sid))}
            </SortableContext>
          ) : (
            <div className="p-12 text-center text-brand-mute text-sm flex flex-col justify-center items-center min-h-[500px]">
              <p>Drag or click blocks in the sidebar to populate your theme layout.</p>
            </div>
          )}
        </div>

        {footerBlockId && renderBlock(footerBlockId, true)}
      </div>
    </div>
  );
}
