"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
  closestCorners,
  CollisionDetection,
} from "@dnd-kit/core";
import { useEditorStore } from "@/store/editorStore";
import { getBlockTemplate } from "@/editor/components/blockTemplates";
import { Square } from "lucide-react";

export default function DndWrapper({ children }: { children: React.ReactNode }) {
  const { moveBlock, insertBlockAt, document: themeDoc, activePage } = useEditorStore();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid triggering drag on simple clicks
      },
    })
  );

  const customCollisionDetection: CollisionDetection = (args) => {
    const activeId = args.active.id.toString();

    // If dragging a layer tree item, restrict collisions to layer tree elements
    if (activeId.startsWith("layer-")) {
      const layerContainers = args.droppableContainers.filter((c) =>
        c.id.toString().startsWith("layer-")
      );
      const filteredArgs = { ...args, droppableContainers: layerContainers };
      const pointerCollisions = pointerWithin(filteredArgs);
      if (pointerCollisions.length > 0) {
        return pointerCollisions;
      }
      return closestCorners(filteredArgs);
    }

    // If dragging a canvas block, do not collide with layer tree elements
    if (!activeId.startsWith("sidebar-")) {
      const canvasContainers = args.droppableContainers.filter(
        (c) => !c.id.toString().startsWith("layer-")
      );
      const filteredArgs = { ...args, droppableContainers: canvasContainers };
      const pointerCollisions = pointerWithin(filteredArgs);
      if (pointerCollisions.length > 0) {
        return pointerCollisions;
      }
      return closestCorners(filteredArgs);
    }

    // Dragging from sidebar palette
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      // Prioritize explicit drop slots between blocks!
      const slotCollision = pointerCollisions.find((c) =>
        c.id.toString().startsWith("drop-slot-")
      );
      if (slotCollision) {
        return [slotCollision];
      }
      return pointerCollisions;
    }
    return closestCorners(args);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id.toString());
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    // 1. Layers Tree real-time reordering
    if (activeId.startsWith("layer-")) {
      const realActiveId = activeId.replace("layer-", "");
      const sections = themeDoc.pages[activePage]?.sections || [];

      if (overId === "layer-global-header") {
        if (sections.length > 0 && sections[0] !== realActiveId) {
          moveBlock(realActiveId, sections[0]);
        }
        return;
      }

      if (overId === "layer-global-footer") {
        if (sections.length > 0 && sections[sections.length - 1] !== realActiveId) {
          moveBlock(realActiveId, sections[sections.length - 1]);
        }
        return;
      }

      if (overId.startsWith("layer-")) {
        const realOverId = overId.replace("layer-", "");
        if (realActiveId !== realOverId) {
          moveBlock(realActiveId, realOverId);
        }
      }
      return;
    }

    // 2. Canvas blocks real-time reordering
    if (!activeId.startsWith("sidebar-") && !activeId.startsWith("layer-")) {
      if (
        overId !== "canvas-root" &&
        !overId.startsWith("layer-") &&
        !overId.startsWith("sidebar-") &&
        !overId.startsWith("drop-slot-")
      ) {
        moveBlock(activeId, overId);
      }
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // 1. Layers Tree drop
    if (activeId.startsWith("layer-")) {
      const realActiveId = activeId.replace("layer-", "");
      const sections = themeDoc.pages[activePage]?.sections || [];

      if (overId === "layer-global-header") {
        if (sections.length > 0 && sections[0] !== realActiveId) {
          moveBlock(realActiveId, sections[0]);
        }
        return;
      }

      if (overId === "layer-global-footer") {
        if (sections.length > 0 && sections[sections.length - 1] !== realActiveId) {
          moveBlock(realActiveId, sections[sections.length - 1]);
        }
        return;
      }

      if (overId.startsWith("layer-")) {
        const realOverId = overId.replace("layer-", "");
        if (realActiveId !== realOverId) {
          moveBlock(realActiveId, realOverId);
        }
      }
      return;
    }

    // 2. Dragging from LeftSidebar palette
    if (activeId.startsWith("sidebar-")) {
      const blockType = activeId.replace("sidebar-", "");
      if (blockType === "header" || blockType === "footer") return;

      const targetId = overId.startsWith("layer-")
        ? overId.replace("layer-", "")
        : overId;

      // Drop on an explicit insertion slot: "drop-slot-[index]"
      if (targetId.startsWith("drop-slot-")) {
        const slotParts = targetId.replace("drop-slot-", "").split("-");
        if (slotParts.length === 1) {
          const slotIndex = parseInt(slotParts[0], 10);
          insertBlockAt(blockType, isNaN(slotIndex) ? 0 : slotIndex);
          return;
        } else {
          const slotIndex = parseInt(slotParts[slotParts.length - 1], 10);
          const slotParentId = slotParts.slice(0, -1).join("-");
          insertBlockAt(blockType, isNaN(slotIndex) ? 0 : slotIndex, slotParentId);
          return;
        }
      }

      if (targetId === "canvas-root" || targetId === "canvas-empty-slot" || targetId === "global-footer") {
        const sections = themeDoc.pages[activePage]?.sections || [];
        insertBlockAt(blockType, sections.length);
        return;
      }

      if (targetId === "global-header" || targetId === "layer-global-header") {
        insertBlockAt(blockType, 0);
        return;
      }

      // If dropping over a layout block, place it inside (prevent nested sections)
      const overBlock = themeDoc.blocks[targetId];
      if (
        overBlock &&
        (overBlock.type === "container" || overBlock.type === "section" || overBlock.type === "columns") &&
        !(blockType === "section" && overBlock.type === "section")
      ) {
        insertBlockAt(blockType, overBlock.childrenIds?.length || 0, targetId);
        return;
      }

      // Resolve drop index in page sections or container children
      const sections = themeDoc.pages[activePage]?.sections || [];
      const overIndex = sections.indexOf(targetId);

      if (overIndex !== -1) {
        insertBlockAt(blockType, overIndex + 1);
      } else {
        // Search inside containers
        for (const pid of Object.keys(themeDoc.blocks)) {
          const block = themeDoc.blocks[pid];
          if (block.childrenIds) {
            const idx = block.childrenIds.indexOf(targetId);
            if (idx !== -1) {
              insertBlockAt(blockType, idx + 1, pid);
              return;
            }
          }
        }
        // Fallback: append block
        insertBlockAt(blockType, sections.length);
      }
    } else {
      // 3. Existing canvas block reorder/move
      if (!overId.startsWith("layer-") && overId !== "canvas-root") {
        moveBlock(activeId, overId);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}

      {/* Tactile floating drag preview when picking up from sidebar */}
      <DragOverlay dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeDragId?.startsWith("sidebar-") ? (() => {
          const blockType = activeDragId.replace("sidebar-", "");
          const tpl = getBlockTemplate(blockType);
          const Icon = tpl?.icon || Square;
          const label = tpl?.label || blockType;
          return (
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white dark:bg-zinc-900 border-2 border-brand-primary rounded-md shadow-2xl text-brand-ink dark:text-white select-none pointer-events-none transform rotate-[-2deg] scale-105 cursor-grabbing z-[9999] min-w-[170px] ring-4 ring-black/5">
              <div className="w-7 h-7 rounded-sm bg-brand-primary/10 dark:bg-white/10 flex items-center justify-center text-brand-primary dark:text-white shrink-0">
                <Icon size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-tight">{label}</span>
                <span className="text-[10px] text-brand-mute leading-tight font-mono">Drop to put on canvas</span>
              </div>
            </div>
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}
