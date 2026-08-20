"use client";

import { useEditorStore } from "@/store/editorStore";
import { BuilderBlock } from "@/types/theme";
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
  className = ""
}: {
  block: BuilderBlock;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
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
  } = useSortable({ id: block.id, disabled: isPreviewMode });
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

  const handleResizeStart = (e: React.MouseEvent, direction: 'width' | 'height') => {
    e.stopPropagation();
    e.preventDefault();
    const parentEl = e.currentTarget.parentElement;
    if (!parentEl) return;

    const rect = parentEl.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (direction === 'width') {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = startWidth + deltaX;
        const snappedWidth = Math.round(newWidth / 16) * 16;
        updateBlockStyles(block.id, { width: `${Math.max(100, snappedWidth)}px` });
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
          {!isPreviewMode && (
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
          {!isPreviewMode && (
            <>
              {/* Right Edge (Width) Resize handle */}
              <div 
                onMouseDown={(e) => handleResizeStart(e, 'width')}
                className="absolute top-0 -right-1 w-2 h-full cursor-col-resize group-hover/sortable:border-r-2 group-hover/sortable:border-brand-primary/30 hover:border-brand-primary active:border-brand-primary z-30 transition-all"
                title="Drag right edge to change width"
              />
              {/* Bottom Edge (Height) Resize handle */}
              <div 
                onMouseDown={(e) => handleResizeStart(e, 'height')}
                className="absolute -bottom-1 left-0 w-full h-2 cursor-row-resize group-hover/sortable:border-b-2 group-hover/sortable:border-brand-primary/30 hover:border-brand-primary active:border-brand-primary z-30 transition-all"
                title="Drag bottom edge to change height"
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

  const renderBlock = (blockId: string): React.ReactNode => {
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

    switch (block.type) {
      case "section": {
        const { 
          backgroundColor, 
          paddingTop, 
          paddingBottom,
          backgroundImage,
          backgroundVideoUrl,
          enableParallax = false,
          backgroundSize = "cover",
          backgroundRepeat = "no-repeat",
          backgroundPosition = "center"
        } = block.styles;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            style={{
              backgroundColor: resolveStyle(backgroundColor) || "transparent",
              paddingTop: resolveStyle(paddingTop) || "48px",
              paddingBottom: resolveStyle(paddingBottom) || "48px",
              backgroundImage: backgroundImage ? `url('${resolveStyle(backgroundImage)}')` : undefined,
              backgroundSize: backgroundImage ? (resolveStyle(backgroundSize) || "cover") : undefined,
              backgroundRepeat: backgroundImage ? (resolveStyle(backgroundRepeat) || "no-repeat") : undefined,
              backgroundPosition: backgroundImage ? (resolveStyle(backgroundPosition) || "center") : undefined,
              backgroundAttachment: (backgroundImage && enableParallax) ? "fixed" : undefined,
              clipPath: (backgroundVideoUrl && enableParallax) ? "inset(0px)" : undefined,
            }}
            className="w-full relative overflow-hidden"
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
            <div className="w-full px-6 max-w-[1200px] mx-auto min-h-[40px] border border-dashed border-transparent hover:border-brand-hairline transition-all relative z-10">
              {block.childrenIds && block.childrenIds.length > 0 ? (
                <SortableContext items={block.childrenIds} strategy={verticalListSortingStrategy}>
                  {block.childrenIds.map((cid) => renderBlock(cid))}
                </SortableContext>
              ) : (
                <div className="p-4 border border-dashed border-brand-hairline text-center text-xs text-brand-mute">
                  Empty Section (Drop components here)
                </div>
              )}
            </div>
          </SortableElement>
        );
      }

      case "container": {
        const { display, gap, justifyContent, textAlign } = block.styles;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            style={{
              display: resolveStyle(display) || "block",
              gap: resolveStyle(gap) || "0px",
              justifyContent: resolveStyle(justifyContent) || "normal",
              textAlign: (resolveStyle(textAlign) as any) || "left",
            }}
            className="w-full min-h-[30px] border border-dashed border-transparent hover:border-brand-hairline transition-all"
          >
            {block.childrenIds && block.childrenIds.length > 0 ? (
              <SortableContext items={block.childrenIds} strategy={verticalListSortingStrategy}>
                {block.childrenIds.map((cid) => renderBlock(cid))}
              </SortableContext>
            ) : (
              <div className="p-2 border border-dashed border-brand-hairline text-center text-[10px] text-brand-mute">
                Empty Container
              </div>
            )}
          </SortableElement>
        );
      }

      case "columns": {
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full min-h-[40px]"
          >
            <div className="flex flex-col md:flex-row gap-4 items-stretch w-full border border-dashed border-brand-hairline p-2">
              {block.childrenIds && block.childrenIds.length > 0 ? (
                <SortableContext items={block.childrenIds} strategy={verticalListSortingStrategy}>
                  {block.childrenIds.map((cid) => (
                    <div key={cid} className="flex-1 min-w-[150px]">
                      {renderBlock(cid)}
                    </div>
                  ))}
                </SortableContext>
              ) : (
                <div className="p-4 text-center text-xs text-brand-mute w-full">
                  Columns container (Drop inner blocks here)
                </div>
              )}
            </div>
          </SortableElement>
        );
      }

      case "divider": {
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full py-2"
          >
            <hr className="border-t border-brand-hairline w-full" />
          </SortableElement>
        );
      }

      case "spacer": {
        const height = block.props.height || "40px";
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div 
              style={{ height }} 
              className={`w-full transition-all ${
                isPreviewMode ? "bg-transparent" : "bg-brand-canvas-soft-2 border border-dashed border-brand-hairline flex items-center justify-center text-[9px] font-mono text-brand-mute uppercase"
              }`}
            >
              {!isPreviewMode && `Spacer: ${height}`}
            </div>
          </SortableElement>
        );
      }

      case "image": {
        const { url, alt } = block.props;
        const { borderRadius } = block.styles;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div 
              style={{ borderRadius: resolveStyle(borderRadius) || undefined }}
              className="bg-brand-canvas-soft-2 border border-brand-hairline overflow-hidden flex flex-col justify-center items-center p-1 select-none shadow-level-2 max-w-full"
            >
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={alt || "Image"} className="w-full h-auto object-cover max-h-[300px]" />
              ) : (
                <div className="py-12 flex flex-col items-center gap-2 text-brand-mute">
                  <ImageIcon size={24} />
                  <span className="text-xs">No image URL configured</span>
                </div>
              )}
            </div>
          </SortableElement>
        );
      }

      case "heading": {
        const { text, level } = block.props;
        const { fontSize, fontWeight, letterSpacing, marginBottom, textColor, textAlign } = block.styles;
        const HeadingTag = `h${level || 2}` as any;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            style={{
              fontSize: resolveStyle(fontSize) || "24px",
              fontWeight: resolveStyle(fontWeight) || "600",
              letterSpacing: resolveStyle(letterSpacing) || "-0.6px",
              marginBottom: resolveStyle(marginBottom) || "0px",
              color: resolveStyle(textColor) || undefined,
              textAlign: (resolveStyle(textAlign) as any) || undefined,
            }}
            className="leading-tight text-brand-ink"
          >
            <HeadingTag>{text}</HeadingTag>
          </SortableElement>
        );
      }

      case "text": {
        const { text } = block.props;
        const { fontSize, textColor, marginBottom, fontWeight, letterSpacing, textAlign } = block.styles;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            style={{
              fontSize: resolveStyle(fontSize) || "16px",
              color: resolveStyle(textColor) || "#4d4d4d",
              marginBottom: resolveStyle(marginBottom) || "0px",
              fontWeight: resolveStyle(fontWeight) || undefined,
              letterSpacing: resolveStyle(letterSpacing) || undefined,
              textAlign: (resolveStyle(textAlign) as any) || undefined,
            }}
            className="leading-relaxed"
          >
            <p>{text}</p>
          </SortableElement>
        );
      }

      case "button": {
        const { label, variant } = block.props;
        const { borderRadius } = block.styles;
        const buttonStyles = 
          variant === "secondary"
            ? "bg-white text-brand-ink shadow-level-2 border border-brand-hairline hover:bg-brand-canvas-soft"
            : "bg-brand-primary text-white hover:bg-black shadow-level-3";
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="inline-block"
          >
            <button 
              style={{ borderRadius: resolveStyle(borderRadius) || undefined }}
              className={`${buttonStyles} px-5 py-2 text-xs font-semibold tracking-tight select-none cursor-pointer ${borderRadius ? "" : "rounded-pill"}`}
            >
              {label}
            </button>
          </SortableElement>
        );
      }

      case "hero": {
        const { title, subtitle, buttonLabel } = block.props;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full text-center py-16 mesh-glow relative rounded-md overflow-hidden border border-brand-hairline"
          >
            <div className="max-w-[700px] mx-auto px-6 flex flex-col items-center gap-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-link font-semibold bg-brand-link-bg-soft px-2 py-0.5 rounded-full">Introducing Builder V2</span>
              <h1 className="text-4xl md:text-5xl font-sans font-bold leading-tight text-brand-ink tracking-tighter">
                {title || "Build beautiful templates."}
              </h1>
              <p className="text-base text-brand-body leading-relaxed max-w-[500px]">
                {subtitle || "A visual workspace built directly on layout AST compilation logic, adhering strictly to Geist presets."}
              </p>
              <div className="mt-4 flex gap-3">
                <button className="bg-brand-primary text-white hover:bg-black px-6 py-2.5 rounded-pill text-xs font-semibold shadow-level-3">{buttonLabel || "Start Free"}</button>
                <button className="bg-white border border-brand-hairline text-brand-ink px-6 py-2.5 rounded-pill text-xs font-semibold shadow-level-2">Documentation</button>
              </div>
            </div>
          </SortableElement>
        );
      }

      case "newsletter": {
        const { title, buttonLabel, placeholder } = block.props;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full py-12 px-8 bg-brand-canvas-soft border border-brand-hairline rounded-md flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex flex-col gap-1.5 max-w-[400px]">
              <h3 className="text-lg font-bold text-brand-ink tracking-tight">{title || "Join our technical newsletter"}</h3>
              <p className="text-xs text-brand-body leading-relaxed">
                Stay up to date with new features, theme validation presets, and visual editor architecture tutorials.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-[320px]">
              <div className="flex gap-2 w-full">
                <input 
                  type="email" 
                  placeholder={placeholder || "you@domain.com"} 
                  disabled
                  className="flex-1 px-3 py-2 border border-brand-hairline rounded-sm text-xs font-sans bg-white focus:outline-none cursor-not-allowed"
                />
                <button className="bg-brand-primary text-white hover:bg-black px-4 rounded-sm text-xs font-semibold shrink-0 cursor-pointer shadow-level-3">
                  {buttonLabel || "Subscribe"}
                </button>
              </div>
              <span className="text-[10px] font-mono text-brand-mute">No spam. Unsubscribe anytime.</span>
            </div>
          </SortableElement>
        );
      }

      case "featured-posts": {
        const featured = mockPosts[0];
        const secondaries = mockPosts.slice(1);
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full">
              <h2 className="text-xs font-mono uppercase tracking-wider text-brand-mute mb-6">{block.props.title || "Featured Articles"}</h2>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-white border border-brand-hairline rounded-md overflow-hidden flex flex-col shadow-level-2 group hover:shadow-level-3 transition-all">
                  <div className="aspect-video relative overflow-hidden bg-brand-canvas-soft-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={featured.image} 
                      alt={featured.title} 
                      className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-link font-semibold">{featured.category}</span>
                    <h3 className="text-xl font-bold text-brand-ink leading-snug group-hover:text-brand-link transition-colors">{featured.title}</h3>
                    <p className="text-xs text-brand-body leading-relaxed">{featured.excerpt}</p>
                    <div className="flex gap-4 text-[10px] text-brand-mute mt-2 pt-2 border-t border-brand-hairline">
                      <span>{featured.date}</span>
                      <span>{featured.readingTime}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                  {secondaries.map(post => (
                    <div key={post.id} className="flex gap-4 items-start border-b border-brand-hairline pb-5 last:border-0 last:pb-0 group">
                      <div className="w-24 h-20 bg-brand-canvas-soft-2 border border-brand-hairline rounded-sm overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-brand-link font-semibold">{post.category}</span>
                        <h4 className="text-xs font-semibold text-brand-ink group-hover:text-brand-link transition-colors leading-snug line-clamp-2">{post.title}</h4>
                        <span className="text-[10px] text-brand-mute">{post.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SortableElement>
        );
      }

      case "author-profile": {
        const { name, bio } = block.props;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full p-6 border border-brand-hairline rounded-md bg-white flex items-center gap-5 shadow-level-2">
              <div className="w-16 h-16 rounded-full bg-brand-canvas-soft-2 border border-brand-hairline shrink-0 overflow-hidden flex items-center justify-center">
                <span className="text-lg font-mono font-bold text-brand-primary">{name ? name.charAt(0) : "A"}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">Author bio</span>
                <h4 className="text-sm font-bold text-brand-ink">{name || "Author Name"}</h4>
                <p className="text-xs text-brand-body leading-relaxed max-w-[500px]">
                  {bio || "This is a default biography overview containing details about publishing styles, domain fields, and tags."}
                </p>
              </div>
            </div>
          </SortableElement>
        );
      }

      case "tag-archive": {
        const mockTags = [
          { name: "Engineering", count: 18, color: "text-brand-link" },
          { name: "Product Design", count: 12, color: "text-brand-warning-deep" },
          { name: "Architecture", count: 7, color: "text-brand-ink" },
        ];
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full">
              <h3 className="text-xs font-mono uppercase tracking-wider text-brand-mute mb-4">{block.props.title || "Browse Topics"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockTags.map(tag => (
                  <div key={tag.name} className="p-4 border border-brand-hairline rounded-md bg-white hover:border-brand-hairline-strong shadow-level-2 flex justify-between items-center transition-all cursor-pointer">
                    <span className="text-xs font-bold text-brand-ink">{tag.name}</span>
                    <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-brand-body font-semibold">
                      {tag.count} posts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SortableElement>
        );
      }

      case "post-detail": {
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <article className="max-w-[700px] mx-auto px-6 py-12 flex flex-col gap-6 select-text">
              <header className="flex flex-col gap-3">
                <div className="flex gap-2 items-center text-[10px] font-mono text-brand-mute uppercase tracking-wider">
                  <span className="text-brand-link font-semibold">Engineering</span>
                  <span>•</span>
                  <span>August 20, 2026</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-sans font-bold leading-tight text-brand-ink tracking-tight">
                  Building custom Ghost themes with Next.js App Router AST compiling
                </h1>
              </header>

              <div className="w-full aspect-video bg-brand-canvas-soft-2 rounded-md border border-brand-hairline overflow-hidden select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" 
                  alt="Feature img" 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="text-sm text-brand-body leading-relaxed flex flex-col gap-4 mt-4">
                <p>
                  Ghost themes are traditionally written in Handlebars templates. While Handlebars is great for basic templating, designing dynamic components and checking styles per viewport is notoriously difficult inside static handlebars structures.
                </p>
                <p>
                  By creating a visual theme builder utilizing an intermediate JSON AST layout, we separate the layout design layer from compilation logic. The visual workspace operates purely on a React preview canvas, and then exports standard Handlebars layouts dynamically.
                </p>
                <h3 className="text-lg font-bold text-brand-ink mt-4 tracking-tight">Why Geist aesthetics matter</h3>
                <p>
                  Developer branding requires extreme precision. The visual space demands clean styling bounds, stacked offsets shadow arrays, and a 600 weight displaying font limit to look premium and high-end.
                </p>
              </div>
            </article>
          </SortableElement>
        );
      }

      case "header": {
        const { 
          logoText = "THE BLOG", 
          logoImageUrl, 
          navLinks = "Articles, About, Newsletter", 
          showCta = false, 
          ctaLabel = "Subscribe", 
          ctaHref = "#" 
        } = block.props;
        
        const {
          isSticky = false,
          borderWidth = "1px",
          borderColor = "#e2e8f0",
          borderRadius,
          backgroundColor = "#ffffff"
        } = block.styles;
        
        const linksArray = navLinks.split(",").map((s: string) => s.trim()).filter(Boolean);

        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className={`w-full ${isSticky ? "sticky top-0 z-50 shadow-level-1" : ""}`}
            style={{
              backgroundColor: isSticky ? `${backgroundColor}cc` : backgroundColor,
              backdropFilter: isSticky ? "blur(12px)" : undefined,
              WebkitBackdropFilter: isSticky ? "blur(12px)" : undefined,
              borderRadius: resolveStyle(borderRadius) || undefined,
              borderBottom: borderWidth !== "0px" ? `${borderWidth} solid ${borderColor}` : "none",
            }}
          >
            <header className="w-full flex items-center justify-between py-4 px-6">
              <div className="flex items-center gap-3">
                {logoImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoImageUrl} alt={logoText} className="h-6 w-auto object-contain" />
                ) : (
                  <div className="font-sans font-bold text-sm tracking-tight uppercase">{logoText}</div>
                )}
              </div>
              <div className="flex items-center gap-6">
                <nav className="flex gap-4 text-xs font-medium text-brand-body">
                  {linksArray.map((link: string, idx: number) => (
                    <span key={idx} className="hover:text-brand-ink cursor-pointer transition-colors">{link}</span>
                  ))}
                </nav>
                {showCta && (
                  <button className="px-3.5 py-1.5 bg-brand-primary text-white rounded-sm text-xs font-semibold hover:bg-black transition-all shadow-level-2 select-none cursor-pointer">
                    {ctaLabel}
                  </button>
                )}
              </div>
            </header>
          </SortableElement>
        );
      }

      case "post-grid": {
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-mono uppercase tracking-wider text-brand-mute">{block.props.title || "Latest Articles"}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockPosts.map((post) => (
                  <article key={post.id} className="bg-white border border-brand-hairline rounded-md overflow-hidden flex flex-col shadow-level-2 group hover:shadow-level-3 transition-all">
                    <div className="aspect-video relative overflow-hidden bg-brand-canvas-soft-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-300"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1 gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-link font-semibold">{post.category}</span>
                      <h3 className="text-sm font-semibold text-brand-ink leading-snug group-hover:text-brand-link transition-colors">{post.title}</h3>
                      <p className="text-xs text-brand-body leading-relaxed line-clamp-2">{post.excerpt}</p>
                      <div className="mt-4 pt-3 border-t border-brand-hairline flex justify-between text-[10px] text-brand-mute">
                        <span>{post.date}</span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </SortableElement>
        );
      }

      case "accordion": {
        const items = block.props.items || [];
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full py-6">
              <div className="flex flex-col gap-3">
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="border border-brand-hairline rounded-sm p-4 bg-white shadow-level-1">
                    <h4 className="text-xs font-bold text-brand-ink mb-2 flex justify-between items-center">
                      <span>{item.question || "FAQ Question"}</span>
                      <span className="text-[10px] text-brand-mute font-mono">▼</span>
                    </h4>
                    <p className="text-xs text-brand-body leading-relaxed">{item.answer || "Answer content goes here."}</p>
                  </div>
                ))}
              </div>
            </div>
          </SortableElement>
        );
      }

      case "testimonials": {
        const items = block.props.items || [];
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full py-6">
              <div className="flex flex-col gap-4">
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="border border-brand-hairline rounded-sm p-6 bg-brand-canvas-soft relative">
                    <p className="text-xs italic text-brand-body leading-relaxed mb-4">
                      "{item.quote || "This tool streamlines dynamic block assembly perfectly."}"
                    </p>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-brand-ink">{item.author || "User Author"}</span>
                      <span className="text-[10px] font-mono text-brand-mute">{item.title || "Job Title"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SortableElement>
        );
      }

      case "pricing-table": {
        const { title, tiers } = block.props;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full py-8 text-center">
              {title && <h3 className="text-sm font-mono uppercase tracking-wider text-brand-mute mb-6">{title}</h3>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
                {(tiers || []).map((tier: any, idx: number) => (
                  <div key={idx} className="border border-brand-hairline rounded-md p-6 bg-white flex flex-col justify-between shadow-level-2">
                    <div className="flex flex-col gap-2 mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-mute font-semibold">{tier.name}</span>
                      <span className="text-3xl font-sans font-bold text-brand-ink">{tier.price}</span>
                      <div className="flex flex-col gap-1 mt-4 text-xs text-brand-body">
                        {(tier.features || []).map((f: string, fidx: number) => (
                          <div key={fidx} className="flex items-center justify-center gap-1.5">
                            <span className="text-brand-link">✓</span>
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="bg-brand-primary text-white hover:bg-black py-2 rounded-sm text-xs font-semibold shadow-level-3">
                      {tier.buttonLabel || "Choose Plan"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </SortableElement>
        );
      }

      case "grid-gallery": {
        const urls = block.props.urls || [];
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {urls.map((url: string, idx: number) => (
                  <div key={idx} className="aspect-square bg-brand-canvas-soft-2 rounded-sm border border-brand-hairline overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Gallery index ${idx}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </SortableElement>
        );
      }

      case "social-links": {
        const { github, twitter, website } = block.props;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full py-4 flex justify-center gap-6">
              {github && <a href={github} target="_blank" rel="noreferrer" className="text-xs font-mono font-semibold text-brand-body hover:text-brand-ink">GitHub</a>}
              {twitter && <a href={twitter} target="_blank" rel="noreferrer" className="text-xs font-mono font-semibold text-brand-body hover:text-brand-ink">Twitter</a>}
              {website && <a href={website} target="_blank" rel="noreferrer" className="text-xs font-mono font-semibold text-brand-body hover:text-brand-ink">Website</a>}
            </div>
          </SortableElement>
        );
      }

      case "video-player": {
        const { url } = block.props;
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <div className="w-full py-6 flex justify-center">
              <div className="w-full max-w-[640px] aspect-video bg-black rounded-md overflow-hidden border border-brand-hairline shadow-level-4">
                {url ? (
                  <iframe src={url} title="Video Embed" className="w-full h-full border-none" allowFullScreen />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500 font-mono">No Video URL Configured</div>
                )}
              </div>
            </div>
          </SortableElement>
        );
      }

      case "footer": {
        return (
          <SortableElement
            key={block.id}
            block={block}
            isSelected={isSelected}
            onClick={handleClick}
            onDelete={handleDelete}
            className="w-full"
          >
            <footer className="w-full border-t border-brand-hairline pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-brand-mute">
              <span>{block.props.copyright || "© 2026 Ghost Theme Builder"}</span>
              <div className="flex gap-4 mt-4 md:mt-0 font-medium">
                <span className="hover:text-brand-ink">Ghost CMS</span>
                <span className="hover:text-brand-ink">IdliStack</span>
                <span className="hover:text-brand-ink">Documentation</span>
              </div>
            </footer>
          </SortableElement>
        );
      }

      default:
        return (
          <div key={block.id} className="p-4 border border-dashed border-brand-hairline-strong text-center text-xs text-brand-mute">
            Unknown block type: {block.type}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-brand-canvas-soft overflow-y-auto p-8 flex justify-center items-start mesh-glow select-none">
      <div 
        ref={setCanvasDropRef}
        onClick={() => selectBlock(null)}
        className={`${getViewportWidthClass()} bg-white shadow-level-5 rounded-md min-h-[850px] border overflow-visible transition-all duration-300 p-4 pt-8 pb-8 ${
          isCanvasOver ? "border-brand-primary ring-2 ring-brand-primary/20 scale-[1.002]" : "border-brand-hairline"
        }`}
      >
        {pageSections.length > 0 ? (
          <SortableContext items={pageSections} strategy={verticalListSortingStrategy}>
            {pageSections.map((sid) => renderBlock(sid))}
          </SortableContext>
        ) : (
          <div className="p-12 text-center text-brand-mute text-sm flex flex-col justify-center items-center min-h-[500px]">
            <p>Drag or click blocks in the sidebar to populate your theme layout.</p>
          </div>
        )}
      </div>
    </div>
  );
}
