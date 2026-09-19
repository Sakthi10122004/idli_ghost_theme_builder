"use client";

import React from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverEvent,
  pointerWithin,
  closestCorners,
  CollisionDetection,
} from "@dnd-kit/core";
import { useEditorStore } from "@/store/editorStore";

export default function DndWrapper({ children }: { children: React.ReactNode }) {
  const { moveBlock, insertBlockAt, document: themeDoc, activePage } = useEditorStore();

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
      return pointerCollisions;
    }
    return closestCorners(args);
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
      if (overId !== "canvas-root" && !overId.startsWith("layer-") && !overId.startsWith("sidebar-")) {
        moveBlock(activeId, overId);
      }
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

      if (targetId === "canvas-root" || targetId === "global-footer") {
        const sections = themeDoc.pages[activePage]?.sections || [];
        insertBlockAt(blockType, sections.length);
        return;
      }

      if (targetId === "global-header") {
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
        insertBlockAt(blockType, overIndex);
      } else {
        // Search inside containers
        for (const pid of Object.keys(themeDoc.blocks)) {
          const block = themeDoc.blocks[pid];
          if (block.childrenIds) {
            const idx = block.childrenIds.indexOf(targetId);
            if (idx !== -1) {
              insertBlockAt(blockType, idx, pid);
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
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}
