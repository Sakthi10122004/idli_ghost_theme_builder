import { INITIAL_THEME_DOCUMENT, useEditorStore } from "../src/store/editorStore";

function testLayersReorder() {
  console.log("Testing Layers Tree reordering...");

  // Check initial sections on home
  const initialSections = [...INITIAL_THEME_DOCUMENT.pages.home.sections];
  console.log("Initial home sections:", initialSections);

  if (initialSections.length < 2) {
    throw new Error("Need at least 2 sections to test reordering");
  }

  const first = initialSections[0];
  const second = initialSections[1];

  // Test moveBlock(first, second)
  useEditorStore.getState().moveBlock(first, second);

  const updatedSections = useEditorStore.getState().document.pages.home.sections;
  console.log("Updated home sections after moving first to second:", updatedSections);

  if (updatedSections[0] !== second || updatedSections[1] !== first) {
    throw new Error(`Expected [${second}, ${first}, ...] but got [${updatedSections[0]}, ${updatedSections[1]}, ...]`);
  }
  console.log("PASS: Sections correctly reordered in editorStore!");

  // Test moveBlock(first, second) back
  useEditorStore.getState().moveBlock(first, second);
  const revertedSections = useEditorStore.getState().document.pages.home.sections;
  console.log("Reverted sections:", revertedSections);

  if (revertedSections[0] !== first || revertedSections[1] !== second) {
    throw new Error(`Expected [${first}, ${second}, ...] after reverting`);
  }
  console.log("PASS: Reversion verified!");
  console.log("All layer reorder store tests passed!");
}

testLayersReorder();
