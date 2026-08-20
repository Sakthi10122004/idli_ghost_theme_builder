"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";
import { X } from "lucide-react";

export default function KeyboardShortcuts() {
  const {
    selectedBlockId,
    deleteBlock,
    duplicateBlock,
    selectBlock,
    undo,
    redo,
    showShortcutsHelp,
    toggleShortcutsHelp,
    past,
    future
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input/textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd/Ctrl + Z
      if (cmdKey && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        if (past.length > 0) undo();
      }

      // Redo: Cmd/Ctrl + Shift + Z
      if (cmdKey && e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        if (future.length > 0) redo();
      }

      // Duplicate: Cmd/Ctrl + D
      if (cmdKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (selectedBlockId) {
          duplicateBlock(selectedBlockId);
        }
      }

      // Delete: Delete / Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedBlockId) {
          e.preventDefault();
          deleteBlock(selectedBlockId);
        }
      }

      // Deselect: Escape
      if (e.key === "Escape") {
        e.preventDefault();
        selectBlock(null);
        toggleShortcutsHelp(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedBlockId, past, future, undo, redo, deleteBlock, duplicateBlock, selectBlock, toggleShortcutsHelp]);

  if (!showShortcutsHelp) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-[100] p-4 select-none">
      <div className="bg-white border border-brand-hairline rounded-md shadow-level-5 max-w-sm w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-brand-hairline flex justify-between items-center bg-brand-canvas-soft">
          <span className="font-sans font-bold text-xs uppercase tracking-wider text-brand-ink">Keyboard Shortcuts</span>
          <button 
            onClick={() => toggleShortcutsHelp(false)}
            className="p-1 hover:bg-brand-canvas-soft-2 rounded-sm text-brand-body hover:text-brand-ink transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 flex flex-col gap-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-body">Undo Action</span>
            <kbd className="font-mono bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-[10px] text-brand-ink">⌘ Z</kbd>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-body">Redo Action</span>
            <kbd className="font-mono bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-[10px] text-brand-ink">⌘ ⇧ Z</kbd>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-body">Duplicate Component</span>
            <kbd className="font-mono bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-[10px] text-brand-ink">⌘ D</kbd>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-body">Delete Selected Block</span>
            <kbd className="font-mono bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-[10px] text-brand-ink">Delete</kbd>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-body">Deselect Selection</span>
            <kbd className="font-mono bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-sm text-[10px] text-brand-ink">ESC</kbd>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-brand-hairline bg-brand-canvas-soft text-[10px] font-mono text-brand-mute text-center">
          Press ESC to dismiss shortcuts dialog.
        </div>
      </div>
    </div>
  );
}
