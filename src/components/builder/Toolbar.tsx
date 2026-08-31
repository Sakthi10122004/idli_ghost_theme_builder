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

import React, { useEffect, useState } from "react";
import { Save, Cloud, Check, Loader2, AlertCircle, LayoutTemplate, X, AlertTriangle } from "lucide-react";
import TemplatePickerModal from "./TemplatePickerModal";

export default function Toolbar() {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Gscan Validation State
  const [isExporting, setIsExporting] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationReport, setValidationReport] = useState<any>(null);
  const [themeBlob, setThemeBlob] = useState<Blob | null>(null);
  const [themeFilename, setThemeFilename] = useState<string>("");
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

  const [liveScore, setLiveScore] = useState<{ value: number, level: string } | null>(null);
  const [isValidatingLive, setIsValidatingLive] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        setIsValidatingLive(true);
        const zip = new JSZip();
        
        // Fetch minimal required ghost assets for accurate score
        const manifestRes = await fetch("/casper-template/manifest.json");
        if (manifestRes.ok) {
          const manifest: string[] = await manifestRes.json();
          await Promise.all(
            manifest.map(async (filePath) => {
              if (!filePath.startsWith("locales/") && !filePath.startsWith("partials/icons/")) return;
              const res = await fetch(`/casper-template/${filePath}`);
              if (res.ok) {
                zip.file(filePath, await res.arrayBuffer());
              }
            })
          );
        }

        const { generateThemeFiles } = await import("./compiler");
        const files = generateThemeFiles(themeDoc as any);
        Object.entries(files).forEach(([name, content]) => {
          zip.file(name, content as string);
        });

        const blob = await zip.generateAsync({ type: "blob" });
        const formData = new FormData();
        formData.append("theme", blob, "live-theme.zip");

        const validateRes = await fetch("/api/theme/validate", {
          method: "POST",
          body: formData
        });
        
        if (validateRes.ok) {
          const validateData = await validateRes.json();
          if (validateData.success && validateData.report?.score) {
            setLiveScore(validateData.report.score);
            setValidationReport(validateData.report);
          }
        }
      } catch (e) {
        // Silently ignore background validation errors
      } finally {
        setIsValidatingLive(false);
      }
    }, 4000); // 4s debounce

    return () => clearTimeout(handler);
  }, [themeDoc]);

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
    <>
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
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 px-2 py-1 bg-brand-canvas-soft border border-brand-hairline rounded-sm text-xs font-medium hover:bg-gray-100 text-brand-ink transition-colors"
            title="Choose a layout template for the current page"
          >
            <LayoutTemplate size={13} />
            <span>Templates</span>
          </button>
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
          {/* Live Score Badge */}
          {liveScore && (
            <button 
              onClick={() => setShowValidationModal(true)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border transition-colors ${liveScore.level === 'error' ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' : liveScore.level === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`} 
              title="Click to view GScan validation report"
            >
              <span className="text-[10px] font-bold font-mono tracking-tight">GSCAN: {liveScore.value}/100</span>
              {isValidatingLive && <Loader2 size={10} className="animate-spin opacity-50" />}
            </button>
          )}

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

                await Promise.all(
                  manifest.map(async (filePath) => {
                    // Only cherry-pick locales and icons
                    if (!filePath.startsWith("locales/") && !filePath.startsWith("partials/icons/")) return;

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
                    zip.file("assets/built/screen.css", content as string);
                    zip.file("assets/css/screen.css", content as string);
                  } else if (name === "package.json") {
                    const compiledPackage = JSON.parse(content as string);
                    zip.file("package.json", JSON.stringify(compiledPackage, null, 2));
                  } else {
                    zip.file(name, content as string);
                  }
                }

                const blob = await zip.generateAsync({ type: "blob" });
                const filename = `${latestDoc.metadata.name.toLowerCase().replace(/\s+/g, "-")}-theme.zip`;
                
                setIsExporting(true);
                
                const formData = new FormData();
                formData.append("theme", blob, filename);
                
                const validateRes = await fetch("/api/theme/validate", {
                  method: "POST",
                  body: formData
                });
                
                const validateData = await validateRes.json();
                setIsExporting(false);
                
                if (!validateRes.ok || validateData.error) {
                  console.warn("Theme validation API failed:", validateData.error);
                  alert(`Warning: The theme validation service encountered an error (${validateData.error || 'Server Error'}). We will download the theme anyway, but it has not been fully verified.`);
                } else if (validateData.success && validateData.report) {
                  const hasFatals = Object.keys(validateData.report.fatal || {}).length > 0;
                  const hasErrors = Object.keys(validateData.report.error || {}).length > 0;
                  const hasWarnings = Object.keys(validateData.report.warning || {}).length > 0;
                  
                  if (hasFatals || hasErrors || hasWarnings) {
                    setValidationReport(validateData.report);
                    setThemeBlob(blob);
                    setThemeFilename(filename);
                    setShowValidationModal(true);
                    return;
                  }
                }
                
                // If clean (or API failed but we still have blob), download directly
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch (error) {
                setIsExporting(false);
                console.error("Export theme error:", error);
                alert("Error exporting theme. Please check console logs.");
              }
            }}
          >
            {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            <span>{isExporting ? "Validating..." : "Export Theme"}</span>
          </button>
        </div>
      </div>
    </header>

      <TemplatePickerModal 
        isOpen={showTemplateModal} 
        onClose={() => setShowTemplateModal(false)} 
      />

      {showValidationModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ zIndex: 9999 }}>
          <div className="bg-white rounded-xl shadow-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ width: '600px', maxWidth: '90vw' }}>
            <div className={`flex justify-between items-center px-6 py-4 border-b border-gray-100 ${validationReport?.score?.level === 'error' ? 'bg-red-50/50' : validationReport?.score?.level === 'warning' ? 'bg-yellow-50/50' : 'bg-green-50/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${validationReport?.score?.level === 'error' ? 'bg-red-100 text-red-600' : validationReport?.score?.level === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                  {validationReport?.score?.level === 'passing' ? <Check size={20} /> : <AlertTriangle size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">
                      {validationReport?.score?.level === 'passing' ? 'Theme Validation Passed' : 'Theme Validation Issues'}
                    </h3>
                    {validationReport?.score && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${validationReport.score.level === 'error' ? 'bg-red-100 text-red-700' : validationReport.score.level === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        Score: {validationReport.score.value}/100
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Ghost validator (gscan) detected issues that may prevent upload.</p>
                </div>
              </div>
              <button onClick={() => setShowValidationModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              {(!validationReport?.fatal || Object.keys(validationReport.fatal).length === 0) &&
               (!validationReport?.error || Object.keys(validationReport.error).length === 0) &&
               (!validationReport?.warning || Object.keys(validationReport.warning).length === 0) && (
                 <div className="text-center py-12">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Check size={32} />
                   </div>
                   <h4 className="font-bold text-gray-900 text-lg mb-2">Theme is fully compatible!</h4>
                   <p className="text-gray-500">No issues were found. Your theme is ready to be exported and uploaded to Ghost.</p>
                 </div>
               )}

              {validationReport?.fatal && Object.keys(validationReport.fatal).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-red-700 text-sm mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                    Fatal Errors ({Object.keys(validationReport.fatal).length})
                  </h4>
                  <div className="flex flex-col gap-3">
                    {Object.values(validationReport.fatal).map((err: any, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{err.rule}</p>
                        <p className="text-xs text-gray-600 mb-2">{err.details}</p>
                        {err.failures?.length > 0 && (
                          <div className="bg-red-50 p-2 rounded text-[11px] font-mono text-red-800 break-all">
                            Affected: {err.failures.map((f: any) => f.ref).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {validationReport?.error && Object.keys(validationReport.error).length > 0 && (
                <div>
                  <h4 className="font-bold text-orange-600 text-sm mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 inline-block"></span>
                    Errors ({Object.keys(validationReport.error).length})
                  </h4>
                  <div className="flex flex-col gap-3">
                    {Object.values(validationReport.error).map((err: any, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{err.rule}</p>
                        <p className="text-xs text-gray-600 mb-2">{err.details}</p>
                        {err.failures?.length > 0 && (
                          <div className="bg-orange-50 p-2 rounded text-[11px] font-mono text-orange-800 break-all">
                            Affected: {err.failures.map((f: any) => f.ref).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {validationReport?.warning && Object.keys(validationReport.warning).length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-yellow-600 text-sm mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
                    Warnings ({Object.keys(validationReport.warning).length})
                  </h4>
                  <div className="flex flex-col gap-3">
                    {Object.values(validationReport.warning).map((err: any, i: number) => (
                      <div key={i} className="bg-white p-4 rounded-lg border border-yellow-100 shadow-sm">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{err.rule}</p>
                        <p className="text-xs text-gray-600 mb-2">{err.details}</p>
                        {err.failures?.length > 0 && (
                          <div className="bg-yellow-50 p-2 rounded text-[11px] font-mono text-yellow-800 break-all">
                            Affected: {err.failures.map((f: any) => f.ref).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setShowValidationModal(false)}
              >
                {themeBlob ? "Cancel & Fix" : "Close"}
              </button>
              {themeBlob && (
                <button 
                  className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm transition-all"
                  onClick={() => {
                    if (themeBlob && themeFilename) {
                      const url = URL.createObjectURL(themeBlob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = themeFilename;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                    setShowValidationModal(false);
                  }}
                >
                  Download Anyway
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
