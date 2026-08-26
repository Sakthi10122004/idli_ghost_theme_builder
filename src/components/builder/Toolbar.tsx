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
            onClick={async () => {
              const zip = new JSZip();

              try {
                const manifestRes = await fetch("/casper-template/manifest.json");
                if (!manifestRes.ok) throw new Error("Failed to load template manifest");
                const manifest: string[] = await manifestRes.json();
                
                // Fetch and process global.css and screen.css dynamically to avoid mutating the reference casper-template
                let globalCssContent = "";
                let screenCssContent = "";
                try {
                  const [gRes, sRes] = await Promise.all([
                    fetch("/casper-template/assets/css/global.css"),
                    fetch("/casper-template/assets/css/screen.css")
                  ]);
                  if (gRes.ok) globalCssContent = await gRes.text();
                  if (sRes.ok) screenCssContent = await sRes.text();
                } catch (e) {
                  console.error("Failed to load CSS files for merging", e);
                }

                // Process global.css
                globalCssContent = globalCssContent.replace(/::not\(/g, ":not(");
                globalCssContent = globalCssContent.replace(/blockquote\s*{\s*margin:\s*1\.5em\s*0;\s*padding:\s*0\s*1\.6em(?:\s*0\s*1\.6em)?;\s*border-left:\s*#daf2fd\s*}/, "blockquote { margin: 1.5em 0; padding: 0 1.6em; border-left: 3px solid #daf2fd; }");
                globalCssContent = globalCssContent.replace(/border-left:\s*#daf2fd;/, "border-left: 3px solid #daf2fd;");

                // Process screen.css
                screenCssContent = screenCssContent.replace(/@import\s+"global\.css";?\n?/, "");
                
                // Replace all color-mod instances
                screenCssContent = screenCssContent.replace(/color-mod\((var\(--[a-zA-Z0-9-]+\))\s+l\(\+([0-9]+)%\)\)/g, "color-mix(in srgb, $1, white $2%)");
                screenCssContent = screenCssContent.replace(/color-mod\((var\(--[a-zA-Z0-9-]+\))\s+l\(-([0-9]+)%\)\)/g, "color-mix(in srgb, $1, black $2%)");
                screenCssContent = screenCssContent.replace(/color-mod\((var\(--[a-zA-Z0-9-]+\))\s+lightness\(([0-9]+)%\)\)/g, "color-mix(in srgb, $1, white $2%)");
                screenCssContent = screenCssContent.replace(/color-mod\((var\(--[a-zA-Z0-9-]+\))\s+lightness\(([0-9]+)%\)\s+saturation\(([0-9]+)%\)\)/g, "color-mix(in srgb, $1, white $2%)");
                screenCssContent = screenCssContent.replace(/color-mod\((var\(--[a-zA-Z0-9-]+\))\s+a\(0%\)\)/g, "transparent");
                screenCssContent = screenCssContent.replace(/color-mod\([^)]+\)/g, "inherit"); // Catch-all fallback
                
                screenCssContent = screenCssContent.replace(/black 70%/g, "white 15%");
                screenCssContent = screenCssContent.replace(/var\(--ghost-accent-color(?!\s*,)[^)]*\)/g, "var(--ghost-accent-color, #15171a)");

                const baseMergedCss = `/* 1. Global Reset & Base Typography */\n\n${globalCssContent}\n\n/* 2. Theme Styles (Screen) */\n\n${screenCssContent}`;

                await Promise.all(
                  manifest.map(async (filePath) => {
                    // Skip global.css and built css files so we can overwrite them cleanly
                    if (filePath === "assets/css/global.css" || filePath === "assets/built/global.css") return;
                    if (filePath === "assets/built/screen.css" || filePath === "assets/css/screen.css") return;

                    const res = await fetch(`/casper-template/${filePath}`);
                    if (!res.ok) throw new Error(`Failed to load ${filePath}`);
                    
                    const buffer = await res.arrayBuffer();
                    zip.file(filePath, buffer);
                  })
                );

                const { generateThemeFiles } = await import("./compiler");
                const latestDoc = useEditorStore.getState().document;
                const files = generateThemeFiles(latestDoc);

                for (const [name, content] of Object.entries(files)) {
                  if (name === "assets/css/screen.css") {
                    const finalCss = baseMergedCss + "\n\n/* 3. Custom Builder Components & Color Palettes */\n\n" + (content as string);
                    zip.file("assets/built/screen.css", finalCss);
                    zip.file("assets/css/screen.css", finalCss);
                  } else if (name === "package.json") {
                    const originalPackageFile = zip.file("package.json");
                    const originalPackage = originalPackageFile ? JSON.parse(await originalPackageFile.async("text")) : {};
                    const compiledPackage = JSON.parse(content as string);
                    
                    const mergedPackage = {
                      ...originalPackage,
                      name: compiledPackage.name || originalPackage.name,
                      description: compiledPackage.description || originalPackage.description,
                      version: compiledPackage.version || originalPackage.version,
                      config: compiledPackage.config || originalPackage.config,
                      author: {
                        ...originalPackage.author,
                        name: compiledPackage.author?.name || originalPackage.author?.name
                      }
                    };
                    
                    if (mergedPackage.config && mergedPackage.config.custom) {
                      // We only keep custom settings that are actually used in the templates we include 
                      // from Casper (like partials/post-card.hbs).
                      const feedLayout = mergedPackage.config.custom.feed_layout;
                      if (feedLayout) {
                        mergedPackage.config.custom = {
                          feed_layout: feedLayout
                        };
                      } else {
                        delete mergedPackage.config.custom;
                      }
                    }
                    zip.file("package.json", JSON.stringify(mergedPackage, null, 2));
                  } else {
                    zip.file(name, content as string);
                  }
                }

                const blob = await zip.generateAsync({ type: "blob" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${latestDoc.metadata.name.toLowerCase().replace(/\s+/g, "-")}-theme.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error("Export theme error:", error);
                alert("Error exporting theme. Please check console logs.");
              }
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
