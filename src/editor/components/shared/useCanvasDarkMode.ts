import { useEditorStore } from "@/store/editorStore";

/**
 * Shared hook returning whether the editor canvas is currently in dark mode preview.
 * Backed by useEditorStore.previewColorMode ("light" | "dark").
 */
export function useCanvasDarkMode(): boolean {
  const previewColorMode = useEditorStore((state) => state.previewColorMode);
  return previewColorMode === "dark";
}
