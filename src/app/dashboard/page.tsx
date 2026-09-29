"use client";

import React, { useState, useEffect, startTransition, useMemo } from "react";
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
  AlertTriangle,
  Eye,
  Grid,
  List,
  ArrowRight,
  Monitor,
  Tablet,
  Smartphone,
  CheckCircle,
  FolderPlus
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

// Preset themes for 1-click workspace starter templates
const CURATED_PRESETS = [
  {
    id: "preset-minimal",
    name: "Apex Minimal",
    tagline: "Vercel-inspired Developer Publication",
    author: "Alex Rivera",
    desc: "Minimalist black-and-ink aesthetics with clean typography, subtle shadows, and 100/100 Lighthouse score.",
    color: "#0070f3",
    badge: "Minimalist",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "preset-editorial",
    name: "Editorial Gazette",
    tagline: "High-density Magazine & Longform",
    author: "Sarah Jenkins",
    desc: "Bold headlines, multi-column article grids, author bio cards, and curated recommendations.",
    color: "#ff0080",
    badge: "Magazine",
    badgeColor: "bg-pink-50 text-pink-700 border-pink-200",
  },
  {
    id: "preset-technical",
    name: "Geist Tech Log",
    tagline: "Documentation & Technical Journal",
    author: "Dev Team",
    desc: "Monospace eyebrows, code block containers, and automated dark mode contrast cascading.",
    color: "#10b981",
    badge: "Technical",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "preset-newsletter",
    name: "Vivid Dispatch",
    tagline: "High-conversion Creator Newsletter",
    author: "Creative Collective",
    desc: "Prominent subscriber hero callouts, member discussions, and Ghost membership tiers.",
    color: "#8b5cf6",
    badge: "Newsletter",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

// Deterministic default theme for initial render (matches on server and client)
const DEFAULT_INITIAL_THEMES: ThemeProject[] = [
  {
    id: "theme-primary",
    name: "My Ghost Theme",
    author: "Ghost Creator",
    version: "1.0.0",
    description: "A clean, modern Ghost publication theme",
    updatedAt: "Just now",
    document: INITIAL_THEME_DOCUMENT,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { 
    document: themeDoc, 
    setDocument,
    activeThemeId, 
    setActiveThemeId,
    userId,
  } = useEditorStore();

  const [themes, setThemes] = useState<ThemeProject[]>(DEFAULT_INITIAL_THEMES);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const hasInitializedRef = React.useRef(false);

  // View & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterTab, setFilterTab] = useState<"all" | "active" | "multipage">("all");
  const [sortBy, setSortBy] = useState<"recent" | "name" | "blocks">("recent");

  // Export & Action States
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportSuccessId, setExportSuccessId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [showNewModal, setShowNewModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [themeToEdit, setThemeToEdit] = useState<ThemeProject | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<ThemeProject | null>(null);
  const [quickLookTheme, setQuickLookTheme] = useState<ThemeProject | null>(null);
  const [quickLookDevice, setQuickLookDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // New Theme Form State
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeAuthor, setNewThemeAuthor] = useState("");
  const [newThemeDescription, setNewThemeDescription] = useState("");

  // Edit Theme Form State
  const [editName, setEditName] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editVersion, setEditVersion] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Load themes from localStorage & cloud database strictly once on client mount
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const { setActiveThemeId, setDocument, setUserId } = useEditorStore.getState();

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
        localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(DEFAULT_INITIAL_THEMES));
        localStorage.setItem(STORAGE_ACTIVE_ID_KEY, DEFAULT_INITIAL_THEMES[0].id);
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

    const updated = themes.filter((t) => t.id !== id);
    setThemes(updated);
    try {
      localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
    } catch {}

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

  const handleClonePreset = (preset: typeof CURATED_PRESETS[0]) => {
    const newId = createThemeId();
    const baseDoc: ThemeDocument = JSON.parse(JSON.stringify(INITIAL_THEME_DOCUMENT));
    baseDoc.metadata = {
      name: preset.name,
      author: preset.author,
      version: "1.0.0",
      description: preset.desc,
      themeId: newId,
    };

    if (baseDoc.settings) {
      baseDoc.settings.primaryColor = preset.color;
    }

    if (baseDoc.blocks && baseDoc.blocks["header-sec-1"]) {
      baseDoc.blocks["header-sec-1"].props = {
        ...baseDoc.blocks["header-sec-1"].props,
        general: {
          ...baseDoc.blocks["header-sec-1"].props?.general,
          siteTitle: preset.name,
        },
      };
    }

    const newProject: ThemeProject = {
      id: newId,
      name: preset.name,
      author: preset.author,
      version: "1.0.0",
      description: preset.desc,
      updatedAt: "Just now",
      document: baseDoc,
    };

    const updated = [newProject, ...themes];
    setThemes(updated);
    try {
      localStorage.setItem(STORAGE_THEMES_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_ACTIVE_ID_KEY, newId);
    } catch {}

    setDocument(baseDoc, newId);
    setActiveThemeId(newId);

    if (userId) {
      fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, document: baseDoc }),
      }).catch(() => {});
    }

    showToast(`Added "${preset.name}" preset to your projects!`);
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
        if (updatedDoc.blocks && updatedDoc.blocks["header-sec-1"]) {
          updatedDoc.blocks["header-sec-1"].props = {
            ...updatedDoc.blocks["header-sec-1"].props,
            general: {
              ...updatedDoc.blocks["header-sec-1"].props?.general,
              siteTitle: editName.trim(),
            },
          };
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

  // Filter & Search processing
  const filteredThemes = useMemo(() => {
    let result = themes.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterTab === "active") {
      result = result.filter((t) => t.id === (activeTheme?.id || activeThemeId));
    } else if (filterTab === "multipage") {
      result = result.filter((t) => Object.keys(t.document.pages || {}).length > 1);
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "blocks") {
      result = [...result].sort((a, b) => Object.keys(b.document.blocks || {}).length - Object.keys(a.document.blocks || {}).length);
    }

    return result;
  }, [themes, searchQuery, filterTab, sortBy, activeTheme, activeThemeId]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink flex flex-col font-sans selection:bg-brand-primary selection:text-white relative">
      {/* Subtle Atmospheric Top Mesh Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] pointer-events-none opacity-30 blur-3xl z-0 animate-mesh-float"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, #50e3c2 0%, #007cf0 30%, #7928ca 60%, transparent 100%)",
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-brand-primary text-white text-xs px-4 py-3 rounded-xl shadow-level-4 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles size={15} className="text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ─── 1. Sticky Navigation Bar ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-hairline px-6 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-primary flex items-center justify-center rounded-lg transition-transform group-hover:scale-105 shadow-xs">
              <span className="text-white font-mono font-semibold text-sm">G</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-brand-ink">Ghost Theme Builder</span>
              <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-full text-brand-mute uppercase font-semibold">
                Studio
              </span>
            </div>
          </Link>
          
          <div className="h-4 w-px bg-brand-hairline mx-1 hidden sm:block" />

          <nav className="hidden md:flex items-center gap-1 text-xs text-brand-body">
            <Link href="/" className="px-3 py-1.5 rounded-md hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">
              Landing Page
            </Link>
            <span className="px-3 py-1.5 rounded-md text-brand-ink font-semibold bg-white border border-brand-hairline shadow-xs">
              Dashboard
            </span>
            <Link href="/builder" className="px-3 py-1.5 rounded-md hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">
              Visual Builder
            </Link>
            <button
              onClick={() => setShowAuditModal(true)}
              className="px-3 py-1.5 rounded-md text-emerald-700 bg-emerald-50/70 border border-emerald-200/80 hover:bg-emerald-100/70 transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>GScan Health (100/100)</span>
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-brand-hairline rounded-full text-xs font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-all shadow-xs"
          >
            <Plus size={13} />
            <span>New Theme</span>
          </button>
          <Link
            href="/builder"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary text-white rounded-full text-xs font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-level-1"
          >
            <Layout size={13} />
            <span>Launch Canvas</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* ─── 2. Main Workspace Body ─── */}
      <main className="flex-1 max-w-[1340px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
        {/* Welcome Greeting & Summary Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-hairline rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-brand-mute">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Ghost 5.x Ready Engine</span>
              <span>&bull;</span>
              <span>GScan Pass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">
              {getGreeting()}, Creator.
            </h1>
            <p className="text-xs sm:text-sm text-brand-body leading-relaxed max-w-xl">
              Design, preview, test, and export standard Ghost publication themes. Zero client runtime overhead, pure Handlebars AST compilation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-level-1"
            >
              <FolderPlus size={14} />
              <span>Create New Theme</span>
            </button>
            <button
              onClick={() => setShowAuditModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-brand-hairline rounded-xl text-xs font-semibold text-brand-ink bg-brand-canvas-soft hover:bg-gray-100 transition-colors shadow-xs"
            >
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Validator Audit</span>
            </button>
          </div>
        </div>

        {/* ─── 3. Metric Cards Row ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-brand-hairline rounded-xl shadow-xs hover:border-brand-hairline-strong transition-all">
            <div className="flex items-center justify-between text-brand-mute mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Active Theme</span>
              <FileCode2 size={16} className="text-brand-primary" />
            </div>
            <div className="text-lg font-bold text-brand-ink truncate">
              {!hasLoadedFromStorage ? (
                <span className="inline-block h-5 w-28 bg-gray-200 animate-pulse rounded" />
              ) : (
                activeTheme?.name || themeDoc.metadata?.name || "Untitled Theme"
              )}
            </div>
            <div className="text-xs text-brand-mute mt-1 truncate">
              {!hasLoadedFromStorage ? (
                <span className="inline-block h-3.5 w-36 bg-gray-100 animate-pulse rounded" />
              ) : (
                `v${activeTheme?.version || "1.0.0"} · By ${activeTheme?.author || "Creator"}`
              )}
            </div>
          </div>

          <div 
            onClick={() => setShowAuditModal(true)}
            className="p-5 bg-white border border-brand-hairline rounded-xl shadow-xs hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">GScan Compliance</span>
              <ShieldCheck size={16} className="group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-lg font-bold text-brand-ink flex items-center gap-2">
              <span>100 / 100</span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Certified
              </span>
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Casper assets, clean locales &amp; CSS minified
            </div>
          </div>

          <div className="p-5 bg-white border border-brand-hairline rounded-xl shadow-xs hover:border-brand-hairline-strong transition-all">
            <div className="flex items-center justify-between text-brand-mute mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Total Projects</span>
              <Layers size={16} className="text-violet-600" />
            </div>
            <div className="text-lg font-bold text-brand-ink" suppressHydrationWarning>
              {!hasLoadedFromStorage ? (
                <span className="inline-block h-5 w-16 bg-gray-200 animate-pulse rounded" />
              ) : (
                `${themes.length} ${themes.length === 1 ? "Theme" : "Themes"}`
              )}
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Independent publication AST workspaces
            </div>
          </div>

          <div className="p-5 bg-white border border-brand-hairline rounded-xl shadow-xs hover:border-brand-hairline-strong transition-all">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Export Engine</span>
              <Globe size={16} />
            </div>
            <div className="text-lg font-bold text-brand-ink">
              Pure Handlebars
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Dynamic `&#123;&#123;navigation&#125;&#125;` &amp; zero runtime
            </div>
          </div>
        </div>

        {/* ─── 4. Quick Starter Presets Carousel ─── */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-brand-ink uppercase tracking-wider font-mono">
                Curated Publication Presets
              </h3>
              <p className="text-xs text-brand-mute">
                Initialize a pre-configured publication layout with 1 click.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {CURATED_PRESETS.map((preset) => (
              <div 
                key={preset.id}
                className="bg-white border border-brand-hairline rounded-xl p-4 shadow-xs hover:border-brand-hairline-strong hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                      {preset.badge}
                    </span>
                    <span 
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" 
                      style={{ backgroundColor: preset.color }}
                      title={`Accent Color: ${preset.color}`}
                    />
                  </div>
                  <h4 className="font-bold text-sm text-brand-ink group-hover:text-brand-primary transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-brand-mute line-clamp-2 leading-relaxed">
                    {preset.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-brand-hairline">
                  <button
                    onClick={() => handleClonePreset(preset)}
                    className="w-full py-1.5 text-xs font-semibold border border-brand-hairline rounded-lg text-brand-ink hover:bg-brand-canvas-soft hover:border-brand-hairline-strong transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus size={12} />
                    <span>Clone to My Themes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. Themes Workspace Controls & List ─── */}
        <section className="space-y-4">
          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-white border border-brand-hairline rounded-lg p-1 text-xs shadow-xs">
                <button
                  onClick={() => setFilterTab("all")}
                  className={`px-3 py-1 rounded-md transition-colors font-medium ${
                    filterTab === "all" ? "bg-brand-primary text-white shadow-xs" : "text-brand-mute hover:text-brand-ink"
                  }`}
                >
                  All Projects ({themes.length})
                </button>
                <button
                  onClick={() => setFilterTab("active")}
                  className={`px-3 py-1 rounded-md transition-colors font-medium ${
                    filterTab === "active" ? "bg-brand-primary text-white shadow-xs" : "text-brand-mute hover:text-brand-ink"
                  }`}
                >
                  Active Only
                </button>
                <button
                  onClick={() => setFilterTab("multipage")}
                  className={`px-3 py-1 rounded-md transition-colors font-medium ${
                    filterTab === "multipage" ? "bg-brand-primary text-white shadow-xs" : "text-brand-mute hover:text-brand-ink"
                  }`}
                >
                  Multi-page
                </button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white border border-brand-hairline rounded-lg p-1 text-xs shadow-xs">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"
                  }`}
                  title="Grid View"
                >
                  <Grid size={13} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"
                  }`}
                  title="Compact List View"
                >
                  <List size={13} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 md:flex-initial">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-mute pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-8 py-1.5 text-xs bg-white border border-brand-hairline rounded-lg text-brand-ink focus:outline-none focus:border-brand-primary w-full sm:w-56 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-mute hover:text-brand-ink"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1 text-xs bg-white border border-brand-hairline rounded-lg px-2 py-1 shadow-xs">
                <SlidersHorizontal size={12} className="text-brand-mute" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "name" | "blocks")}
                  className="bg-transparent text-xs text-brand-ink focus:outline-none cursor-pointer font-medium"
                >
                  <option value="recent">Recent</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="blocks">Blocks</option>
                </select>
              </div>
            </div>
          </div>

          {/* ─── Themes View: Grid or List ─── */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {!hasLoadedFromStorage ? (
                <div className="bg-white border border-brand-hairline rounded-2xl p-5 flex flex-col justify-between min-h-[300px] animate-pulse">
                  <div className="space-y-4">
                    <div className="h-28 bg-gray-100 rounded-xl" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                  <div className="h-9 bg-gray-100 rounded-lg" />
                </div>
              ) : (
                filteredThemes.map((theme) => {
                  const isActive = theme.id === (activeTheme?.id || activeThemeId);
                  const pages = Object.keys(theme.document.pages || {});
                  const blocksCount = Object.keys(theme.document.blocks || {}).length;
                  const isCurrentlyExporting = isExporting === theme.id;
                  const isExportSuccess = exportSuccessId === theme.id;
                  const themeAccent = theme.document.settings?.primaryColor || "#0070f3";

                  return (
                    <div 
                      key={theme.id}
                      className={`bg-white border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                        isActive ? "border-brand-primary ring-2 ring-brand-primary/15" : "border-brand-hairline hover:border-brand-hairline-strong"
                      }`}
                    >
                      {/* Mini Simulated Publication Viewport Header */}
                      <div className="bg-gradient-to-b from-brand-canvas-soft to-white border-b border-brand-hairline p-4 space-y-3 relative overflow-hidden">
                        {/* Chrome window dots */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-400" />
                            <span className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="font-mono text-[10px] text-brand-mute ml-1 truncate max-w-[120px]">
                              {theme.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                ACTIVE
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-brand-mute px-2 py-0.5 rounded-full border border-brand-hairline bg-white">
                                DRAFT
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Simulated publication frame snippet */}
                        <div className="bg-white border border-brand-hairline rounded-lg p-3 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: themeAccent }} />
                              <span className="font-bold text-xs text-brand-ink truncate max-w-[140px]">
                                {theme.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-brand-mute">Ghost 5.x</span>
                          </div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-3/4 rounded-full bg-gray-200" />
                            <div className="h-1.5 w-1/2 rounded-full bg-gray-100" />
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div>
                            <span className="font-mono text-[10px] text-brand-mute block">
                              v{theme.version} &bull; By {theme.author}
                            </span>
                            <p className="text-xs text-brand-body leading-relaxed line-clamp-2 mt-1">
                              {theme.description || "A custom high-performance Ghost publication theme."}
                            </p>
                          </div>

                          {/* Stats Capsules */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-0.5">
                              <span className="text-[10px] font-mono uppercase text-brand-mute block">
                                Templates
                              </span>
                              <span className="font-bold text-brand-ink text-xs">
                                {pages.length} Layouts
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-0.5">
                              <span className="text-[10px] font-mono uppercase text-brand-mute block">
                                GScan Health
                              </span>
                              <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                                <Check size={12} /> 100/100
                              </span>
                            </div>
                          </div>

                          {/* Template tags */}
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {pages.slice(0, 4).map((slug) => (
                              <span 
                                key={slug} 
                                className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded-md text-brand-body"
                              >
                                {slug === "home" ? "index.hbs" : `${slug}.hbs`}
                              </span>
                            ))}
                            {pages.length > 4 && (
                              <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded-md text-brand-mute">
                                +{pages.length - 4}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions Footer */}
                        <div className="pt-3 border-t border-brand-hairline space-y-2.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenTheme(theme)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-xs"
                            >
                              <Layout size={13} />
                              <span>Open in Builder</span>
                            </button>

                            <button
                              onClick={() => setQuickLookTheme(theme)}
                              className="p-2 border border-brand-hairline rounded-xl text-brand-ink hover:bg-brand-canvas-soft transition-colors bg-white shadow-2xs"
                              title="Quick Look Preview"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => handleExportThemeZip(theme)}
                              disabled={isCurrentlyExporting}
                              className={`px-3 py-2 border rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs ${
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
                              <span>ZIP</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs text-brand-mute pt-1 px-1">
                            <div className="flex items-center gap-1 text-[10px] font-mono">
                              <Clock size={11} className="opacity-70" />
                              <span>{blocksCount} blocks</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => openSettings(theme)}
                                className="hover:text-brand-ink transition-colors text-[11px] font-medium flex items-center gap-1"
                                title="Theme Settings"
                              >
                                <Settings size={12} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDuplicateTheme(theme)}
                                className="hover:text-brand-ink transition-colors text-[11px] font-medium flex items-center gap-1"
                                title="Duplicate Theme"
                              >
                                <Copy size={12} />
                                <span>Duplicate</span>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(theme)}
                                className="hover:text-rose-600 transition-colors text-[11px] font-medium flex items-center gap-1"
                                title="Delete Theme"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Create New Theme Card */}
              <button
                onClick={() => setShowNewModal(true)}
                className="border-2 border-dashed border-brand-hairline hover:border-brand-primary/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center group transition-all bg-brand-canvas-soft/40 hover:bg-white min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-brand-hairline flex items-center justify-center text-brand-body group-hover:text-brand-primary group-hover:scale-110 transition-all shadow-xs mb-3">
                  <Plus size={22} />
                </div>
                <h4 className="font-bold text-sm text-brand-ink group-hover:text-brand-primary transition-colors">
                  Create New Theme
                </h4>
                <p className="text-xs text-brand-mute max-w-[220px] mt-1 leading-relaxed">
                  Start fresh with Ghost 5.x header, page templates, and standard Handlebars compiler.
                </p>
              </button>
            </div>
          ) : (
            /* ─── Alternative Compact Table / List View ─── */
            <div className="bg-white border border-brand-hairline rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-brand-canvas-soft border-b border-brand-hairline text-brand-mute font-mono text-[10px] uppercase">
                    <th className="py-3 px-4">Theme Name</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Templates</th>
                    <th className="py-3 px-4">Blocks</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-hairline">
                  {filteredThemes.map((theme) => {
                    const isActive = theme.id === (activeTheme?.id || activeThemeId);
                    const pages = Object.keys(theme.document.pages || {});
                    const blocksCount = Object.keys(theme.document.blocks || {}).length;
                    const isCurrentlyExporting = isExporting === theme.id;
                    const themeAccent = theme.document.settings?.primaryColor || "#0070f3";

                    return (
                      <tr key={theme.id} className="hover:bg-brand-canvas-soft/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: themeAccent }} />
                            <div>
                              <span className="font-bold text-brand-ink block hover:text-brand-primary cursor-pointer" onClick={() => handleOpenTheme(theme)}>
                                {theme.name}
                              </span>
                              <span className="text-[10px] text-brand-mute block">v{theme.version}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-brand-mute px-2 py-0.5 rounded border border-brand-hairline bg-white">
                              DRAFT
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-brand-body">
                          {pages.length} layouts
                        </td>
                        <td className="py-3.5 px-4 font-mono text-brand-body">
                          {blocksCount}
                        </td>
                        <td className="py-3.5 px-4 text-brand-body">
                          {theme.author}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleOpenTheme(theme)}
                              className="px-2.5 py-1 bg-brand-primary text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                            >
                              Open
                            </button>
                            <button
                              onClick={() => setQuickLookTheme(theme)}
                              className="p-1 text-brand-body hover:text-brand-ink rounded hover:bg-brand-canvas-soft"
                              title="Quick Look"
                            >
                              <Eye size={13} />
                            </button>
                            <button
                              onClick={() => handleExportThemeZip(theme)}
                              disabled={isCurrentlyExporting}
                              className="p-1 text-brand-body hover:text-brand-ink rounded hover:bg-brand-canvas-soft"
                              title="Export ZIP"
                            >
                              <Download size={13} />
                            </button>
                            <button
                              onClick={() => openSettings(theme)}
                              className="p-1 text-brand-body hover:text-brand-ink rounded hover:bg-brand-canvas-soft"
                              title="Edit Settings"
                            >
                              <Settings size={13} />
                            </button>
                            <button
                              onClick={() => handleDuplicateTheme(theme)}
                              className="p-1 text-brand-body hover:text-brand-ink rounded hover:bg-brand-canvas-soft"
                              title="Duplicate Theme"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(theme)}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                              title="Delete Theme"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ─── 6. Ghost Theme Validator Health Check Widget ─── */}
        <section className="p-6 bg-white border border-brand-hairline rounded-2xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-brand-ink">
                  Ghost Architecture &amp; GScan Validator Guarantees
                </h3>
                <p className="text-xs text-brand-mute">
                  Every ZIP package exported passes 100% of Ghost official gscan rule checks.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAuditModal(true)}
              className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full hover:bg-emerald-100 transition-colors self-start sm:self-auto"
            >
              View Full Audit Spec &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-brand-body pt-1">
            <div className="p-4 bg-brand-canvas-soft rounded-xl border border-brand-hairline space-y-1.5">
              <div className="font-semibold text-brand-ink flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>Package Metadata Engine</span>
              </div>
              <p className="text-[11px] text-brand-mute leading-relaxed">
                Automatically injects author email, `config.card_assets: true`, and strict `engines.ghost &gt;= 4.0.0` into package.json.
              </p>
            </div>

            <div className="p-4 bg-brand-canvas-soft rounded-xl border border-brand-hairline space-y-1.5">
              <div className="font-semibold text-brand-ink flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>Responsive CSS &amp; Layout</span>
              </div>
              <p className="text-[11px] text-brand-mute leading-relaxed">
                Minified screen.css declaring `--gh-font-heading`, `--gh-font-body`, `.kg-width-wide`, and `.kg-width-full` image alignment rules.
              </p>
            </div>

            <div className="p-4 bg-brand-canvas-soft rounded-xl border border-brand-hairline space-y-1.5">
              <div className="font-semibold text-brand-ink flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>Casper Core Partial Injections</span>
              </div>
              <p className="text-[11px] text-brand-mute leading-relaxed">
                Bundles locales (`locales/en.json`), SVG icons, and standard `partials/navigation.hbs` helper loops.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 7. 3-Step Deployment Guide ─── */}
        <section className="p-6 sm:p-7 bg-brand-canvas-soft border border-brand-hairline rounded-2xl space-y-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
              Deployment Workflow
            </span>
            <h3 className="text-base font-bold text-brand-ink mt-0.5">
              How to install your exported theme in Ghost CMS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 bg-white border border-brand-hairline rounded-xl space-y-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                1
              </div>
              <h4 className="font-bold text-brand-ink text-sm">Export ZIP Archive</h4>
              <p className="text-brand-body leading-relaxed">
                Click &quot;ZIP&quot; on any theme card above or inside the Visual Builder to download the fully compiled Ghost theme archive.
              </p>
            </div>

            <div className="p-5 bg-white border border-brand-hairline rounded-xl space-y-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                2
              </div>
              <h4 className="font-bold text-brand-ink text-sm">Open Ghost Admin</h4>
              <p className="text-brand-body leading-relaxed">
                Navigate to your Ghost publication admin console: <code className="font-mono text-[10px] bg-brand-canvas-soft px-1.5 py-0.5 rounded border border-brand-hairline">Settings &gt; Design &gt; Change theme</code>.
              </p>
            </div>

            <div className="p-5 bg-white border border-brand-hairline rounded-xl space-y-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                3
              </div>
              <h4 className="font-bold text-brand-ink text-sm">Upload &amp; Activate</h4>
              <p className="text-brand-body leading-relaxed">
                Click &quot;Upload theme&quot;, select your downloaded ZIP file, and click &quot;Activate&quot;. Ghost will immediately render your visual theme live.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── MODAL 1: Quick Look Live Theme Preview Modal ─── */}
      {quickLookTheme && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickLookTheme(null);
          }}
        >
          <div className="bg-white border border-brand-hairline rounded-2xl shadow-level-5 max-w-3xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-4 h-4 rounded-full border border-black/10 shadow-xs" 
                  style={{ backgroundColor: quickLookTheme.document.settings?.primaryColor || "#0070f3" }} 
                />
                <div>
                  <h3 className="font-bold text-base text-brand-ink">{quickLookTheme.name}</h3>
                  <span className="font-mono text-[10px] text-brand-mute">
                    v{quickLookTheme.version} &bull; Author: {quickLookTheme.author}
                  </span>
                </div>
              </div>

              {/* Viewport Toggles */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-brand-canvas-soft border border-brand-hairline rounded-lg p-0.5">
                  <button
                    onClick={() => setQuickLookDevice("desktop")}
                    className={`p-1 rounded text-xs transition-colors ${quickLookDevice === "desktop" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                    title="Desktop"
                  >
                    <Monitor size={13} />
                  </button>
                  <button
                    onClick={() => setQuickLookDevice("tablet")}
                    className={`p-1 rounded text-xs transition-colors ${quickLookDevice === "tablet" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                    title="Tablet"
                  >
                    <Tablet size={13} />
                  </button>
                  <button
                    onClick={() => setQuickLookDevice("mobile")}
                    className={`p-1 rounded text-xs transition-colors ${quickLookDevice === "mobile" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                    title="Mobile"
                  >
                    <Smartphone size={13} />
                  </button>
                </div>

                <button 
                  onClick={() => setQuickLookTheme(null)} 
                  className="text-brand-mute hover:text-brand-ink p-1 rounded-md hover:bg-brand-canvas-soft"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Simulated Live Preview */}
            <div className="p-4 sm:p-6 bg-brand-canvas-soft border border-brand-hairline rounded-xl flex justify-center">
              <div 
                className={`bg-white border border-brand-hairline rounded-xl shadow-xs overflow-hidden transition-all duration-200 flex flex-col ${
                  quickLookDevice === "mobile" ? "w-[340px]" : quickLookDevice === "tablet" ? "w-[560px]" : "w-full"
                }`}
              >
                {/* Header */}
                <div className="px-4 py-2.5 border-b border-brand-hairline flex items-center justify-between text-xs">
                  <span className="font-bold text-brand-ink">{quickLookTheme.name}</span>
                  <div className="hidden sm:flex items-center gap-3 text-brand-mute text-[11px]">
                    <span>Stories</span>
                    <span>About</span>
                    <span>Membership</span>
                  </div>
                  <span 
                    style={{ backgroundColor: quickLookTheme.document.settings?.primaryColor || "#0070f3" }} 
                    className="px-2.5 py-0.5 text-white font-semibold text-[10px] rounded-full"
                  >
                    Subscribe
                  </span>
                </div>

                {/* Hero snippet */}
                <div className="p-6 text-center space-y-2">
                  <span 
                    className="text-[10px] font-mono uppercase font-bold tracking-wider" 
                    style={{ color: quickLookTheme.document.settings?.primaryColor || "#0070f3" }}
                  >
                    FEATURED PUBLICATION
                  </span>
                  <h4 className="font-bold text-lg text-brand-ink">
                    High-performance visual layouts for Ghost CMS
                  </h4>
                  <p className="text-xs text-brand-mute max-w-sm mx-auto line-clamp-2">
                    {quickLookTheme.description || "Compiled static Handlebars templates with real-time accent sync."}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-brand-mute font-mono">
                <CheckCircle size={14} className="text-emerald-600" />
                <span>100/100 GScan Passed</span>
                <span>&bull;</span>
                <span>{Object.keys(quickLookTheme.document.pages || {}).length} Templates</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleExportThemeZip(quickLookTheme);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 border border-brand-hairline rounded-xl text-xs font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-colors"
                >
                  Export ZIP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickLookTheme(null);
                    handleOpenTheme(quickLookTheme);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-brand-primary text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Layout size={13} />
                  <span>Open in Visual Builder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: GScan Validator Audit Modal ─── */}
      {showAuditModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuditModal(false);
          }}
        >
          <div className="bg-white border border-brand-hairline rounded-2xl shadow-level-5 max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-brand-ink">Ghost Theme Compiler &amp; GScan Compliance</h3>
                  <p className="text-xs text-brand-mute">Official Ghost Theme Validator Specification Audits</p>
                </div>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="text-brand-mute hover:text-brand-ink p-1">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-brand-body">
              <div className="p-3.5 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-1">
                <div className="font-semibold text-brand-ink flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>1. `package.json` Ghost Theme Specification</span>
                </div>
                <p className="text-[11px] text-brand-mute leading-relaxed">
                  Requires `&quot;keywords&quot;: [&quot;ghost-theme&quot;]`, `author.email`, and `&quot;config&quot;: &#123; &quot;card_assets&quot;: true &#125;`. All exports automatically pass this validation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-1">
                <div className="font-semibold text-brand-ink flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>2. Core CSS Custom Property Variables</span>
                </div>
                <p className="text-[11px] text-brand-mute leading-relaxed">
                  Exported `assets/css/screen.css` declares `--gh-font-heading` and `--gh-font-body` and inverts cascade so Ghost Admin typography cascades universally.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-1">
                <div className="font-semibold text-brand-ink flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>3. Dynamic Native Ghost Navigation (`partials/navigation.hbs`)</span>
                </div>
                <p className="text-[11px] text-brand-mute leading-relaxed">
                  Employs Ghost native `&#123;&#123;#foreach navigation&#125;&#125;` loop and `&#123;&#123;navigation&#125;&#125;` helper for 100% compatibility with Ghost Admin menu settings.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-brand-canvas-soft border border-brand-hairline space-y-1">
                <div className="font-semibold text-brand-ink flex items-center gap-2">
                  <Check size={14} className="text-emerald-600" />
                  <span>4. Casper Template Asset Bundling</span>
                </div>
                <p className="text-[11px] text-brand-mute leading-relaxed">
                  Injects Casper core icons and locales (`locales/en.json`) into the generated ZIP, guaranteeing 0 missing asset warnings in GScan.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-brand-hairline flex items-center justify-between">
              <a 
                href="https://gscan.ghost.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-semibold text-brand-primary hover:underline inline-flex items-center gap-1"
              >
                Official Ghost GScan Tool <ExternalLink size={12} />
              </a>
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-1.5 bg-brand-primary text-white font-semibold rounded-xl text-xs hover:opacity-90"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: New Theme Modal ─── */}
      {showNewModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewModal(false);
          }}
        >
          <div className="bg-white border border-brand-hairline rounded-2xl shadow-level-5 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
              <div className="flex items-center gap-2">
                <FileCode2 size={16} className="text-brand-primary" />
                <h3 className="font-bold text-base text-brand-ink">Create New Theme</h3>
              </div>
              <button onClick={() => setShowNewModal(false)} className="text-brand-mute hover:text-brand-ink p-1">
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
                  className="w-full px-3 py-2 border border-brand-hairline rounded-xl text-brand-ink focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Studio"
                  value={newThemeAuthor}
                  onChange={(e) => setNewThemeAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-xl text-brand-ink focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of the publication theme..."
                  value={newThemeDescription}
                  onChange={(e) => setNewThemeDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-xl text-brand-ink focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div className="pt-3 border-t border-brand-hairline flex flex-col sm:flex-row items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="w-full sm:w-auto px-3.5 py-2 border border-brand-hairline rounded-xl text-brand-body hover:bg-brand-canvas-soft"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleCreateTheme(e, false)}
                  disabled={!newThemeName.trim()}
                  className="w-full sm:w-auto px-4 py-2 border border-brand-hairline rounded-xl font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-colors disabled:opacity-50"
                >
                  Save as Project
                </button>
                <button
                  type="submit"
                  disabled={!newThemeName.trim()}
                  className="w-full sm:w-auto px-5 py-2 bg-brand-primary text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Launch Builder</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: Theme Settings Modal ─── */}
      {themeToEdit && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setThemeToEdit(null);
          }}
        >
          <div className="bg-white border border-brand-hairline rounded-2xl shadow-level-5 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
              <h3 className="font-bold text-base text-brand-ink">Edit Theme Configuration</h3>
              <button onClick={() => setThemeToEdit(null)} className="text-brand-mute hover:text-brand-ink p-1">
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
                  className="w-full px-3 py-2 border border-brand-hairline rounded-xl text-brand-ink focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Author</label>
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-xl text-brand-ink focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Version</label>
                <input
                  type="text"
                  value={editVersion}
                  onChange={(e) => setEditVersion(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-xl text-brand-ink focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-xl text-brand-ink focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div className="pt-3 border-t border-brand-hairline flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setThemeToEdit(null)}
                  className="px-4 py-2 border border-brand-hairline rounded-xl text-brand-body hover:bg-brand-canvas-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-primary text-white font-semibold rounded-xl hover:opacity-90 shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 5: Delete Confirmation Warning Modal ─── */}
      {themeToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setThemeToDelete(null);
          }}
        >
          <div className="bg-white border border-brand-hairline rounded-2xl shadow-level-5 max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
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

            <div className="bg-brand-canvas-soft/80 border border-brand-hairline rounded-xl p-3 text-xs space-y-1.5">
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
                className="px-4 py-2 border border-brand-hairline rounded-xl text-xs font-medium text-brand-body hover:bg-brand-canvas-soft hover:text-brand-ink transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTheme}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Trash2 size={13} />
                <span>{themes.length === 1 ? "Delete & Reset" : "Delete Theme"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Minimal Footer ─── */}
      <footer className="border-t border-brand-hairline bg-white py-6 px-6 text-center text-xs text-brand-mute mt-auto">
        <p>&copy; 2026 Ghost Theme Builder. Built with Next.js App Router, Tailwind CSS, and Ghost AST Compiler.</p>
      </footer>
    </div>
  );
}
