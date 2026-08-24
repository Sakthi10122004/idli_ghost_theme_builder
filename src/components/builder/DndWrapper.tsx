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
  closestCorners
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Check if dragging from LeftSidebar palette
    if (activeId.startsWith("sidebar-")) {
      const blockType = activeId.replace("sidebar-", "");
      
      if (overId === "canvas-root") {
        const sections = themeDoc.pages[activePage]?.sections || [];
        insertBlockAt(blockType, sections.length);
        return;
      }

      // If dropping over a layout block, place it inside (prevent nested sections)
      const overBlock = themeDoc.blocks[overId];
      if (
        overBlock &&
        (overBlock.type === "container" || overBlock.type === "section" || overBlock.type === "columns") &&
        !(blockType === "section" && overBlock.type === "section")
      ) {
        insertBlockAt(blockType, overBlock.childrenIds?.length || 0, overId);
        return;
      }

      // Resolve drop index in page sections or container children
      const sections = themeDoc.pages[activePage]?.sections || [];
      const overIndex = sections.indexOf(overId);

      if (overIndex !== -1) {
        insertBlockAt(blockType, overIndex);
      } else {
        // Search inside containers
        for (const pid of Object.keys(themeDoc.blocks)) {
          const block = themeDoc.blocks[pid];
          if (block.childrenIds) {
            const idx = block.childrenIds.indexOf(overId);
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
      // Existing canvas block reorder/move
      moveBlock(activeId, overId);
    }
  };

  const customCollisionDetection = (args: any) => {
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

    // If active element is a canvas block and over a different canvas block, reorder in real-time
    if (!activeId.startsWith("sidebar-") && activeId !== overId) {
      // Check if over target is a valid canvas block (not canvas-root background)
      if (overId !== "canvas-root") {
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
