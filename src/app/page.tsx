"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Check, 
  Layout, 
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Terminal,
  Menu,
  X,
  Copy,
  Moon,
  Sun,
  Palette,
  Type,
  ExternalLink,
  Sliders,
  Plus,
  Trash2,
  FileCheck,
  Zap,
  Box,
  MessageSquare
} from "lucide-react";

// --- Types ---
type DeviceMode = "desktop" | "tablet" | "mobile";
type MainTab = "visual" | "code";
type FontFamily = "sans" | "serif" | "mono";

export default function LandingPage() {
  // --- Hero Playground Interactive State ---
  const [activeDevice, setActiveDevice] = useState<DeviceMode>("desktop");
  const [activeTab, setActiveTab] = useState<MainTab>("visual");
  const [accentColor, setAccentColor] = useState<string>("#0070f3");
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [mockThemeMode, setMockThemeMode] = useState<"light" | "dark">("light");
  const [heroBorderRadius, setHeroBorderRadius] = useState<"none" | "md" | "pill">("md");
  
  // Dynamic block toggles inside hero mockup
  const [showNewsletterBlock, setShowNewsletterBlock] = useState(true);
  const [showCommentsBlock, setShowCommentsBlock] = useState(false);
  const [isMockMobileMenuOpen, setIsMockMobileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // --- Bento Lab State ---
  // 1. Dynamic Navigation Simulator
  const [navItems, setNavItems] = useState<string[]>(["Home", "Articles", "Authors", "About"]);
  const [newNavItem, setNewNavItem] = useState("");

  // 2. Interactive Theme Customizer Card
  const [labRadius, setLabRadius] = useState<"none" | "md" | "pill">("pill");
  const [labIsDark, setLabIsDark] = useState(false);
  const [labAccent, setLabAccent] = useState("#0070f3");

  // 3. Interactive GScan Audit Checks
  const [gscanChecks, setGscanChecks] = useState<Record<string, boolean>>({
    manifest: true,
    locales: true,
    minified: true,
    balanced: true,
  });

  // 4. Interactive 3-Stage Pipeline
  const [activePipelineStep, setActivePipelineStep] = useState<1 | 2 | 3>(1);

  // --- Compiler Code Tab State ---
  const [activeCompilerFile, setActiveCompilerFile] = useState<"post" | "nav" | "css" | "pkg">("post");
  const [copiedCode, setCopiedCode] = useState(false);

  // --- FAQ State ---
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<"all" | "general" | "ghost" | "export">("all");

  // --- Accent Presets ---
  const accentPresets = [
    { name: "Electric Blue", color: "#0070f3" },
    { name: "Ghost Pink", color: "#ff0080" },
    { name: "Emerald", color: "#10b981" },
    { name: "Sunset Amber", color: "#f59e0b" },
    { name: "Vivid Violet", color: "#8b5cf6" },
    { name: "Deep Jet", color: "#15171a" },
  ];

  // --- Starter Templates ---
  const starterTemplates = [
    {
      name: "Apex Minimal (Default)",
      tagline: "Vercel-inspired Developer Publication",
      desc: "Minimalist black-and-ink aesthetics with Geist typography, subtle stacked shadows, and mesh gradients.",
      badge: "Featured",
      badgeColor: "bg-brand-primary text-white",
      tag: "Engineering",
      readTime: "4 min read",
      author: "Alex Rivera",
      color: "#0070f3",
      font: "sans" as FontFamily,
      radius: "md" as const,
      hasNewsletter: true,
      hasComments: false,
    },
    {
      name: "Editorial Gazette",
      tagline: "High-density Magazine & Longform",
      desc: "Bold serif headlines, multi-column article grids, author bio cards, and curated recommendations.",
      badge: "Magazine",
      badgeColor: "bg-blue-600 text-white",
      tag: "Editorial",
      readTime: "6 min read",
      author: "Sarah Jenkins",
      color: "#ff0080",
      font: "serif" as FontFamily,
      radius: "none" as const,
      hasNewsletter: false,
      hasComments: true,
    },
    {
      name: "Geist Tech Log",
      tagline: "Documentation & Technical Journal",
      desc: "Syntax-highlighted code containers, monospace eyebrows, and 100/100 Lighthouse performance.",
      badge: "Technical",
      badgeColor: "bg-purple-600 text-white",
      tag: "DevOps",
      readTime: "3 min read",
      author: "Dev Team",
      color: "#10b981",
      font: "mono" as FontFamily,
      radius: "pill" as const,
      hasNewsletter: true,
      hasComments: true,
    },
  ];

  // --- Code Snippets for "Try the Compiler" ---
  const compilerSnippets = {
    post: `{{!< default}}

{{#post}}
<article class="article {{post_class}}">
  <header class="article-header">
    {{#if primary_tag}}
    <section class="article-tag" style="color: var(--ghost-accent-color);">
      {{#if featured}}<span class="article-featured-badge">Featured</span>{{/if}}
      <a href="{{primary_tag.url}}">{{primary_tag.name}}</a>
    </section>
    {{/if}}
    <h1 class="article-title">{{title}}</h1>
    {{#if custom_excerpt}}
    <p class="article-excerpt">{{custom_excerpt}}</p>
    {{/if}}
  </header>

  {{#if feature_image}}
  <figure class="article-image">
    <img srcset="{{img_url feature_image size="s"}} 300w, {{img_url feature_image size="m"}} 600w, {{img_url feature_image size="l"}} 1000w"
         src="{{img_url feature_image size="xl"}}"
         alt="{{#if feature_image_alt}}{{feature_image_alt}}{{else}}{{title}}{{/if}}" />
  </figure>
  {{/if}}

  <section class="gh-content gh-canvas">
    {{content}}
  </section>

  {{#if comments}}
  <section class="gh-comments-section">
    {{comments}}
  </section>
  {{/if}}
</article>
{{/post}}`,

    nav: `{{!-- partials/navigation.hbs - Native Dynamic Ghost Navigation --}}
<ul class="nav" role="menu">
  {{#foreach navigation}}
    <li class="{{link_class for=(url)}}" role="menuitem">
      <a href="{{url absolute="true"}}">{{label}}</a>
    </li>
  {{/foreach}}
</ul>`,

    css: `/* assets/built/screen.css - Compiled & Minified */
:root {
  --gh-font-heading: Inter, -apple-system, sans-serif;
  --gh-font-body: Inter, -apple-system, sans-serif;
  --font-heading: var(--gh-font-heading);
  --font-body: var(--gh-font-body);
  --ghost-accent-color: #0070f3;
  --color-accent: var(--ghost-accent-color);
}

body { font-family: var(--gh-font-body); }
h1, h2, h3, h4, h5, h6, .heading, .post-title, .hero-title {
  font-family: var(--gh-font-heading) !important;
}

.btn-primary, .gh-head-btn {
  background-color: var(--ghost-accent-color) !important;
  color: #ffffff !important;
}
a:hover { color: var(--ghost-accent-color); }`,

    pkg: `{
  "name": "idli-ghost-theme",
  "description": "Production Ghost theme compiled with Idli Theme Builder",
  "version": "1.0.0",
  "engines": {
    "ghost": ">=4.0.0"
  },
  "keywords": [
    "ghost-theme"
  ],
  "author": {
    "name": "Tech4Good Community",
    "email": "praveen@tech4goodcommunity.com"
  },
  "config": {
    "card_assets": true
  }
}`
  };

  const copyCompilerCode = () => {
    navigator.clipboard.writeText(compilerSnippets[activeCompilerFile]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // --- FAQs ---
  const faqs = [
    {
      q: "Does the exported theme work on Ghost(Pro) cloud hosting?",
      a: "Yes, 100%. The exported ZIP file contains valid Ghost theme structures adhering strictly to Ghost v5 specifications. You can upload it to Ghost(Pro), digitalocean droplets, or any self-hosted instance without code modifications.",
      category: "general"
    },
    {
      q: "How does the Ghost Admin Accent Color and Typography sync work?",
      a: "The compiler inverts the :root CSS variable cascade so that when you change 'Accent color', 'Heading font', or 'Body font' inside Ghost Admin (Settings → Design & branding), all primary buttons, badges, links, headings, and body paragraphs instantly update without requiring you to re-export or edit code.",
      category: "ghost"
    },
    {
      q: "How does the theme pass Ghost's official GScan validation?",
      a: "Our compiler automatically bundles required Casper template locales (locales/en.json), required core SVG icons, card_assets metadata, and minifies screen.css, guaranteeing a 100/100 score in Ghost's official GScan tool.",
      category: "export"
    },
    {
      q: "Can I create custom page templates and duplicate layouts?",
      a: "Yes. You can create custom page templates (custom-[slug].hbs) or duplicate existing ones with real-time duplicate slug validation directly inside the builder workspace.",
      category: "templates"
    },
    {
      q: "Does dark mode sync with Ghost native comments?",
      a: "Yes. The compiled post template includes a real-time MutationObserver that targets Ghost's native comments iframe (@tryghost/comments-ui), ensuring the iframe canvas is transparent with high-contrast text in dark mode.",
      category: "ghost"
    },
  ];

  const filteredFaqs = faqs.filter(f => faqCategory === "all" || f.category === faqCategory);

  // Dynamic font styles
  const getMockFontFamily = () => {
    if (fontFamily === "serif") return 'Georgia, Cambria, "Times New Roman", serif';
    if (fontFamily === "mono") return 'Menlo, Monaco, Consolas, "Liberation Mono", monospace';
    return 'Inter, system-ui, -apple-system, sans-serif';
  };

  const getRadiusClass = (r: "none" | "md" | "pill") => {
    if (r === "none") return "rounded-none";
    if (r === "pill") return "rounded-full";
    return "rounded-md";
  };

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      {/* ─── 1. Sticky Navigation Bar ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-hairline px-6 h-16 flex items-center justify-between transition-all">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-primary flex items-center justify-center rounded-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-xs">
              <span className="text-white font-mono font-semibold text-sm">G</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-brand-ink">Idli Ghost Builder</span>
              <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded-sm text-brand-body uppercase font-medium">Alpha</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs text-brand-body">
            <a href="#playground" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">Playground</a>
            <a href="#interactive-lab" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">Interactive Lab</a>
            <a href="#compiler" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">Compiler</a>
            <a href="#templates" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">Templates</a>
            <a href="#faq" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">FAQ</a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-brand-hairline rounded-full text-xs font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-all duration-200"
          >
            <span>Dashboard</span>
          </Link>
          <Link
            href="/builder"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary text-white rounded-full text-xs font-semibold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-level-1"
          >
            <span>Open Builder</span>
            <ArrowRight size={13} />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-1.5 text-brand-body hover:text-brand-ink rounded-md hover:bg-brand-canvas-soft transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileNavOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-brand-hairline px-6 py-4 flex flex-col gap-3 text-xs font-medium text-brand-body shadow-level-2 animate-in slide-in-from-top-1 duration-150">
          <a href="#playground" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">Playground</a>
          <a href="#interactive-lab" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">Interactive Lab</a>
          <a href="#compiler" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">Compiler</a>
          <a href="#templates" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">Templates</a>
          <a href="#faq" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">FAQ</a>
          <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="py-1 text-brand-ink font-semibold hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
        </div>
      )}

      {/* ─── 2. Hero Section with Animated Mesh Gradient & Floating Elements ─── */}
      <section id="playground" className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6">
        {/* Ambient Animated Mesh Gradient */}
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] pointer-events-none opacity-40 blur-3xl z-0 animate-mesh-float"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, #50e3c2 0%, #007cf0 25%, #7928ca 50%, #ff0080 75%, transparent 100%)",
          }}
        />

        {/* Floating Badges */}
        <div className="hidden lg:block absolute top-28 left-[10%] z-10 animate-float-slow pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md border border-brand-hairline shadow-level-2 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-brand-ink">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>100/100 GScan Verified</span>
          </div>
        </div>

        <div className="hidden lg:block absolute top-36 right-[10%] z-10 animate-float-slow [animation-delay:2s] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md border border-brand-hairline shadow-level-2 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-brand-ink">
            <Sparkles size={14} className="text-blue-500" />
            <span>Pure Handlebars (.hbs)</span>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-hairline shadow-xs hover:border-brand-hairline-strong transition-all">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-brand-body">
              GHOST 5.X READY · ZERO RUNTIME OVERHEAD
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-brand-ink leading-[1.08]">
            Design production Ghost themes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600">visually.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-brand-body leading-relaxed max-w-2xl mx-auto font-normal">
            Assemble publication layouts on a responsive canvas. Real-time compilation to clean Handlebars templates, zero runtime overhead, and 1-click ZIP export.
          </p>

          {/* CTA Cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/builder"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-brand-primary text-white font-semibold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-level-2 inline-flex items-center justify-center gap-2"
            >
              <span>Start Building Free</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white border border-brand-hairline text-brand-ink font-semibold text-sm hover:bg-brand-canvas-soft transition-all shadow-level-1 inline-flex items-center justify-center gap-2"
            >
              <Layout size={15} />
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>

        {/* ─── 3. Interactive Hero Workspace Playground ─── */}
        <div className="relative z-10 max-w-5xl mx-auto mt-12 sm:mt-16">
          <div className="bg-white border border-brand-hairline rounded-xl shadow-level-4 overflow-hidden">
            {/* Top Workspace Chrome */}
            <div className="bg-brand-canvas-soft border-b border-brand-hairline px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[11px] text-brand-mute hidden sm:inline">ghost-theme-builder / live-preview</span>
              </div>

              {/* Viewport Controls */}
              <div className="flex items-center gap-1 bg-white border border-brand-hairline rounded-md p-0.5">
                <button
                  onClick={() => { setActiveDevice("desktop"); setIsMockMobileMenuOpen(false); }}
                  className={`p-1 rounded text-xs transition-colors ${activeDevice === "desktop" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                  title="Desktop (1280px)"
                >
                  <Monitor size={13} />
                </button>
                <button
                  onClick={() => { setActiveDevice("tablet"); setIsMockMobileMenuOpen(false); }}
                  className={`p-1 rounded text-xs transition-colors ${activeDevice === "tablet" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                  title="Tablet (768px)"
                >
                  <Tablet size={13} />
                </button>
                <button
                  onClick={() => { setActiveDevice("mobile"); setIsMockMobileMenuOpen(false); }}
                  className={`p-1 rounded text-xs transition-colors ${activeDevice === "mobile" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                  title="Mobile (375px)"
                >
                  <Smartphone size={13} />
                </button>
              </div>

              {/* Visual vs Code Tab */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveTab("visual")}
                  className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${activeTab === "visual" ? "bg-white border border-brand-hairline text-brand-ink shadow-xs" : "text-brand-mute hover:text-brand-ink"}`}
                >
                  Visual Canvas
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${activeTab === "code" ? "bg-white border border-brand-hairline text-brand-ink shadow-xs" : "text-brand-mute hover:text-brand-ink"}`}
                >
                  Compiled AST (HBS)
                </button>
              </div>
            </div>

            {/* Interactive Customizer Bar */}
            <div className="bg-white border-b border-brand-hairline px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Accent Color Swatches */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-mono uppercase text-brand-mute font-semibold">
                  <Palette size={12} />
                  <span>Accent:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {accentPresets.map((p) => (
                    <button
                      key={p.color}
                      onClick={() => setAccentColor(p.color)}
                      style={{ backgroundColor: p.color }}
                      className={`w-5 h-5 rounded-full transition-all duration-200 ${accentColor === p.color ? "ring-2 ring-offset-2 ring-brand-primary scale-110" : "hover:scale-105 opacity-85 hover:opacity-100"}`}
                      title={p.name}
                      aria-label={`Select ${p.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Typography Picker */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-mono uppercase text-brand-mute font-semibold">
                  <Type size={12} />
                  <span>Font:</span>
                </span>
                <div className="flex items-center bg-brand-canvas-soft border border-brand-hairline rounded-md p-0.5">
                  <button
                    onClick={() => setFontFamily("sans")}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${fontFamily === "sans" ? "bg-white text-brand-ink shadow-xs" : "text-brand-mute hover:text-brand-ink"}`}
                  >
                    Sans
                  </button>
                  <button
                    onClick={() => setFontFamily("serif")}
                    className={`px-2 py-0.5 rounded text-[11px] font-serif font-medium transition-colors ${fontFamily === "serif" ? "bg-white text-brand-ink shadow-xs" : "text-brand-mute hover:text-brand-ink"}`}
                  >
                    Serif
                  </button>
                  <button
                    onClick={() => setFontFamily("mono")}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${fontFamily === "mono" ? "bg-white text-brand-ink shadow-xs" : "text-brand-mute hover:text-brand-ink"}`}
                  >
                    Mono
                  </button>
                </div>
              </div>

              {/* Shape & Dark Mode Controls */}
              <div className="flex items-center gap-2">
                {/* Border Radius Switcher */}
                <div className="flex items-center gap-1 bg-brand-canvas-soft border border-brand-hairline rounded-md p-0.5 text-[10px]">
                  <button
                    onClick={() => setHeroBorderRadius("none")}
                    className={`px-1.5 py-0.5 rounded transition-colors ${heroBorderRadius === "none" ? "bg-white text-brand-ink shadow-xs" : "text-brand-mute"}`}
                  >
                    Sharp
                  </button>
                  <button
                    onClick={() => setHeroBorderRadius("md")}
                    className={`px-1.5 py-0.5 rounded transition-colors ${heroBorderRadius === "md" ? "bg-white text-brand-ink shadow-xs" : "text-brand-mute"}`}
                  >
                    Soft
                  </button>
                  <button
                    onClick={() => setHeroBorderRadius("pill")}
                    className={`px-1.5 py-0.5 rounded transition-colors ${heroBorderRadius === "pill" ? "bg-white text-brand-ink shadow-xs" : "text-brand-mute"}`}
                  >
                    Pill
                  </button>
                </div>

                {/* Live Section Toggles */}
                <button
                  onClick={() => setShowNewsletterBlock(!showNewsletterBlock)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${showNewsletterBlock ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-brand-canvas-soft border-brand-hairline text-brand-mute"}`}
                >
                  Newsletter
                </button>
                <button
                  onClick={() => setShowCommentsBlock(!showCommentsBlock)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${showCommentsBlock ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-brand-canvas-soft border-brand-hairline text-brand-mute"}`}
                >
                  Comments
                </button>

                {/* Mock Dark Mode Switch */}
                <button
                  onClick={() => setMockThemeMode(mockThemeMode === "light" ? "dark" : "light")}
                  className={`p-1.5 rounded-md border border-brand-hairline transition-colors ${mockThemeMode === "dark" ? "bg-neutral-900 text-yellow-400" : "bg-brand-canvas-soft text-brand-ink hover:bg-gray-100"}`}
                  title={`Switch to ${mockThemeMode === "light" ? "Dark" : "Light"} mode`}
                  aria-label="Toggle mock theme mode"
                >
                  {mockThemeMode === "dark" ? <Sun size={13} /> : <Moon size={13} />}
                </button>
              </div>
            </div>

            {/* Mockup Canvas Screen */}
            <div className={`p-4 sm:p-8 flex justify-center min-h-[420px] transition-colors duration-300 ${mockThemeMode === "dark" ? "bg-[#09090b]" : "bg-brand-canvas-soft-2"}`}>
              {activeTab === "visual" ? (
                <div 
                  className={`border shadow-sm transition-all duration-300 overflow-hidden flex flex-col ${
                    mockThemeMode === "dark" 
                      ? "bg-[#111111] border-neutral-800 text-white" 
                      : "bg-white border-brand-hairline text-brand-ink"
                  } ${
                    activeDevice === "mobile" ? "w-[360px]" : activeDevice === "tablet" ? "w-[680px]" : "w-full max-w-[940px]"
                  } ${getRadiusClass(heroBorderRadius)}`}
                  style={{ fontFamily: getMockFontFamily() }}
                >
                  {/* Mock Site Header */}
                  <div className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between text-xs relative z-20 transition-colors ${
                    mockThemeMode === "dark" ? "border-neutral-800 bg-[#111111]" : "border-brand-hairline bg-white"
                  }`}>
                    <span className="font-bold tracking-tight text-sm">Apex Journal</span>
                    
                    {/* Desktop/Tablet Navigation Links */}
                    <div className={`${activeDevice === "mobile" ? "hidden" : "hidden md:flex"} items-center gap-5 text-brand-body font-medium`}>
                      <span className="hover:text-brand-primary cursor-pointer transition-colors" style={{ color: mockThemeMode === "dark" ? "#a1a1aa" : undefined }}>Stories</span>
                      <span className="hover:text-brand-primary cursor-pointer transition-colors" style={{ color: mockThemeMode === "dark" ? "#a1a1aa" : undefined }}>About</span>
                      <span className="hover:text-brand-primary cursor-pointer transition-colors" style={{ color: mockThemeMode === "dark" ? "#a1a1aa" : undefined }}>Membership</span>
                    </div>

                    {/* Actions & Mobile Hamburger */}
                    <div className="flex items-center gap-2">
                      <span 
                        style={{ backgroundColor: accentColor }}
                        className={`px-3 py-1 text-white text-[11px] font-semibold hover:opacity-90 transition-all cursor-pointer whitespace-nowrap shadow-xs ${getRadiusClass(heroBorderRadius)}`}
                      >
                        Subscribe
                      </span>

                      {/* Mobile Hamburger Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setIsMockMobileMenuOpen(!isMockMobileMenuOpen)}
                        className={`${activeDevice === "mobile" ? "flex" : "flex md:hidden"} p-1 text-brand-body hover:text-brand-ink rounded transition-colors`}
                        aria-label="Toggle mobile menu"
                      >
                        {isMockMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Mock Mobile Dropdown Drawer */}
                  {isMockMobileMenuOpen && (
                    <div className={`flex flex-col px-5 py-3 border-b gap-2 text-xs font-medium animate-in slide-in-from-top-1 duration-150 ${
                      mockThemeMode === "dark" ? "bg-[#18181b] border-neutral-800 text-neutral-300" : "bg-brand-canvas-soft border-brand-hairline text-brand-body"
                    }`}>
                      <span className="cursor-pointer py-0.5">Stories</span>
                      <span className="cursor-pointer py-0.5">About</span>
                      <span className="cursor-pointer py-0.5">Membership</span>
                    </div>
                  )}

                  {/* Hero Story Block */}
                  <div className="p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                      <span>Engineering</span>
                      <span>•</span>
                      <span className={mockThemeMode === "dark" ? "text-neutral-500" : "text-brand-mute"}>August 2026</span>
                    </div>
                    <h2 className={`${activeDevice === "mobile" ? "text-2xl" : "text-2xl sm:text-4xl"} font-bold tracking-tight leading-tight`}>
                      Designing modern Ghost publications visually
                    </h2>
                    <p className={`text-sm leading-relaxed max-w-lg mx-auto ${mockThemeMode === "dark" ? "text-neutral-400" : "text-brand-body"}`}>
                      A deep dive into fluid responsive layouts, real-time Handlebars compilation, and native Ghost CMS styling.
                    </p>
                    <div className={`pt-2 flex items-center justify-center gap-3 text-xs ${mockThemeMode === "dark" ? "text-neutral-500" : "text-brand-mute"}`}>
                      <span className="font-semibold" style={{ color: mockThemeMode === "dark" ? "#ffffff" : "#171717" }}>Alex Rivera</span>
                      <span>•</span>
                      <span>4 min read</span>
                    </div>
                  </div>

                  {/* Post Grid Snippet */}
                  <div className={`px-4 sm:px-6 pb-6 border-t pt-6 grid ${activeDevice === "mobile" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-4 ${
                    mockThemeMode === "dark" ? "border-neutral-800" : "border-brand-hairline"
                  }`}>
                    <div className={`p-4 border transition-all ${
                      mockThemeMode === "dark" ? "bg-[#18181b] border-neutral-800" : "bg-brand-canvas-soft border-brand-hairline"
                    } ${getRadiusClass(heroBorderRadius)}`}>
                      <span className="text-[10px] font-mono uppercase font-semibold" style={{ color: accentColor }}>Architecture</span>
                      <h4 className="font-semibold text-xs mt-1">Decoupled presentation with AST compiler</h4>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${mockThemeMode === "dark" ? "text-neutral-400" : "text-brand-mute"}`}>Instant static page loads without client-side hydration delays.</p>
                    </div>
                    <div className={`p-4 border transition-all ${
                      mockThemeMode === "dark" ? "bg-[#18181b] border-neutral-800" : "bg-brand-canvas-soft border-brand-hairline"
                    } ${getRadiusClass(heroBorderRadius)}`}>
                      <span className="text-[10px] font-mono uppercase font-semibold" style={{ color: accentColor }}>Performance</span>
                      <h4 className="font-semibold text-xs mt-1">100/100 Lighthouse on Ghost Cloud</h4>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${mockThemeMode === "dark" ? "text-neutral-400" : "text-brand-mute"}`}>Minified screen.css, responsive image srcsets, and native Casper assets.</p>
                    </div>
                  </div>

                  {/* Conditionally Toggled Newsletter Block */}
                  {showNewsletterBlock && (
                    <div className={`mx-4 sm:mx-6 mb-6 p-6 border text-center space-y-3 transition-all animate-in fade-in-50 duration-200 ${
                      mockThemeMode === "dark" ? "bg-[#18181b] border-neutral-800" : "bg-blue-50/50 border-blue-100"
                    } ${getRadiusClass(heroBorderRadius)}`}>
                      <h4 className="font-bold text-sm">Subscribe to Apex Journal</h4>
                      <p className="text-xs text-brand-mute max-w-sm mx-auto">Get essays on architecture delivered directly to your inbox.</p>
                      <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-1">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          readOnly
                          className={`w-full px-3 py-1.5 text-xs border ${
                            mockThemeMode === "dark" ? "bg-neutral-900 border-neutral-700 text-white" : "bg-white border-brand-hairline"
                          } ${getRadiusClass(heroBorderRadius)}`}
                        />
                        <button
                          style={{ backgroundColor: accentColor }}
                          className={`px-4 py-1.5 text-white font-semibold text-xs shadow-xs ${getRadiusClass(heroBorderRadius)}`}
                        >
                          Join
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Conditionally Toggled Comments Block */}
                  {showCommentsBlock && (
                    <div className={`mx-4 sm:mx-6 mb-6 p-4 border space-y-2 transition-all animate-in fade-in-50 duration-200 ${
                      mockThemeMode === "dark" ? "bg-[#18181b] border-neutral-800" : "bg-brand-canvas-soft border-brand-hairline"
                    } ${getRadiusClass(heroBorderRadius)}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold flex items-center gap-1.5">
                          <MessageSquare size={13} style={{ color: accentColor }} />
                          <span>Member Discussion (3 comments)</span>
                        </span>
                        <span className="text-[10px] text-brand-mute font-mono">Ghost Native UI</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10 rounded text-[11px] space-y-1">
                        <span className="font-semibold block text-[10px]">Elena Rostova</span>
                        <p className="text-brand-mute">The inverted CSS variable hierarchy makes Ghost typography completely seamless.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-[940px] bg-[#0d0d0d] rounded-lg border border-neutral-800 p-5 text-left font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto shadow-2xl">
                  <div className="text-neutral-500 pb-3 border-b border-neutral-800 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Terminal size={13} className="text-emerald-400" />
                      <span>post.hbs — Real-time AST Compilation</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">GScan Validated 100/100</span>
                  </div>
                  <pre className="pt-4 text-[12px] leading-relaxed">
{compilerSnippets.post}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Technical Ecosystem Strip ─── */}
      <section className="border-y border-brand-hairline bg-white py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono uppercase tracking-wider text-brand-mute font-semibold text-center md:text-left">
            Certified for modern Ghost 5.x architecture
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-medium text-brand-body">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Ghost 5.x Ready</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Handlebars AST</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> 100/100 GScan Pass</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Dynamic Navigation</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Casper Locales Bundled</span>
          </div>
        </div>
      </section>

      {/* ─── 5. Interactive Builder Lab (Bento Showcase) ─── */}
      <section id="interactive-lab" className="py-20 md:py-28 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
            Interactive Architecture Lab
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink">
            Experience the Engine in Action
          </h2>
          <p className="text-sm text-brand-body">
            Try the real-time systems that power the builder: dynamic navigation loops, live token cascading, and automated GScan validation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Interactive Theme Customizer Lab */}
          <div className="bg-white border border-brand-hairline rounded-2xl p-6 shadow-level-1 hover:border-brand-hairline-strong transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Sliders size={18} />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-brand-mute bg-brand-canvas-soft px-2 py-0.5 rounded-full">
                  Live Token Sync
                </span>
              </div>
              <h3 className="font-bold text-lg text-brand-ink">Theme Customizer Lab</h3>
              <p className="text-xs text-brand-body leading-relaxed">
                Tweak tokens below and watch the card live-render without page refreshes.
              </p>

              {/* Lab Controls */}
              <div className="space-y-3 pt-2 text-xs">
                {/* Accent Swatches */}
                <div className="flex items-center justify-between">
                  <span className="text-brand-mute font-medium">Accent Color:</span>
                  <div className="flex items-center gap-1.5">
                    {["#0070f3", "#ff0080", "#10b981", "#f59e0b", "#8b5cf6"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setLabAccent(c)}
                        style={{ backgroundColor: c }}
                        className={`w-4 h-4 rounded-full transition-all ${labAccent === c ? "ring-2 ring-brand-primary ring-offset-1 scale-110" : "opacity-80 hover:opacity-100"}`}
                        aria-label={`Select accent ${c}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div className="flex items-center justify-between">
                  <span className="text-brand-mute font-medium">Border Radius:</span>
                  <div className="flex items-center gap-1 bg-brand-canvas-soft border border-brand-hairline p-0.5 rounded-md text-[10px]">
                    <button
                      onClick={() => setLabRadius("none")}
                      className={`px-2 py-0.5 rounded ${labRadius === "none" ? "bg-white shadow-xs font-semibold" : "text-brand-mute"}`}
                    >
                      Sharp
                    </button>
                    <button
                      onClick={() => setLabRadius("md")}
                      className={`px-2 py-0.5 rounded ${labRadius === "md" ? "bg-white shadow-xs font-semibold" : "text-brand-mute"}`}
                    >
                      Soft
                    </button>
                    <button
                      onClick={() => setLabRadius("pill")}
                      className={`px-2 py-0.5 rounded ${labRadius === "pill" ? "bg-white shadow-xs font-semibold" : "text-brand-mute"}`}
                    >
                      Pill
                    </button>
                  </div>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <span className="text-brand-mute font-medium">Theme Mode:</span>
                  <button
                    onClick={() => setLabIsDark(!labIsDark)}
                    className="px-2 py-0.5 rounded-md border border-brand-hairline text-[11px] font-medium flex items-center gap-1 hover:bg-brand-canvas-soft transition-colors"
                  >
                    {labIsDark ? <Sun size={12} className="text-yellow-500" /> : <Moon size={12} />}
                    <span>{labIsDark ? "Dark" : "Light"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Target Live Card */}
            <div className={`p-4 border transition-all duration-300 ${
              labIsDark ? "bg-[#121214] border-neutral-800 text-white" : "bg-brand-canvas-soft border-brand-hairline text-brand-ink"
            } ${getRadiusClass(labRadius)}`}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold" style={{ color: labAccent }}>Ghost Accent Token</span>
                <span className="font-mono text-[10px] text-brand-mute">@site.accent_color</span>
              </div>
              <p className="text-xs pt-1.5 line-clamp-2">This card immediately reflects your chosen border-radius and color variables.</p>
              <button 
                style={{ backgroundColor: labAccent }}
                className={`w-full mt-3 py-1.5 text-white font-semibold text-xs shadow-xs hover:opacity-90 transition-all ${getRadiusClass(labRadius)}`}
              >
                Dynamic Action Button
              </button>
            </div>
          </div>

          {/* Card 2: Interactive Dynamic Ghost Navigation Simulator */}
          <div className="bg-white border border-brand-hairline rounded-2xl p-6 shadow-level-1 hover:border-brand-hairline-strong transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Layers size={18} />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-brand-mute bg-brand-canvas-soft px-2 py-0.5 rounded-full">
                  Handlebars Loop
                </span>
              </div>
              <h3 className="font-bold text-lg text-brand-ink">Dynamic Navigation Lab</h3>
              <p className="text-xs text-brand-body leading-relaxed">
                Add or remove menu links below to see how Ghost compiles dynamic <code className="font-mono text-[10px] bg-brand-canvas-soft px-1 rounded">{"{{navigation}}"}</code> loops.
              </p>

              {/* Add item input */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="New link name (e.g. Podcast)..."
                  value={newNavItem}
                  onChange={(e) => setNewNavItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newNavItem.trim()) {
                      setNavItems([...navItems, newNavItem.trim()]);
                      setNewNavItem("");
                    }
                  }}
                  className="w-full px-3 py-1.5 text-xs bg-brand-canvas-soft border border-brand-hairline rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <button
                  onClick={() => {
                    if (newNavItem.trim()) {
                      setNavItems([...navItems, newNavItem.trim()]);
                      setNewNavItem("");
                    }
                  }}
                  className="p-1.5 rounded-lg bg-brand-primary text-white hover:opacity-90 transition-opacity"
                  title="Add Navigation Item"
                  aria-label="Add item"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Tag Cloud of items */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                {navItems.map((item, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-canvas-soft border border-brand-hairline text-xs font-medium text-brand-ink group hover:border-brand-hairline-strong transition-all"
                  >
                    <span>{item}</span>
                    {navItems.length > 2 && (
                      <button
                        onClick={() => setNavItems(navItems.filter((_, i) => i !== idx))}
                        className="text-brand-mute hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item}`}
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Compiled Nav Code Output */}
            <div className="p-3 bg-[#0d0d0d] rounded-xl text-neutral-300 font-mono text-[11px] leading-relaxed border border-neutral-800">
              <span className="text-neutral-500 text-[10px] block pb-1 border-b border-neutral-800 mb-2">
                {"{{!-- partials/navigation.hbs --}}"}
              </span>
              <div className="text-emerald-400">&lt;ul class=&quot;nav&quot;&gt;</div>
              {navItems.slice(0, 3).map((item, i) => (
                <div key={i} className="pl-3 text-neutral-300">
                  &lt;li&gt;&lt;a href=&quot;/{item.toLowerCase()}&quot;&gt;{item}&lt;/a&gt;&lt;/li&gt;
                </div>
              ))}
              {navItems.length > 3 && (
                <div className="pl-3 text-neutral-500">... +{navItems.length - 3} more items</div>
              )}
              <div className="text-emerald-400">&lt;/ul&gt;</div>
            </div>
          </div>

          {/* Card 3: Interactive GScan 100/100 Compliance Meter */}
          <div className="bg-white border border-brand-hairline rounded-2xl p-6 shadow-level-1 hover:border-brand-hairline-strong transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <FileCheck size={18} />
                </div>
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  100/100 Pass
                </span>
              </div>
              <h3 className="font-bold text-lg text-brand-ink">GScan Validator Gauge</h3>
              <p className="text-xs text-brand-body leading-relaxed">
                Click checkpoints below to test the automated compiler rules that keep themes 100% compliant.
              </p>

              {/* Checkpoints Interactive Toggles */}
              <div className="space-y-2 pt-1 text-xs">
                {[
                  { id: "manifest", label: "Casper Manifest & Manifest Icons", desc: "Injects /casper-template/manifest.json" },
                  { id: "locales", label: "Required Locales (locales/en.json)", desc: "Injects English localization fallbacks" },
                  { id: "minified", label: "Minified CSS & Card Assets", desc: "Minifies screen.css & card_assets: true" },
                  { id: "balanced", label: "Balanced Handlebars AST Blocks", desc: "Guarantees 100% balanced {{#...}} tags" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGscanChecks({ ...gscanChecks, [item.id]: !gscanChecks[item.id] })}
                    className={`w-full p-2 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                      gscanChecks[item.id] ? "bg-emerald-50/50 border-emerald-200 text-brand-ink" : "bg-brand-canvas-soft border-brand-hairline text-brand-mute"
                    }`}
                  >
                    <CheckCircle2 size={14} className={gscanChecks[item.id] ? "text-emerald-500 shrink-0 mt-0.5" : "text-brand-mute shrink-0 mt-0.5"} />
                    <div>
                      <span className="font-semibold text-[11px] block">{item.label}</span>
                      <span className="text-[10px] text-brand-mute">{item.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* GScan Score Meter */}
            <div className="p-3 bg-brand-canvas-soft border border-brand-hairline rounded-xl flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-ink">Overall GScan Score:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
                <span className="text-emerald-600">
                  {Object.values(gscanChecks).filter(Boolean).length === 4 ? "100 / 100" : `${Object.values(gscanChecks).filter(Boolean).length * 25} / 100`}
                </span>
                <span className="text-[10px] text-brand-mute">Clean Pass</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3-Stage Pipeline Interactive Stepper ─── */}
        <div className="bg-white border border-brand-hairline rounded-2xl p-6 sm:p-8 shadow-level-2 space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-ink">
              From Visual Canvas to Ghost Cloud in 3 Steps
            </h3>
            <p className="text-xs sm:text-sm text-brand-body">
              Click each step to explore how your visual layout is compiled and packaged.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {[
              { step: 1, title: "1. Visual Canvas", desc: "Drag & drop AST blocks", icon: Box },
              { step: 2, title: "2. Headless AST", desc: "Zustand JSON state", icon: Zap },
              { step: 3, title: "3. Standalone ZIP", desc: "100% GScan Validated", icon: CheckCircle2 },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = activePipelineStep === s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setActivePipelineStep(s.step as 1 | 2 | 3)}
                  className={`w-full sm:w-64 p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    isActive 
                      ? "bg-brand-primary text-white border-brand-primary shadow-level-2 scale-102" 
                      : "bg-brand-canvas-soft border-brand-hairline hover:border-brand-hairline-strong text-brand-ink"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? "bg-white/10 text-white" : "bg-white text-brand-primary border border-brand-hairline"}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{s.title}</h4>
                    <p className={`text-[11px] ${isActive ? "text-neutral-300" : "text-brand-mute"}`}>{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Detail View */}
          <div className="p-6 bg-brand-canvas-soft border border-brand-hairline rounded-xl text-center max-w-2xl mx-auto space-y-3">
            {activePipelineStep === 1 && (
              <div className="space-y-2 animate-in fade-in-50 duration-200">
                <span className="font-mono text-[10px] uppercase font-bold text-blue-600">Stage 1: Authoring</span>
                <h4 className="font-bold text-base text-brand-ink">Visual Drag &amp; Drop Editor</h4>
                <p className="text-xs text-brand-body leading-relaxed max-w-lg mx-auto">
                  Powered by <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-brand-hairline">@dnd-kit</code>, creators arrange sections, columns, hero banners, and post feeds with fluid responsive previews.
                </p>
              </div>
            )}
            {activePipelineStep === 2 && (
              <div className="space-y-2 animate-in fade-in-50 duration-200">
                <span className="font-mono text-[10px] uppercase font-bold text-purple-600">Stage 2: Representation</span>
                <h4 className="font-bold text-base text-brand-ink">Headless ThemeDocument AST</h4>
                <p className="text-xs text-brand-body leading-relaxed max-w-lg mx-auto">
                  Editing actions update a centralized Zustand JSON tree with undo/redo history, avoiding messy raw HTML or direct DOM mutation.
                </p>
              </div>
            )}
            {activePipelineStep === 3 && (
              <div className="space-y-2 animate-in fade-in-50 duration-200">
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-600">Stage 3: Production</span>
                <h4 className="font-bold text-base text-brand-ink">Ghost Theme ZIP Package</h4>
                <p className="text-xs text-brand-body leading-relaxed max-w-lg mx-auto">
                  The compiler generates clean Handlebars (<code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-brand-hairline">.hbs</code>), minifies <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-brand-hairline">screen.css</code>, bundles Casper locales, and packages a ready-to-upload ZIP.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── 6. Try The Compiler Live Code Section (Dark Mode) ─── */}
      <section id="compiler" className="bg-[#0e0e11] text-white py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Zero-Runtime Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Pure Ghost Handlebars. Zero React in production.
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Most builders output heavy, bloated HTML with hundreds of inline styles. Idli Ghost Theme Builder translates your visual tree directly into semantic Handlebars partials, minified CSS variables, and native Ghost CMS loop helpers.
            </p>

            <div className="space-y-3 pt-2 text-xs font-mono text-neutral-300">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Compatible with Ghost 4.x and 5.x cloud &amp; self-hosted</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Ghost Admin Accent Color dynamic CSS custom property cascade</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Automatic asset minification of screen.css on compilation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Ghost comments dark mode sync with transparent iframe</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-brand-ink font-semibold text-xs hover:bg-neutral-100 hover:scale-105 transition-all shadow-xs"
              >
                <span>Launch Builder &amp; Export</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Interactive Code Inspector Terminal */}
          <div className="bg-[#050507] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl space-y-0 font-mono text-xs">
            {/* Terminal Header */}
            <div className="bg-[#121217] border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveCompilerFile("post")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${activeCompilerFile === "post" ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400 hover:text-white"}`}
                >
                  post.hbs
                </button>
                <button
                  onClick={() => setActiveCompilerFile("nav")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${activeCompilerFile === "nav" ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400 hover:text-white"}`}
                >
                  navigation.hbs
                </button>
                <button
                  onClick={() => setActiveCompilerFile("css")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${activeCompilerFile === "css" ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400 hover:text-white"}`}
                >
                  screen.css
                </button>
                <button
                  onClick={() => setActiveCompilerFile("pkg")}
                  className={`px-2.5 py-1 rounded text-[11px] transition-colors ${activeCompilerFile === "pkg" ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400 hover:text-white"}`}
                >
                  package.json
                </button>
              </div>

              <button
                onClick={copyCompilerCode}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] transition-all"
                title="Copy code to clipboard"
              >
                {copiedCode ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-5 max-h-[380px] overflow-y-auto overflow-x-auto text-[11px] leading-relaxed text-neutral-300">
              <pre className="font-mono">
                {compilerSnippets[activeCompilerFile]}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. Starter Templates Showcase ─── */}
      <section id="templates" className="py-20 md:py-28 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
            Pre-Built Foundations
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink">
            Start from curated, validated templates.
          </h2>
          <p className="text-sm text-brand-body">
            Each template is built with Geist UI design tokens, responsive typography scales, and modular blocks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {starterTemplates.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-brand-hairline rounded-xl overflow-hidden shadow-xs hover:border-brand-hairline-strong hover:shadow-level-2 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="text-xs font-mono text-brand-mute">{item.readTime}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-base text-brand-ink group-hover:text-brand-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-brand-mute font-medium">
                    {item.tagline}
                  </p>
                  <p className="text-xs text-brand-body leading-relaxed pt-2">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-brand-canvas-soft border-t border-brand-hairline flex items-center justify-between">
                <button
                  onClick={() => {
                    setAccentColor(item.color);
                    setFontFamily(item.font);
                    setHeroBorderRadius(item.radius);
                    setShowNewsletterBlock(item.hasNewsletter);
                    setShowCommentsBlock(item.hasComments);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-[11px] font-mono text-brand-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles size={11} />
                  <span>Preview in Hero</span>
                </button>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-ink hover:text-brand-primary transition-colors"
                >
                  <span>Open in Builder</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. Frequently Asked Questions (Interactive Accordions) ─── */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 border-t border-brand-hairline">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
            Support &amp; FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-brand-body">
            Everything you need to know about theme compiling, Ghost validation, and live deployment.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center justify-center gap-1.5 text-xs">
          <button
            onClick={() => setFaqCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${faqCategory === "all" ? "bg-brand-primary text-white" : "bg-white border border-brand-hairline text-brand-body hover:text-brand-ink"}`}
          >
            All
          </button>
          <button
            onClick={() => setFaqCategory("general")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${faqCategory === "general" ? "bg-brand-primary text-white" : "bg-white border border-brand-hairline text-brand-body hover:text-brand-ink"}`}
          >
            General
          </button>
          <button
            onClick={() => setFaqCategory("ghost")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${faqCategory === "ghost" ? "bg-brand-primary text-white" : "bg-white border border-brand-hairline text-brand-body hover:text-brand-ink"}`}
          >
            Ghost &amp; CMS
          </button>
          <button
            onClick={() => setFaqCategory("export")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${faqCategory === "export" ? "bg-brand-primary text-white" : "bg-white border border-brand-hairline text-brand-body hover:text-brand-ink"}`}
          >
            GScan &amp; Export
          </button>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-white border border-brand-hairline rounded-xl overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-brand-ink hover:text-brand-primary transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-brand-primary text-white border-transparent" : "text-brand-body"}`}>
                    <ChevronDown size={14} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-brand-body leading-relaxed border-t border-brand-hairline bg-brand-canvas-soft/30 animate-in fade-in-50 duration-150">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 9. Final CTA Band ─── */}
      <section className="bg-white border-t border-brand-hairline py-20 px-6 text-center space-y-6">
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink">
            Ready to design your publication?
          </h2>
          <p className="text-sm text-brand-body leading-relaxed">
            Jump directly into the visual workspace, customize your pages, and download your production Ghost theme in minutes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/builder"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand-primary text-white font-semibold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-level-2 inline-flex items-center justify-center gap-2"
          >
            <span>Launch Visual Builder</span>
            <ArrowRight size={15} />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand-canvas-soft border border-brand-hairline text-brand-ink font-semibold text-sm hover:bg-gray-100 transition-all shadow-xs inline-flex items-center justify-center gap-2"
          >
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </section>

      {/* ─── 10. Footer ─── */}
      <footer className="border-t border-brand-hairline bg-white py-12 px-6 text-xs text-brand-mute">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-primary flex items-center justify-center rounded-sm">
                <span className="text-white font-mono font-semibold text-xs">G</span>
              </div>
              <span className="font-semibold text-brand-ink">Idli Ghost Theme Builder</span>
            </div>
            <p className="text-brand-mute leading-relaxed text-[11px]">
              Visual design environment for modern Ghost CMS publishing frameworks.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-mono uppercase tracking-wider text-brand-ink font-semibold text-[10px]">Product</span>
            <ul className="space-y-1.5">
              <li><Link href="/builder" className="hover:text-brand-ink transition-colors">Visual Builder</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-ink transition-colors">Theme Dashboard</Link></li>
              <li><a href="#templates" className="hover:text-brand-ink transition-colors">Starter Themes</a></li>
              <li><a href="#compiler" className="hover:text-brand-ink transition-colors">Handlebars AST</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-mono uppercase tracking-wider text-brand-ink font-semibold text-[10px]">Resources</span>
            <ul className="space-y-1.5">
              <li><a href="https://ghost.org/docs/themes/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-ink transition-colors inline-flex items-center gap-1">Ghost Theme Docs <ExternalLink size={10} /></a></li>
              <li><a href="https://ghost.org/docs/themes/helpers/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-ink transition-colors inline-flex items-center gap-1">Handlebars Helpers <ExternalLink size={10} /></a></li>
              <li><a href="https://gscan.ghost.org/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-ink transition-colors inline-flex items-center gap-1">Official GScan Validator <ExternalLink size={10} /></a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-mono uppercase tracking-wider text-brand-ink font-semibold text-[10px]">Ecosystem</span>
            <p className="text-[11px] leading-relaxed text-brand-body">
              Designed with Geist UI guidelines, Tailwind CSS v4, and TypeScript.
            </p>
            <p className="text-[10px] text-brand-mute pt-1">
              © 2026 Idli Ghost Theme Builder.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
