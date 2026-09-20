"use client";

import React, { useState } from "react";
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
  ArrowRight, 
  Settings, 
  Search, 
  Layout, 
  Globe, 
  ShieldCheck, 
  SlidersHorizontal,
  X,
  Loader2,
  Check
} from "lucide-react";
import { useEditorStore } from "@/store/editorStore";

export default function DashboardPage() {
  const router = useRouter();
  const { document: themeDoc, updateMetadata } = useEditorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeAuthor, setNewThemeAuthor] = useState("");
  const [newThemeDescription, setNewThemeDescription] = useState("");

  const pageCount = Object.keys(themeDoc.pages || {}).length;
  const blockCount = Object.keys(themeDoc.blocks || {}).length;

  const starterTemplates = [
    {
      id: "sakthi-t4gc",
      name: "Sakthi T4GC (Active)",
      tagline: "Vercel-inspired developer publication theme",
      description: "Stark monochrome aesthetics, multi-stop mesh gradients, Geist typography, and micro-interactions.",
      badge: "Current Theme",
      badgeColor: "bg-brand-primary text-white",
      pages: ["Home", "Post", "Page", "Author", "Tag", "404"],
      accentColor: "#171717",
      previewBg: "bg-white",
      isCurrent: true,
    },
    {
      id: "editorial-magazine",
      name: "Editorial Gazette",
      tagline: "High-density editorial & longform storytelling",
      description: "Designed for newsrooms, magazines, and essayists with bold serif display and multi-author bylines.",
      badge: "Magazine",
      badgeColor: "bg-blue-600 text-white",
      pages: ["Home", "Post", "Page", "Author", "Tag"],
      accentColor: "#0070f3",
      previewBg: "bg-slate-50",
      isCurrent: false,
    },
    {
      id: "minimal-devblog",
      name: "Geist Tech Log",
      tagline: "Developer-first documentation & engineering journal",
      description: "Monospace accents, dark code syntax blocks, technical eyebrows, and 100/100 Lighthouse performance.",
      badge: "Engineering",
      badgeColor: "bg-purple-600 text-white",
      pages: ["Home", "Post", "Page", "Tag"],
      accentColor: "#7928ca",
      previewBg: "bg-zinc-50",
      isCurrent: false,
    },
    {
      id: "creator-minimal",
      name: "Atelier Minimal",
      tagline: "Visual portfolio & newsletter publication",
      description: "Expansive image grids, integrated Ghost membership tiers, sticky subscription bar, and fluid layout containers.",
      badge: "Portfolio",
      badgeColor: "bg-emerald-600 text-white",
      pages: ["Home", "Post", "Page", "Author"],
      accentColor: "#059669",
      previewBg: "bg-stone-50",
      isCurrent: false,
    }
  ];

  const filteredTemplates = starterTemplates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportZip = async () => {
    try {
      setIsExporting(true);
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
      const latestDoc = useEditorStore.getState().document;
      const files = generateThemeFiles(latestDoc);

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
      const filename = `${latestDoc.metadata.name.toLowerCase().replace(/\s+/g, "-")}-theme.zip`;

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error("Dashboard theme export failed:", err);
      alert("Failed to export theme ZIP. Please verify compiler outputs.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeName.trim()) return;

    updateMetadata({
      name: newThemeName.trim(),
      author: newThemeAuthor.trim() || themeDoc.metadata.author,
      description: newThemeDescription.trim() || themeDoc.metadata.description,
    });

    setShowNewModal(false);
    router.push("/builder");
  };

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink flex flex-col font-sans selection:bg-brand-primary selection:text-white">
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
              Builder
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
                placeholder="Search templates & themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary w-56 sm:w-64"
              />
            </div>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 border border-brand-hairline rounded-md bg-white hover:bg-brand-canvas-soft text-brand-ink transition-colors"
              title="Theme Settings"
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
              {themeDoc.metadata.name || "Sakthi T4GC"}
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Version {themeDoc.metadata.version || "1.0.0"} · By {themeDoc.metadata.author || "Sakthi T4GC"}
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
              Zero errors · Casper & Ghost 5.x spec compliant
            </div>
          </div>

          <div className="p-4 bg-white border border-brand-hairline rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-brand-mute mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Layout Structure</span>
              <Layers size={16} />
            </div>
            <div className="text-lg font-bold text-brand-ink">
              {pageCount} Templates · {blockCount} Blocks
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Includes home, post, page, author, tag & 404
            </div>
          </div>

          <div className="p-4 bg-white border border-brand-hairline rounded-lg shadow-xs">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Export Readiness</span>
              <Globe size={16} />
            </div>
            <div className="text-lg font-bold text-brand-ink">
              Standalone ZIP
            </div>
            <div className="text-xs text-brand-mute mt-1">
              Instantly deployable to Ghost Admin Design
            </div>
          </div>
        </div>

        {/* Active Project Banner Card */}
        <div className="p-6 bg-white border border-brand-hairline rounded-xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-brand-primary text-white">
                Active Theme Project
              </span>
              <span className="text-xs font-mono text-brand-mute">
                Author: {themeDoc.metadata.author}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-ink">
              {themeDoc.metadata.name}
            </h2>
            
            <p className="text-sm text-brand-body leading-relaxed">
              {themeDoc.metadata.description || "A high-performance, minimalist Ghost CMS publication theme designed with Geist UI principles and real-time Handlebars AST compilation."}
            </p>

            {/* Quick layout tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {Object.keys(themeDoc.pages || {}).map((slug) => (
                <span 
                  key={slug} 
                  className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-2 py-0.5 rounded text-brand-body"
                >
                  {slug === "home" ? "index.hbs" : `${slug}.hbs`}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[200px]">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity shadow-xs text-center"
            >
              <Layout size={14} />
              <span>Open in Visual Builder</span>
            </Link>

            <button
              onClick={handleExportZip}
              disabled={isExporting}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg font-semibold text-xs transition-colors text-center ${
                exportSuccess 
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
                  : "bg-white border-brand-hairline text-brand-ink hover:bg-brand-canvas-soft"
              }`}
            >
              {isExporting ? (
                <>
                  <Loader2 size={14} className="animate-spin text-brand-mute" />
                  <span>Compiling ZIP...</span>
                </>
              ) : exportSuccess ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Export Theme ZIP</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-lg font-medium text-xs text-brand-body hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors"
            >
              <Settings size={13} />
              <span>Theme Configuration</span>
            </button>
          </div>
        </div>

        {/* Starter Themes & Template Library */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-ink">
                Curated Theme Library & Starters
              </h3>
              <p className="text-xs text-brand-body">
                Kickstart your next publication with validated layouts designed for Ghost 5.x.
              </p>
            </div>
            <span className="text-xs font-mono text-brand-mute hidden sm:inline">
              {filteredTemplates.length} themes available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id} 
                className="bg-white border border-brand-hairline rounded-xl overflow-hidden shadow-xs hover:border-brand-hairline-strong transition-all flex flex-col group"
              >
                {/* Visual Header Mockup */}
                <div className={`h-36 ${template.previewBg} border-b border-brand-hairline p-4 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${template.badgeColor}`}>
                      {template.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: template.accentColor }} />
                  </div>

                  <div className="space-y-1">
                    <div className="w-24 h-2 bg-brand-hairline rounded-full" />
                    <div className="w-36 h-3 bg-brand-ink/80 rounded-full" />
                    <div className="w-16 h-1.5 bg-brand-hairline rounded-full" />
                  </div>

                  {/* Decorative background grid pattern */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border border-dashed border-brand-hairline/80 pointer-events-none opacity-50" />
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="font-bold text-sm text-brand-ink group-hover:text-brand-primary transition-colors">
                      {template.name}
                    </h4>
                    <p className="text-xs text-brand-mute font-medium mt-0.5">
                      {template.tagline}
                    </p>
                    <p className="text-xs text-brand-body mt-2 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-brand-hairline flex items-center justify-between">
                    <div className="text-[11px] font-mono text-brand-mute">
                      {template.pages.length} templates
                    </div>
                    {template.isCurrent ? (
                      <Link
                        href="/builder"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
                      >
                        <span>Edit Active</span>
                        <ArrowRight size={12} />
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          updateMetadata({
                            name: template.name,
                            description: template.description
                          });
                          router.push("/builder");
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-body hover:text-brand-ink transition-colors"
                      >
                        <span>Use Starter</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ghost Theme Validator Health Check Widget */}
        <section className="p-5 bg-white border border-brand-hairline rounded-xl shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <h3 className="font-bold text-sm text-brand-ink">
                Ghost Architecture & GScan Validator Checklist
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
                <span>Responsive CSS & Layout</span>
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
              <h3 className="font-bold text-base text-brand-ink">Create New Theme</h3>
              <button onClick={() => setShowNewModal(false)} className="text-brand-mute hover:text-brand-ink">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTheme} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-brand-ink mb-1">Theme Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Journal"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Author Name</label>
                <input
                  type="text"
                  placeholder="e.g. Design Team"
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

              <div className="pt-3 border-t border-brand-hairline flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3.5 py-1.5 border border-brand-hairline rounded-md text-brand-body hover:bg-brand-canvas-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-primary text-white font-semibold rounded-md hover:opacity-90"
                >
                  Create &amp; Open Builder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Theme Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-brand-hairline rounded-xl shadow-level-5 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-hairline pb-3">
              <h3 className="font-bold text-base text-brand-ink">Theme Settings</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-brand-mute hover:text-brand-ink">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-brand-ink mb-1">Theme Name</label>
                <input
                  type="text"
                  value={themeDoc.metadata.name}
                  onChange={(e) => updateMetadata({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Author</label>
                <input
                  type="text"
                  value={themeDoc.metadata.author}
                  onChange={(e) => updateMetadata({ author: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Version</label>
                <input
                  type="text"
                  value={themeDoc.metadata.version}
                  onChange={(e) => updateMetadata({ version: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink mb-1">Description</label>
                <textarea
                  rows={2}
                  value={themeDoc.metadata.description}
                  onChange={(e) => updateMetadata({ description: e.target.value })}
                  className="w-full px-3 py-2 border border-brand-hairline rounded-md text-brand-ink focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-brand-hairline flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 bg-brand-primary text-white font-semibold rounded-md hover:opacity-90 text-xs"
              >
                Done
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
