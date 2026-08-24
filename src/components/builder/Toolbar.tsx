"use client";
import JSZip from "jszip";

import { useEditorStore } from "@/store/editorStore";
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Undo2, 
  Redo2, 
  Download,
  Eye,
  EyeOff,
  Code,
  HelpCircle,
  Plus,
  Copy
} from "lucide-react";

import React, { useEffect } from "react";
import { Save, Cloud, Check, Loader2, AlertCircle } from "lucide-react";

export default function Toolbar() {
  const { 
    deviceMode, 
    setDeviceMode, 
    activePage, 
    setActivePage, 
    undo, 
    redo,
    past,
    future,
    document: themeDoc,
    isPreviewMode,
    togglePreviewMode,
    isCodeMode,
    toggleCodeMode,
    toggleShortcutsHelp,
    createCustomPage,
    duplicateCustomPage,
    updatePageTagFilter,
    loadTheme,
    saveTheme,
    saveStatus,
    isSaving
  } = useEditorStore();

  useEffect(() => {
    loadTheme();
  }, []);

  const allPageKeys = Object.keys(themeDoc.pages);

  // Group default vs custom templates
  const defaultPageSlugs = ["home", "post", "page", "author", "tag", "error"];
  const customPageSlugs = allPageKeys.filter(slug => !defaultPageSlugs.includes(slug));

  const handleCreatePage = () => {
    const name = prompt("Enter a name/slug for the custom template (e.g. landing-pricing):");
    if (name && name.trim()) {
      createCustomPage(name);
    }
  };

  const handleDuplicatePage = () => {
    const name = prompt("Enter a name/slug for the duplicated template:", `${activePage}-copy`);
    if (name && name.trim()) {
      duplicateCustomPage(activePage, name);
    }
  };

  return (
    <header className="h-[64px] border-b border-brand-hairline bg-white px-6 flex items-center justify-between shrink-0 select-none shadow-level-1 z-10">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-primary flex items-center justify-center rounded-sm">
          <span className="text-white font-mono font-semibold text-sm">G</span>
        </div>
        <div>
          <span className="font-sans font-semibold text-sm tracking-tight text-brand-ink">Ghost Theme Builder</span>
          <span className="ml-2 font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded-sm text-brand-body uppercase">Alpha</span>
        </div>
      </div>

      {/* Dynamic Pages Selector & Add Page CTA */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono uppercase text-brand-mute">Page:</span>
        <select
          value={activePage}
          onChange={(e) => setActivePage(e.target.value)}
          className="px-2.5 py-1 border border-brand-hairline rounded-sm text-xs font-medium focus:outline-none bg-brand-canvas-soft text-brand-ink"
        >
          <optgroup label="Default Layouts">
            <option value="home">Home (index.hbs)</option>
            <option value="post">Post (post.hbs)</option>
            <option value="page">Page (page.hbs)</option>
            <option value="author">Author (author.hbs)</option>
            <option value="tag">Tag (tag.hbs)</option>
            <option value="error">404 (error.hbs)</option>
          </optgroup>
          {customPageSlugs.length > 0 && (
            <optgroup label="Custom Templates">
              {customPageSlugs.map(slug => (
                <option key={slug} value={slug}>{slug}.hbs</option>
              ))}
            </optgroup>
          )}
        </select>
        <button
          onClick={handleCreatePage}
          className="p-1 border border-brand-hairline rounded-sm hover:bg-brand-canvas-soft text-brand-ink transition-colors flex items-center justify-center"
          title="Create Custom Page Template"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={handleDuplicatePage}
          className="p-1 border border-brand-hairline rounded-sm hover:bg-brand-canvas-soft text-brand-ink transition-colors flex items-center justify-center"
          title="Duplicate Current Page Layout"
        >
          <Copy size={14} />
        </button>

        <div className="flex items-center gap-1.5 ml-2 border-l border-brand-hairline pl-2">
          <span className="text-[10px] font-mono text-brand-mute uppercase">Tag:</span>
          <input
            type="text"
            value={themeDoc.pages[activePage]?.tagFilter || ""}
            onChange={(e) => updatePageTagFilter(activePage, e.target.value)}
            placeholder="e.g. engineering"
            className="w-[90px] px-1.5 py-0.5 border border-brand-hairline rounded-xs text-[10px] bg-brand-canvas-soft font-mono focus:outline-none focus:border-brand-primary"
            title="Filter articles on this page by tag (e.g. 'engineering')"
          />
        </div>
      </div>

      {/* View Mode & History Toggles */}
      <div className="flex items-center gap-6">
        <div className="flex items-center border-r border-brand-hairline pr-6 gap-1">
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-1.5 rounded-xs transition-colors ${deviceMode === "desktop" ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold" : "text-brand-mute hover:text-brand-ink"}`}
            title="Desktop view"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`p-1.5 rounded-xs transition-colors ${deviceMode === "tablet" ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold" : "text-brand-mute hover:text-brand-ink"}`}
            title="Tablet view"
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-1.5 rounded-xs transition-colors ${deviceMode === "mobile" ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold" : "text-brand-mute hover:text-brand-ink"}`}
            title="Mobile view"
          >
            <Smartphone size={16} />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className={`p-1.5 rounded-xs transition-colors ${past.length > 0 ? "text-brand-ink hover:bg-brand-canvas-soft-2" : "text-brand-hairline-strong cursor-not-allowed"}`}
            title="Undo (⌘Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className={`p-1.5 rounded-xs transition-colors ${future.length > 0 ? "text-brand-ink hover:bg-brand-canvas-soft-2" : "text-brand-hairline-strong cursor-not-allowed"}`}
            title="Redo (⌘⇧Z)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* View Toggles & Help */}
        <div className="flex items-center gap-3 border-l border-brand-hairline pl-6">
          <button
            onClick={togglePreviewMode}
            className={`p-1.5 rounded-xs transition-colors ${isPreviewMode ? "bg-brand-canvas-soft-2 text-brand-ink font-semibold" : "text-brand-mute hover:text-brand-ink"}`}
            title={isPreviewMode ? "Edit Mode" : "Preview Mode"}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={toggleCodeMode}
            className={`p-1.5 rounded-xs transition-colors ${isCodeMode ? "bg-[#171717] text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
            title="Code view"
          >
            <Code size={16} />
          </button>
          <button
            onClick={() => toggleShortcutsHelp()}
            className="p-1.5 rounded-xs text-brand-mute hover:text-brand-ink transition-colors"
            title="Help / Keyboard Shortcuts"
          >
            <HelpCircle size={16} />
          </button>
        </div>

        {/* Export / Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Autosave / DB Status Badge */}
          <div className="flex items-center gap-1.5 text-xs text-brand-body pr-2">
            {saveStatus === "saving" && (
              <>
                <Loader2 size={13} className="animate-spin text-brand-link" />
                <span className="text-[10px] font-mono text-brand-mute">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Cloud size={13} className="text-emerald-500" />
                <span className="text-[10px] font-mono text-emerald-600">Saved</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle size={13} className="text-red-500" />
                <span className="text-[10px] font-mono text-red-500">Save Error</span>
              </>
            )}
          </div>

          <button 
            disabled={isSaving}
            onClick={() => saveTheme()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-hairline rounded-sm text-xs font-semibold hover:bg-brand-canvas-soft text-brand-ink transition-all shadow-level-2 bg-white"
            title="Manual Save to Database"
          >
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
            <span>Save Theme</span>
          </button>

          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white rounded-sm text-xs font-semibold hover:bg-black transition-all shadow-level-3"
            onClick={() => {
              // Statically imported JSZip makes zip compilation fully stable
              const zip = new JSZip();

              import("./compiler").then(({ generateThemeFiles }) => {
                const latestDoc = useEditorStore.getState().document;
                const files = generateThemeFiles(latestDoc);
                
                // Add files to zip archive
                Object.entries(files).forEach(([name, content]) => {
                  zip.file(name, content as string);
                });
                
                // Build ZIP blob and download
                zip.generateAsync({ type: "blob" }).then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${latestDoc.metadata.name.toLowerCase().replace(/\s+/g, "-")}-theme.zip`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                });
              });
            }}
          >
            <Download size={12} />
            <span>Export Theme</span>
          </button>
        </div>
      </div>
    </header>
  );
}
