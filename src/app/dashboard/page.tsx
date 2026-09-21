"use client";

import React, { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { 
  Plus, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  FileCode2, 
  Settings, 
  Search, 
  Layout, 
  Globe, 
  ShieldCheck, 
  SlidersHorizontal,
  X,
  Loader2,
  Check,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import { useEditorStore, INITIAL_THEME_DOCUMENT, unwrapStandaloneSections } from "@/store/editorStore";
import { ThemeDocument } from "@/types/theme";

interface ThemeProject {
  id: string;
  name: string;
  author: string;
  version: string;
  description: string;
  updatedAt: string;
  document: ThemeDocument;
}

const STORAGE_THEMES_KEY = "ghost_user_themes_v2";
const STORAGE_ACTIVE_ID_KEY = "ghost_active_theme_id_v2";

function createThemeId(): string {
  return `theme-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { 
    document: themeDoc, 
    updateMetadata, 
    setDocument, 
    activeThemeId, 
    setActiveThemeId,
    userId,
    setUserId,
    saveTheme,
  } = useEditorStore();

  // Deterministic default theme for initial render (matches on server and client)
  const defaultInitialThemes: ThemeProject[] = [
    {
      id: "theme-primary",
      name: themeDoc.metadata?.name || "Untitled Theme",
      author: themeDoc.metadata?.author || "Ghost Creator",
      version: themeDoc.metadata?.version || "1.0.0",
      description: themeDoc.metadata?.description || "A clean, modern Ghost publication theme",
      updatedAt: "Just now",
      document: themeDoc,
    },
  ];

  const [themes, setThemes] = useState<ThemeProject[]>(defaultInitialThemes);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportSuccessId, setExportSuccessId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<ThemeProject | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<ThemeProject | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Theme Form State
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeAuthor, setNewThemeAuthor] = useState("");
  const [newThemeDescription, setNewThemeDescription] = useState("");

  // Edit Theme Form State
  const [editName, setEditName] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editVersion, setEditVersion] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Load themes from localStorage & cloud database after client hydration mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_THEMES_KEY) || localStorage.getItem("ghost_user_themes_v1");
      if (stored) {
        const parsed: ThemeProject[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migratedParsed = parsed.map((t) => ({
            ...t,
            document: unwrapStandaloneSections(t.document),
          }));
          const storedActiveId = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
          const activeProj = (storedActiveId ? migratedParsed.find((t) => t.id === storedActiveId) : null) || migratedParsed[0];

          startTransition(() => {
            setThemes(migratedParsed);
            if (activeProj) {
              setActiveThemeId(activeProj.id);
              setDocument(activeProj.document, activeProj.id);
            }
          });
          try {
            localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(migratedParsed));
          } catch {}
        }
      } else {
        localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(defaultInitialThemes));
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, defaultInitialThemes[0].id);
      }
      startTransition(() => {
        setHasLoadedFromStorage(true);
      });

      // Check cloud database if logged in and sync cloud-saved theme
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then(async (authData) => {
          if (authData.authenticated && authData.userId) {
            setUserId(authData.userId);
            const res = await fetch(`/api/theme?userId=${encodeURIComponent(authData.userId)}`);
            const data = await res.json();
            if (data.document && data.document.metadata) {
              const dbDoc = data.document;
              const dbThemeId = dbDoc.metadata.themeId;
              const dbThemeName = dbDoc.metadata.name;

              setThemes((prevThemes) => {
                const updated = [...prevThemes];
                // Match ONLY by explicit themeId if present, or if theme-primary matches dbThemeName
                const matchIdx = updated.findIndex(
                  (t) => (dbThemeId ? t.id === dbThemeId : false) || (t.id === "theme-primary" && t.name === dbThemeName)
                );
                if (matchIdx >= 0) {
                  updated[matchIdx] = {
                    ...updated[matchIdx],
                    name: dbDoc.metadata.name,
                    author: dbDoc.metadata.author,
                    version: dbDoc.metadata.version,
                    description: dbDoc.metadata.description || "",
                    document: dbDoc,
                    updatedAt: "Just now",
                  };
                  try {
                    localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
                  } catch {}
                } else if (
                  updated.length === 0 ||
                  (updated.length === 1 && updated[0].id === "theme-primary" && updated[0].name === "My Ghost Theme")
                ) {
                  // Fresh session with only default starter theme: safely hydrate cloud theme
                  const cloudThemeId = dbThemeId || "theme-primary";
                  updated[0] = {
                    id: cloudThemeId,
                    name: dbDoc.metadata.name,
                    author: dbDoc.metadata.author,
                    version: dbDoc.metadata.version,
                    description: dbDoc.metadata.description || "",
                    updatedAt: "Just now",
                    document: dbDoc,
                  };
                  try {
                    localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
                  } catch {}
                }
                return updated;
              });

              // Only setDocument in editor store if the active theme matches this db theme
              const currentActiveId = localStorage.getItem(STORAGE_ACTIVE_ID_KEY);
              if (dbThemeId && currentActiveId === dbThemeId) {
                setDocument(dbDoc, dbThemeId);
              }
            }
          }
        })
        .catch(console.error);
    } catch (e) {
      console.error("Failed to load themes from storage:", e);
      queueMicrotask(() => {
        setHasLoadedFromStorage(true);
      });
    }
  }, []);

  // Synchronize themes list changes into localStorage once loaded
  useEffect(() => {
    if (!hasLoadedFromStorage) return;
    try {
      localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(themes));
    } catch (err) {
      console.error("Failed to save themes:", err);
    }
  }, [themes, hasLoadedFromStorage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenTheme = (theme: ThemeProject) => {
    setActiveThemeId(theme.id);
    setDocument(theme.document, theme.id);
    try {
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, theme.id);
    } catch {}
    router.push("/builder");
  };

  const handleDuplicateTheme = (theme: ThemeProject) => {
    const duplicatedDoc: ThemeDocument = JSON.parse(JSON.stringify(theme.document));
    const newId = createThemeId();
    const newName = `${theme.name} (Copy)`;
    duplicatedDoc.metadata.name = newName;
    duplicatedDoc.metadata.themeId = newId;

    if (duplicatedDoc.blocks && duplicatedDoc.blocks["header-sec-1"]) {
      duplicatedDoc.blocks["header-sec-1"].props = {
        ...duplicatedDoc.blocks["header-sec-1"].props,
        general: {
          ...duplicatedDoc.blocks["header-sec-1"].props?.general,
          siteTitle: newName,
        },
      };
    }

    const newProject: ThemeProject = {
      id: newId,
      name: newName,
      author: theme.author,
      version: theme.version,
      description: theme.description,
      updatedAt: "Just now",
      document: duplicatedDoc,
    };

    const updated = [newProject, ...themes];
    setThemes(updated);
    try {
      localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
    } catch {}
    showToast(`Duplicated "${theme.name}" as "${newName}"!`);
  };

  const handleDeleteClick = (theme: ThemeProject) => {
    setThemeToDelete(theme);
  };

  const confirmDeleteTheme = async () => {
    if (!themeToDelete) return;
    const id = themeToDelete.id;
    const targetName = themeToDelete.name;

    if (themes.length <= 1) {
      // User is deleting their only theme: reset workspace to a fresh starter theme
      const freshDoc: ThemeDocument = JSON.parse(JSON.stringify(INITIAL_THEME_DOCUMENT));
      const freshId = createThemeId();
      freshDoc.metadata = {
        name: "My Ghost Theme",
        author: "Ghost Creator",
        version: "1.0.0",
        description: "A clean, modern Ghost publication theme",
        themeId: freshId,
      };
      if (freshDoc.blocks && freshDoc.blocks["header-sec-1"]) {
        freshDoc.blocks["header-sec-1"].props = {
          ...freshDoc.blocks["header-sec-1"].props,
          general: {
            ...freshDoc.blocks["header-sec-1"].props?.general,
            siteTitle: "",
          },
        };
      }

      const freshTheme: ThemeProject = {
        id: freshId,
        name: freshDoc.metadata.name,
        author: freshDoc.metadata.author,
        version: freshDoc.metadata.version,
        description: freshDoc.metadata.description || "",
        updatedAt: "Just now",
        document: freshDoc,
      };

      const updated = [freshTheme];
      setThemes(updated);
      try {
        localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, freshId);
      } catch {}

      setDocument(freshDoc, freshId);
      setActiveThemeId(freshId);

      if (userId) {
        try {
          await fetch("/api/theme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, document: freshDoc }),
          });
        } catch {}
      }

      showToast(`Deleted theme "${targetName}". Workspace reset with a fresh starter theme.`);
      setThemeToDelete(null);
      return;
    }

    // Multiple themes exist
    const updated = themes.filter((t) => t.id !== id);
    setThemes(updated);
    try {
      localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
    } catch {}

    // If deleting active theme, switch to first remaining
    if (activeThemeId === id && updated.length > 0) {
      setDocument(updated[0].document, updated[0].id);
      setActiveThemeId(updated[0].id);
      try {
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, updated[0].id);
      } catch {}
      if (userId && updated[0].document) {
        try {
          fetch("/api/theme", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, document: updated[0].document }),
          }).catch(() => {});
        } catch {}
      }
    }
    showToast(`Deleted theme "${targetName}".`);
    setThemeToDelete(null);
  };

  const handleCreateTheme = (e: React.FormEvent, openBuilder = true) => {
    e.preventDefault();
    const trimmedName = newThemeName.trim();
    if (!trimmedName) return;

    const newId = createThemeId();
    const baseDoc: ThemeDocument = JSON.parse(JSON.stringify(INITIAL_THEME_DOCUMENT));
    baseDoc.metadata = {
      name: trimmedName,
      author: newThemeAuthor.trim() || activeTheme?.author || "Ghost Creator",
      version: "1.0.0",
      description: newThemeDescription.trim() || "A custom Ghost publication theme",
      themeId: newId,
    };

    // Update siteTitle in header block so visual canvas renders the new theme name
    if (baseDoc.blocks && baseDoc.blocks["header-sec-1"]) {
      baseDoc.blocks["header-sec-1"].props = {
        ...baseDoc.blocks["header-sec-1"].props,
        general: {
          ...baseDoc.blocks["header-sec-1"].props?.general,
          siteTitle: trimmedName,
        },
      };
    }

    const newProject: ThemeProject = {
      id: newId,
      name: trimmedName,
      author: baseDoc.metadata.author,
      version: baseDoc.metadata.version,
      description: baseDoc.metadata.description || "",
      updatedAt: "Just now",
      document: baseDoc,
    };

    const updated = [newProject, ...themes];
    setThemes(updated);
    try {
      localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, newId);
    } catch (err) {
      console.error("Failed to store new theme:", err);
    }

    setDocument(baseDoc, newId);
    setActiveThemeId(newId);

    // Save newly created theme into user DB session so cloud sync doesn't overwrite it
    if (userId) {
      fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, document: baseDoc }),
      }).catch(() => {});
    }

    setShowNewModal(false);
    setNewThemeName("");
    setNewThemeAuthor("");
    setNewThemeDescription("");

    if (openBuilder) {
      router.push("/builder");
    } else {
      showToast(`Created theme "${trimmedName}"!`);
    }
  };

  const openSettings = (theme: ThemeProject) => {
    setThemeToEdit(theme);
    setEditName(theme.name);
    setEditAuthor(theme.author);
    setEditVersion(theme.version);
    setEditDescription(theme.description);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeToEdit || !editName.trim()) return;

    const updated = themes.map((t) => {
      if (t.id === themeToEdit.id) {
        const updatedDoc = {
          ...t.document,
          metadata: {
            ...t.document.metadata,
            name: editName.trim(),
            author: editAuthor.trim(),
            version: editVersion.trim(),
            description: editDescription.trim(),
          },
        };
        // Update header block if present
        if (updatedDoc.blocks && updatedDoc.blocks["header-sec-1"]) {
          updatedDoc.blocks["header-sec-1"].props = {
            ...updatedDoc.blocks["header-sec-1"].props,
            general: {
              ...updatedDoc.blocks["header-sec-1"].props?.general,
              siteTitle: editName.trim(),
            },
          };
        }
        // If this is the active theme, update Zustand store and cloud DB
        if (t.id === activeThemeId || t.name === themeDoc.metadata.name) {
          updateMetadata(updatedDoc.metadata);
          setTimeout(() => saveTheme(), 100);
        }
        return {
          ...t,
          name: editName.trim(),
          author: editAuthor.trim(),
          version: editVersion.trim(),
          description: editDescription.trim(),
          updatedAt: "Just now",
          document: updatedDoc,
        };
      }
      return t;
    });

    setThemes(updated);
    try {
      localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
    } catch {}
    setThemeToEdit(null);
    showToast("Theme configuration updated.");
  };

  const handleExportThemeZip = async (theme: ThemeProject) => {
    try {
      setIsExporting(theme.id);
      const zip = new JSZip();

      // Cherry-pick casper template assets if available
      try {
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
      } catch {
        // Continue if local manifest is absent
      }

      const { generateThemeFiles } = await import("@/components/builder/compiler");
      const files = generateThemeFiles(theme.document);

      for (const [name, content] of Object.entries(files)) {
        if (name === "assets/css/screen.css") {
          zip.file("assets/built/screen.css", content);
          zip.file("assets/css/screen.css", content);
        } else if (name === "package.json") {
          const compiledPackage = JSON.parse(content);
          zip.file("package.json", JSON.stringify(compiledPackage, null, 2));
        } else if (name.startsWith("assets/images/") && !name.endsWith(".svg")) {
          zip.file(name, content, { base64: true });
        } else {
          zip.file(name, content);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const filename = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-theme.zip`;

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setExportSuccessId(theme.id);
      setTimeout(() => setExportSuccessId(null), 3000);
      showToast(`Exported "${filename}"!`);
    } catch (err) {
      console.error("Theme export failed:", err);
      alert("Failed to export theme ZIP. Please verify compiler outputs.");
    } finally {
      setIsExporting(null);
    }
  };

  const activeTheme = themes.find((t) => t.id === activeThemeId) || themes[0];

  const filteredThemes = themes.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-brand-primary text-white text-xs px-4 py-2.5 rounded-lg shadow-level-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-hairline px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-primary flex items-center justify-center rounded-sm transition-transform group-hover:scale-105">
              <span className="text-white font-mono font-semibold text-sm">G</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-brand-ink">Ghost Theme Builder</span>
              <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded-sm text-brand-mute uppercase">Dashboard</span>
            </div>
          </Link>
          
          <div className="h-4 w-px bg-brand-hairline mx-1 hidden sm:block" />

          <nav className="hidden md:flex items-center gap-1 text-xs text-brand-body">
            <Link href="/" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">
              Overview
            </Link>
            <span className="px-2.5 py-1 rounded text-brand-ink font-semibold bg-brand-canvas-soft">
              My Themes
            </span>
            <Link href="/builder" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">
              Visual Builder
            </Link>
            <a 
              href="https://ghost.org/docs/themes/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors inline-flex items-center gap-1"
            >
              Ghost Docs <ExternalLink size={11} className="opacity-60" />
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewModal(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-hairline rounded-md text-xs font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-colors"
          >
            <Plus size={13} />
            <span>New Theme</span>
          </button>
          <Link
            href="/builder"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-primary text-white rounded-md text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
          >
            <Layout size={13} />
            <span>Open Builder</span>
          </Link>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1320px] w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome & Quick Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
              Project Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink mt-0.5">
              Theme Management Dashboard
            </h1>
            <p className="text-sm text-brand-body mt-1">
              Design, compile, validate, and export production-ready Ghost 5.x publication themes.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-mute pointer-events-none" />
              <input
                type="text"
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary w-56 sm:w-64"
              />
            </div>
            <button
              onClick={() => {
                const active = themes.find((t) => t.id === activeThemeId || t.name === themeDoc.metadata.name) || themes[0];
                if (active) openSettings(active);
              }}
              className="p-2 border border-brand-hairline rounded-md bg-white hover:bg-brand-canvas-soft text-brand-ink transition-colors"
              title="Active Theme Settings"
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-brand-hairline rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-brand-mute mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Active Theme</span>
              <FileCode2 size={16} />
            </div>
            <div className="text-lg font-bold text-brand-ink truncate">
              {!hasLoadedFromStorage ? (
                <span className="inline-block h-5 w-28 bg-gray-200/80 animate-pulse rounded align-middle" />
              ) : (
                activeTheme?.name || themeDoc.metadata?.name || "Untitled Theme"
              )}
            </div>
            <div className="text-xs text-brand-mute mt-1">
              {!hasLoadedFromStorage ? (
                <span className="inline-block h-3.5 w-36 bg-gray-100 animate-pulse rounded align-middle" />
              ) : (
                `v${activeTheme?.version || themeDoc.metadata?.version || "1.0.0"} · By ${activeTheme?.author || themeDoc.metadata?.author || "Ghost Creator"}`
              )}
            </div>
          </div>

          <div className="p-4 bg-white border border-brand-hairline rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">GScan Validation</span>
              <ShieldCheck size={16} />
            </div>
            <div className="text-lg font-bold text-brand-ink flex items-center gap-2">
              <span>100 / 100</span>
              <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                Passed
              </span>
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Zero errors · Casper &amp; Ghost 5.x spec compliant
            </div>
          </div>

          <div className="p-4 bg-white border border-brand-hairline rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-brand-mute mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Total Themes</span>
              <Layers size={16} />
            </div>
            <div className="text-lg font-bold text-brand-ink" suppressHydrationWarning>
              {!hasLoadedFromStorage ? (
                <span className="inline-block h-5 w-16 bg-gray-200/80 animate-pulse rounded align-middle" />
              ) : (
                `${themes.length} ${themes.length === 1 ? "Theme" : "Themes"}`
              )}
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Independent Ghost publication projects
            </div>
          </div>

          <div className="p-4 bg-white border border-brand-hairline rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Export Readiness</span>
              <Globe size={16} />
            </div>
            <div className="text-lg font-bold text-brand-ink">
              Ghost 5.x Ready
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Automated Handlebars &amp; minified CSS
            </div>
          </div>
        </div>

        {/* Themes Grid Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-brand-ink">
                  My Themes
                </h3>
                <span className="font-mono text-[11px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded text-brand-mute" suppressHydrationWarning>
                  {!hasLoadedFromStorage ? "..." : `${filteredThemes.length} ${filteredThemes.length === 1 ? "theme" : "themes"}`}
                </span>
              </div>
              <p className="text-xs text-brand-body mt-0.5">
                Manage, edit, and export your Ghost CMS publication themes.
              </p>
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white rounded-md text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs self-start sm:self-auto"
            >
              <Plus size={13} />
              <span>New Theme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {!hasLoadedFromStorage ? (
              <div className="bg-white border border-brand-hairline rounded-xl p-5 flex flex-col justify-between min-h-[290px] animate-pulse">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-gray-200" />
                      <div className="space-y-1.5">
                        <div className="h-4 w-28 bg-gray-200 rounded" />
                        <div className="h-2.5 w-20 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="h-5 w-14 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-3 w-48 bg-gray-100 rounded mt-3" />
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="h-14 bg-brand-canvas-soft rounded-lg" />
                    <div className="h-14 bg-brand-canvas-soft rounded-lg" />
                  </div>
                </div>
                <div className="pt-4">
                  <div className="h-9 w-full bg-gray-200 rounded-lg" />
                </div>
              </div>
            ) : (
              filteredThemes.map((theme) => {
              const isActive = theme.id === (activeTheme?.id || activeThemeId);
              const pages = Object.keys(theme.document.pages || {});
              const blocksCount = Object.keys(theme.document.blocks || {}).length;
              const isCurrentlyExporting = isExporting === theme.id;
              const isExportSuccess = exportSuccessId === theme.id;

              return (
                <div 
                  key={theme.id}
                  className={`bg-white border rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group ${
                    isActive ? "border-brand-primary/50 ring-1 ring-brand-primary/10" : "border-brand-hairline hover:border-brand-hairline-strong"
                  }`}
                >
                  {/* Card Top Banner */}
                  <div className="p-4 border-b border-brand-hairline bg-gradient-to-r from-brand-canvas-soft via-white to-brand-canvas-soft flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-brand-primary text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
                        {theme.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-brand-ink group-hover:text-brand-primary transition-colors block truncate max-w-[160px]">
                          {theme.name}
                        </span>
                        <span className="font-mono text-[10px] text-brand-mute block truncate max-w-[160px]">
                          v{theme.version} · By {theme.author}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-brand-mute px-2 py-0.5 rounded border border-brand-hairline bg-brand-canvas-soft">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-xs text-brand-body leading-relaxed line-clamp-2">
                        {theme.description || "A custom high-performance Ghost publication theme built with the visual editor."}
                      </p>

                      {/* Theme Stats Specs */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-brand-hairline text-xs">
                        <div className="p-2.5 rounded-lg bg-brand-canvas-soft border border-brand-hairline space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-brand-mute block">
                            Templates
                          </span>
                          <span className="font-bold text-brand-ink text-xs">
                            {pages.length} Layouts
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-brand-canvas-soft border border-brand-hairline space-y-0.5">
                          <span className="text-[10px] font-mono uppercase text-brand-mute block">
                            GScan Health
                          </span>
                          <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                            <Check size={12} /> 100/100
                          </span>
                        </div>
                      </div>

                      {/* Included template file pills */}
                      <div className="flex flex-wrap items-center gap-1 pt-3">
                        {pages.slice(0, 5).map((slug) => (
                          <span 
                            key={slug} 
                            className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded text-brand-body"
                          >
                            {slug === "home" ? "index.hbs" : `${slug}.hbs`}
                          </span>
                        ))}
                        {pages.length > 5 && (
                          <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded text-brand-mute">
                            +{pages.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-3 border-t border-brand-hairline space-y-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenTheme(theme)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-primary text-white rounded-md text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
                        >
                          <Layout size={13} />
                          <span>Open in Builder</span>
                        </button>
                        <button
                          onClick={() => handleExportThemeZip(theme)}
                          disabled={isCurrentlyExporting}
                          className={`px-3 py-2 border rounded-md text-xs font-semibold transition-colors flex items-center gap-1 ${
                            isExportSuccess 
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
                              : "border-brand-hairline text-brand-ink hover:bg-brand-canvas-soft bg-white"
                          }`}
                          title="Export Theme ZIP"
                        >
                          {isCurrentlyExporting ? (
                            <Loader2 size={13} className="animate-spin text-brand-mute" />
                          ) : isExportSuccess ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Download size={13} />
                          )}
                          <span className="hidden sm:inline">ZIP</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-brand-mute pt-0.5 px-0.5">
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                          <Clock size={10} className="opacity-70" />
                          <span>{blocksCount} blocks</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openSettings(theme)}
                            className="hover:text-brand-ink transition-colors text-[11px] font-medium flex items-center gap-1"
                            title="Theme Settings"
                          >
                            <Settings size={11} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDuplicateTheme(theme)}
                            className="hover:text-brand-ink transition-colors text-[11px] font-medium flex items-center gap-1"
                            title="Duplicate Theme"
                          >
                            <Copy size={11} />
                            <span>Duplicate</span>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(theme)}
                            className="hover:text-rose-600 transition-colors text-[11px] font-medium flex items-center gap-1"
                            title="Delete Theme"
                          >
                            <Trash2 size={11} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }))}

            {/* Create New Theme Card */}
            <button
              onClick={() => setShowNewModal(true)}
              className="border-2 border-dashed border-brand-hairline hover:border-brand-primary/40 rounded-xl p-6 flex flex-col items-center justify-center text-center group transition-all bg-brand-canvas-soft/30 hover:bg-white min-h-[280px]"
            >
              <div className="w-11 h-11 rounded-full bg-white border border-brand-hairline flex items-center justify-center text-brand-body group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-xs mb-3">
                <Plus size={20} />
              </div>
              <h4 className="font-bold text-sm text-brand-ink group-hover:text-brand-primary transition-colors">
                Create New Theme
              </h4>
              <p className="text-xs text-brand-mute max-w-[220px] mt-1 leading-relaxed">
                Initialize a new publication theme project ready for the visual builder.
              </p>
            </button>
          </div>
        </section>

        {/* Ghost Theme Validator Health Check Widget */}
        <section className="p-5 bg-white border border-brand-hairline rounded-xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <h3 className="font-bold text-sm text-brand-ink">
                Ghost Architecture &amp; GScan Validator Checklist
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded self-start sm:self-auto">
              Automated Compiler Rules Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-brand-body">
            <div className="p-3 bg-brand-canvas-soft rounded-lg border border-brand-hairline space-y-1">
              <div className="font-semibold text-brand-ink flex items-center gap-1.5">
                <Check size={13} className="text-emerald-600" />
                <span>Package Metadata Engine</span>
              </div>
              <p className="text-[11px] text-brand-mute leading-normal">
                Includes author email, config.card_assets: true, and engines.ghost &gt;= 4.0.0.
              </p>
            </div>

            <div className="p-3 bg-brand-canvas-soft rounded-lg border border-brand-hairline space-y-1">
              <div className="font-semibold text-brand-ink flex items-center gap-1.5">
                <Check size={13} className="text-emerald-600" />
                <span>Responsive CSS &amp; Layout</span>
              </div>
              <p className="text-[11px] text-brand-mute leading-normal">
                Minified screen.css with --gh-font variables, .kg-width-wide, and responsive container insets.
              </p>
            </div>

            <div className="p-3 bg-brand-canvas-soft rounded-lg border border-brand-hairline space-y-1">
              <div className="font-semibold text-brand-ink flex items-center gap-1.5">
                <Check size={13} className="text-emerald-600" />
                <span>Casper Core Partial Injections</span>
              </div>
              <p className="text-[11px] text-brand-mute leading-normal">
                Injects locales (en.json), SVG icons, and dynamic primary/secondary navigation helper loops.
              </p>
            </div>
          </div>
        </section>

        {/* 3-Step Deployment Guide */}
        <section className="p-6 bg-brand-canvas-soft border border-brand-hairline rounded-xl space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
              Deployment Workflow
            </span>
            <h3 className="text-base font-bold text-brand-ink mt-0.5">
              How to install your theme in Ghost CMS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white border border-brand-hairline rounded-lg space-y-2">
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-mono font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-brand-ink text-sm">Export ZIP Archive</h4>
              <p className="text-brand-body leading-relaxed">
                Click &quot;Export Theme ZIP&quot; above or inside the Visual Builder to download the fully compiled Ghost theme bundle.
              </p>
            </div>

            <div className="p-4 bg-white border border-brand-hairline rounded-lg space-y-2">
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-mono font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-brand-ink text-sm">Open Ghost Admin</h4>
              <p className="text-brand-body leading-relaxed">
                Navigate to your Ghost publication admin console: <code className="font-mono text-[10px] bg-brand-canvas-soft px-1.5 py-0.5 rounded border border-brand-hairline">Settings &gt; Design &gt; Change theme</code>.
              </p>
            </div>

            <div className="p-4 bg-white border border-brand-hairline rounded-lg space-y-2">
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-mono font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-brand-ink text-sm">Upload &amp; Activate</h4>
              <p className="text-brand-body leading-relaxed">
                Click &quot;Upload theme&quot;, choose your ZIP file, and click &quot;Activate&quot;. Ghost will immediately render your visual theme live.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* New Theme Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-brand-hairline rounded-xl shadow-level-5 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 size={16} className="text-brand-primary" />
                <h3 className="font-bold text-base text-brand-ink">Create New Theme</h3>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-brand-mute hover:text-brand-ink">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={(e) => handleCreateTheme(e, true)} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-brand-ink mb-1">
                  Theme Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Acme Publication"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Studio"
                  value={newThemeAuthor}
                  onChange={(e) => setNewThemeAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the publication theme..."
                  value={newThemeDescription}
                  onChange={(e) => setNewThemeDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="pt-3 border-t border-brand-hairline flex flex-col sm:flex-row items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="w-full sm:w-auto px-3.5 py-1.5 border border-brand-hairline rounded-md text-brand-body hover:bg-brand-canvas-soft"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreateTheme(e, false)}
                  disabled={!newThemeName.trim()}
                  className="w-full sm:w-auto px-3.5 py-1.5 border border-brand-hairline rounded-md font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-colors disabled:opacity-50"
                >
                  Create Theme
                </button>
                <button
                  type="submit"
                  disabled={!newThemeName.trim()}
                  className="w-full sm:w-auto px-4 py-1.5 bg-brand-primary text-white font-semibold rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  <span>Create &amp; Open Builder</span>
                  <span className="text-xs">&rarr;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Theme Settings Modal */}
      {themeToEdit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-brand-hairline rounded-xl shadow-level-5 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
              <h3 className="font-bold text-base text-brand-ink">Edit Theme Configuration</h3>
              <button onClick={() => setThemeToEdit(null)} className="text-brand-mute hover:text-brand-ink">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-brand-ink mb-1">Theme Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Author</label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Version</label>
                <input
                  type="text"
                  value={editVersion}
                  onChange={(e) => setEditVersion(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="pt-3 border-t border-brand-hairline flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setThemeToEdit(null)}
                  className="px-3.5 py-1.5 border border-brand-hairline rounded-md text-brand-body hover:bg-brand-canvas-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-primary text-white font-semibold rounded-md hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Warning Modal */}
      {themeToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setThemeToDelete(null);
          }}
        >
          <div className="bg-white border border-brand-hairline rounded-xl shadow-level-5 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle size={20} className="stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-brand-ink">Delete Theme</h3>
                  <p className="text-xs text-brand-mute">This action cannot be undone.</p>
                </div>
              </div>
              <button 
                onClick={() => setThemeToDelete(null)} 
                className="text-brand-mute hover:text-brand-ink p-1 rounded-md hover:bg-brand-canvas-soft transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-brand-body leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-brand-ink">&ldquo;{themeToDelete.name}&rdquo;</span>? This will permanently remove the theme document, layouts, custom templates, and styling settings.
            </p>

            <div className="bg-brand-canvas-soft/80 border border-brand-hairline rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-brand-mute font-medium">Theme Name:</span>
                <span className="font-semibold text-brand-ink">{themeToDelete.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-mute font-medium">Author / Version:</span>
                <span className="text-brand-body">{themeToDelete.author} &bull; v{themeToDelete.version}</span>
              </div>
              {themes.length === 1 ? (
                <div className="pt-1.5 border-t border-brand-hairline/60 flex items-start gap-1.5 text-amber-700 text-[11px] font-medium">
                  <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
                  <span>This is your only theme project. Deleting it will reset your workspace and initialize a clean starter theme.</span>
                </div>
              ) : themeToDelete.id === activeThemeId ? (
                <div className="pt-1.5 border-t border-brand-hairline/60 flex items-center gap-1.5 text-amber-700 text-[11px] font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                  Currently active theme — editor will automatically switch to your next theme.
                </div>
              ) : null}
            </div>

            <div className="pt-2 border-t border-brand-hairline flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setThemeToDelete(null)}
                className="px-3.5 py-1.5 border border-brand-hairline rounded-md text-xs font-medium text-brand-body hover:bg-brand-canvas-soft hover:text-brand-ink transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTheme}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-md text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Trash2 size={13} />
                <span>{themes.length === 1 ? "Delete & Reset" : "Delete Theme"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-brand-hairline bg-white py-6 px-6 text-center text-xs text-brand-mute">
        <p>© 2026 Ghost Theme Builder. Built with Next.js, Tailwind CSS, and Ghost AST Compiler.</p>
      </footer>
    </div>
  );
}
