"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Code2, 
  ShieldCheck, 
  Download, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Check, 
  Layout, 
  ChevronRight,
  CheckCircle2,
  Terminal,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"visual" | "code">("visual");
  const [isMockMobileMenuOpen, setIsMockMobileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const starterTemplates = [
    {
      name: "Sakthi T4GC (Default)",
      tagline: "Vercel-inspired Developer Publication",
      desc: "Minimalist black-and-ink aesthetics with Geist typography, subtle stacked shadows, and mesh gradients.",
      badge: "Featured",
      badgeColor: "bg-brand-primary text-white",
      tag: "Engineering",
      readTime: "4 min read",
      author: "Alex Rivera",
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
    },
  ];

  return (
    <div className="min-h-screen bg-brand-canvas-soft text-brand-ink flex flex-col font-sans selection:bg-brand-primary selection:text-white">
      {/* ─── 1. Sticky Navigation Bar ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-hairline px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-brand-primary flex items-center justify-center rounded-sm transition-transform group-hover:scale-105">
              <span className="text-white font-mono font-semibold text-sm">G</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-brand-ink">Ghost Theme Builder</span>
              <span className="font-mono text-[10px] bg-brand-canvas-soft border border-brand-hairline px-1.5 py-0.5 rounded-sm text-brand-body uppercase">Alpha</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-xs text-brand-body">
            <a href="#features" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">Features</a>
            <a href="#compiler" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">Compiler</a>
            <a href="#templates" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">Templates</a>
            <a href="#faq" className="px-2.5 py-1 rounded hover:text-brand-ink hover:bg-brand-canvas-soft transition-colors">FAQ</a>
            <Link href="/dashboard" className="px-2.5 py-1 rounded text-brand-ink font-semibold hover:bg-brand-canvas-soft transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-brand-hairline rounded-full text-xs font-semibold text-brand-ink hover:bg-brand-canvas-soft transition-colors"
          >
            <span>Dashboard</span>
          </Link>
          <Link
            href="/builder"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-primary text-white rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-xs"
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

      {/* Mobile Drawer for Landing Page Header */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-brand-hairline px-6 py-4 flex flex-col gap-3 text-xs font-medium text-brand-body shadow-level-2 animate-in slide-in-from-top-1 duration-150">
          <a href="#features" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">Features</a>
          <a href="#compiler" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">Compiler</a>
          <a href="#templates" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">Templates</a>
          <a href="#faq" onClick={() => setIsMobileNavOpen(false)} className="py-1 hover:text-brand-ink transition-colors">FAQ</a>
          <Link href="/dashboard" onClick={() => setIsMobileNavOpen(false)} className="py-1 text-brand-ink font-semibold hover:text-brand-primary transition-colors">
            Dashboard
          </Link>
        </div>
      )}

      {/* ─── 2. Hero Band with Signature Mesh Gradient ─── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32 px-6">
        {/* Atmospheric mesh gradient backdrop */}
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] pointer-events-none opacity-40 blur-3xl z-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, #50e3c2 0%, #007cf0 25%, #7928ca 50%, #ff0080 75%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-brand-hairline shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-brand-body">
              GHOST 5.X READY · GSCAN 100/100 COMPLIANT
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-brand-ink leading-[1.08]">
            Design production-ready Ghost themes visually.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-brand-body leading-relaxed max-w-2xl mx-auto font-normal">
            Drag and drop layout blocks on a responsive canvas. Real-time compilation to clean Handlebars templates, zero-runtime hydration overhead, and standalone ZIP export.
          </p>

          {/* CTA Cluster */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/builder"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-brand-primary text-white font-semibold text-sm hover:opacity-90 transition-all shadow-level-2 inline-flex items-center justify-center gap-2"
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

        {/* ─── 3. Interactive Hero Workspace Mockup Preview ─── */}
        <div className="relative z-10 max-w-5xl mx-auto mt-12 sm:mt-16">
          <div className="bg-white border border-brand-hairline rounded-xl shadow-level-4 overflow-hidden">
            {/* Window Top Chrome */}
            <div className="bg-brand-canvas-soft border-b border-brand-hairline px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-[11px] text-brand-mute">ghost-theme-builder / live-preview</span>
              </div>

              {/* Viewport Switcher Controls */}
              <div className="hidden sm:flex items-center gap-1 bg-white border border-brand-hairline rounded-md p-0.5">
                <button
                  onClick={() => { setActiveDevice("desktop"); setIsMockMobileMenuOpen(false); }}
                  className={`p-1 rounded text-xs transition-colors ${activeDevice === "desktop" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                  title="Desktop View"
                >
                  <Monitor size={13} />
                </button>
                <button
                  onClick={() => { setActiveDevice("tablet"); setIsMockMobileMenuOpen(false); }}
                  className={`p-1 rounded text-xs transition-colors ${activeDevice === "tablet" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                  title="Tablet View"
                >
                  <Tablet size={13} />
                </button>
                <button
                  onClick={() => { setActiveDevice("mobile"); setIsMockMobileMenuOpen(false); }}
                  className={`p-1 rounded text-xs transition-colors ${activeDevice === "mobile" ? "bg-brand-primary text-white" : "text-brand-mute hover:text-brand-ink"}`}
                  title="Mobile View"
                >
                  <Smartphone size={13} />
                </button>
              </div>

              {/* Tab Selector */}
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

            {/* Mockup Canvas Screen */}
            <div className="bg-brand-canvas-soft-2 p-6 flex justify-center min-h-[380px] overflow-hidden">
              {activeTab === "visual" ? (
                <div 
                  className={`bg-white border border-brand-hairline rounded-md shadow-xs transition-all duration-300 overflow-hidden flex flex-col ${
                    activeDevice === "mobile" ? "w-[360px]" : activeDevice === "tablet" ? "w-[680px]" : "w-full max-w-[940px]"
                  }`}
                >
                  {/* Mock Site Header */}
                  <div className="px-4 sm:px-6 py-3.5 border-b border-brand-hairline flex items-center justify-between text-xs bg-white relative z-20">
                    <span className="font-bold tracking-tight text-sm text-brand-ink">Sakthi T4GC</span>
                    
                    {/* Desktop/Tablet Navigation Links */}
                    <div className={`${activeDevice === "mobile" ? "hidden" : "hidden md:flex"} items-center gap-5 text-brand-body font-medium`}>
                      <span className="hover:text-brand-ink cursor-pointer transition-colors">Stories</span>
                      <span className="hover:text-brand-ink cursor-pointer transition-colors">About</span>
                      <span className="hover:text-brand-ink cursor-pointer transition-colors">Membership</span>
                    </div>

                    {/* Actions & Mobile Hamburger */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 sm:px-3 py-1 bg-brand-primary text-white rounded-full text-[11px] font-semibold hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap">
                        Subscribe
                      </span>

                      {/* Mobile Hamburger Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setIsMockMobileMenuOpen(!isMockMobileMenuOpen)}
                        className={`${activeDevice === "mobile" ? "flex" : "flex md:hidden"} p-1 text-brand-body hover:text-brand-ink rounded hover:bg-brand-canvas-soft transition-colors`}
                        aria-label="Toggle mobile menu"
                        title="Toggle navigation menu"
                      >
                        {isMockMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Mock Mobile Dropdown Navigation Drawer */}
                  {isMockMobileMenuOpen && (
                    <div className={`${activeDevice === "mobile" ? "flex" : "flex md:hidden"} flex-col px-5 py-3 bg-brand-canvas-soft border-b border-brand-hairline gap-2.5 text-xs font-medium text-brand-body animate-in slide-in-from-top-1 duration-150`}>
                      <span className="hover:text-brand-ink cursor-pointer transition-colors py-0.5">Stories</span>
                      <span className="hover:text-brand-ink cursor-pointer transition-colors py-0.5">About</span>
                      <span className="hover:text-brand-ink cursor-pointer transition-colors py-0.5">Membership</span>
                    </div>
                  )}

                  {/* Mock Hero Story */}
                  <div className="p-8 sm:p-12 text-center space-y-4 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-blue-600">
                      <span>Design Systems</span>
                      <span>•</span>
                      <span className="text-brand-mute">August 20, 2026</span>
                    </div>
                    <h2 className={`${activeDevice === "mobile" ? "text-2xl" : "text-2xl sm:text-4xl"} font-bold tracking-tight text-brand-ink leading-tight`}>
                      Designing modern publication themes with Ghost
                    </h2>
                    <p className="text-sm text-brand-body leading-relaxed max-w-lg mx-auto">
                      A deep dive into fluid typography, zero layout shift, and production-ready Handlebars templates.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-3 text-xs text-brand-mute">
                      <span className="font-semibold text-brand-ink">Alex Rivera</span>
                      <span>•</span>
                      <span>4 min read</span>
                    </div>
                  </div>

                  {/* Mock Post Grid Snippet */}
                  <div className={`px-4 sm:px-6 pb-8 border-t border-brand-hairline pt-6 grid ${activeDevice === "mobile" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} gap-3 sm:gap-4`}>
                    <div className="p-4 bg-brand-canvas-soft border border-brand-hairline rounded-md">
                      <span className="text-[10px] font-mono uppercase text-blue-600 font-semibold">Architecture</span>
                      <h4 className="font-semibold text-xs text-brand-ink mt-1">Decoupled presentation with AST compiler</h4>
                      <p className="text-[11px] text-brand-mute mt-1 line-clamp-2">Instant static page loads without client-side hydration delays.</p>
                    </div>
                    <div className="p-4 bg-brand-canvas-soft border border-brand-hairline rounded-md">
                      <span className="text-[10px] font-mono uppercase text-purple-600 font-semibold">Performance</span>
                      <h4 className="font-semibold text-xs text-brand-ink mt-1">100/100 Lighthouse on Ghost Cloud</h4>
                      <p className="text-[11px] text-brand-mute mt-1 line-clamp-2">Minified screen.css, responsive image srcsets, and native Casper assets.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-[940px] bg-[#111111] rounded-md border border-neutral-800 p-5 text-left font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto">
                  <div className="text-neutral-500 pb-2 border-b border-neutral-800 flex items-center justify-between">
                    <span>post.hbs — Compiled Output</span>
                    <span className="text-[10px] text-emerald-400">Validated 100% Passed</span>
                  </div>
                  <pre className="pt-4 text-[12px]">
{`{{!< default}}

{{#post}}
<article class="article {{post_class}}">
  <header class="article-header">
    {{#if primary_tag}}
    <section class="article-tag">
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
    <img srcset="{{img_url feature_image size="s"}} 300w, ..." src="{{img_url feature_image size="xl"}}" />
  </figure>
  {{/if}}

  <section class="gh-content">
    {{content}}
  </section>
</article>
{{/post}}`}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Logo / Technical Ecosystem Strip ─── */}
      <section className="border-y border-brand-hairline bg-white py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-mono uppercase tracking-wider text-brand-mute font-semibold text-center md:text-left">
            Built for modern Ghost publishing architecture
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono font-medium text-brand-body">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Ghost 5.x</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Handlebars AST</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> 100/100 GScan</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Minified CSS</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Casper Locales</span>
          </div>
        </div>
      </section>

      {/* ─── 5. Feature Grid (3-Up Card Marketing) ─── */}
      <section id="features" className="py-20 md:py-28 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
            Engineered Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-ink">
            Everything you need to craft high-performance Ghost themes.
          </h2>
          <p className="text-sm text-brand-body">
            No messy HTML exports or bloated JS runtimes. Every theme compiles into clean Handlebars ready for Ghost Cloud or self-hosted servers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-brand-hairline rounded-xl p-6 space-y-4 shadow-level-1 hover:border-brand-hairline-strong transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-primary">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-lg text-brand-ink">Visual Drag &amp; Drop AST</h3>
            <p className="text-xs text-brand-body leading-relaxed">
              Arrange hero bands, post grids, author profiles, related articles, newsletters, and pricing tables directly on canvas with nested layer tree reordering.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-brand-hairline rounded-xl p-6 space-y-4 shadow-level-1 hover:border-brand-hairline-strong transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-primary">
              <Code2 size={20} />
            </div>
            <h3 className="font-bold text-lg text-brand-ink">Native Ghost Handlebars</h3>
            <p className="text-xs text-brand-body leading-relaxed">
              Emits real <code className="font-mono text-[10px] bg-brand-canvas-soft px-1 py-0.5 rounded">{"{{#foreach}}"}</code>, <code className="font-mono text-[10px] bg-brand-canvas-soft px-1 py-0.5 rounded">{"{{img_url}}"}</code>, and <code className="font-mono text-[10px] bg-brand-canvas-soft px-1 py-0.5 rounded">{"{{navigation}}"}</code> helpers. Zero client-side React code in the final theme.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-brand-hairline rounded-xl p-6 space-y-4 shadow-level-1 hover:border-brand-hairline-strong transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-primary">
              <ShieldCheck size={20} />
            </div>
            <h3 className="font-bold text-lg text-brand-ink">100/100 GScan Guaranteed</h3>
            <p className="text-xs text-brand-body leading-relaxed">
              Automated compiler rules inject <code className="font-mono text-[10px] bg-brand-canvas-soft px-1 py-0.5 rounded">locales/en.json</code>, required icons, card assets metadata, and minified CSS to ensure 100% clean passes.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-brand-hairline rounded-xl p-6 space-y-4 shadow-level-1 hover:border-brand-hairline-strong transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-primary">
              <Monitor size={20} />
            </div>
            <h3 className="font-bold text-lg text-brand-ink">Fluid Responsive Testing</h3>
            <p className="text-xs text-brand-body leading-relaxed">
              Preview your theme live in desktop (1280px), tablet (768px), and mobile (375px) device viewports with responsive padding insets and typography scaling.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-brand-hairline rounded-xl p-6 space-y-4 shadow-level-1 hover:border-brand-hairline-strong transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-primary">
              <Download size={20} />
            </div>
            <h3 className="font-bold text-lg text-brand-ink">Instant ZIP Packaging</h3>
            <p className="text-xs text-brand-body leading-relaxed">
              Package your theme into an immediate <code className="font-mono text-[10px] bg-brand-canvas-soft px-1 py-0.5 rounded">theme.zip</code> ready to upload directly into Ghost Admin &gt; Settings &gt; Design with one click.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-white border border-brand-hairline rounded-xl p-6 space-y-4 shadow-level-1 hover:border-brand-hairline-strong transition-all">
            <div className="w-10 h-10 rounded-lg bg-brand-canvas-soft border border-brand-hairline flex items-center justify-center text-brand-primary">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-lg text-brand-ink">Dark Mode &amp; Design Tokens</h3>
            <p className="text-xs text-brand-body leading-relaxed">
              Built-in dark mode support, Geist typography presets, customizable container widths, and color tokens that automatically synchronize across templates.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 6. Polarity-Flipped Dark Band (Architecture & Specs) ─── */}
      <section id="compiler" className="bg-brand-primary text-white py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Under The Hood
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Zero runtime overhead. Pure Ghost native Handlebars.
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Most visual builders output heavy, bloated HTML with hundreds of inline styles. Ghost Theme Builder translates your visual nodes directly into semantic Handlebars partials, minified CSS variables, and native Ghost CMS loop helpers.
            </p>

            <div className="space-y-3 pt-2 text-xs font-mono text-neutral-300">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Supports Ghost 4.x and 5.x runtime engines</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Primary and secondary dynamic navigation helper loops</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Automatic asset minification of screen.css on compilation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                <span>Native Ghost comments sync with dark/light themes</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-brand-ink font-semibold text-xs hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <span>Try the Compiler in Builder</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Terminal / Code Snippet */}
          <div className="bg-[#0c0c0c] border border-neutral-800 rounded-xl p-5 shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-neutral-500 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-emerald-400" />
                <span>Ghost AST Compiler Output</span>
              </div>
              <span className="text-[10px] text-neutral-400">package.json + hbs</span>
            </div>

            <pre className="text-neutral-300 text-[11px] leading-relaxed overflow-x-auto py-2">
{`{
  "name": "sakthi-t4gc",
  "version": "1.0.0",
  "engines": { "ghost": ">=4.0.0" },
  "keywords": ["ghost-theme"],
  "config": { "card_assets": true }
}

{{!-- partials/navigation.hbs --}}
<ul class="nav" role="menu">
  {{#foreach navigation}}
    <li class="{{link_class for=(url)}}" role="menuitem">
      <a href="{{url absolute="true"}}">{{label}}</a>
    </li>
  {{/foreach}}
</ul>`}
            </pre>
          </div>
        </div>
      </section>

      {/* ─── 7. Starter Templates Showcase ─── */}
      <section id="templates" className="py-20 md:py-28 px-6 max-w-6xl mx-auto space-y-12">
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
              className="bg-white border border-brand-hairline rounded-xl overflow-hidden shadow-xs hover:border-brand-hairline-strong transition-all flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
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
                <span className="text-[11px] font-mono text-brand-mute">By {item.author}</span>
                <Link
                  href="/builder"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-ink hover:text-brand-primary transition-colors"
                >
                  <span>Launch in Builder</span>
                  <ChevronRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. Frequently Asked Questions ─── */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-8 border-t border-brand-hairline">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-mute font-semibold">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-ink">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-5 bg-white border border-brand-hairline rounded-xl space-y-2">
            <h4 className="font-bold text-sm text-brand-ink">Does this work on Ghost(Pro) cloud hosting?</h4>
            <p className="text-brand-body leading-relaxed">
              Yes, 100%. The exported ZIP file contains valid Ghost theme structures that adhere strictly to Ghost&apos;s theme specifications, meaning you can drag and drop it into Ghost(Pro) or any self-hosted instance without modifications.
            </p>
          </div>

          <div className="p-5 bg-white border border-brand-hairline rounded-xl space-y-2">
            <h4 className="font-bold text-sm text-brand-ink">How does the GScan validation test pass?</h4>
            <p className="text-brand-body leading-relaxed">
              Our compiler automatically injects required manifest files, package.json engines, core icons, and asset paths into the generated ZIP, guaranteeing a 100% clean score in Ghost&apos;s official GScan validator tool.
            </p>
          </div>

          <div className="p-5 bg-white border border-brand-hairline rounded-xl space-y-2">
            <h4 className="font-bold text-sm text-brand-ink">Can I add custom page templates and duplicate layouts?</h4>
            <p className="text-brand-body leading-relaxed">
              Yes. You can create custom page templates (<code className="font-mono text-[10px] bg-brand-canvas-soft px-1 py-0.5 rounded">custom-[slug].hbs</code>) or duplicate existing ones directly from the top toolbar selector.
            </p>
          </div>
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
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-brand-primary text-white font-semibold text-sm hover:opacity-90 transition-all shadow-level-2 inline-flex items-center justify-center gap-2"
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
              <span className="font-semibold text-brand-ink">Ghost Theme Builder</span>
            </div>
            <p className="text-brand-mute leading-relaxed text-[11px]">
              Visual design environment for Ghost CMS publishing frameworks.
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
              <li><a href="https://ghost.org/docs/themes/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-ink transition-colors">Ghost Theme Docs</a></li>
              <li><a href="https://ghost.org/docs/themes/helpers/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-ink transition-colors">Handlebars Helpers</a></li>
              <li><a href="https://gscan.ghost.org/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-ink transition-colors">Official GScan Validator</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-mono uppercase tracking-wider text-brand-ink font-semibold text-[10px]">Ecosystem</span>
            <p className="text-[11px] leading-relaxed text-brand-body">
              Designed with Geist UI guidelines, Tailwind CSS, and TypeScript.
            </p>
            <p className="text-[10px] text-brand-mute pt-1">
              © 2026 Ghost Theme Builder.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
